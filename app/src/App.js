import { useEffect, useState } from 'react';
import Face from './component/face';
import Scatter from './component/sactter';
import EmotionBar from './component/emotionBar';
import AttentionBar from './component/attentionBar';
import Dot from './component/dot';
import DistributionList from './component/distributionList';
import './App.css';
function App() {

  const [data, setData] = useState({});
  const [type, setType] = useState("attention");
  const [emotions, setEmotions] = useState([]);
  const [fatigue, setFatigue] = useState({})
  const [time, setTime] = useState(20);
  const [Distribution,setDistribution] = useState([])
  useEffect(()=>{
    fetchData(time);
    fetchStreamData(time);
    fetchDistribution(50,100);
  },[time]); 

  useEffect(()=>{
    // setInterval(() => {
    //   setTime((prev) => prev+1);
    // }, 2000);
  },[])

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
      console.log('streamdata',data)
      setEmotions(data.data.emotionsData);
      setFatigue(data.data.fatigueData);
    }
  }
  return (
    <div className="box">
      <div className="video">
      </div>
      <div className="system">
      <div className="controller">
      </div>

      {type=="emotion" ? <EmotionBar data={data}/> : <AttentionBar data={data} type={type} />}

      <DistributionList data={Distribution} method="happy"/>
      </div>
      {
        //<Scatter data={data}/>
      }
    </div>

  );
}

export default App;
