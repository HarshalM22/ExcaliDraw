
import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";
type Shape = 
   {
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
      type: "pencil";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private selectedTool : Tool = "circle";

  socket: WebSocket;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.roomId = roomId;
    this.existingShapes = [];
    this.socket = socket;
    this.clicked = false;
    this.initLogic();
    this.initHandlers();
    this.initMouseHandlers();
  }

  setTool(tool : Tool){
    this.selectedTool = tool ;
  }

  async initLogic() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearContext() ;
  
}

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type == "chat") {
        const parsedShape = JSON.parse(message.message);
        this.existingShapes.push(parsedShape.shape);
        this.clearContext();
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
        this.ctx.arc(shape.centerX,shape.centerY,Math.abs(shape.radius),0, Math.PI * 2 );
        this.ctx.closePath();
        this.ctx.stroke();
      }
    });
  }
  
  destroy(){
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove",this.mouseMoveHandler);
  }
  
  mouseDownHandler=(e:any)=>{
    this.clicked = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
    
  }
  mouseUpHandler=(e:any)=>{
    this.clicked = false;
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
       
        const selectedTool = this.selectedTool;
    
        let shape : Shape|null = null ;
    
        if (selectedTool === "rect") {
          shape= {
            type: "rect",
            x: this.startX,
            y: this.startY,
            width: width,
            height: height
          }
        } else if (selectedTool === "circle") {
          const radius = Math.max(width,height) / 2 ;
          shape = {
            type: "circle",
            radius: radius,
            centerX: this.startX + radius ,
            centerY: this.startY + radius
          }
        } else if (selectedTool === "pencil") {
    
        }
    
        if(!shape){
          return
        }
    
        this.existingShapes.push(shape);
        console.log(shape)
    
        this.socket.send(JSON.stringify({
          type: "chat",
          message: JSON.stringify({
            shape
          }),
          roomId : this.roomId 
        })
      )

  }
  mouseMoveHandler=(e:any)=>{
    if (this.clicked) {
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
        this.clearContext()
        this.ctx.strokeStyle = "rgba(255,255,255)";
        
        
        if (this.selectedTool === "rect") {
          this.ctx.strokeRect(this.startX, this.startY, width, height)
        } else if (this.selectedTool === "circle") {
          const centerX = this.startX + width / 2;
          const centerY = this.startY + height / 2;
          const radius = Math.max(width, height) / 2;
          this.ctx.beginPath()
          this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
          this.ctx.closePath()
          this.ctx.stroke();
  
  
        }
      }

  }
  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove",this.mouseMoveHandler);
  }
}
