import react, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {EmotionColor} from '../../utils';
import {Select} from 'antd';
// import './index.css'
const Bar = (props) => {
  const { data,type } = props;
  const svgRef = useRef()
  useEffect(()=>{
    console.log('data in bar',data);
    drawBar(data,type);
  },[data,type]);
  const drawBar = (obj,type) => {
    if(Object.keys(obj).length==0) return;
    let target = (type=='attention')?'fatigue':'attention';
    let width = svgRef.current.clientWidth
    let height = svgRef.current.clientHeight;

    let padding = { top: height*0.1 , right: 20, bottom: 20, left: width*0.3 };
    let rectStep = height*0.2;
    let rectheight = height*0.12;
    let keys = Object.keys(obj);
    let res = {
        "a":{
          "neutral":[],
          "sad":[],
          "happy":[],
          "angry": [],
          "surprise":[],
          "disgust":[],
          "fear":[],
          "undetected":[],
        },
        "b":{
          "neutral":[],
          "sad":[],
          "happy":[],
          "angry": [],
          "surprise":[],
          "disgust":[],
          "fear":[],
          "undetected":[],
        },
        "c":{
          "neutral":[],
          "sad":[],
          "happy":[],
          "angry": [],
          "surprise":[],
          "disgust":[],
          "fear":[],
          "undetected":[],
        },
        "d": {
          "neutral":[],
          "sad":[],
          "happy":[],
          "angry": [],
          "surprise":[],
          "disgust":[],
          "fear":[],
          "undetected":[],
        },
    }
    
    for(let i=0; i<keys.length; i++){
      let key = keys[i];
      let detected = obj[key].detected;
      let value = obj[key][type];
      let emotion = obj[key].emotion;
      let attention = obj[key].attention;
      let fatigue = obj[key].fatigue;
      let state = obj[key].action
      let item = {
        "name":key,
        "attention":attention,
        "fatigue":fatigue,
        "emotion":emotion,
        "state":state
      }
      if(value<0.25) {
        res.a[emotion].push(item);
      } else if (value<0.5) {
        res.b[emotion].push(item);
      } else if(value<0.75) {
        res.c[emotion].push(item);
      } else {
        res.d[emotion].push(item);
      }
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

    for(let i in res) {
      let item = res[i];
      for(let j in item) {
        let it = item[j];
        it.sort((a,b)=> b[target] - a[target])
      }
    }
    console.log('res',res);
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove();  
    let resData = [];
    let maxCount = 0;
    for(let key in res) {
      let item = res[key];
      let count = 0;
      for(let it in item) {
        let arr = item[it];
        arr.forEach((element,index) => {
            element.x = count;
            element.y = key;
            resData.push(element)
            count+=1;
        });
      }
      if(maxCount < count) {maxCount = count}
    }
    console.log('attention data',resData,maxCount);

        //比例尺
      var linearX = d3.scaleLinear()
      .domain([0,maxCount])
      .range([0,width*0.7]);

      var linearY = d3.scaleLinear()
      .domain([0,1])
      .range([0,rectheight*1]);
      
      var xAxis = d3.axisTop(linearX);   

      svg.selectAll('.label')
         .data(resKeys).enter().append('g')
         .append('rect')
         .attr('x',width*0.05)
         .attr('y',(d,index)=> index*height*0.12*0.8+padding.top)
         .attr('width',width*0.05)
         .attr('height',height*0.05)
         .attr('fill',(d)=>EmotionColor[d].normal)
      svg.selectAll('.labelText')
        .data(resKeys).enter().append('g')   
         .append("text") 
         .attr("transform",function(d,index){
            return "translate(" + width*0.12 +',' + (index*height*0.12*0.8+padding.top + height*0.05) +")"})
          .text(d => d)

      svg.selectAll(".bar")
                .data(resData)
                .enter().append("g")
                .attr("class", "rect")
                // .attr("transform", function(d,index) { 
                //   return "translate(0," + index*15 + ")"; })
                .append("rect")
                .attr("x",(d,i) => padding.left + linearX(d.x))
                .attr("y",(d) => {
                  return padding.top + (d.y.charCodeAt() -"a".charCodeAt()) * rectStep;
                })
                .attr("width",linearX(1))
                .attr("height",rectheight)
                // .attr("stroke", "White")
                .attr("fill",(d,i)=>EmotionColor[d.emotion].normal);
    // svg.selectAll('YAxis')
    // .data([0,1,2,3]).enter()
    // .append('g')
    // .append('rect')
    // .attr('x',padding.left-0.5)
    // .attr('y',(d) => {
    //   return padding.top + d * rectStep;
    // })
    // .attr("width",0.5)
    // .attr('height',rectheight)
    // .attr('fill',EmotionColor.undetected.normal)

    // //每个柱中嵌入注意力和疲劳指标
    
    // for(let i=0 ;i<resKeys.length; i++) {
    //   //注意力

      svg.selectAll(`.embed`)
         .data(resData)
         .enter()
         .append("rect")
         .attr("x",(d,index) => {
           return padding.left + linearX(d.x)
         })
         .attr("y",(d,index) => {
           return padding.top  + (d.y.charCodeAt()-'a'.charCodeAt()) * (rectStep) + rectheight - linearY(d[target])
         })
         .attr("width",linearX(1))
         .attr("height",(d,index) => {
           return linearY(d[target])
         })
         .attr("fill",(d,index)=>{
           return EmotionColor[d.emotion].attention
         })
    //   //疲劳程度
    //   svg.selectAll(`.embed-${resKeys[i]}-fatigue`)
    //   .data(res[resKeys[i]])
    //   .enter().append('g')
    //   .append("rect")
    //   .attr("x",(d,index) => {
    //     return padding.left + index * linearX(1)
    //   })
    //   .attr("y",(d,index) => {
    //     return padding.top  + i * rectStep + 25 - linearY(d.fatigue)
    //   })
    //   .attr("width",linearX(1))
    //   .attr("height",(d,index) => {
    //     return linearY(d.fatigue)
    //   })
    //   .attr("fill",(d,index)=>EmotionColor[resKeys[i]].fatigue)

    //   //符号
    //   svg.selectAll('.embed-state')
    //      .data(res[resKeys[i]])
    //      .enter().append('g')
    //      .append('path')
    //      .attr('d',(d) => {
    //        switch(d.state){
    //          case "RowHead" : {
    //           return d3.symbol().type(d3.symbolCircle).size(20)(); 
    //           break;}
    //          case "PitchHead" : {return d3.symbol().type(d3.symbolDiamond).size(20)();  break;}
    //          case "daze" : {return d3.symbol().type(d3.symbolCross).size(20)();; break;}
    //          default : {return ; break;}
    //        }
    //      })
    //      .attr('transform',(d, index) => {
    //        return "translate(" + (linearX(index+0.5)+padding.left)  + ","+ (padding.top+i*rectStep + 17.5)+ ")"
    //      })
    //      .attr('fill',"#000000");
    // }
    svg.append("g") 
       .attr("class","axis")
       .attr("transform","translate(" + padding.left + "," + (padding.top-5) + ")")
       .call(xAxis);
  }
  return (
    <div className="draw-bar">
      <svg ref={svgRef} width="500px" height="250px"></svg>
    </div>
  )
}

export default Bar;