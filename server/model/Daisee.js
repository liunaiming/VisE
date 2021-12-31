const connect = require('./mongoose_help');

//实例化数据模版

const mongoose = connect('diasee');
const Schema = mongoose.Schema;
const DaiseeSchema = new Schema({
  id: String,
  ClipID: String,
  frame: Number,
  detected: Boolean,
  timestamp: Number,
  gazex: Number,
  gazey: Number,
  onscreen: Boolean,
  HeadRow: Number,
  HeadPitch: Number,
  HeadDown: Boolean,
  RowHead: Boolean,
  PicthHead: Boolean,
  emotion: String,
  blink: Number,
  openmouse: Boolean,
  attention: Number,
  fatigue: Number,
  daze: Boolean,
  accept: Boolean,
  reject: Boolean,
  boredom: Number,
  Engagement: Number,
  Confusion: Number,
  Frustration: Number
})

module.exports = Diasee = mongoose.model("DaiseeSchema",DaiseeSchema)