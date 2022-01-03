import React, { useEffect } from 'react';
import { useRef } from 'react';
import DrawFace from '../face';
import './index.css';


const Scatter = () => {
  const scatterRef = useRef()
  useEffect(()=>{
    drawScatter()
  },[])
  const data =[[10,15,2,3],[30,40,-2,-5],[40,45,3,6]]
  const drawScatter = () => {
    const canvas = scatterRef.current;
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext("2d");
    data.forEach(arr => drawFace(ctx,...arr))

  }
  const drawFace = (ctx,x,y,posex,posey) => {
    const emotion = {
      "neutral": {
        color:"#cf3634",
        draw:(ctx)=>{

        }
      },
      "angry": [],
      "surprise": [],
      "disgust": [],
      "fear": [],
      "sad" : [],
    }

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
    ctx.linewidth=0.5
    ctx.strokeStyle="RGBA(0,0,0,0.3)"
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle="RGBA(54, 70, 147,0.3)"
    ctx.fillRect(x-10,y-10,20,20);
//头部方向
    ctx.beginPath();
    ctx.moveTo(x-10,y-1+posey);
    ctx.lineTo(x-10,y+1+posey);
    ctx.moveTo(x+10,y-1+posey);
    ctx.lineTo(x+10,y+1+posey);
    ctx.moveTo(x+1+posex,y-10);
    ctx.lineTo(x-1+posex,y-10);
    ctx.moveTo(x+1+posex,y+10);
    ctx.lineTo(x-1+posex,y+10);
    ctx.strokeStyle="#000";
    ctx.stroke();
    ctx.closePath();



    

  }
  return(
    <div className="scatter">
     <canvas width="600px" height="400px" id="scatter" ref={scatterRef}></canvas>
    </div>  
  ) 
}

export default Scatter;
