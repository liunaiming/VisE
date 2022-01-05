const fs = require('fs');
const path = require('path')
const Diasee = require('../model/Daisee');
const csv = require('csvtojson');

const stand = require('../avg.json');
console.log(stand);
mypath = '/Users/liunaiming/site/刘乃铭/DAiSEE'

class Head {
  constructor(threshold,length){
    this.arr = [];
    this.arr_max = [];
    this.arr_min = [];
    this.threshold = threshold;
    this.length = length;
    this.count = 0;
  }
  push(m) {
    this.count+=1;
    let data = {
      count:this.count,
      value: m
    }
    while(this.arr_max.length && this.arr_max[this.arr_max.length-1].value <= m) {
      this.arr_max.pop()
    }
    this.arr_max.push(data);

    while(this.arr_min.length && this.arr_min[this.arr_min.length-1].value >= m) {
      this.arr_min.pop()
    }
    this.arr_min.push(data)

    while(this.arr_max[0].count < this.count-this.threshold) {
      this.arr_max.shift()
    }
    while(this.arr_min[0].count < this.count-this.threshold) {
      this.arr_min.shift();
    }
  }
  getState() {
    return this.arr_max[0].value - this.arr_min[0].value >= this.threshold
  }
  getDaze() {
    if(this.arr.length < this.length) {
      return false;
    }
    return this.arr_max[0].value - this.arr_min[0].value <= this.threshold
  }
}

class Fatigue {
  constructor(){
    this.arr = [];
    this.sum = 0;
  }
  push(m) {
    this.arr.push(m);
    this.sum += m;
    if(this.arr.length>300) {
      let last = this.arr.shift();
      this.sum -= last;
    }
    return this.sum / this.arr.length;
  }
}

class Attention {
  constructor() {
    this.arr = [];
    this.count = 0;
  }
  push(m){
    if(m) {
      this.arr.push(1);
      this.count += 1;
    } else {
      this.arr.push(0)
    }
    
    if(this.arr.length > 300) {
      let last = this.arr.shift()
      this.count -= last;
    }
    return this.count/this.arr.length;
  }
}
saveData()
async function saveData() {
  let LabelPath = mypath + '/Labels/TrainLabels_reduce.csv'
  const jsonLabel= await csv().fromFile(LabelPath);
  let prefix = null;
  let  currentTime = 0;
  let Headx = new Head(0.04, 100);
  let Heady = new Head(0.04, 100);
  let dazex = new Head(0.05, 1000);
  let dazey = new Head(0.05, 1000);
  let attention = new Attention();
  let fatigue = new Fatigue();
  for( let i=0 ;i < jsonLabel.length; i++) {
    let item = jsonLabel[i];
    let Boredom = item.Boredom;
    let Engagement = item.Engagement;
    let Confusion = item.Confusion;
    let Frustration = item.Frustration;
    let ClipID = item.ClipID.slice(0,-4);
    let pre = item.ClipID.slice(0,6);
    let avg_gazex = stand[pre].avg_gazex;
    let avg_gazey = stand[pre].avg_gazey;
    let avg_headx = stand[pre].avg_headx;
    let avg_heady = stand[pre].avg_heady;
    if(pre !== prefix) {
      prefix = pre;
      currentTime = 0;
      Headx = new Head(0.08, 100);
      Heady = new Head(0.08, 100);
      dazex = new Head(0.05, 1000);
      dazey = new Head(0.05, 1000);
      attention = new Attention();
      fatigue = new Fatigue();
    }
    let Epath = mypath + '/emotion/' + ClipID + '_emo.csv';
    let Fpath = mypath + '/process/' + ClipID + '.csv';
    let JsonE = await csv().fromFile(Epath);
    let jsonF = await csv().fromFile(Fpath);


    for (let j=0; j<JsonE.length; j++) { //
      let Erow = JsonE[j];
      let Frow = jsonF[j];
      let random = Math.random()
      let accept = random > 0.5 && random < 0.52;
      let reject = random > 0.2 && random < 0.22;
      let timestamp = currentTime + Number(Frow.timestamp);
      let onscreen = Math.abs(Frow.gaze_angle_x-avg_gazex) < 0.18 && Math.abs(Frow.gaze_angle_y)<0.18
      Headx.push(Number(Frow.pose_Rx));
      Heady.push(Number(Frow.pose_Ry));
      dazey.push(Number(Frow.gaze_angle_y));
      dazex.push(Number(Frow.gaze_angle_x));

      //抬头小，低头大
      let HeadDown = Frow.pose_Rx-avg_headx > 0.15;
      let att  = attention.push(onscreen);
      let fat = fatigue.push(Number(Frow.AU45_r));
      let HeadRow = Headx.getState();
      let HeadPitch = Heady.getState();
      let state_dazey = dazey.getDaze();
      let state_dazex = dazex.getDaze();
      let daze = state_dazex && state_dazey;
      
      let data = {
        id: pre,
        ClipID:ClipID,
        frame: Number(Erow.frame),
        detected: Boolean(Frow.success),
        timestamp:timestamp,
        gazex: Number(Frow.gaze_angle_x),
        gazey: Number(Frow.gaze_angle_y),
        onscreen:onscreen,
        HeadRow:Number(Frow.pose_Rx),
        HeadPitch:Number(Frow.pose_Ry),
        HeadDown:HeadDown,
        RowHead:HeadRow,
        PicthHead:HeadPitch,
        emotion:Erow.domain_emotion || neutral,
        blink: Number(Frow.AU45_r),
        openmouse:Frow.AU25_r>1,
        attention: att,
        fatigue: fat,
        daze: daze,
        accept: accept,
        reject: reject,

        boredom: Number(Boredom),
        Engagement:Number(Engagement),
        Confusion:Number(Confusion),
        Frustration:Number(Frustration),
      }
      await Diasee.create(data,function(error,doc){
        if(error) {
          console.log(error, data)
        } else {
          console.log(ClipID,Number(Erow.frame))
        }
      })  
    }
    currentTime += 10;
  }
}



