import react, {useRef, useState, useEffect} from 'react'
import * as d3 from 'd3';
import { EmotionColor } from '../../utils';
const Stream = (props) => {
  const emotions = props.emotions;
  const fatigue = props.fatigue;
  const svgRef = useRef();
  useEffect(()=>{
    console.log('seriesEmotion',emotions);
    drawStream();
  },[emotions,fatigue])

  const drawStream = () => {


    let xscale = d3.scaleLinear()
                   .domain([0,20])
                   .range([0,300])

    let yscale = d3.scaleLinear()
                   .domain([0,50])
                   .range([0,300])
    let padding = { top: 40 , right: 20, bottom: 20, left: 70 };
    const stack = d3.stack()
                    .keys(["neutral","happy","sad","surprise","fear","disgust","angry","undetected"])
                    .offset(d3.stackOffsetWiggle)
    const series = stack(emotions)
    const svg = d3.select(svgRef.current).append('g');

    var defs = d3.select(svgRef.current).append('defs');
    // defs.data([0,1,2,3,4,5,6,7,8,9,10])
    //                   .enter()
    var linearGradient = defs.append("linearGradient")
                            .attr("id", "gradient")
                            .attr("x1", "0%")
                            .attr("y1", "0%")
                            .attr("x2", "100%")
                            .attr("y2", "0%")
    linearGradient.append('stop')
                  .attr('offset',"0%")
                  .attr("stop-color", "#aaaa00")
                  .attr("stop-opacity", 1);
    linearGradient.append('stop')
    .attr('offset',"50%")
    .attr("stop-color", "#aaaa00")
    .attr("stop-opacity", 0);

    linearGradient.append('stop')
    .attr('offset',"100%")
    .attr("stop-color", "#aaaa00")
    .attr("stop-opacity", 1);

    var area = d3.area()
    .x(function(d, i) { return (xscale(d.data.timestamp)); })
    .y0(function(d) { return yscale((d[0])); })
    .y1(function(d) { return yscale((d[1])); })
    // .interpolate("basis");
    .curve(d3.curveMonotoneX)


    svg.selectAll('.layer')
        .data(series)
        .enter()
        .append('g')
        .attr('class','layer')
        .append('path')
        .attr('calss','area')
        .attr('d',area)
        // .attr('fill',"url(#" + linearGradient.attr("id") + ")");
        .attr('fill',(d,index) => EmotionColor[d.key].normal);
    console.log('series',series,fatigue);
  }
  return(
    <div>
      <svg id="stream" width="600px" height="600px" ref={svgRef}></svg>
    </div>
  )
}
export default Stream;