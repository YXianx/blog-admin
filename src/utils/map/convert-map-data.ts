import { coordinateData } from "./coordinate-data";
export const convertData = function(data: any) {
  var res = [];
  for (var i = 0; i < data.length; i++) {
      var geoCoord = coordinateData[data[i].name];

      if (geoCoord) {
          res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
          });
      }
  }
  return res;
}
