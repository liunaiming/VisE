import React, { useEffect } from 'react';
import { useRef,useState } from 'react';
import DrawFace from '../face';
import './index.css';
import { actions, emotions } from '../../utils'
import avgData from '../../avg.json';



const Scatter = (props) => {
  const scatterRef = useRef()
  // const [data, setData] = useState(props.data);
  const { data } = props;
  useEffect(()=>{
    drawScatter();
  },[data]);
  // const data =[[11,15,0.2,0.3,"neutral","normal"],[30,40,-0.2,-0.5,"fear","headdown"],[40,45,0.3,0.6,"angry","accept"],[40,55,0.3,0.6,"happy","daze"],[110,45,0.3,0.6,"surprise","reject"],[110,75,0.3,0.26,"sad","accept"],[110,130,-0.3,0.6,"disgust","normal"]]
  const drawScatter = () => {
    let keys = Object.keys(data);
    const canvas = scatterRef.current;
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    ctx.globalCompositeOperation ="source-over"
    // 登录状态下不会出现这行文字，点击页面右上角一键登录


    for(let i=0; i<keys.length; i++){
      // data[keys[i]].fatigue,data[keys[i]].attention,"dazy",data[keys[i].headx,data[keys][i].heady]
      drawRect(ctx,data[keys[i]]["fatigue"]*(width-20)+10,data[keys[i]]["attention"]*(height-20)+10,data[keys[i]]["action"],data[keys[i]]["headx"],data[keys[i]]["heady"])
    }
    for(let i=0; i<keys.length; i++){
      drawFace(ctx,data[keys[i]]["fatigue"]*(width-20)+10,data[keys[i]]["attention"]*(height-20)+10,data[keys[i]]["emotion"]);
    }
    // data.forEach(arr => drawRect(ctx,arr[0],arr[1],arr[5],arr[2],arr[3]))
    // data.forEach(arr => drawFace(ctx,...arr))

  }
  const drawRect = (ctx,x,y,action,posex,posey) => {
    ctx.fillStyle = actions[action];
    ctx.fillRect(x-10,y-10,20,20);
    let headx = posex * 10;
    let heady = posey * 10;

    ctx.fillRect(x+headx,y-15,2,5);
    ctx.fillRect(x+headx,y+10,2,5);
    ctx.fillRect(x-15,y+heady,5,2);
    ctx.fillRect(x+10,y+heady,5,2);
  }
  const drawFace = (ctx,x,y,emotion) => {
    // ctx.beginPath();
    // ctx.moveTo(x-10,y-10);
    // ctx.lineTo(x-10,y-1+posey);
    // ctx.moveTo(x-10,y+1+posey);
    // ctx.lineTo(x-10,y+10);
    // ctx.lineTo(x-1+posex,y+10);
    // ctx.moveTo(x+1+posex,y+10);
    // ctx.lineTo(x+10,y+10);
    // ctx.lineTo(x+10,y+1+posey);
    // ctx.moveTo(x+10,y-1+posey);
    // ctx.lineTo(x+10,y-10);
    // ctx.lineTo(x+1+posex,y-10);
    // ctx.moveTo(x-1+posex,y-10);
    // ctx.lineTo(x-10,y-10);
    // ctx.lineWidth=0.5
    // ctx.strokeStyle="RGBA(200,200,200,0.5)"
    // ctx.stroke();
    // ctx.closePath();
    // ctx.fillStyle="RGB(195,199,221)";//"RGBA(54, 70, 147,0.3)"
    // ctx.fillRect(x-10,y-10,20,20);
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
    ctx.strokeStyle="RGBA(0,0,0,0.4)";
    console.log(emotion,emotions[emotion])
    emotions[emotion](ctx,x,y);



    

  }
  return(
    <div className="scatter">
     <canvas width="400px" height="320px" id="scatter" ref={scatterRef}></canvas>
    </div>  
  ) 
}

export default Scatter;
