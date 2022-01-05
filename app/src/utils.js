export const actions = {
  accept:"RGB(99, 180, 87,0.3)",
  reject:"RGB(77, 117, 184,0.3)",
  daze: "RGB(210, 53, 52,0.3)",
  HeadRow:"RGB(138, 194, 91,0.3)",
  HeadPitch:"RGB(237, 151, 64,0.3)",
  normal:"RGB(54, 70, 147,0.3)"
};

export const emotions = {
  neutral: (ctx,x,y) => {
      ctx.beginPath();
      ctx.fillStyle = "RGBA(0,0,0,0.5)"
      ctx.lineWidth= 2;
      ctx.fillRect(x-4,y-4,2,2);
      ctx.fillRect(x+2,y-4,2,2);
      ctx.moveTo(x-2.5,y+5);
      ctx.lineTo(x+2.5,y+5);
      ctx.stroke();
      ctx.closePath();
  },
  angry: (ctx,x,y) => {
    ctx.beginPath();
    ctx.lineWidth=2;
    ctx.fillStyle = "RGBA(0,0,0,0.5)"
    ctx.moveTo(x-5,y-5);
    ctx.lineTo(x-2,y-2);
    ctx.moveTo(x+5,y-5);
    ctx.lineTo(x+2,y-2);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(x,y+8,6,Math.PI*-0.8,Math.PI*-0.2);
    ctx.stroke();
    ctx.closePath();
  },

  happy: (ctx,x,y) => {
    ctx.beginPath();
    ctx.lineWidth=2;
    ctx.fillStyle = "RGBA(0,0,0,0.5)"
    ctx.fillRect(x-4,y-4,2,2);
    ctx.fillRect(x+2,y-4,2,2);
    ctx.arc(x,y-2,6,Math.PI*0.2,Math.PI*0.8);
    ctx.stroke();
    ctx.closePath();
  },
  surprise: (ctx,x,y) => {
    ctx.fillStyle = "RGBA(0,0,0,0.5)"
    ctx.fillRect(x-4,y-4,2,2);
    ctx.fillRect(x+2,y-4,2,2);
    ctx.beginPath();
    ctx.arc(x,y+4,3,0,Math.PI*2);
    ctx.lineWidth=2;
    ctx.stroke();
    ctx.closePath();
  },
  disgust: (ctx,x,y) => {
    ctx.beginPath();
    ctx.lineWidth=2;
    ctx.moveTo(x-6,y-5);
    ctx.lineTo(x-2,y-1);
    ctx.moveTo(x-6,y-1);
    ctx.lineTo(x-2,y-5);
    ctx.moveTo(x+6,y-5);
    ctx.lineTo(x+2,y-1);
    ctx.moveTo(x+6,y-1);
    ctx.lineTo(x+2,y-5);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(x,y+8,6,Math.PI*-0.8,Math.PI*-0.2);
    ctx.stroke();
    ctx.closePath();
  },
  fear: (ctx,x,y) => {
    ctx.beginPath();
    ctx.lineWidth=2;
    ctx.moveTo(x-6,y-5);
    ctx.lineTo(x-2,y-3);
    ctx.lineTo(x-6,y-1);
    ctx.moveTo(x+6,y-5);
    ctx.lineTo(x+2,y-3);
    ctx.lineTo(x+6,y-1);
    ctx.moveTo(x-6,y+5);
    ctx.lineTo(x-4,y+6);
    ctx.lineTo(x-2,y+4);
    ctx.lineTo(x,y+6);
    ctx.lineTo(x+2,y+4);
    ctx.lineTo(x+4,y+6);
    ctx.lineTo(x+6,y+5);
    ctx.stroke();
    ctx.closePath();
    
  },
  sad : (ctx,x,y) => {
    ctx.beginPath();
    ctx.lineWidth=2;
    ctx.fillStyle = "RGBA(0,0,0,0.5)"
    ctx.fillRect(x-4,y-4,2,2);
    ctx.fillRect(x+2,y-4,2,2);
    ctx.beginPath();
    ctx.arc(x,y+8,6,Math.PI*-0.8,Math.PI*-0.2);
    ctx.stroke();
    ctx.closePath();
  },
}