import { Tool } from "@/components/Canvas";
import { deleteShapesByIds, getExistingShapes } from "./http";

export type Shape =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "circle"; centerX: number; centerY: number; radius: number }
  | { type: "line"; startX: number; startY: number; endX: number; endY: number }
  | { type: "eraser"; cordinates: Cordinate[] };

interface Cordinate {
  x: number;
  y: number;
}

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private offscreen: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D;
  private existingShapes: (Shape & { id?: number })[] = [];
  private roomId: string;
  private socket: WebSocket;
  private selectedTool: Tool = "circle";
  private eraserPath: Cordinate[] = [];
  private isDrawing = false;
  private startX = 0;
  private startY = 0;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false })!;
    this.roomId = roomId;
    this.socket = socket;

    this.offscreen = document.createElement("canvas");
    this.offscreen.width = canvas.width;
    this.offscreen.height = canvas.height;
    this.offscreenCtx = this.offscreen.getContext("2d", { alpha: false })!;

    this.initialize();
  }
  public destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({ type: "leave_room", roomId: this.roomId })
      );
    }
  }
  private async initialize() {
    await this.loadExistingShapes();
    this.redrawStaticShapes();
    this.redrawMainCanvas();
    this.setupSocketHandlers();
    this.addCanvasEventListeners();
  }

  private async loadExistingShapes() {
    this.existingShapes = await getExistingShapes(Number(this.roomId));
  }

  private redrawStaticShapes() {
    this.offscreenCtx.clearRect(
      0,
      0,
      this.offscreen.width,
      this.offscreen.height
    );
    this.existingShapes.forEach((shape) =>
      this.drawShape(this.offscreenCtx, shape)
    );
  }

  private redrawMainCanvas(overlayShape?: Shape, eraserPath?: Cordinate[]) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.offscreen, 0, 0);
    if (overlayShape) this.drawShape(this.ctx, overlayShape);
    if (eraserPath && eraserPath.length > 1) this.drawEraserPath(eraserPath);
  }

  private drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255)";
    ctx.lineWidth = 1;

    switch (shape.type) {
      case "rect":
        ctx.strokeRect(
          Math.round(shape.x),
          Math.round(shape.y),
          Math.round(shape.width),
          Math.round(shape.height)
        );
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(
          Math.round(shape.centerX),
          Math.round(shape.centerY),
          Math.round(shape.radius),
          0,
          Math.PI * 2
        );
        ctx.closePath();
        ctx.stroke();
        break;
      case "line":
        ctx.beginPath();
        ctx.moveTo(Math.round(shape.startX), Math.round(shape.startY));
        ctx.lineTo(Math.round(shape.endX), Math.round(shape.endY));
        ctx.stroke();
        ctx.closePath();
        break;
    }
    ctx.restore();
  }

  private drawEraserPath(path: Cordinate[]) {
    this.ctx.save();
    this.ctx.strokeStyle = "rgba(255,0,0,0.5)";
    this.ctx.lineWidth = 10;
    this.ctx.beginPath();
    this.ctx.moveTo(path[0].x, path[0].y);
    path.forEach(({ x, y }) => this.ctx.lineTo(x, y));
    this.ctx.stroke();
    this.ctx.restore();
  }

  private eraseShapes(points: Cordinate[]) {
    const erasedIds: number[] = [];
    this.existingShapes = this.existingShapes.filter((shape) => {
      const erased = points.some((pt) => this.isShapeErased(shape, pt));
      if (erased && shape.id !== undefined) erasedIds.push(shape.id);
      return !erased;
    });
    if (erasedIds.length > 0) {
      deleteShapesByIds(erasedIds).catch(console.error);
      this.redrawStaticShapes();
    }
    this.redrawMainCanvas();
  }

  private isShapeErased(shape: Shape, pt: Cordinate): boolean {
    const r = 20;
    switch (shape.type) {
      case "rect":
        return (
          pt.x >= shape.x &&
          pt.x <= shape.x + shape.width &&
          pt.y >= shape.y &&
          pt.y <= shape.y + shape.height
        );
      case "circle":
        return (
          Math.hypot(shape.centerX - pt.x, shape.centerY - pt.y) <=
          shape.radius + r
        );
      case "line":
        return (
          this.calculateDistanceToLine(
            pt,
            shape.startX,
            shape.startY,
            shape.endX,
            shape.endY
          ) < 10
        );
    }
    return false;
  }

  private calculateDistanceToLine(
    pt: Cordinate,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    const A = pt.x - x1,
      B = pt.y - y1,
      C = x2 - x1,
      D = y2 - y1;
    const dot = A * C + B * D,
      lenSq = C * C + D * D;
    const param = lenSq !== 0 ? Math.max(0, Math.min(1, dot / lenSq)) : 0;
    const nearestX = x1 + param * C,
      nearestY = y1 + param * D;
    return Math.hypot(pt.x - nearestX, pt.y - nearestY);
  }

  public setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  private setupSocketHandlers() {
    this.socket.onmessage = ({ data }) => {
      const msg = JSON.parse(data);
      const shape =
        typeof msg.shape === "string" ? JSON.parse(msg.shape).shape : msg.shape;
      if (!shape || typeof shape.type !== "string") return;

      if (shape.type === "eraser") {
        this.eraseShapes(shape.cordinates);
      } else {
        this.existingShapes.push(shape);
        this.redrawStaticShapes();
        this.redrawMainCanvas();
      }
    };
  }

  private sendShapeToServer(shape: Shape) {
    this.socket.send(
      JSON.stringify({ type: "chat", shape, roomId: this.roomId })
    );
  }

  private addCanvasEventListeners() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

  private mouseDownHandler = (e: MouseEvent) => {
    this.isDrawing = true;
    this.startX = e.offsetX;
    this.startY = e.offsetY;
    if (this.selectedTool === "eraser")
      this.eraserPath = [{ x: e.offsetX, y: e.offsetY }];
  };

  private mouseUpHandler = (e: MouseEvent) => {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    const endX = e.offsetX,
      endY = e.offsetY;

    let shape: Shape | null = null;
    switch (this.selectedTool) {
      case "rect":
        const width = endX - this.startX,
          height = endY - this.startY;
        if (Math.abs(width) < 2 || Math.abs(height) < 2) return;
        shape = { type: "rect", x: this.startX, y: this.startY, width, height };
        break;
      case "circle":
        const radius = Math.hypot(endX - this.startX, endY - this.startY) / 2;
        if (radius < 2) return;
        shape = {
          type: "circle",
          centerX: (this.startX + endX) / 2,
          centerY: (this.startY + endY) / 2,
          radius,
        };
        break;
      case "line":
        if (this.startX === endX && this.startY === endY) return;
        shape = {
          type: "line",
          startX: this.startX,
          startY: this.startY,
          endX,
          endY,
        };
        break;
      case "eraser":
        if (this.eraserPath.length < 2) return;
        shape = { type: "eraser", cordinates: [...this.eraserPath] };
        this.eraserPath = [];
        break;
    }

    if (shape) this.sendShapeToServer(shape);
  };

  private mouseMoveHandler = (e: MouseEvent) => {
    if (!this.isDrawing) return;
    const currX = e.offsetX,
      currY = e.offsetY;

    let overlayShape: Shape | undefined;
    switch (this.selectedTool) {
      case "rect":
        overlayShape = {
          type: "rect",
          x: this.startX,
          y: this.startY,
          width: currX - this.startX,
          height: currY - this.startY,
        };
        break;
      case "circle":
        const radius = Math.hypot(currX - this.startX, currY - this.startY) / 2;
        overlayShape = {
          type: "circle",
          centerX: (this.startX + currX) / 2,
          centerY: (this.startY + currY) / 2,
          radius,
        };
        break;
      case "line":
        overlayShape = {
          type: "line",
          startX: this.startX,
          startY: this.startY,
          endX: currX,
          endY: currY,
        };
        break;
      case "eraser":
        this.eraserPath.push({ x: currX, y: currY });
        this.eraseShapes(this.eraserPath);
        break;
    }

    if (overlayShape)
      this.redrawMainCanvas(
        overlayShape,
        this.selectedTool === "eraser" ? this.eraserPath : undefined
      );
  };
}
