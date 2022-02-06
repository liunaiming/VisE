import { useEffect, useState } from 'react';
import Face from './component/face';
import Scatter from './component/sactter';
import EmotionBar from './component/emotionBar';
import AttentionBar from './component/attentionBar';
import Dot from './component/dot';
import DistributionList from './component/distributionList';
import Detail from './component/detail';
import { Select, Slider, Switch  } from 'antd';

import "antd/dist/antd.css";
import './App.css';
const { Option } = Select;

function App() {

  const [data, setData] = useState({});
  const [type, setType] = useState("attention");
  const [method, setMethod] = useState('attention');
  const [direction ,setDirection] = useState(false);
  const [emotions, setEmotions] = useState([]);
  const [fatigue, setFatigue] = useState({})
  const [time, setTime] = useState(20);
  const [disTime, setDisTime] = useState([0,time]);
  const [distribution,setDistribution] = useState([]);
  const [detail, setDetail] = useState([]);

  useEffect(()=>{
    fetchData(time);
    fetchStreamData(time);
  },[time]); 

  useEffect(()=>{
    fetchDetail('110041',500);
  },[])
  useEffect(()=>{
    // setInterval(() => {
    //   setTime((prev) => prev+1);
    // }, 2000);
  },[])

  useEffect(()=>{
    fetchDistribution(disTime[0],disTime[1]);
  },[disTime,direction,method])
  const fetchData = async (time) => {
     const data = await fetch('http://localhost:3001/time', {
      method: 'POST', 
      body: `timestamp=${time}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      mode: 'cors'
    }).then(res => res.json())
    if(data.code == 200) {
      setData(data.data);
    }
  }
  const fetchDetail = async (id,endTime) => {
    const data = await fetch('http://localhost:3001/detail',{
      method:'POST',
      body:`id=${id}&endTime=${endTime}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      mode: 'cors'
    }).then(res => res.json())
    if(data.code == 200) {
      setDetail(data.data);
    }
  }
  const fetchDistribution = async (start,end) => {
    const data = await fetch('http://localhost:3001/distribution', {
     method: 'POST', 
     body: `start=${start}&end=${end}`,
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded'
     },
     mode: 'cors'
   }).then(res => res.json())
   if(data.code == 200) {
     setDistribution(data.data);
   }
 }

  const fetchStreamData = async (time) => {
    const data = await fetch('http://localhost:3001/stream', {
      method: 'POST',
      body: `timestamp=${time}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      mode: 'cors'
    }).then(res => res.json())
    if(data.code == 200) {
      setEmotions(data.data.emotionsData);
      setFatigue(data.data.fatigueData);
    }
  }
  const handleChange = (value) => {
    setType(value);
  }

  const handleDistributionChange = (value) => {
    setMethod(value)
  }

  const handleSliderChange = (value) => {
    setDisTime(value);
  }

  const handleDirection = (value) => {
    setDirection(value);
  }
  return (
    <div className="box">
      <div className="title">学生课堂参与实时分析系统</div>
      <div className="top">
        <div className="top-left">
          <div className="controller">
            <div className="controller-title">Summary View</div>
            <div style={{"margin":"15px"}}>sort By:</div>
            <Select defaultValue="emotion" style={{ width: 120 }} onChange={handleChange}>
              <Option value="attention">Attention</Option>
              <Option value="fatigue">Fatigue</Option>
              <Option value="emotion">Emotion</Option>
            </Select>
          </div>
          {type=="emotion" ? <EmotionBar data={data}/> : <AttentionBar data={data} type={type} />}
        </div>
      </div>
      <div className="bottom">
         <div className="distribution-controller">
            <div style={{"width":"120px","marginLeft":"15px"}}>Distribution View</div>
            <div style={{"margin":"15px"}}>sort By:</div>
            <Select defaultValue="attention" style={{ width: 120 }} onChange={handleDistributionChange}>
              <Option value="fatigue">Fatigue</Option>
              <Option value="attention">Attention</Option>
              <Option value="happy">Happy</Option>
              <Option value="angry">Angry</Option>
              <Option value="neutral">Neutral</Option>
              <Option value="fear">Fear</Option>
              <Option value="surprise">Surprise</Option>
              <Option value="disgust">Disgust</Option>
              <Option value="sad">Sad</Option>
            </Select>
            <Select defaultValue="Ascending" style={{width:120}} onChange={handleDirection}>
            <Option value="false">Ascending</Option>
            <Option value="true">Descending</Option>
          </Select>
            <div style={{"margin":"15px"}}> Time Area</div>
            <Slider style={{ "width":"200px"}} range defaultValue={[0, 150]} max={time}onChange={handleSliderChange} />
          </div>
        <div className="dis-stream">
          <div className="bottom-left"> 
            <DistributionList className="distributionList" data={distribution} method={method} direction={direction}/>
          </div>
          <div className="bottom-right">
            <Detail data={detail}></Detail>
          </div>
        </div>
       
      </div>
    </div>

  );
}

export default App;
