import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";
type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    } |{
      type: "eraser";
      mouseX : number;
      mouseY : number ;
      cordinate : cordinates[]
    }

interface cordinates {
  x :number
  y:number
}    

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private selectedTool: Tool = "circle";
  private lastX : number ;
  private lastY:number;
  private eraser:cordinates[];
  socket: WebSocket;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.roomId = roomId;
    this.existingShapes = [];
    this.socket = socket;
    this.clicked = false;
    this.eraser = [];
    this.initLogic();
    this.initHandlers();
    this.initMouseHandlers();
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  async initLogic() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearContext();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type == "chat") {
        const parsedShape = JSON.parse(message.message);
      //   if (parsedShape.shape.type === "eraser") {
      //     parsedShape.shape.coordinate.forEach((point: cordinates) => {
      //         this.eraser.push(point);
      //     });
      //     this.eraseShapes();
      // } else {
          this.existingShapes.push(parsedShape.shape);
          this.clearContext();
      // }
      }
    };
  }

  clearContext() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0,0,0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes.map((shape) => {
      if (shape.type === "rect") {
        this.ctx.strokeStyle = "rgba(255,255,255)";
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(
          shape.centerX,
          shape.centerY,
          Math.abs(shape.radius),
          0,
          Math.PI * 2
        );
        this.ctx.closePath();
        this.ctx.stroke();
      }else if(shape.type==="line"){
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(Math.abs(shape.endX), Math.abs(shape.endY));
        this.ctx.closePath();
        this.ctx.strokeStyle = "rgba(255,255,255)";
        this.ctx.stroke();
      }
    });
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  mouseDownHandler = (e: any) => {
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
  //   for eraser
    this.lastX = this.startX ;
    this.lastY = this.startY ;
  };
  mouseUpHandler = (e: any) => {
    this.clicked = false;
    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;

    const selectedTool = this.selectedTool;

    let shape: Shape | null = null;

    if (selectedTool === "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        width: width,
        height: height,
      };
    } else if (selectedTool === "circle") {
      const radius = Math.max(width, height) / 2;
      shape = {
        type: "circle",
        radius: radius,
        centerX: this.startX + radius,
        centerY: this.startY + radius,
      };
    } else if (selectedTool === "line") {
      shape = {
        type: "line",
        startX: this.startX,
        startY: this.startY,
        endX: e.clientX,
        endY: e.clientY,
      };
    } else if(selectedTool === "eraser"){
      shape ={
        type : "eraser",
        mouseX : e.clientX,
        mouseY : e.clientY,
        cordinate : this.eraser
      }
    }

    if (!shape) {
      return;
    }

    this.existingShapes.push(shape);
    console.log(shape);

    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
        roomId: this.roomId,
      })
    );
  };
  mouseMoveHandler = (e: any) => {
    if (this.clicked) {
      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;

      this.clearContext();
      this.ctx.strokeStyle = "rgba(255,255,255)";

      if (this.selectedTool === "rect") {
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      } else if (this.selectedTool === "circle") {
        const centerX = this.startX + width / 2;
        const centerY = this.startY + height / 2;
        const radius = Math.max(width, height) / 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.stroke();
      } else if (this.selectedTool === "line") {
        const endX = e.clientX;
        const endY = e.clientY;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(Math.abs(endX), Math.abs(endY));
        this.ctx.closePath();
        this.ctx.strokeStyle = "rgba(255,255,255)";
        this.ctx.stroke();
      } else if (this.selectedTool=== "eraser"){
        this.eraser.push({ x: e.clientX, y: e.clientY });
        this.eraseShapes(); 
      }
    }
  };

  eraseShapes() {
    this.existingShapes = this.existingShapes.filter(
        (shape) => !this.eraser.some((eraserPoint) => this.isShapeErased(shape, eraserPoint))
    );
    this.clearContext();
}

  isShapeErased(shape: Shape, eraserPoint: cordinates): boolean {
    const eraserRadius = 10; // Adjust for sensitivity
  
    if (shape.type === "rect") {
      return (
        eraserPoint.x >= shape.x &&
        eraserPoint.x <= shape.x + shape.width &&
        eraserPoint.y >= shape.y &&
        eraserPoint.y <= shape.y + shape.height
      );
    } else if (shape.type === "circle") {
      const dist = Math.sqrt(
        (shape.centerX - eraserPoint.x) ** 2 + (shape.centerY - eraserPoint.y) ** 2
      );
      return dist <= shape.radius + eraserRadius;
    } else if (shape.type === "line") {
      return this.isPointNearLine(
        eraserPoint.x,
        eraserPoint.y,
        shape.startX,
        shape.startY,
        shape.endX,
        shape.endY,
        eraserRadius
      );
    }
    return false;
  }
  isPointNearLine(px: number, py: number, x1: number, y1: number, x2: number, y2: number, threshold: number): boolean {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = dot / len_sq;
  
    if (param < 0 || len_sq === 0) {
      param = 0;
    } else if (param > 1) {
      param = 1;
    }
  
    const nearestX = x1 + param * C;
    const nearestY = y1 + param * D;
    const dist = Math.sqrt((px - nearestX) ** 2 + (py - nearestY) ** 2);
  
    return dist < threshold;
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}


