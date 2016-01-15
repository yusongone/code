function init1(){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight,0.1, 1000);
    camera.position.z=3;

    var renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    var geometry = new THREE.BoxGeometry(10,10,10);
    var material = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
    var cube = new THREE.Mesh(geometry, material);

    var geometry = new THREE.BoxGeometry(10,10,10);
    var material = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
    var cube = new THREE.Mesh(geometry, material);

    cube.position.z=-19;
    cube.rotateX(10);
    cube.rotateY(10);

    var d=new MyLight();
    d.send(scene);
    d.setPosition(2,0,-3);

    var light = new THREE.DirectionalLight(0xffffff,0.5);
    light.position.set(0, 0, 300);
    scene.add(light);

    scene.add(cube);

    renderer.setClearColor("#ffffff",1);
    var i=0;
    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}



function MyLight(){
    var sphere_geo=new THREE.SphereGeometry(10, 10, 12);
    var material = new THREE.MeshBasicMaterial({color: 0xffffff});
    this.sphere = new THREE.Mesh(sphere_geo, material);
    this.light=new THREE.PointLight(0xffffff,1,1999);
    return this;
}
MyLight.prototype.setPosition=function(x,y,z){
   this.sphere.position.set(x,y,z);
   this.light.position.set(x,y,z);
};
MyLight.prototype.send=function(scene){
    scene.add(this.sphere,this.light);
}

function checkHit(){
    for (var vertexIndex = 0; vertexIndex < Player.geometry.vertices.length; vertexIndex++) {
        var localVertex = Player.geometry.vertices[vertexIndex].clone();
        var globalVertex = Player.matrix.multiplyVector3(localVertex);
        var directionVector = globalVertex.subSelf( Player.position );

        var ray = new THREE.Ray( Player.position, directionVector.clone().normalize() );
        var collisionResults = ray.intersectObjects( collidableMeshList );
        if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ){
            // a collision occurred... do something...
        }
    }
}

function init(){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight,0.1, 1000);
    camera.position.z=3;

    var renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth*2, window.innerHeight*2);
    renderer.domElement.style.width="100%";
    renderer.domElement.style.height="100%";
    document.body.appendChild(renderer.domElement);

    var ff=poi_data.features;
    for(var j=0;j<ff.length;j++){
        //drawPoi(ff[j]);
        createPoi(scene,ff[j]);
    }

    var light = new THREE.DirectionalLight(0xffffff,0.5);
    scene.add(light);

    renderer.setClearColor("#ffffff",1);
    renderer.render(scene, camera);
    camera.position.z=120;
    camera.position.y=-50;
    camera.position.x=150;
    camera.rotateX(0.99);

    var d=new MyLight();
    d.send(scene);
    var i=0;
    var light2=new THREE.AmbientLight(0x111111);
    scene.add(light2);//OK，就这两步就行了
        d.setPosition(0,0,200);
        camera.position.x+=1;
        renderer.render(scene, camera);

}

function createPoi(scene,ff){
    if(!ff.geometry){
       return;
    };

    var californiaPts = [];
    createPoins(californiaPts,ff);

    var californiaShape = new THREE.Shape( californiaPts );
    var extrudeSettings = { amount:15,steps:1,bevelSegments: 1,bevelSize: 0, bevelThickness:0 }; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5

    var geometry = californiaShape.extrude(extrudeSettings);
    var col="#"+(parseInt(Math.random()*100000).toString(16)+"0000").substr(0,6);
    var material = new THREE.MeshLambertMaterial({color: col});
    var cube = new THREE.Mesh(geometry, material);
        cube.position.x=-20;

    scene.add(cube);

    return cube;
}


function createPoins(californiaPts,ff){
    var coord=ff.geometry.coordinates;
    for(var i=0;i<coord[0][0].length;i++){
        var c=coord[0][0][i];
        var latlng=Page.Parse.getLatlng({x:c[0],y:c[1]});
        latlng.lat*=-200000;
        latlng.lng*=200000;
        californiaPts.push( new THREE.Vector2 ( latlng.lng, latlng.lat ) );
    }
};


function iinit(){
    var ff=poi_data.features;
    var scale=1.8;
    var offset=10;
    var t=document.getElementById("canvas");
    var ctx= t.getContext("2d");
        drawPoi(ff[15]);
    for(var j=0;j<ff.length;j++){
   //     drawPoi(ff[j]);
    }


    function drawPoi(ff){
        if(!ff.geometry){return;}
        var coord=ff.geometry.coordinates;

        ctx.strokeWidth=1;
        ctx.beginPath();
        for(var i=0;i<coord[0][0].length;i++){
            var c=coord[0][0][i];
            var latlng=Page.Parse.getLatlng({x:c[0],y:c[1]});
            latlng.lat*=-200000;
            latlng.lng*=200000;
            ctx.strokeStyle="#0f0";
            i==0?ctx.moveTo(latlng.lng,latlng.lat):"";
            console.log(latlng.lat,latlng.lng);
            ctx.lineTo(latlng.lng,latlng.lat)
            //i==0?ctx.moveTo(c[0]*scale-offset,-c[1]*scale-offset):"";
            //    console.log(c[0]*scale-offset,-c[1]*scale-offset);
            //ctx.lineTo(c[0]*scale-offset,-c[1]*scale-offset)
        }
        ctx.closePath();
        ctx.stroke();
    }
}
