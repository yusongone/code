var Canvas=require("canvas");
var canvas = new Canvas(100, 30),
        ctx = canvas.getContext('2d'),
        items = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPRSTUVWXYZ23456789'.split(''),
        vcode = '',
        textColors = ['#FD0', '#6c0', '#09F', '#f30', '#aaa', '#3cc', '#cc0', '#A020F0', '#FFA500', '#A52A2A', '#8B6914', '#FFC0CB', '#90EE90'];


function _getVcode(callback){
    ctx.clearRect(0,0,100,30);
    var fillCo = Math.round(rnd * (textColors.length - 1));
    ctx.fillStyle =fillCo;
    ctx.fillRect(0, 0, 100, 30);
    ctx.font = 'bold 30px sans-serif';
    ctx.globalAlpha =0.8;
    for (var i = 0; i < 4; i++) {
        var rnd = Math.random();
        var item = Math.round(rnd * (items.length - 1));
        var color = Math.round(rnd * (textColors.length - 1));
        ctx.fillStyle = textColors[color];
        ctx.fillText(items[item], 5 + i*23, 25);
        vcode += items[item];
    }
    canvas.toBuffer(function(err, buf){
        var v=vcode.toLowerCase();
        vcode="";
        callback({
            "vcode":v,
            "buf":buf
        });
    });
}

exports.getVcode=_getVcode;
