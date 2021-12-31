var mongoose= require('mongoose')
var { join } = require('path')
function connectMD (dataset){
  let url = "mongodb://localhost:27017/"+dataset;
  mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true},(err)=>{
    if(err){
      console.log(url,'err')
    }else{
      console.log(`数据库${dataset}链接成功`)
    }
  })
  return mongoose;
}
module.exports = connectMD;