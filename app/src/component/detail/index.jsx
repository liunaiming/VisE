import { Divider } from 'antd';
import react, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { EmotionColor } from '../../utils';

const Detail = (props) => {
  const svgRef = useRef();
  const data = props.data;
  console.log('detail data',data)

  useEffect(()=>{
    draw();
  },[data])

  const draw = () => {
    if(data.length == 0) {
      return;
    }
    const svg = d3.select(svgRef.current)
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const xScale = d3.scaleLinear()
                     .domain([0,data[data.length-1].timestamp])
                     .range([0,width*0.7]);
    const xAxis = d3.axisBottom(xScale)
                    .ticks(10);
    let blink_arr = []
    data.forEach( v => blink_arr.push(+v.blink))
    console.log('blinkzarr',blink_arr,Math.min(blink_arr),Math.max(blink_arr));
    const yScale = d3.scaleLinear()
                     .domain([-0.15,0.15])
                     .range([height*0.3,height*0.2])
    
    const aScale = d3.scaleLinear()
                      .domain([Math.min(...blink_arr),Math.max(...blink_arr)])
                      .range([height*0.7,height*0.55])

    svg.selectAll('.xAxis')
       .data([
         {y:height*0.1,height:height*0.3,color:'#e0e2df'},
         {y:height*0.4,height:height*0.2,color:'#c8d2df'},
         {y:height*0.6,height:height*0.3,color:'#b4c2d4'},
        ])
       .enter()
       .append('g')
       .append('rect')
       .attr('x',width*0.13)
       .attr('y',(d)=>d.y)
       .attr('width',width*0.02)
       .attr('height',(d)=>d.height)
       .attr('fill',(d)=>d.color)
                
    svg.append('g')
      .attr("transform","translate("+ width*0.15+","+height*0.9+")")
      .call(xAxis)
    
      // svg.append('g')
      // .append('rect')
      // .attr('x',width*0.15)
      // .attr('y',height*0.1)
      // .attr('width',width*0.7)
      // .attr('height',height*0.1)
      // .attr('fill','#f2f2f2')

      // svg.append('g')
      // .append('rect')
      // .attr('x',width*0.15)
      // .attr('y',height*0.3)
      // .attr('width',width*0.7)
      // .attr('height',height*0.1)
      // .attr('fill','#f2f2f2')

    let gazeyArea = d3.area()
                  .x((d)=>xScale(+d.timestamp))
                  .y1(d =>yScale(+d.gazey))
                  // .y0((d) => yScale(+d.HeadPitch));
    
    let gazexArea = d3.area()
                      .x((d)=>xScale(+d.timestamp))
                      .y1((d)=>yScale(+d.gazex))

    let attentionArea = d3.area()
                          .x(d => xScale(+d.timestamp))
                          .y1(d =>aScale(+d.blink))
                          .y0(height*0.7)
    const gazeySvg = svg.append('g')
                        .datum(data)
  
    gazeySvg.append('clipPath')
        .attr('id',"clip-below-x")
        .append('path')
        .attr('d',gazexArea.y0(height))


    gazeySvg.append('clipPath')
      .attr('id',"clip-above-x")
      .append('path')
      .attr('d',gazexArea.y0(0))

    gazeySvg.append('clipPath')
        .attr('id',"clip-below")
        .append('path')
        .attr('d',gazeyArea.y0(height))


    gazeySvg.append('clipPath')
      .attr('id',"clip-above")
      .append('path')
      .attr('d',gazeyArea.y0(0))

    
    var linex = d3.line()
                // .defined(function(d) { return d; })
                .x(function(d) { return xScale(+d.timestamp); })
                .y(function(d) { return yScale(+d.gazex); });
        
    var liney = d3.line()
    // .defined(function(d) { return d; })
    .x(function(d) { return xScale(+d.timestamp); })
    .y(function(d) { return yScale(+d.gazey); });

    gazeySvg.append('path')
       .attr('clip-path',"url(#clip-above)")
       .attr('d',gazeyArea.y0((d)=>yScale(+d.HeadX)))
       .attr('fill','RGBA(224, 150, 108,0.6)')
       .attr('transform','translate('+ width*0.15 +','+ height*-0.05+')')
    
    gazeySvg.append('path')
        .attr('clip-path',"url(#clip-below)")
        .attr('d',gazeyArea)
        .attr('fill','RGBA(167, 202, 121,0.6)')
        .attr('transform','translate('+ width*0.15 +','+ height*-0.05+')')

    gazeySvg.append('path')
        .attr('clip-path',"url(#clip-above-x)")
        .attr('d',gazexArea.y0((d)=>yScale(+d.HeadY)))
        .attr('fill','RGBA(224, 150, 108,0.6)')
        .attr('transform','translate('+ width*0.15 +','+ height*0.1+')')
  
    gazeySvg.append('path')
        .attr('clip-path',"url(#clip-below-x)")
        .attr('d',gazexArea)
        .attr('fill','RGBA(167, 202, 121,0.6)')
        .attr('transform','translate('+ width*0.15 +','+ height*0.1+')') 
        

    gazeySvg.append('g')
    .append('path')
    .attr('d',liney)  
    .attr("stroke","#3c3c3c")
    .attr("stroke-width","1px") 
    .attr("fill","none")
    .attr('transform','translate('+ width*0.15 +','+ height*-0.05+')')

    gazeySvg.append('g')
    .append('path')
    .attr('d',linex)  
    .attr("stroke","#3c3c3c")
    .attr("stroke-width","1px") 
    .attr("fill","none")
    .attr('transform','translate('+ width*0.15 +','+ height*0.1+')')


    gazeySvg.append('g')
            .append('path')
            .attr('d', attentionArea)
            .attr('fill','blue')
            .attr('transform','translate('+ width*0.15 +','+ 0+')')
    let emotionData = processEmotion(data);
    console.log('emotionDsta',emotionData)
    svg.selectAll('emotionRect')
        .append('g')
        .data(emotionData)
        .enter()
        .append('rect')
        .attr('x',d => xScale(d.x))
        .attr('y',height*0.8)
        .attr('width', d=>xScale(d.value))
        .attr('height',height*0.06)
        .attr('fill',d => {
          let e = d.emotion
          if(e == "Null") e = "neutral";
          // console.log('eeee',e)
          return EmotionColor[e]["normal"]
        })
        .attr('transform','translate('+ width*0.15 +','+ 0+')')
    
  }

  const processEmotion = (data)=>{
    let res = []
    let cur = '';
    let count = 0;
    for(let i = 0; i < data.length; i++){
      let e = data[i].emotion
      if(cur == e) {
        count += 1;
      } else {
        if(i!=0) {
          res.push({
            x:i-count,
            value:count,
            emotion:cur
          });
        }
        cur = e;
        count = 1;
      }
    }
    res.push({
      x:data.length - count,
      value:count,
      emotion:cur
    })
    return res;
  }
  return (
    <div>
      <svg width="800" height="400" ref={svgRef}></svg>
    </div>
  )
}
export default Detail;
