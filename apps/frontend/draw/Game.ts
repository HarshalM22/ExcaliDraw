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
    this.offscreen = document.createElement("canvas");
    this.offscreen.width = canvas.width;
    this.offscreen.height = canvas.height;
    this.offscreenCtx = this.offscreen.getContext("2d", { alpha: false })!;
    this.roomId = roomId;
    this.socket = socket;

    this.initialize();

    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

  private async initialize() {
    this.existingShapes = await getExistingShapes(Number(this.roomId));
    this.redrawStaticShapes();
    this.redrawMainCanvas();
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const shape: Shape = typeof message.shape === "string"
        ? JSON.parse(message.shape).shape
        : message.shape?.shape;

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
    this.socket.send(JSON.stringify({ type: "chat", shape, roomId: this.roomId }));
  }

  private drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255)";
    ctx.beginPath();

    switch (shape.type) {
      case "rect":
        ctx.strokeRect(Math.round(shape.x), Math.round(shape.y), Math.round(shape.width), Math.round(shape.height));
        break;
      case "circle":
        ctx.arc(Math.round(shape.centerX), Math.round(shape.centerY), Math.round(shape.radius), 0, Math.PI * 2);
        break;
      case "line":
        ctx.moveTo(Math.round(shape.startX), Math.round(shape.startY));
        ctx.lineTo(Math.round(shape.endX), Math.round(shape.endY));
        break;
    }

    ctx.stroke();
    ctx.restore();
  }

  private redrawStaticShapes() {
    this.offscreenCtx.clearRect(0, 0, this.offscreen.width, this.offscreen.height);
    for (const shape of this.existingShapes) {
      if (shape.type !== "eraser") {
        this.drawShape(this.offscreenCtx, shape);
      }
    }
  }

  private redrawMainCanvas(overlayShape?: Shape, eraserPath?: Cordinate[]) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.offscreen, 0, 0);

    if (overlayShape && overlayShape.type !== "eraser") {
      this.drawShape(this.ctx, overlayShape);
    }

    if (eraserPath?.length > 1) {
      this.ctx.save();
      this.ctx.strokeStyle = "rgba(255,0,0,0.5)";
      this.ctx.lineWidth = 10;
      this.ctx.beginPath();
      this.ctx.moveTo(eraserPath[0].x, eraserPath[0].y);
      eraserPath.slice(1).forEach(pt => this.ctx.lineTo(pt.x, pt.y));
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  private eraseShapes(eraserPoints: Cordinate[]) {
    const erasedIds: number[] = [];
    this.existingShapes = this.existingShapes.filter((shape) => {
      const hit = eraserPoints.some(pt => this.isShapeErased(shape, pt));
      if (hit && shape.id !== undefined) erasedIds.push(shape.id);
      return !hit;
    });

    if (erasedIds.length > 0) {
      deleteShapesByIds(erasedIds).catch(console.error);
      this.redrawStaticShapes();
    }
    this.redrawMainCanvas();
  }

  private isShapeErased(shape: Shape, pt: Cordinate): boolean {
    const eraserRadius = 20;
    switch (shape.type) {
      case "rect":
        return pt.x >= shape.x && pt.x <= shape.x + shape.width &&
               pt.y >= shape.y && pt.y <= shape.y + shape.height;
      case "circle":
        return Math.hypot(shape.centerX - pt.x, shape.centerY - pt.y) <= shape.radius + eraserRadius;
      case "line":
        return this.calculateDistanceToLine(pt, shape.startX, shape.startY, shape.endX, shape.endY) < 10;
      default:
        return false;
    }
  }

  private calculateDistanceToLine(p: Cordinate, x1: number, y1: number, x2: number, y2: number): number {
    const A = p.x - x1, B = p.y - y1;
    const C = x2 - x1, D = y2 - y1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    const t = lenSq ? Math.max(0, Math.min(1, dot / lenSq)) : 0;
    const projX = x1 + t * C, projY = y1 + t * D;
    return Math.hypot(p.x - projX, p.y - projY);
  }

  public setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  // --- Event Handlers ---
  private mouseDownHandler = (e: MouseEvent) => {
    this.isDrawing = true;
    this.startX = e.offsetX;
    this.startY = e.offsetY;
    if (this.selectedTool === "eraser") {
      this.eraserPath = [{ x: e.offsetX, y: e.offsetY }];
    }
  };

  private mouseUpHandler = (e: MouseEvent) => {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    const endX = e.offsetX;
    const endY = e.offsetY;

    let shape: Shape | null = null;
    switch (this.selectedTool) {
      case "rect":
        const width = endX - this.startX, height = endY - this.startY;
        if (Math.abs(width) < 2 || Math.abs(height) < 2) return;
        shape = { type: "rect", x: this.startX, y: this.startY, width, height };
        break;

      case "circle":
        const radius = Math.hypot(endX - this.startX, endY - this.startY) / 2;
        if (radius < 2) return;
        shape = { type: "circle", centerX: (this.startX + endX) / 2, centerY: (this.startY + endY) / 2, radius };
        break;

      case "line":
        if (this.startX === endX && this.startY === endY) return;
        shape = { type: "line", startX: this.startX, startY: this.startY, endX, endY };
        break;

      case "eraser":
        if (this.eraserPath.length < 2) return;
        shape = { type: "eraser", cordinates: [...this.eraserPath] };
        this.eraserPath = [];
        break;
    }

    if (shape) {
      this.sendShapeToServer(shape);
    }
  };

  private mouseMoveHandler = (e: MouseEvent) => {
    if (!this.isDrawing) return;

    const currX = e.offsetX;
    const currY = e.offsetY;
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
        overlayShape = {
          type: "circle",
          centerX: (this.startX + currX) / 2,
          centerY: (this.startY + currY) / 2,
          radius: Math.hypot(currX - this.startX, currY - this.startY) / 2,
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

    this.redrawMainCanvas(overlayShape, this.selectedTool === "eraser" ? this.eraserPath : undefined);
  };
}
