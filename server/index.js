const koa = require('koa');
const router = require('./router/index');
const bodyParser = require('koa-bodyparser');
const app = new koa();

app.use(async (ctx, next)=> {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200; 
  } else {
    await next();
  }
});

app.use(bodyParser());
app.use(router.routes())
app.use(router.allowedMethods())

router.get('/',(ctx)=> {
  ctx.body = "欢迎来到Koa"
})
app.listen(3001,()=>{
  console.log('server start')
})