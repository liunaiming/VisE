import { useEffect, useState } from 'react';
import Face from './component/face';
import Scatter from './component/sactter';
function App() {
  const [mouth, setMouth] = useState(); 
  const [head, setHead] = useState();
  const [eye, setEye] = useState();
  const [gaze, setGaze]  = useState();
  const [data, setData] = useState({});
  const [time, setTime] = useState(500);
  useEffect(()=>{
    fetchData(time);
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
  return (
    <div>
      <Scatter data={data}/>
    </div>
  );
}

export default App;
