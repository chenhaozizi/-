export default class fmtDate {
  fmtDate = (obj, minuts) => {
 
  var date = new Date(obj);
  var y = 1900 + date.getYear();
  var m = "0" + (date.getMonth() + 1);
  var d = "0"+ date.getDate();
  var hour = "0" + date.getHours();
  var minute = "0" + date.getMinutes();
  var second = "0" + date.getSeconds();
  if (minuts) { return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length) + "  " + hour.substring(hour.length - 2, hour.length) + ":" + minute.substring(minute.length - 2, minute.length) + ":" + second.substring(second.length - 2, second.length)}

  return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}

}