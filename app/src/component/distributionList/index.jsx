import react, { useEffect, useState, useRef } from 'react';
import Distribution from '../distribution';
import { List, Select } from 'antd';
import * as d3 from 'd3';
import './index.css'

const { Option } = Select;

const DistributionList = (props) => {

  const { method, data, direction } = props;
  console.log('method',method,'direction',direction)
  const [list, setList] = useState([]);
  const [cate, setCate] = useState([
  "neutral",
  "happy",
  "sad",
  "surprise",
  "fear",
  "disgust",
  "angry",
  "undetected"]);

  const svgRef = useRef();
  useEffect(()=>{
    processData()
  },[method,data,direction])

  useEffect(()=>{
    drawAxis();
  },[list])

  const drawAxis = () => {
    console.log('画')
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const xscale = d3.scaleLinear()
                     .domain([0,1])
                     .range([0,width*0.28]);
    const xscale1 = d3.scaleLinear()
    .domain([1,0])
    .range([0,width*0.28]);

    const attentionAxis = d3.axisTop(xscale)
                            // .ticks(2,",f")
                            .tickArguments([1, "s"])
                            // s.precision = d3.precisionFixed(0.01);
    const fatigueAxis = d3.axisTop(xscale1)
                          .tickValues([1,0])
                          .tickArguments([1, "s"])
                            
    const svg = d3.select(svgRef.current)
    svg.append('g')
        .attr("transform", "translate("+width*0.7+","+height*0.9+")")
        .call(attentionAxis)
    svg.append('g')
        .attr("transform","translate("+width*0.02+","+height*0.9+")")
        .call(fatigueAxis)
  }
  const processData = () => {
    let newData = data.slice();

    if(method == 'attention') {
      if(direction=="true") {
        newData.sort((a,b) => {
          return a.attention.mid_attention - b.attention.mid_attention
        })
      } else {
        newData.sort((a,b) => {
          return b.attention.mid_attention - a.attention.mid_attention
        })
      }
    }
    else if(method == 'fatigue') {
      if(direction=="true") {
        newData.sort((a,b) => {
          return a.fatigue.mid_fatigue - b.fatigue.mid_fatigue
        })
      } else {
        newData.sort((a,b) => {
          return b.fatigue.mid_fatigue - a.fatigue.mid_fatigue
        })
      }
    } else {
      let newCate = cate.slice();
      let index = newCate.indexOf(method);
      newCate.splice(index,1);
      newCate.unshift(method);
      setCate(newCate);
      if(direction=='true') {
        newData.sort((a,b) => {
          return a[method] - b[method]
        })
      } else {
        newData.sort((a,b) => {
          return b[method] - a[method]
        })
      }
    }

    setList(newData);

  }
  return (
    <List
      header={
        <svg ref={svgRef} height="20px" width="300px"></svg>
      }
      itemLayout="horizontal"
      bordered="false"
      dataSource={list}
      renderItem={(item,index) =>  
        <Distribution data={item} sortArr={cate} keys={index}/>
      }
    />
  )
}
export default DistributionList;