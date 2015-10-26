function myClone (jsonObj) 
{
    var buf;
    if (jsonObj instanceof Array) {
        buf = [];
        var i = jsonObj.length;
        while (i--) {
            buf[i] = arguments.callee(jsonObj[i]);
        }
        return buf;
    }else if (typeof jsonObj == "function"){
        return jsonObj;
    }else if (jsonObj instanceof Object){
        buf = {};
        for (var k in jsonObj) {
            buf[k] = arguments.callee(jsonObj[k]);
        }
        return buf;
    }else{
        return jsonObj;
    }
}
function setHSVToRGB(_l,_m,_n) {
  if(_m == 0) {
    _l = _m = _n = Math.round(255*_n/100);
    newR = _l;
    newG = _m;
    newB = _n;
  } else {
    _m = _m/100;
    _n = _n/100;
    p = Math.floor(_l/60)%6;
    f = _l/60 - p;
    a = _n*(1-_m);
    b = _n*(1-_m*f);
    c = _n*(1-_m*(1-f));
    switch(p) {
      case 0:
        newR = _n; newG = c; newB = a;
        break;
      case 1:
        newR = b; newG = _n; newB = a;
        break;
      case 2:
        newR = a; newG = _n; newB = c;
        break;
      case 3:
        newR = a; newG = b; newB = _n;
        break;
      case 4:
        newR = c; newG = a; newB = _n;
        break;
      case 5:
        newR = _n; newG = a; newB = b;
        break;
    }
    newR = Math.round(255*newR);
    newG = Math.round(255*newG);
    newB = Math.round(255*newB);
  }
  return {
    'r':newR,
    'g':newG,
    'b':newB
  }
}
// function hslToRgb(h, s, l){
//     var r, g, b;

//     if(s == 0){
//         r = g = b = l; // achromatic
//     }else{
//         function hue2rgb(p, q, t){
//             if(t < 0) t += 1;
//             if(t > 1) t -= 1;
//             if(t < 1/6) return p + (q - p) * 6 * t;
//             if(t < 1/2) return q;
//             if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
//             return p;
//         }

//         var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
//         var p = 2 * l - q;
//         r = hue2rgb(p, q, h + 1/3);
//         g = hue2rgb(p, q, h);
//         b = hue2rgb(p, q, h - 1/3);
//     }

//     return {
//         'r':Math.round(r * 255),
//         'g':Math.round(g * 255),
//         'b':Math.round(b * 255)
//     };
// }