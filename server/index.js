const koa = require('koa');
const router = require('./router/index');
const bodyParser = require('koa-bodyparser');
const app = new koa();

app.use(bodyParser());
app.use(router.routes())
app.use(router.allowedMethods())

router.get('/',(ctx)=> {
  ctx.body = "欢迎来到Koa"
})
app.listen(3001,()=>{
  console.log('server start')
})