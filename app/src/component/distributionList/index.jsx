import react, { useEffect, useState } from 'react';
import Distribution from '../distribution';
import { List } from 'antd';

const DistributionList = (props) => {

  const { method, data } = props;
  console.log(props,method,data)
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
  useEffect(()=>{
    processData(false)
  },[method,data])

  const processData = (direction) => {
    
    let newData = data.slice();

    if(method == 'attention') {
      if(direction) {
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
      if(direction) {
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
      if(direction) {
        newData.sort((a,b) => {
          return a[method] - b[method]
        })
      } else {
        newData.sort((a,b) => {
          return b[method] - a[method]
        })
      }
    }
    console.log('mew',newData,cate);
    setList(newData);

  }
  return (
    <List
      header={<div>Header</div>}
      bordered
      dataSource={list}
      renderItem={item =>  
          <Distribution data={item} sortArr={cate}/>
      }
    />
  )
}
export default DistributionList;