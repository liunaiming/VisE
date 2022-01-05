const router = require('koa-router')()
const avgData = require('../avg.json');
const Diasee  = require('../model/Daisee.js');
router.post('/time', async(ctx, next) => {
  const conditions = ctx.request.body;
  console.log(conditions);
  try{
    const findResult = await Diasee.find(conditions);
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

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})
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
      "attention": item.attention,
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
  if(item.accept) return "accept";
  if(item.reject) return "reject";
  if(item.HeadRow) return "HeadRow";
  if(item.HeadPitch) return "HeadPitch";
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
