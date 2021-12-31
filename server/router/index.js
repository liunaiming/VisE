const router = require('koa-router')()

const Diasee  = require('../model/Daisee.js');
router.post('/time', async (ctx, next) => {
  const conditions = ctx.request.body;
  console.log(conditions);
  const findResult = await Diasee.find(conditions);
  if(findResult.length) {
    ctx.body = findResult;
  } else {
    ctx.status = 500;
    ctx.body = "查找失败";
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

module.exports = router