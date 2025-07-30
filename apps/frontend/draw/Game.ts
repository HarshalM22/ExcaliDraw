import { Tool } from "@/components/Canvas"; // Assuming this path is correct
import { deleteShapesByIds, getExistingShapes } from "./http"; // Assuming these functions exist and work

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
    this.canvas.removeEventListener("mouseleave", this.mouseUpHandler); // Ensure cleanup

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({ type: "leave_room", roomId: this.roomId })
      );
    }
  }

  private async initialize() {
    await this.loadExistingShapes();
    this.redrawStaticShapes(); // Draw all existing shapes to offscreen canvas
    this.redrawMainCanvas(); // Draw offscreen content to main canvas
    this.setupSocketHandlers();
    this.addCanvasEventListeners();
  }

  private async loadExistingShapes() {
    try {
      this.existingShapes = await getExistingShapes(Number(this.roomId));
      console.log("Existing shapes loaded:", this.existingShapes);
    } catch (error) {
      console.error("Failed to load existing shapes:", error);
      // Potentially show an error to the user or retry
    }
  }

  // Draws all existing shapes onto the offscreen canvas
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

  // Draws the offscreen canvas onto the main canvas, optionally adding an overlay or eraser path
  private redrawMainCanvas(overlayShape?: Shape, currentEraserPath?: Cordinate[]) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.offscreen, 0, 0); // Always draw static shapes from offscreen

    // Draw the temporary overlay shape (e.g., while drawing a rect/circle/line)
    if (overlayShape && overlayShape.type !== "eraser") {
      this.drawShape(this.ctx, overlayShape);
    }
    // Draw the temporary eraser path
    if (currentEraserPath && currentEraserPath.length > 1) {
      this.drawEraserPath(currentEraserPath);
    }
  }

  private drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255)"; // White stroke for shapes
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
      case "eraser":
        // Eraser shapes are for erasing, not for drawing on the canvas directly in this context.
        // The actual erasing logic happens in eraseShapes.
        break;
    }
    ctx.restore();
  }

  // Draws the temporary eraser path on the main canvas
  private drawEraserPath(path: Cordinate[]) {
    this.ctx.save();
    this.ctx.strokeStyle = "rgba(255,0,0,0.5)"; // Red semi-transparent for eraser preview
    this.ctx.lineWidth = 10; // Eraser thickness
    this.ctx.lineCap = "round"; // Make eraser path look smoother
    this.ctx.lineJoin = "round";

    this.ctx.beginPath();
    if (path.length > 0) {
      this.ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        this.ctx.lineTo(path[i].x, path[i].y);
      }
    }
    this.ctx.stroke();
    this.ctx.restore();
  }

  // Handles erasing shapes based on a path of points
  private async eraseShapes(points: Cordinate[]) {
    const eraseTolerance = 15; // How close the eraser needs to be to a shape's stroke

    // Identify shapes that will be erased from the current existingShapes array
    const idsToAttemptDeletion: number[] = [];
    const shapesToKeep: (Shape & { id?: number })[] = [];

    this.existingShapes.forEach((shape) => {
      const isErased = points.some((pt) =>
        this.isShapeErased(shape, pt, eraseTolerance)
      );

      if (isErased) {
        if (shape.id !== undefined) {
          idsToAttemptDeletion.push(shape.id);
        }
      } else {
        shapesToKeep.push(shape);
      }
    });

    // Optimistic UI update: Remove the erased shapes from local display immediately
    this.existingShapes = shapesToKeep;
    this.redrawStaticShapes();
    this.redrawMainCanvas(undefined, this.selectedTool === "eraser" ? this.eraserPath : undefined);


    if (idsToAttemptDeletion.length > 0) {
      try {
        await deleteShapesByIds(idsToAttemptDeletion);
        console.log("Successfully deleted shapes with IDs:",` ${idsToAttemptDeletion}`);
        // No further action needed here if successful, local state is already updated
      } catch (error) {
        console.error("Failed to delete shapes on server:", error);
        // If deletion fails, re-load shapes from server to resynchronize
        // This will effectively "revert" the local erasure if the server failed to delete.
        alert("Failed to save erasure changes to server. Changes might not persist on refresh.");
        await this.loadExistingShapes(); // Fetch authoritative state from server
        this.redrawStaticShapes(); // Redraw offscreen
        this.redrawMainCanvas(); // Redraw main canvas
      }
    }
  }

  // Checks if a shape is "erased" by a given point with a tolerance
  private isShapeErased(shape: Shape, pt: Cordinate, tolerance: number): boolean {
    switch (shape.type) {
      case "rect":
        // Check if the point is within the rectangle's bounds, expanded by tolerance.
        // This makes it easier to "catch" the stroke of the rectangle.
        return (
          pt.x >= Math.min(shape.x, shape.x + shape.width) - tolerance &&
          pt.x <= Math.max(shape.x, shape.x + shape.width) + tolerance &&
          pt.y >= Math.min(shape.y, shape.y + shape.height) - tolerance &&
          pt.y <= Math.max(shape.y, shape.y + shape.height) + tolerance
        );
      case "circle":
        // Check if the point is within the circle's radius, expanded by tolerance.
        return (
          Math.hypot(shape.centerX - pt.x, shape.centerY - pt.y) <=
          shape.radius + tolerance
        );
      case "line":
        // Use your existing distance to line calculation, with tolerance.
        return (
          this.calculateDistanceToLine(
            pt,
            shape.startX,
            shape.startY,
            shape.endX,
            shape.endY
          ) < tolerance
        );
      default:
        return false;
    }
  }

  private calculateDistanceToLine(
    pt: Cordinate,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    const A = pt.x - x1;
    const B = pt.y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;

    let param = 0;
    if (lenSq !== 0) {
      param = Math.max(0, Math.min(1, dot / lenSq));
    }

    const nearestX = x1 + param * C;
    const nearestY = y1 + param * D;

    return Math.hypot(pt.x - nearestX, pt.y - nearestY);
  }

  public setTool(tool: Tool) {
    this.selectedTool = tool;
    this.isDrawing = false; // Reset drawing state when tool changes
    this.eraserPath = []; // Clear eraser path when tool changes
    this.redrawMainCanvas(); // Redraw to clear any lingering temporary drawings
  }

  private setupSocketHandlers() {
    this.socket.onmessage = ({ data }) => {
      const msg = JSON.parse(data);
      // Ensure the shape object is correctly parsed, considering a nested 'shape' property
      const shapeData = typeof msg.shape === "string" ? JSON.parse(msg.shape).shape : msg.shape;

      if (!shapeData || typeof shapeData.type !== "string") {
        console.warn("Received malformed shape data:", shapeData);
        return;
      }

      if (shapeData.type === "eraser") {
        // When an eraser message is received, perform the erase operation
        // Note: The remote eraser does not need to send back to the server.
        // Only the initiating client sends the delete request.
        this.eraseShapes(shapeData.cordinates);
      } else {
        // For other shapes, add them to existingShapes and redraw
        this.existingShapes.push(shapeData);
        this.redrawStaticShapes(); // Update offscreen canvas with new shape
        this.redrawMainCanvas(); // Redraw main canvas
      }
    };
  }

  private sendShapeToServer(shape: Shape) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({ type: "chat", shape, roomId: this.roomId })
      );
    } else {
      console.warn("WebSocket not open. Cannot send shape to server.");
    }
  }

  private addCanvasEventListeners() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("mouseleave", this.mouseUpHandler); // Important for ending drawing if mouse leaves canvas
  }

  private mouseDownHandler = (e: MouseEvent) => {
    this.isDrawing = true;
    this.startX = e.offsetX;
    this.startY = e.offsetY;
    if (this.selectedTool === "eraser") {
      this.eraserPath = [{ x: e.offsetX, y: e.offsetY }];
      // Immediately try to erase at the start point for single clicks
      this.eraseShapes(this.eraserPath);
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
        const rectWidth = endX - this.startX;
        const rectHeight = endY - this.startY;
        // Require a minimum size to avoid drawing tiny shapes
        if (Math.abs(rectWidth) < 2 || Math.abs(rectHeight) < 2) {
          this.redrawMainCanvas(); // Clear temporary shape if too small
          return;
        }
        shape = { type: "rect", x: this.startX, y: this.startY, width: rectWidth, height: rectHeight };
        break;
      case "circle":
        const circleRadius = Math.hypot(endX - this.startX, endY - this.startY) / 2;
        if (circleRadius < 2) {
          this.redrawMainCanvas(); // Clear temporary shape if too small
          return;
        }
        shape = {
          type: "circle",
          centerX: (this.startX + endX) / 2,
          centerY: (this.startY + endY) / 2,
          radius: circleRadius,
        };
        break;
      case "line":
        if (this.startX === endX && this.startY === endY) {
          this.redrawMainCanvas(); // Clear temporary shape if just a dot
          return;
        }
        shape = {
          type: "line",
          startX: this.startX,
          startY: this.startY,
          endX,
          endY,
        };
        break;
      case "eraser":
        // Eraser operations are handled continuously on mousemove and within eraseShapes.
        // Send the complete eraser path to other clients only if there's a path drawn.
        if (this.eraserPath.length > 1) { // Only send if it was a drag, not just a click
            shape = { type: "eraser", cordinates: [...this.eraserPath] };
            this.sendShapeToServer(shape); // Broadcast eraser path to other clients
        }
        this.eraserPath = []; // Clear path after use
        this.redrawMainCanvas(); // Ensure main canvas is clean after erase operation ends
        return; // Don't add eraser "shape" to existingShapes or send via the general path
    }

    if (shape) {
      // Add new drawable shape to local state immediately
      this.existingShapes.push(shape);
      this.redrawStaticShapes(); // Update offscreen canvas with the new shape
      this.redrawMainCanvas(); // Redraw main canvas
      this.sendShapeToServer(shape); // Send to server for other clients
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
        // Continuously erase as mouse moves for real-time feedback
        // This will update existingShapes and redraw static shapes
        this.eraseShapes(this.eraserPath);
        break;
    }

    // Pass overlayShape and eraserPath separately to redrawMainCanvas
    // The eraser path is always drawn on the main canvas during a drag.
    this.redrawMainCanvas(
      overlayShape,
      this.selectedTool === "eraser" ? this.eraserPath : undefined
    );
  };
}