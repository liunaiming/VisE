import React, { useEffect } from 'react';
import { useRef } from 'react';
import DrawFace from '../face';
import './index.css';


const emotions = {
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

const Scatter = () => {
  const scatterRef = useRef()
  useEffect(()=>{
    drawScatter()
  },[])
  const data =[[10,15,2,3,"neutral"],[30,40,-2,-5,"fear"],[60,45,3,6,"angry"],[80,45,3,6,"happy"],[110,45,3,6,"surprise"],[110,75,3,6,"sad"],[110,130,3,6,"disgust"]]
  const drawScatter = () => {

    const canvas = scatterRef.current;
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    data.forEach(arr => drawFace(ctx,...arr))

  }
  const drawFace = (ctx,x,y,posex,posey,emotion) => {


    ctx.beginPath();
    ctx.moveTo(x-10,y-10);
    ctx.lineTo(x-10,y-1+posey);
    ctx.moveTo(x-10,y+1+posey);
    ctx.lineTo(x-10,y+10);
    ctx.lineTo(x-1+posex,y+10);
    ctx.moveTo(x+1+posex,y+10);
    ctx.lineTo(x+10,y+10);
    ctx.lineTo(x+10,y+1+posey);
    ctx.moveTo(x+10,y-1+posey);
    ctx.lineTo(x+10,y-10);
    ctx.lineTo(x+1+posex,y-10);
    ctx.moveTo(x-1+posex,y-10);
    ctx.lineTo(x-10,y-10);
    ctx.lineWidth=0.5
    ctx.strokeStyle="RGBA(0,0,0,0.4)"
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle="RGBA(54, 70, 147,0.3)"
    ctx.fillRect(x-10,y-10,20,20);
//头部方向
    // ctx.beginPath();
    // ctx.moveTo(x-10,y-1+posey);
    // ctx.lineTo(x-10,y+1+posey);
    // ctx.moveTo(x+10,y-1+posey);
    // ctx.lineTo(x+10,y+1+posey);
    // ctx.moveTo(x+1+posex,y-10);
    // ctx.lineTo(x-1+posex,y-10);
    // ctx.moveTo(x+1+posex,y+10);
    // ctx.lineTo(x-1+posex,y+10);
    // ctx.strokeStyle="#000";
    // ctx.stroke();
    // ctx.closePath();
    //表情
    emotions[emotion](ctx,x,y);



    

  }
  return(
    <div className="scatter">
     <canvas width="600px" height="400px" id="scatter" ref={scatterRef}></canvas>
    </div>  
  ) 
}

export default Scatter;
