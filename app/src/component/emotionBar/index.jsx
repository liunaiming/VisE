import react, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {EmotionColor} from '../../utils';
import {Select} from 'antd';
import './index.css'
const Bar = (props) => {
  const { data } = props;
  const svgRef = useRef()
  useEffect(()=>{
    console.log('data in bar',data);
    drawBar(data,"attention");
  },[data]);
  const drawBar = (obj,target) => {
    let padding = { top: 40 , right: 20, bottom: 20, left: 70 };
    let width = svgRef.current.clientWidth
    let height = svgRef.current.clientheight;
    console.log('width',width)
    let rectStep = 30;
    let rectheight = 25;
    let keys = Object.keys(obj);
    let res = {
      "neutral":[],
      "sad":[],
      "happy":[],
      "angry": [],
      "surprise":[],
      "disgust":[],
      "fear":[],
      "undetected":[],
    }

    //比例尺
    var linearX = d3.scaleLinear()
                   .domain([0,45])
                   .range([0,width-30]);
    var linearY = d3.scaleLinear()
                    .domain([0,1])
                    .range([0,rectheight*0.5]);
    var xAxis = d3.axisTop(linearX);   
    for(let i=0; i<keys.length; i++){
      let key = keys[i];
      let detected = obj[key].detected;
      if(!detected){
         res.undetected.push(key)
         continue;
      }
      let emotion = obj[key].emotion;
      let attention = obj[key].attention;
      let fatigue = obj[key].fatigue;
      let state = obj[key].action
      let item = {
        "name":key,
        "attention":attention,
        "fatigue":fatigue,
        "state":state
      }
      res[emotion].push(item);
    }
    let resKeys = [ 
      "neutral",
      "sad",
      "happy",
      "angry",
      "surprise",
      "disgust",
      "fear",
      "undetected",]
    let barX = resKeys.map(v => {
      res[v].sort((a,b) => b[target] - a[target])
      return res[v].length
    }) 
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove();   
    var  bar = svg.selectAll(".bar")
                .data(barX)
                .enter().append("g")
                .attr("class", "rect")
                // .attr("transform", function(d,index) { 
                //   return "translate(0," + index*15 + ")"; })
                .append("rect")
                .attr("x",(d,i) => padding.left)
                .attr("y",(d,i) => padding.top + i * rectStep)
                .attr("width",(d) => linearX(d))
                .attr("height",rectheight)
                // .attr("stroke", "White")
                .attr("fill",(d,i)=>EmotionColor[resKeys[i]].normal);
    svg.selectAll('YAxis')
    .data([0,1,2,3,4,5,6,7,8]).enter()
    .append('g')
    .append('rect')
    .attr('x',padding.left-0.5)
    .attr('y',(d) => {
      return padding.top + d * rectStep;
    })
    .attr("width",0.5)
    .attr('height',rectheight)
    .attr('fill',EmotionColor.undetected.normal)

    //每个柱中嵌入注意力和疲劳指标
    
    for(let i=0 ;i<resKeys.length; i++) {
      //注意力

      svg.selectAll(`.embed-${resKeys[i]}-attention`)
         .data(res[resKeys[i]])
         .enter().append('g')
         .append("rect")
         .attr("x",(d,index) => {
           return padding.left + index * linearX(1)
         })
         .attr("y",(d,index) => {
           return padding.top  + i * rectStep 
         })
         .attr("width",linearX(1))
         .attr("height",(d,index) => {
           return linearY(d.attention)
         })
         .attr("fill",(d,index)=>{
           return EmotionColor[resKeys[i]].attention
         })
      //疲劳程度
      svg.selectAll(`.embed-${resKeys[i]}-fatigue`)
      .data(res[resKeys[i]])
      .enter().append('g')
      .append("rect")
      .attr("x",(d,index) => {
        return padding.left + index * linearX(1)
      })
      .attr("y",(d,index) => {
        return padding.top  + i * rectStep + 25 - linearY(d.fatigue)
      })
      .attr("width",linearX(1))
      .attr("height",(d,index) => {
        return linearY(d.fatigue)
      })
      .attr("fill",(d,index)=>EmotionColor[resKeys[i]].fatigue)

      //符号
      svg.selectAll('.embed-state')
         .data(res[resKeys[i]])
         .enter().append('g')
         .append('path')
         .attr('d',(d) => {
           switch(d.state){
             case "RowHead" : {
              return d3.symbol().type(d3.symbolCircle).size(20)(); 
              break;}
             case "PitchHead" : {return d3.symbol().type(d3.symbolDiamond).size(20)();  break;}
             case "daze" : {return d3.symbol().type(d3.symbolCross).size(20)();; break;}
             default : {return ; break;}
           }
         })
         .attr('transform',(d, index) => {
           return "translate(" + (linearX(index+0.5)+padding.left)  + ","+ (padding.top+i*rectStep + 17.5)+ ")"
         })
         .attr('fill',"#000000");
    }
    svg.append("g") 
       .attr("class","axis")
       .attr("transform","translate(" + padding.left + "," + (padding.top-5) + ")")
       .call(xAxis);
  }
  return (
    <div className="draw-bar">
      <div>课堂表现试图</div>
      <svg ref={svgRef} width="500px" height="300px"></svg>
    </div>
  )
}

export default Bar;