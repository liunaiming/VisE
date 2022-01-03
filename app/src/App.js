import { useEffect, useState } from 'react';
import Face from './component/face';
import Scatter from './component/sactter';
function App() {
  const [mouth, setMouth] = useState(); 
  const [head, setHead] = useState();
  const [eye, setEye] = useState();
  const [gaze, setGaze]  = useState();

  useEffect(()=>{
    fetchData();
  }) 
  let faceprops = {
    mouth: 0.1,
    head: 0.1,
    eye: 0.5,
    gaze: { gazex: 0.01, gazey: 0.05 }
  }

  const fetchData = async () => {
    fetch('http://localhost:3001/time', {
      method: 'POST', 
      body: `timestamp=100`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      mode: 'cors'
    }).then(res => console.log('res',res.body))
  }
  return (
    <div>
      <Scatter/>
    </div>
  );
}

export default App;
