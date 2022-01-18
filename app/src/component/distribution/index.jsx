import react, { useEffect,useRef } from 'react';
import { Row, Col } from 'antd';
import * as d3 from 'd3';
import './index.css'
import { EmotionColor } from '../../utils';
const Distribution = (props) => {
  const { data, sortArr } = props;
  const svgRef = useRef()
  useEffect(()=>{
    drawDistribution()
  },[data,sortArr])
  const drawDistribution = () => {

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const padding = {top:height*0.1,left:0};
    console.log('distribution',data,width,height);
    const emotion =[]
    let xScaleDomain = 0;
    for(let i=0; i<sortArr.length; i++) {
      emotion.push({
        x0:xScaleDomain,
        x:data[sortArr[i]]
      })
      xScaleDomain += data[sortArr[i]]
    }

    const xScale = d3.scaleLinear()
                     .domain([0,xScaleDomain])
                     .range([0,width*0.4])
    
    const xScale_att = d3.scaleLinear()
                          .domain([0,1])
                          .range([0,width*0.3]) 
    
                          console.log('rectData',emotion,xScale_att(data.attention.mid_attention));              
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove();   
    svg.selectAll('.emotion')
        .data(emotion).enter()
        .append('rect')
        .attr('x',(d)=> width*0.3 + xScale(d.x0))
        .attr('y',(d)=> padding.top)
        .attr('width',(d)=> xScale(d.x))
        .attr('height',(d)=> height*0.8)
        .attr('fill',(d,index)=>EmotionColor[sortArr[index]].normal)

    svg.selectAll('.attention') 
       .data([1]).enter()
       .append('rect')
       .attr('x',d=> width*0.7)
       .attr('y',(d)=> height*0.2)
       .attr('width', xScale_att(data.attention.mid_attention))
       .attr('height',(d)=> height*0.6)
       .attr('fill','RGB(250, 180, 174)')

    svg.append('line')
        .attr("x1", width*0.7 + xScale_att(data.attention.left_attention))
        .attr("x2",width*0.7 + xScale_att(data.attention.right_attention))
        .attr('y1',height*0.5)
        .attr('y2',height*0.5)
        .attr('stroke','black')

    svg.selectAll('.fatigue') 
    .data([1]).enter()
    .append('rect')
    .attr('x', width*0.3-xScale_att(data.fatigue.mid_fatigue))
    .attr('y',height*0.2)
    .attr('width', xScale_att(data.fatigue.mid_fatigue))
    .attr('height',height*0.6)
    .attr('fill','RGB(250, 180, 174)')

    svg.append('line')
    .attr("x1", width*0.3 - xScale_att(data.fatigue.right_fatigue))
    .attr("x2",width*0.3 - xScale_att(data.fatigue.left_fatigue))
    .attr('y1',height*0.5)
    .attr('y2',height*0.5)
    .attr('stroke','black')

  }
  return (
    <div className="distribution">
      <div className="distribution-id">{data.id}</div>
      <svg ref={svgRef}></svg>
    </div>
  )
}

export default Distribution;

// <Row >
      
// <Col span={6}>{data.id}</Col>
// <Col span={10}>
//   {
//     //<svg ref={svgRef}></svg>
//   }
//   {"ssss"}
// </Col>
// </Row>