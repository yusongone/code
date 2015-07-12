function init(){
    THREE.DoubleSide = 2;
    Rtmap.Room.init({
        canvasBox:document.body
    });

    //var poi=Rtmap.PoiFactory.createPoi({height:10,width:20,deep:300});
     //   poi.setPosition(50,50);
    //Rtmap.Room.addMesh(poi);
    create(poi_data,0x666666);
    create(fn_data,0xffffff);
    //create(bk_data,0x000000);
}

function create(json,color){
    var ff=json.features;
    for(var j=0;j<ff.length;j++){
        //drawPoi(ff[j]);
        if(ff[j].geometry){
            var poi=Rtmap.PoiFactory.createPoi({features:ff[j],color:color});
        };
//        poi.setPosition(50,50);
        Rtmap.Room.addMesh(poi);
    }
}
