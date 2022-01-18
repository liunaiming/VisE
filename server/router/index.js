const router = require('koa-router')()
const avgData = require('../avg.json');
const Diasee  = require('../model/Daisee.js');
router.post('/time', async(ctx, next) => {
  const conditions = ctx.request.body;
  let timestamp = Number(conditions.timestamp)
  try{
    const findResult = await Diasee.find({"timestamp":timestamp});
    // const [faceData,scatterData] = calFace(findResult);
    const data = calScatter(findResult);
    ctx.type = 'json';
    ctx.response.body = {
      code : 200,
      msg:"成功",
      data:data
    }
  } catch (error) {
    console.log(error);
  }

  
})

router.post('/stream', async (ctx, next) => {
  const conditions = ctx.request.body;
  let finalTime = Number(conditions.timestamp)
  let cond = new Array(finalTime+1).fill(0).map((v,index) => index); 
  const data = await Diasee.find({"timestamp":{$in:cond}});
  //计算每种情感的数量，
  //计算注意力的位置
  // const emotions = {
  //   "neutral": new Array(finalTime+1).fill(0).map((v,index) => {return {"timestamp":index, "count":0}}),
  //   "sad": new Array(finalTime+1).fill(0).map((v,index) => {return {"timestamp":index, "count":0}}),
  //   "happy": new Array(finalTime+1).fill(0).map((v,index) => {return {"timestamp":index, "count":0}}),
  //   "fear": new Array(finalTime+1).fill(0).map((v,index) => {return {"timestamp":index, "count":0}}),
  //   "angry": new Array(finalTime+1).fill(0).map((v,index) => {return {"timestamp":index, "count":0}}),
  //   "disgust": new Array(finalTime+1).fill(0).map((v,index) => {return {"timestamp":index, "count":0}}),
  //   "surprise": new Array(finalTime+1).fill(0).map((v,index) => {return {"timestamp":index, "count":0}}),
  //   "undetected": new Array(finalTime+1).fill(0).map((v,index) => {return {"timestamp":index, "count":0}}),
  // }
  // const fatigue = new Array(finalTime+1).fill(0).map((v,index)=>{
  //   return {
  //     timestamp:index,
  //     "neutral": [],
  //     "sad": [],
  //     "happy": [],
  //     "fear": [],
  //     "angry": [],
  //     "disgust": [],
  //     "surprise": [],
  //     "undetected": []
  //   }
  // })
  const fatigue = {}
  const emotions = new Array(finalTime+1).fill(0).map((v,index)=>{
    return {
      timestamp:index,
      "neutral": 0,
      "sad": 0,
      "happy": 0,
      "fear": 0,
      "angry": 0,
      "disgust": 0,
      "surprise": 0,
      "undetected": 0
    }
  })
  for(let i=0; i<data.length; i++){
    let item = data[i];
    let id = item.id;
    let timestamp = item.timestamp
    let emotion = item.emotion == 'Null' ? "neutral" : item.emotion
    let detected = item.detected;
    if(!detected) {
      emotions[timestamp]["undetected"] +=1;
      emotion = "undetected";
    } else {
      emotions[timestamp][emotion] += 1;
    }
    if(!fatigue[timestamp]) {
      fatigue[timestamp] = [];
    }
    fatigue[timestamp].push({
      "id":id,
      "fatigue":item.fatigue,
      "emotion":emotion,
      "attention": item.attention
    })
    }
    for( i in fatigue) {
      let range = {
        "neutral":0,
        "happy":0,
        "sad":0,
        "surprise":0,
        "fear":0,
        "disgust":0,
        "angry":0,
        "undetected":0

      }
      fatigue[i].sort((a,b) => a.fatigue - b.fatigue);
      for(let j=0; j< fatigue[i].length; j++){
        let e = fatigue[i][j].emotion;
        range[e] += 1;
        fatigue[i][j].rank = range[e]
      }
    }
    ctx.type = 'json';
    ctx.response.body = {
      code : 200,
      msg:"成功",
      data:{
        emotionsData : emotions,
        fatigueData : fatigue
      }
    }
  
  });

router.post('/distribution', async (ctx, next) => {
  const conditions = ctx.request.body;
  let start = Number(conditions.start);
  let end = Number(conditions.end);

  let cond = []
  for(let i=start; i<=end; i++) {
    cond.push(i)
  }
  console.log('start-end',start,end,cond);
  const data = await Diasee.find({"timestamp":{$in:cond}})

  let res = {}
  for(let i=0; i<data.length; i++) {
    let item = data[i];
    let id = item.id;
    let emotion = item.emotion;
    let attention = item.attention;
    let fatigue = item.fatigue;
    if(!res[id]) {
      res[id] = {
        "neutral":0,
        "happy":0,
        "sad":0,
        "surprise":0,
        "fear":0,
        "disgust":0,
        "angry":0,
        "undetected":0,
        "attention":[],
        "fatigue":[],
        "RowHead":0,
        "PitchHead":0,
      }
    }
    res[id][emotion]+=1;
    res[id]["attention"].push(attention);
    res[id]["fatigue"].push(fatigue);
    if(item.RowHead == true) {
      res[id]["RowHead"] += 1;
    }
    if(item.PitchHead == true) {
      res[id]["PitchHead"] += 1;
    }
  
  }
  let finallData = [];
  let keys = Object.keys(res);
  for(let i=0; i<keys.length; i++){
    let key = keys[i];
    let length = res[key].attention.length
    res[key].attention.sort()
    res[key].fatigue.sort()
    // for(let j=0; j<length; j++) {
    //   sum_attention += res[key].attention[j];
    //   sum_fatigue += res[key].fatigue[j];
    // }
    // let avg_attention = sum_attention/length;
    // let avg_fatigue = sum_fatigue/length;
    let left_attention = res[key].attention[Math.floor(length/4)];
    let mid_attention = res[key].attention[Math.floor(length/2)];
    let right_attention = res[key].attention[Math.floor(length/4*3)];
    let min_attention = res[key].attention[0];
    let max_attention = res[key].attention[length-1];

    let left_fatigue = res[key].fatigue[Math.floor(length/4)];
    let mid_fatigue = res[key].fatigue[Math.floor(length/2)];
    let right_fatigue = res[key].fatigue[Math.floor(length/4*3)];
    let min_fatigue = res[key].fatigue[0];
    let max_fatigue = res[key].fatigue[length-1];

    //方差
    let t = {
      id:key,
      "neutral":res[key]["neutral"],
      "happy":res[key]["happy"],
      "sad":res[key]["sad"],
      "surprise":res[key]["surprise"],
      "fear":res[key]["fear"],
      "disgust":res[key]["disgust"],
      "angry":res[key]["angry"],
      "undetected":res[key]["undetected"],
      "attention": {
        left_attention,
        mid_attention,
        right_attention,
        min_attention,
        max_attention
      },
      "fatigue": {
        left_fatigue,
        mid_fatigue,
        right_fatigue,
        min_fatigue,
        max_fatigue
      }
    }
    finallData.push(t);
  }
  console.log('finallData',finallData)
  ctx.type = 'json';
  ctx.response.body = {
    code : 200,
    msg:"成功",
    data:finallData
  }
  ctx.res.state = 200
});


function calScatter(list){
  let length = list.length;
  let res = {};
  let fatigue_max = 2.25;
  for(let i=0; i<length; i++) {

    let item = list[i];
    let id = item.id;
    let headx = (item.HeadRow-avgData[id].avg_headx)/0.15;
    if(headx <= -1) {
      headx = -1;
    } else if(headx >=1) {
      headx = 1;
    }
    let heady = (item.HeadPitch - avgData[id].avg_heady)/0.15;
    if(heady <= -1) {
      heady = -1;
    } else if (heady >=1) {
      heady = 1;
    }
    let emotion = item.emotion == "Null" ? "neutral" : item.emotion;
    let action = getAction(item);
    let fatigue = item.fatigue > 0.5 ? 1 : item.fatigue/0.5;
    res[id] = {
      "ClipID" : item.ClipID,
      "frame" : item.frame,
      "detected" : item.detected,
      "attention": item.attention,
      "fatigue": fatigue,
      "fatigue_x": item.fatigue/fatigue_max,
      "emotion": emotion,
      "headx": headx,
      "heady": heady,
      "gazex": item.gazex-avgData[id].avg_gazex,
      "gazey": item.gazey-avgData[id].avg_gazey,
      "action": action
    }
  }
  return res;
}
function getAction(item) {
  // if(item.accept) return "accept";
  // if(item.reject) return "reject";
  if(item.RowHead) return "RowHead";
  if(item.PitchHead) return "PitchHead";
  if(item.daze) return "daze";
  return "normal";
}
// function calFace(list) {
//   let length = list.length;
//   const emotions = {
//     "neutral": [],
//     "happy": [],
//     "angry": [],
//     "surprise": [],
//     "disgust": [],
//     "fear": [],
//     "sad" : [],
//   }
//   let fatigue_sum = 0;
//   let onscreen_sum = 0;
//   let HeadDown_sum = 0;
//   for(let i = 0; i < length; i++) {
//     let item = list[i];
//     let emo = item.emotion || "neutral";
//     let id = item.id;
//     emotions[emo].push(id);
//     let onscreen = item.onscreen;
//     let HeadDown = item.HeadDown;
//     let fatigue = item.fatigue;
//     onscreen_sum += (onscreen ? 1 : 0);
//     HeadDown_sum += (HeadDown ? 1 : 0);
//     fatigue_sum += fatigue;
//   }
//   let happy = emotions.happy.length;
//   let neutral = emotions.neutral.length;
//   let unhappy = length - happy - neutral;
//   let fatigue_avg = fatigue/length;
//   let headdown_avg = HeadDown_sum/length;
//   let onscreen_avg = onscreen_sum/length;
//   let emotion = (unhappy*-1 + happy)/length;
//   let gaze = {
//     gazex:
//     gazey:
//   }
// }
module.exports = router
