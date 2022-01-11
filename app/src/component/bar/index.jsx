import react, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {EmotionColor} from '../../utils';
import './index.css'
const Bar = (props) => {
  const { data } = props;
  const svgRef = useRef()
  useEffect(()=>{
    console.log('data in bar',data);
    drawBar(data);
  },[data]);
  const drawBar = (obj) => {
    let padding = { top: 40 , right: 20, bottom: 20, left: 70 };
    let rectStep = 40;
    let rectheight = 35;
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
                   .domain([0,50])
                   .range([0,500]);
    var xAxis = d3.axisTop(linearX)             
    for(let i=0; i<keys.length; i++){
      let key = keys[i];
      let detected = obj[key].detected;
      if(!detected){
         res.undetected.push(key)
         continue;
      }
      let emotion = obj[key].emotion;
      res[emotion].push(key);
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
    let barX = resKeys.map(v => res[v].length) 
    console.log('barx',resKeys,barX);
    const svg = d3.select(svgRef.current)
                  
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
                .attr("fill",(d,i)=>EmotionColor[resKeys[i]]);
    svg.append("g") 
       .attr("class","axis")
       .attr("transform","translate(" + padding.left + "," + (padding.top-5) + ")")
       .call(xAxis);
  }
  return (
    <div className="draw-bar">
      <svg ref={svgRef} width="400px" height="320px"></svg>
    </div>
  )
}

export default Bar;