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

    while(this.arr_max[0].count < this.count-this.length) {
      this.arr_max.shift()
    }
    while(this.arr_min[0].count < this.count-this.length) {
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
      this.arr.push(m);
      this.count += m;   
    if(this.arr.length > 300) {
      let last = this.arr.shift()
      this.count -= last;
    }
    return this.count/ this.arr.length;
  }
}
saveData()
async function saveData() {
  let LabelPath = mypath + '/Labels/TrainLabels_reduce.csv'
  const jsonLabel= await csv().fromFile(LabelPath);
  let prefix = null;
  let  currentTime = 0;
  let Headx = new Head(0.05, 100);
  let Heady = new Head(0.05, 100);
  let dazex = new Head(0.1, 300);
  let dazey = new Head(0.1, 300);
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
      Headx = new Head(0.05, 100);
      Heady = new Head(0.05, 100);
      dazex = new Head(0.1, 300);
      dazey = new Head(0.1, 300);
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
      let timestamp = currentTime + Number(Frow.timestamp);
      let onscreen = Math.abs(Number(Frow.gaze_angle_x)-avg_gazex) < 0.18 && Math.abs(Number(Frow.gaze_angle_y)-avg_gazey)<0.18
      if(onscreen) {
        onscreen = 1
      } else {
        onscreen = 0;
      }
      let detaY = avg_headx - avg_gazex;
      let detaX = avg_heady - avg_gazey;

      let pose_y = Number(Frow.pose_Rx) - detaY
      let pose_x = Number(Frow.pose_Ry) - detaX
      
      Headx.push(pose_x);
      Heady.push(pose_y);
      dazey.push(Number(Frow.gaze_angle_y));
      dazex.push(Number(Frow.gaze_angle_x));

      //抬头小，低头大
      let HeadDown = Frow.pose_Rx-avg_headx > 0.15;
      let att  = attention.push(onscreen);

      let HeadYaw = Headx.getState();
      let HeadPitch = Heady.getState();
      let state_dazey = dazey.getDaze();
      let state_dazex = dazex.getDaze();
      let daze = state_dazex && state_dazey;

      let E2_l_x = Number(Frow.eye_lmk_x_10);
      let E6_l_x = Number(Frow.eye_lmk_x_18);
      let E3_l_x = Number(Frow.eye_lmk_x_12);
      let E5_l_x = Number(Frow.eye_lmk_x_16);
      let E1_l_y = Number(Frow.eye_lmk_y_14);
      let E4_l_y = Number(Frow.eye_lmk_y_8);
      let E2_r_x = Number(Frow.eye_lmk_x_38);
      let E6_r_x = Number(Frow.eye_lmk_x_46);
      let E3_r_x = Number(Frow.eye_lmk_x_40);
      let E5_r_x = Number(Frow.eye_lmk_x_44);
      let E1_r_y = Number(Frow.eye_lmk_y_42);
      let E4_r_y = Number(Frow.eye_lmk_y_36);

      let E2_l_y = Number(Frow.eye_lmk_y_10);
      let E6_l_y = Number(Frow.eye_lmk_y_18);
      let E3_l_y = Number(Frow.eye_lmk_y_12);
      let E5_l_y = Number(Frow.eye_lmk_y_16);
      let E1_l_x = Number(Frow.eye_lmk_x_14);
      let E4_l_x = Number(Frow.eye_lmk_x_8);
      let E2_r_y = Number(Frow.eye_lmk_y_38);
      let E6_r_y = Number(Frow.eye_lmk_y_46);
      let E3_r_y = Number(Frow.eye_lmk_y_40);
      let E5_r_y = Number(Frow.eye_lmk_y_44);
      let E1_r_x = Number(Frow.eye_lmk_x_42);
      let E4_r_x = Number(Frow.eye_lmk_x_36);


      let blink_l = (Math.sqrt((E2_l_x - E6_l_x) ** 2 + (E2_l_y - E6_l_y) ** 2) + Math.sqrt((E3_l_x - E5_l_x) ** 2 + (E3_l_y - E5_l_y) ** 2))/
                    (2 * Math.sqrt((E1_l_x - E4_l_x) ** 2 + (E1_l_y - E4_l_y) ** 2))

      let blink_r = (Math.sqrt((E2_r_x - E6_r_x) ** 2 + (E2_r_y - E6_r_y) ** 2) + Math.sqrt((E3_r_x - E5_r_x) ** 2 + (E3_r_y - E5_r_y) ** 2))/
      (2 * Math.sqrt((E1_r_x - E4_r_x) ** 2 + (E1_r_y - E4_r_y) ** 2)) 

      let blink = (blink_l+blink_r)/2
      let fat = fatigue.push(blink);

      let M2_x = Number(Frow.x_51);
      let M2_y = Number(Frow.y_51);
      let M4_x = Number(Frow.x_57);
      let M4_y = Number(Frow.y_57); 
      let M1_x = Number(Frow.x_54);
      let M1_y = Number(Frow.y_54);
      let M3_x = Number(Frow.x_48);
      let M3_y = Number(Frow.y_48);

      let mouthOpen = Math.sqrt((M2_x - M4_x) ** 2 + (M2_y - M4_y) ** 2) / Math.sqrt((M1_x - M3_x) ** 2 + (M1_y - M3_y) ** 2)
      
      let data = {
        id: pre,
        ClipID:ClipID,
        frame: Number(Erow.frame),
        detected: Boolean(Frow.success),
        timestamp:timestamp,
        gazex: Number(Frow.gaze_angle_x),
        gazey: Number(Frow.gaze_angle_y),
        onscreen:onscreen,
        HeadY:pose_y,
        HeadX:pose_x,
        openmouse:mouthOpen,
        HeadDown:HeadDown,
        XHead:HeadYaw,
        YHead:HeadPitch,
        emotion:Erow.domain_emotion || neutral,
        blink: blink,
        attention: att,
        fatigue: fat,
        daze: daze,
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



