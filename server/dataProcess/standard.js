const fs = require('fs');
const csv = require('csvtojson');

let res = {
}
let avgData = { }
let LabelPath = '/Users/liunaiming/site/刘乃铭/DAiSEE/Labels/TrainLabels_reduce.csv'
async function fetchData() {
  const jsonLabel= await csv().fromFile(LabelPath);
  console.log(jsonLabel);
  for(let i=0; i<jsonLabel.length; i++) {

    let row = jsonLabel[i];
    const ClipID = row.ClipID;
    console.log(ClipID);
    const filename = ClipID.slice(0,-4);
    const Id = ClipID.slice(0,6);
    if(!res[Id]){
      res[Id] = {
        gazex:[],
        gazey:[],
        headx:[],
        heady:[]
      }
    }
    let path = '/Users/liunaiming/site/刘乃铭/DAiSEE/process/'+ filename + '.csv'
    const data = await csv().fromFile(path);
    for(let j=0; j<data.length; j++) {
      let row1 = data[j];
      let gaze_angle_x = Number(row1.gaze_angle_x);
      let gaze_angle_y = Number(row1.gaze_angle_y);
      let pose_Rx = Number(row1.pose_Rx);
      let pose_Ry = Number(row1.pose_Ry);
      res[Id].gazex.push(gaze_angle_x);
      res[Id].gazey.push(gaze_angle_y);
      res[Id].headx.push(pose_Rx);
      res[Id].heady.push(pose_Ry)
    }
  }
  

  for(let key in res) {
    let avg_gazex = avg(res[key].gazex);
    let avg_gazey = avg(res[key].gazey);
    let avg_headx = avg(res[key].headx);
    let avg_heady = avg(res[key].heady);
    avgData[key] = {
      avg_gazex,
      avg_gazey,
      avg_headx,
      avg_heady
    }
  }
  console.log(avgData);
  try {
    fs.writeFileSync('avg.json', JSON.stringify(avgData));
  } catch (err) {
    console.error(err)
  }
} 
fetchData()
function avg(arr) {
  let sum = 0;
  let len = arr.length;
  if(!len) return 0;
  for(let i = 0; i < len; i++) {
    sum += arr[i]
  }
  return sum/len;
}


