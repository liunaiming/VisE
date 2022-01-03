import React from 'react';
import { useState, useEffect, useRef } from 'react';

const DrawFace = (props) => {
  const canvasRef = useRef();
  useEffect(()=>{
  // drawFace(mouth, head, gaze, eye);
    drawFace(props.mouth,props.head,props.gaze,props.eye);
  },[])

  function drawFace(emotion, head, gaze, lib) {
    let canvas = canvasRef.current;
    let ctx = canvas.getContext("2d");
    let width = canvas.width;
    let height = canvas.height;
    let { gazex, gazey } = gaze;
    //脸巴子
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2, width*0.4,height*0.4,0, Math.PI*1.65,Math.PI*1.4);
    // ctx.quadraticCurveTo(width*0.5)
    ctx.stroke();
    ctx.closePath();
    //头发
    ctx.beginPath();
    let coor1 = ellipticCoordinates(width * 0.4, height * 0.4, Math.PI * 0.61, width*0.5, height*0.5);
    let coor2 = ellipticCoordinates(width * 0.4, height * 0.4, Math.PI * 0.34, width*0.5, height*0.5);
    let mid1 = ellipticCoordinates(width * 0.4, height * 0.4, Math.PI * 0.53, width*0.5, height*0.5);
    let mid2 = ellipticCoordinates(width * 0.4, height * 0.4, Math.PI * 0.45, width*0.5, height*0.5);
    console.log(coor1, coor2)
    ctx.moveTo(coor1.width,coor1.height);
    ctx.quadraticCurveTo((coor1.width -width*0.1), 0, mid1.width, mid1.height);
    ctx.quadraticCurveTo((mid1.width + width*0.2), 0, mid2.width, mid2.height);
    ctx.quadraticCurveTo((mid2.width + width*0.3), 0, coor2.width, coor2.height);
    ctx.stroke();
    ctx.closePath();
  
    ctx.beginPath();
    let hearleft = ellipticCoordinates(width * 0.4, height * 0.4, Math.PI * (0.95+head), width*0.5, height*0.5);
    let hearright = ellipticCoordinates(width * 0.4, height * 0.4, Math.PI * (0.05-head), width*0.5, height*0.5);
    let hearWidth = hearright.width - hearleft.width
    let hearMid1 = hearleft.width + hearWidth*0.3
    let hearMid2 = hearleft.width + hearWidth*0.6
    let hearMid3 = hearleft.width + hearWidth*0.85
    ctx.moveTo(hearleft.width,hearleft.height);
    ctx.quadraticCurveTo(hearleft.width + hearWidth*0.15, hearleft.height-height*0.05, hearMid1, hearleft.height-height*0.15);
    ctx.quadraticCurveTo(hearleft.width + hearWidth*0.25, hearleft.height+height*0.1, hearMid2, hearleft.height-height*0.15);
    ctx.quadraticCurveTo(hearleft.width + hearWidth*0.5,hearleft.height+height*0.1, hearMid3,hearleft.height-height*0.1);
    ctx.quadraticCurveTo(hearleft.width+ hearWidth*0.9, hearleft.height+height*0.1, hearright.width,hearright.height);
    ctx.stroke();
    ctx.closePath();
      // 眼睛位置
       ctx.beginPath();
      ctx.ellipse(
        width * 0.32,
        height * (0.5 + head),
        width * 0.06,
        height * 0.08,
        0,
        0,
        2 * Math.PI
      );
      ctx.stroke();
      ctx.closePath();
  
      ctx.beginPath();
      ctx.ellipse(
        width * 0.68,
        height * (0.5 + head),
        width * 0.06,
        height * 0.08,
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.closePath();           
      // 眼珠子
    ctx.beginPath();
    ctx.arc(
      width * (0.32 + gazex),
      height * (0.5 + head + gazey),
      width * 0.03,
      0,
      Math.PI * 2
    );
    ctx.fillstyle = "#00000";
    ctx.fill();
    ctx.stroke()
    ctx.closePath();
  
    ctx.beginPath();
    ctx.arc(
      width * (0.68 + gazex),
      height * (0.5 + head + gazey),
      width * 0.03,
      0,
      Math.PI * 2
    );
  
    ctx.fillstyle = "#00000";
    ctx.fill();
    ctx.stroke();
    // 眼皮
    ctx.beginPath();
    ctx.globalCompositeOperation = 'source-over'
    let eyelidLeft_l = ellipticCoordinates(width * 0.06, height*0.08, Math.PI*(0.5+lib), width*0.32, height*(0.5 + head));
    let eyelidLeft_r = ellipticCoordinates(width * 0.06, height*0.08, Math.PI*(0.5-lib),width*0.32, height*(0.5 + head));
    ctx.moveTo(eyelidLeft_l.width,eyelidLeft_l.height);
    ctx.lineTo(eyelidLeft_r.width,eyelidLeft_r.height);
    ctx.ellipse(
      width * 0.32,
      height * (0.5 + head),
      width * 0.06,
      height * 0.08,
      0,
      Math.PI* (1.5+lib),
      Math.PI * (1.5-lib),
      true
    );
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = '#0e65c5';
    ctx.fill()
  
  
  
  
    ctx.beginPath();
    let eyelidRight_l = ellipticCoordinates(width * 0.06, height*0.08, Math.PI*(0.5+lib), width*0.68, height*(0.5 + head));
    let eyelidRight_r = ellipticCoordinates(width * 0.06, height*0.08, Math.PI*(0.5-lib),width*0.68, height*(0.5 + head));
    ctx.moveTo(eyelidRight_l.width,eyelidRight_l.height);
    ctx.lineTo(eyelidRight_r.width,eyelidRight_r.height);
    ctx.ellipse(
      width * 0.68,
      height * (0.5 + head),
      width * 0.06,
      height * 0.08,
      0,
      Math.PI* (1.5+lib),
      Math.PI * (1.5-lib),
      true
    );
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = '#0e65c5';
    ctx.fill('nonzero')
  
    //耳朵
    let earLeftUp = ellipticCoordinates(width * 0.4, height * 0.4, Math.PI*1.05, width*0.5, height*0.5);
    let earLeftDown = ellipticCoordinates(width * 0.4, height * 0.4, Math.PI*1.15, width*0.5, height*0.5);
    let earRightUp = ellipticCoordinates(width * 0.4, height * 0.4, Math.PI*-0.05, width*0.5, height*0.5);
    let earRightDown = ellipticCoordinates(width * 0.4, height * 0.4, Math.PI*-0.15, width*0.5, height*0.5);
    ctx.beginPath();
    ctx.moveTo(earLeftUp.width,earLeftUp.height)
    ctx.quadraticCurveTo(
      width*0.02,
      earLeftDown.height,
      earLeftDown.width,
      earRightDown.height)
    ctx.stroke()  
    ctx.closePath();
  
    ctx.beginPath();
    ctx.moveTo(earRightUp.width,earRightUp.height)
    ctx.quadraticCurveTo(
      width*0.98,
      earRightDown.height,
      earRightDown.width,
      earRightDown.height)
    ctx.stroke() 
    ctx.closePath(); 
    
    //嘴巴子
    ctx.beginPath();
    ctx.moveTo(width * 0.4, height * (0.7 + head));
    ctx.quadraticCurveTo(
      width * 0.5,
      height * (0.7 + head + emotion),
      width * 0.6,
      height * (0.7 + head)
    );
    ctx.stroke();
    ctx.closePath();
    //鼻子
    ctx.beginPath();
    ctx.moveTo(width * 0.45, height * (0.6 + head));
    ctx.quadraticCurveTo(width*0.5, height * (0.55+head),width*0.55,height * (0.6+head))
    ctx.stroke();
    ctx.closePath();
  }
  
  function ellipticCoordinates(width,height,deta,cx,cy) {
    let tan1 = Math.tan(deta)
    let flag = (deta> Math.PI*0.5 && deta <Math.PI*1.5) ? -1 : 1;
    let x1 = flag * width * height / Math.sqrt(Math.pow(height,2) + Math.pow(width * tan1,2))
    let y1 = flag * width * height * tan1 / Math.sqrt(Math.pow(height,2) + Math.pow(width * tan1,2))
    return {
      width: cx + x1,
      height : cy - y1
    }
  }
  
  return (
    <div>
      <canvas id="face" width="35" height="35" ref={canvasRef}></canvas>
    </div>
  )
}

export default  DrawFace;