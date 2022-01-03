const router = require('koa-router')()

const Diasee  = require('../model/Daisee.js');
router.post('/time', async(ctx, next) => {
  const conditions = ctx.request.body;
  console.log(conditions);
  try{
    const findResult = await Diasee.find(conditions);
    const [faceData,scatterData] = cal(findResult);
    ctx.type = 'json';
    ctx.body = {
      code : 200,
      msg:"成功",
      data:{

      }
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

function cal(list) {
  let length = list.length;
  const emotion = {
    "neutral": [],
    "happy": [],
    "angry": [],
    "surprise": [],
    "disgust": [],
    "fear": [],
    "sad" : [],
  }
  let fatigue_sum = 0;
  let onscreen_sum = 0;
  let HeadDown_sum = 0;
  for(let i = 0; i < length; i++) {
    let item = list[i];
    let emo = item.emotion || "neutral";
    let id = item.id;
    emotion[emo].push(id);
    let onscreen = item.onscreen;
    let HeadDown = item.HeadDown;
    let fatigue = item.fatigue;
    onscreen_sum += (onscreen ? 1 : 0);
    HeadDown_sum += (HeadDown ? 1 : 0);
    fatigue_sum += fatigue;
  }
  let happy = emotion.happy.length;
  let neutral = emotion.neutral.length;

}
module.exports = router
