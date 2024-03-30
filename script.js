let info, datatime;
let timelist = [];
let buslisted,rate;
let nexttimed,pretimed,nexttime,pretime
function addMinutesToTime(time, minutesToAdd) {
  // 時刻を時間と分に分割
  var parts = time.split(":");
  var hours = parseInt(parts[0]);
  var minutes = parseInt(parts[1]);

  // 分数を加算
  hours += Math.floor((minutes + minutesToAdd) / 60);
  minutes = (minutes + minutesToAdd) % 60;

  // 時刻のフォーマットを確認
  hours = (hours < 10 ? "0" : "") + hours;
  minutes = (minutes < 10 ? "0" : "") + minutes;

  // 加算後の時刻を返す
  return hours + ":" + minutes;
}
function show_popup(fontcolor, bgcolor, text, faicon) {
  document.getElementById("popup").style.display = null;
  document.getElementById("popup").style.background = bgcolor;
  document.getElementById("popclose").style.color = fontcolor;
  document.getElementById("popicon").style.color = fontcolor;
  document.getElementById("poptext").style.color = fontcolor;
  document.getElementById("poptext").innerHTML = text;
  document.getElementById("popicon").setAttribute("class", faicon);
  setTimeout(() => {
    document.getElementById('popup').style.display = 'none';
  }, 5000);
}

function averageUnixTime(unixTimes) {
  if (unixTimes.length === 0) {
    return null;
  }
  // UNIX時間の合計を計算
  const sumUnixTime = unixTimes.reduce((total, unixTime) => total + unixTime, 0);
  // 平均を計算
  const averageUnixTime = sumUnixTime / unixTimes.length;
  return averageUnixTime;
}

function formatTime() {
  let unix = averageUnixTime(timelist);
  if (unix) {
    const now = new Date(unix * 1000);
    // 日付から年月日を取得
    var year = now.getFullYear();
    var month = pad(now.getMonth() + 1); // 月は0から始まるため、+1する
    var day = pad(now.getDate());
    // 曜日を取得
    var days = ['日', '月', '火', '水', '木', '金', '土'];
    var dayOfWeek = days[now.getDay()];
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    // 2桁のゼロ埋めを行うための関数
    function pad(num) {
      return (num < 10 ? '0' : '') + num;
    }
    document.getElementById("tit").innerHTML = year + '年' + month + '月' + day + '日(' + dayOfWeek + ')';
    document.getElementById("time").innerHTML = hours + ':' + pad(minutes) + ':' + pad(seconds);
  }
}
let map;
let icz = 25;
const isLineWebBrowser = () => {
  const userAgent = navigator.userAgent;
  const isLineWebOpen = /Line/i.test(userAgent);
  return isLineWebOpen;
};

let popupActive = false;

function openPopup() {
  // if (!popupActive) {
  //   popupActive = true;
    setTimeout(() => {
      this.openPopup();
    }, 175);
    // setTimeout(() => {
    //   datatime.forEach((dataElement) => {
    //     if (dataElement.busname === this.options.data.id) {
    //       if (document.getElementById(this.options.data.id)) {
    //         if (dataElement.delay < 60) {
    //           document.getElementById(this.options.data.id).innerHTML = `定刻`;
    //           document.getElementById(this.options.data.id).style.color = "#83d6c5";
    //         } else {
    //           document.getElementById(this.options.data.id).innerHTML = `${Math.round(dataElement.delay / 60)}分遅れ`;
    //           document.getElementById(this.options.data.id).style.color = "#e394dc";
    //         }
    //         console.log(document.getElementById(this.options.data.id).innerHTML);
    //       }
    //     }
    //   });
    //   popupActive = false;
    // }, 175);
  // }
}

function closePopup() {
  setTimeout(() => {
    this.closePopup();
  }, 175);
}
let loc = "";
let lat, lon;
// 津軽線　　　#15a2c4
// 青い森鉄道　#33cbf4
// 奥羽本線　　#ee7b28
let SUGGEST_LIST = [];
const Utility = {
  // 特殊文字エスケープ
  escapeHtml(str) {
    if (typeof str !== 'string') {
      return str;
    }
    const map = {
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#x27',
      '`': '&#x60',
      '<': '&lt;',
      '>': '&gt;',
    };
    return str.replace(/[&<>"'`]/g, char => map[char]);
  }
};
// 緯度と経度から距離を計算する関数を追加
function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
let dic = [];
fetch('bus_lines.json').then(response => response.json()).then(data => {
  dic = [...data];
}).catch(error => {
  show_popup("#fff", "#ef665b", "情報の収集に失敗しました。", "fa-solid fa-circle-exclamation");
  console.error('Error fetching data:', error);
});
// グラデーションを持つCircleMarkerを描画する関数
function createGradientCircleMarker(latlng, radius) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  var gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
  gradient.addColorStop(0, 'rgba(255, 208, 117, 1)'); // 外側の色
  gradient.addColorStop(1, 'rgba(255, 208, 117, 0)'); // 内側の透明な色

  ctx.beginPath();
  ctx.arc(radius, radius, radius, 0, Math.PI * 2, true);
  ctx.fillStyle = gradient;
  ctx.fill();

  var base64 = canvas.toDataURL(); // Canvasを画像データURLに変換

  return L.marker(latlng, {
      icon: L.icon({
          iconUrl: base64,
          iconSize: [radius * 2, radius * 2],
          iconAnchor: [radius, radius]
      })
  });
}
function currentWatch() {
  function success(pos) {
    var lat = pos.coords.latitude;
    var lng = pos.coords.longitude;
    // 現在地に表示するマーカー
    if (curMarker) {
      map.removeLayer(curMarker);
    } else {
      map.setView([lat, lng], 16);
    }
    var curIcon = L.icon({ /* アイコン */
      iconUrl: 'icons/hiking.png',
      iconRetinaUrl: 'icons/hiking.png',
      iconAnchor: [15, 34]
    });
    curMarker = L.marker([lat, lng], {
      icon: curIcon
    }).addTo(map);
  }

  function error(err) {
    show_popup("#fff", "#ef665b", "位置情報を取得できませんでした。", "fa-solid fa-circle-exclamation");
  }
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  if (watch_id == 0) {
    watch_id = navigator.geolocation.watchPosition(success, error, options); // 現在地情報を定期的に
  }
}

function currentWatchReset() {
  if (watch_id > 0) {
    navigator.geolocation.clearWatch(watch_id);
    watch_id = 0;
  }
  if (curMarker) {
    map.removeLayer(curMarker);
    curMarker = null;
  }
  const isMobileDevice = /Mobi/i.test(navigator.userAgent);
  // PC版の設定
  if (isMobileDevice === false) {
    map.setView([40.853600, 140.748041], 13);
  } else {
    map.setView([40.853600, 140.748041], 12);
  }
}
var watch_id = 0;
var curMarker = null; // 現在地マーカー
var currentWatchBtn = null;
let marker;
let FamilyMarted = false;
let first_done = false;
let fmarker, lmarker, smarker, mcdmarker; // グローバルスコープにマーカー変数を定義
async function makemap(lat, lon, zoom, flag) {
  const FamilyMartIcon = L.icon({
    iconUrl: ['icons/FamilyMart.jpg'], // 画像ファイルパス
    iconSize: [icz, icz] // アイコンサイズ
  });
  const LawsonIcon = L.icon({
    iconUrl: ['icons/Lawson.jpg'], // 画像ファイルパス
    iconSize: [icz, icz] // アイコンサイズ
  });
  const List7_11Icon = L.icon({
    iconUrl: ['icons/7_11.jpg'], // 画像ファイルパス
    iconSize: [icz, icz] // アイコンサイズ
  });
  const MCDIcon = L.icon({
    iconUrl: ['icons/mcdonalds.jpg'], // 画像ファイルパス
    iconSize: [icz, icz] // アイコンサイズ
  });
  const BusIcon = L.icon({
    iconUrl: ['icons/busstop.png'], // 画像ファイルパス
    iconSize: [15, 42] // アイコンサイズ
  });
  map = L.map('map'); // 'map' に表示する地図を変数 map で指定
  var google = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
    attribution: "<a href='https://aomoricitybus.com/buslocation/' target='_blank'>青ロケ マップ</a>｜<a href='https://developers.google.com/maps/documentation' target='_blank'>Google Map</a>｜<a href='https://nucbox5.dorper-royal.ts.net/' target='_blank'>Toki's system</a>"
  });
  var osm = L.tileLayer('http://tile.openstreetmap.jp/{z}/{x}/{y}.png', {
    attribution: "<a href='https://aomoricitybus.com/buslocation/' target='_blank'>青ロケ マップ</a>｜<a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a>｜<a href='https://nucbox5.dorper-royal.ts.net/' target='_blank'>Toki's system</a>"
  });
  google.addTo(map);
  // 現在地表示ボタン
  L.easyButton({ // 現在地表示ボタン
    states: [{
      stateName: 'current-watch',
      icon: 'fas fa-map-marker-alt',
      title: '現在地',
      onClick: function (btn, map) {
        currentWatch();
        btn.state('current-watch-reset');
        currentWatchBtn = btn;
      }
    }, {
      stateName: 'current-watch-reset',
      icon: 'fa fa-user',
      title: '現在地オフ',
      onClick: function (btn, map) {
        currentWatchReset();
        btn.state('current-watch');
      }
    }]
  }).addTo(map);
  if (flag === true) {
    marker = L.marker([lat, lon]).addTo(map); // マップにピンを立てる
  }
  if (FamilyMarted == false) {
    const isMobileDevice = /Mobi/i.test(navigator.userAgent);
    // PC版の設定
    if (isMobileDevice === false) {
      map.setView([40.853600, 140.748041], 13);
    } else {
      map.setView([40.853600, 140.748041], 12);
    }
  }
  // マーカーレイヤーを作成する
  let fmarker = L.layerGroup();
  let lmarker = L.layerGroup();
  let smarker = L.layerGroup();
  let mcdmarker = L.layerGroup();
  let busmarker = L.layerGroup();
  let busstop = L.layerGroup();
  let busline = L.layerGroup();
  L.control.scale({
    imperial: false
  }).addTo(map);
  var gpx = 'aobus.gpx';
  new L.GPX(gpx, {
    async: true,
    marker_options: {
      startIconUrl: '', // マーカーを非表示にするために空の文字列を設定
      endIconUrl: '', // マーカーを非表示にするために空の文字列を設定
      shadowUrl: false,
      iconSize: [20, 30],
      iconAnchor: [16, 30]
    },
    polyline_options: {
      color: '#16cd96',
      opacity: 0.8,
      weight: 3,
      lineCap: 'round'
    }
  }).on('loaded', function (e) {
    busline.addLayer(e.target);
    busline.addTo(map); //.snakeIn();
  }).on('addline', function (e) {
    // e.line.bindPopup(e.element.childNodes[0].nextElementSibling.childNodes[0].data); // ポリラインにポップアップを追加
    const match = e.element.childNodes[0].nextElementSibling.childNodes[0].data.match(/[a-zA-Z]/);
    if (match !== null) {
      const firstLetter = match[0];
      let linecolor;
      switch (firstLetter) {
      case "A":
        linecolor = "#d92628";
        break;
      case "B":
        linecolor = "#405aa8";
        break;
      case "C":
        linecolor = "#f48e8b";
        break;
      case "E":
        linecolor = "#97ce87";
        break;
      case "F":
        linecolor = "#33974e";
        break;
      case "G":
        linecolor = "#bb8bba";
        break;
      case "H":
        linecolor = "#20595f";
        break;
      case "J":
        linecolor = "#f2642f";
        break;
      case "K":
        linecolor = "#2098d5";
        break;
      case "L":
        linecolor = "#1eb684";
        break;
      case "M":
        linecolor = "#f89c1c";
        break;
      case "P":
        linecolor = "#b32e92";
        break;
      case "R":
        linecolor = "#27c3f3";
        break;
      case "S":
        linecolor = "#769d99";
        break;
      case "T":
        linecolor = "#0078c0";
        break;
      case "U":
        linecolor = "#8d4135";
        break;
      case "W":
        linecolor = "#86c03d";
        break;
      default:
        break;
      }
      e.line.setStyle({
        color: linecolor
      });
    }
  });
  info = L.control();
  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'nowtime'); // create a div with a class "info"
    this.update();
    return this._div;
  };
  // method that we will use to update the control based on feature properties passed
  info.update = function (props) {
    this._div.innerHTML = `<h4 id="tit">Loading...</h4><output id="time">Loading...</output>`;
  };
  info.setPosition('topright').addTo(map);
  async function fetchShopData(url, markerLayer, icon) {
    return new Promise((resolve, reject) => {
      fetch(url).then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
          show_popup("#fff", "#ef665b", "情報の収集に失敗しました。", "fa-solid fa-circle-exclamation");
        }
        return response.json();
      }).then(data => {
        if (markerLayer == "busmarker") {
          console.log("現在走行中のバス数：" + data.length);
          console.table(data);
          delelement = [];
          if (data.length == 0) {
            show_popup("#fff", "#ef665b", "現在運行中のバスはありません。", "fa-solid fa-circle-exclamation");
            document.getElementById("tit").innerHTML = "運行データなし";
            document.getElementById("time").innerHTML = "現在、バスはありません。";
          }
          busmarker.clearLayers();
        }
        timelist = [];
        data.forEach(async(element) => {
          let tcolor = "#fff";
          element.previous = "";
          element.next = "";
          element.licensePlated = "";
          element.timestamped = "";
          timelist.push(element.timestamp);
          first_done = false;
          // // マーカーの位置情報を取得する
          // const newLatLng = L.latLng(element.lat || element.stop_lat, element.lon || element.stop_lon);
          // busmarker.eachLayer(function (marker) {
          //   if (marker.options.data.licensePlate == element.licensePlate) {
          //     marker.setLatLng(newLatLng);
          //     first_done = true;
          //     delelement.splice(delelement.indexOf(element), 1);
          //   }
          // });
          if (first_done === false) {
            color = ""
            // console.log(element);
            if (element.shop) {
              element.num = "";
              element.road = element.shop;
              switch (element.shop) {
              case "ファミリーマート":
                color = "linear-gradient(#13c660 0%, #13c660 33%, #ffffff 33%, #ffffff 66%, #0093d9 66%, #0093d9 100%)";
                break;
              case "ローソン":
                color = "linear-gradient(#0371d0 0%, #0371d0 20%, #ffffff 20%, #ffffff 80%, #0371d0 80%, #0371d0 100%)";
                // color = "linear-gradient(#0371d0 0%, #0371d0 33%, #ffffff 33%, #ffffff 66%, #0371d0 66%, #0371d0 100%)";
                break;
              case "セブンイレブン":
                color = "linear-gradient(#f18200 0%, #f18200 33%, #e50014 33%, #e50014 66%, #009946 66%, #009946 100%)";
                break;
              case "マクドナルド":
                color = "linear-gradient(#e34832 0%, #e34832 33%, #f3e217 33%, #f3e217 66%, #e34832 66%, #e34832 100%)";
                break;
              default:
                break;
              }
            }
            if (element.zone_id) {
              element.num = "";
              element.road = "青森市営バス";
            }
            if (element.name) {
              element.to = element.name.replace(element.road, "");
            }
            if (element.busname) {
              datatime.forEach((dataElement) => {
                if (dataElement.busname === element.busname) {
                  element.delay = dataElement.delay;
                  if (dataElement.delay < 60) {
                    element.delayshow = ""; // `<output style="color:#83d6c5;" id="${dataElement.busname}">定刻</output>`;
                    rate = "";
                  } else {
                    tcolor = "#df8807";
                    element.delayshow = `${Math.round(dataElement.delay / 60)}分遅れ`;
                    rate = Math.round(dataElement.delay / 60);

                    var objP1 = L.circleMarker([element.lat || element.stop_lat, element.lon || element.stop_lon], {radius: 24,fillColor: "#ffd075",color: "#000000",weight: 1,opacity: 0, fillOpacity: 0.4});
                    busmarker.addLayer(objP1);
                  }
                }
              });
              const matchedBus = buslisted.find(item => item.bus === element.busname);
              element.busnamek = `<b>系統</b>:${element.busname.match(/系統(\d+)/)[1]}`;
              element.licensePlated = `車両番号:${element.licensePlate}`;
              element.timestamped = `${unixTimeToHHMM(element.timestamp)} 更新`;
              if (element.delay < 60) {
                pretimed = `${matchedBus.stops[Math.max(element.currentStopSequence-1, 0)].arrival_time.replace(':00', '')}`;
                nexttimed = `${matchedBus.stops[element.currentStopSequence].arrival_time.replace(':00', '')}`;
              } else {
                pretime = matchedBus.stops[Math.max(element.currentStopSequence-1, 0)].arrival_time.replace(':00', '');
                nexttime = matchedBus.stops[element.currentStopSequence].arrival_time.replace(':00', '')
                pretimed = `<strike>${pretime}</strike> ${addMinutesToTime(pretime,Math.round(element.delay / 60))}`;
                nexttimed = `<strike>${nexttime}</strike> ${addMinutesToTime(nexttime,Math.round(element.delay / 60))}`;
              }

              element.previous = `<b>前停留所</b>:${matchedBus.stops[Math.max(element.currentStopSequence-1, 0)].stop_name} ${pretimed}`;
              element.next = `<b>次停留所</b>:${matchedBus.stops[element.currentStopSequence].stop_name} ${nexttimed}`;
            } else {
              element.busnamek = "";
              element.delayshow = "";
            }
            const regex = /\d+$/;
            const match = element.name.match(regex);
            const lastDigit = match ? match[0] : null;
            for (let index = 0; index < dic.length; index++) {
              const dicc = dic[index];
              if (lastDigit == dicc.shape) {
                element.name = dicc.trip_headsign;
                const inputString = dicc.trip_headsign;
                const regexPattern = /^(.*?)\d+(.*?)（(.*?)）$/;
                const matches = inputString.match(regexPattern);
                if (matches) {
                  const [first, station, school, line] = matches;
                  element.num = ""; // "<b>路線番号</b>: "+first.replace(school,"").replace(line,"").replace("（）","");
                  element.to = school.trim() + "行";
                  element.road = first.replace(school, "").replace(line, "").replace("（）", "") + "　" + line.trim();
                } else {
                  console.log("マッチしませんでした。");
                }
              }
            }
            if (element.name !== null) {
              const match = element.name.match(/[a-zA-Z]/);
              if (match !== null) {
                const firstLetter = match[0];
                switch (firstLetter) {
                case "A":
                  color = "#d92628";
                  break;
                case "B":
                  color = "#405aa8";
                  break;
                case "C":
                  color = "#f48e8b";
                  break;
                case "E":
                  color = "#97ce87";
                  break;
                case "F":
                  color = "#33974e";
                  break;
                case "G":
                  color = "#bb8bba";
                  break;
                case "H":
                  color = "#20595f";
                  break;
                case "J":
                  color = "#f2642f";
                  break;
                case "K":
                  color = "#2098d5";
                  break;
                case "L":
                  color = "#1eb684";
                  break;
                case "M":
                  color = "#f89c1c";
                  break;
                case "P":
                  color = "#b32e92";
                  break;
                case "R":
                  color = "#27c3f3";
                  break;
                case "S":
                  color = "#769d99";
                  break;
                case "T":
                  color = "#0078c0";
                  break;
                case "U":
                  color = "#8d4135";
                  break;
                case "W":
                  color = "#86c03d";
                  break;
                default:
                  break;
                }
                if (markerLayer == "busmarker") {
                  icon = L.icon({
                    iconUrl: [`icons\\bus\\${firstLetter}.png`], // 画像ファイルパス
                    iconSize: [icz, icz] // アイコンサイズ
                  });
                }
              } else {
                if (markerLayer == "busmarker") {
                  icon = L.icon({
                    iconUrl: [`icons\\bus\\6.png`], // 画像ファイルパス
                    iconSize: [icz, icz] // アイコンサイズ
                  });
                  color = "#000";
                }
              }
            }
            function unixTimeToHHMM(unixTimestamp) {
              // UNIXタイムスタンプをミリ秒に変換
              var milliseconds = unixTimestamp * 1000;
          
              // Dateオブジェクトを作成
              var date = new Date(milliseconds);
          
              // 時間を取得
              var hours = date.getHours();
              // 分を取得
              var minutes = date.getMinutes();
          
              // 1桁の場合は0で埋める
              hours = hours < 10 ? '0' + hours : hours;
              minutes = minutes < 10 ? '0' + minutes : minutes;
          
              // hh:mm形式の文字列を返す
              return hours + ':' + minutes;
          }

            let marker = L.marker([element.lat || element.stop_lat, element.lon || element.stop_lon], {
              icon: icon,
              intentDuration: 300
            }).bindPopup(`
<table>
  <tbody>
    <tr>
      <td rowspan="2" style="background:${color};width:10px;"></td>
      <td colspan="2"><b>${element.road}</b></td>
    </tr>
    <tr>
      <td colspan="2">${element.to}</td>
    </tr>
    <tr>
      <td colspan="3">${element.licensePlated}</td>
      <!--<td colspan="3">${element.timestamped}</td>-->
    </tr>
    <tr>
      <td colspan="3" style="color:${tcolor};">${element.previous}</td>
    </tr>
    <tr>
      <td colspan="3" style="color:${tcolor};">${element.next}</td>
    </tr>
    <tr>
      <td colspan="3" style="color:${tcolor};"><b>${element.delayshow}</b></td>
    </tr>
  </tbody>
</table>`).on('mouseintent', openPopup).on('mouseover', openPopup).on('mouseout', closePopup);

            marker.options.data = {
              licensePlate: element.licensePlate,
              id: element.busname,
              element: element,
              color: color
              // Other relevant data properties can be added here
            };
            // Switch statement to add marker to corresponding marker layer
            switch (markerLayer) {
            case "fmarker":
              fmarker.addLayer(marker);
              break;
            case "lmarker":
              lmarker.addLayer(marker);
              break;
            case "smarker":
              smarker.addLayer(marker);
              break;
            case "mcdmarker":
              mcdmarker.addLayer(marker);
              break;
            case "busmarker":
              busmarker.addLayer(marker);
              break;
            case "busstop":
              var objP1 = L.circleMarker([element.lat || element.stop_lat, element.lon || element.stop_lon], {radius: 8,fillColor: "#fff",color: "#000000",weight: 1,opacity: 1, fillOpacity: 1}).bindPopup(`
              <table>
                <tbody>
                <img src="https://maps.googleapis.com/maps/api/streetview?size=500x500&location=${element.lat || element.stop_lat},${element.lon || element.stop_lon}&fov=80&heading=70&pitch=0&key=AIzaSyAwqhIOd8f0OCpiTxIE_TRy8Uo-H3UMhQY" width="100%">
                  <!--<tr>
                    <td colspan="2"><b>${element.road}</b></td>
                  </tr>-->
                  <tr>
                    <td colspan="2"><b>${element.to}</b></td>
                  </tr>
                  <tr>
                  <td rowspan="2" style="background:${color};width:10px;"></td>
                  <td colspan="2"><b>なんとか線</b></td>
                </tr>
                </tbody>
              </table>`).on('mouseintent', openPopup).on('mouseover', openPopup).on('mouseout', closePopup);
              busstop.addLayer(objP1);
              map.getZoom();
              map.on('move', function (e) {
                if (map.getZoom() >= 17) {
                  busstop.addTo(map);
                } else {
                  map.removeLayer(busstop);
                }
              });
              break;
            default:
              break;
            }
          } else {
            busmarker.eachLayer(function (marker) {
              // dataの子要素elementと上のループで取得したmarker以下の条件で比較
              var licensePlate = marker.options.data.licensePlate;
              var found = false;
              // data内の要素をループしてマーカーのライセンスプレートと比較
              data.forEach(function (element) {
                if (element.licensePlate === licensePlate) {
                  found = true;
                }
              });
              // markerにはあるけどelementにはない場合、マーカーを削除
              if (!found) {
                busmarker.removeLayer(marker);
                console.log("マーカーは到着しました。");
              }
            });
          }
        });
        formatTime(timelist);
        document.getElementById("loading").style.display = "none";
        document.getElementById("loadingdiv").style.display = "none";
        resolve(); // 成功したらresolveを呼ぶ
      }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        show_popup("#fff", "#ef665b", "情報の収集に失敗しました。", "fa-solid fa-circle-exclamation");
        document.getElementById("loadingdiv").style.display = "none";
        document.getElementById("loading").style.display = "none";
        reject(error); // エラーが発生したらrejectを呼ぶ
      });
    });
  }
  try {
    // show_popup("#fff","#509af8",`<output onclick="location.href='miniaomori2d';">新バージョンが公開されました。<BR>※文字をタップしてページ移動できます。</output>`,"fa-solid fa-circle-info");
    await fetchShopData("FamilyMart.json", "fmarker", FamilyMartIcon);
    await fetchShopData("Lawson.json", "lmarker", LawsonIcon);
    await fetchShopData("7_11.json", "smarker", List7_11Icon);
    await fetchShopData("mcdonalds.json", "mcdmarker", MCDIcon);
    await fetchShopData("bus.json", "busstop", BusIcon);
    const responsetime = await fetch("https://nucbox5.dorper-royal.ts.net/gtfstime");
    datatime = await responsetime.json();
    console.log(datatime);
    await fetchShopData("https://nucbox5.dorper-royal.ts.net/gtfsrt", "busmarker", BusIcon);
    setInterval(async() => {
      const responsetime = await fetch("https://nucbox5.dorper-royal.ts.net/gtfstime");
      datatime = await responsetime.json();
      console.log(datatime);
      await fetchShopData("https://nucbox5.dorper-royal.ts.net/gtfsrt", "busmarker", BusIcon);
    }, 15000);
    var pale = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
      attribution: "<a href='https://aomoricitybus.com/buslocation/' target='_blank'>青ロケ マップ</a>｜<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院白地図タイル</a>｜<a href='https://nucbox5.dorper-royal.ts.net/' target='_blank'>Toki's system</a>"
    });
    var gsi = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
      attribution: "<a href='https://aomoricitybus.com/buslocation/' target='_blank'>青ロケ マップ</a>｜<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>｜<a href='https://nucbox5.dorper-royal.ts.net/' target='_blank'>Toki's system</a>"
    });
    var photo = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg', {
      attribution: "<a href='https://aomoricitybus.com/buslocation/' target='_blank'>青ロケ マップ</a>｜<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院白地図タイル</a>｜<a href='https://nucbox5.dorper-royal.ts.net/' target='_blank'>Toki's system</a>"
    });
    var GoogleMapSatellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: "<a href='https://aomoricitybus.com/buslocation/' target='_blank'>青ロケ マップ</a>｜<a href='https://developers.google.com/maps/documentation' target='_blank'>Google Map</a>｜<a href='https://nucbox5.dorper-royal.ts.net/' target='_blank'>Toki's system</a>",
    });
    var baseMaps = {
      "地理院地図": gsi,
      "バスロケ本家": pale,
      "オープンストリートマップ": osm,
      "Googleマップ": google,
      "Google 衛星写真": GoogleMapSatellite
    };
    var layers = {
      "ファミリーマート": fmarker,
      "ローソン": lmarker,
      "セブンイレブン": smarker,
      "マクドナルド": mcdmarker,
      // "青森市営バス(15秒間隔で更新)": busmarker,
      // "バス停": busstop,
      "バス路線": busline
    };
    busmarker.addTo(map);
    L.control.layers(baseMaps, layers).addTo(map);
    document.getElementsByClassName("leaflet-control-layers-list")[0].style.zoom = 1.4;
  } catch (error) {
    console.error('An error occurred while fetching shop data:', error);
    show_popup("#fff", "#ef665b", "情報の収集に失敗しました。", "fa-solid fa-circle-exclamation");
    document.getElementById("loadingdiv").style.display = "none";
    document.getElementById("loading").style.display = "none";
  }
  FamilyMarted = true;
}
document.addEventListener("DOMContentLoaded", async function () {
  const response = await fetch("https://nucbox5.dorper-royal.ts.net/Aomori_City_View/output.json");
  buslisted = await response.json();
  console.log(buslisted);
  document.getElementById("loadingdiv").style.display = "block";
  document.getElementById("loading").style.display = "block";
  makemap(null, null, null, false); //仮の座標と倍率をセットし、現在地表示フラグを消す。
});


/* ここから2024/3/27のメモ

次は「」でございます。お降りの方はお知らせ願います。

次、停まります。ご乗車ありがとうございました。


*/