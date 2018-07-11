export default class fmtDate {
  fmtDate = (obj) => {
    var y = obj.substring(0,4);
    var m = obj.substring(5,7);
    var d = obj.substring(8,10);
    return y + "/" + m + "/" + d;
  }

}