
var Rtmap=window.Rtmap||{};
var debug=false;

/***
 * poi Factory
 */
(function(){
    "use strict";
    var Pois=[];
    var styleHash={
        4:{
            color:0x999999,
            opacity:1
        },
        5:{
            color:0xdddddd,
            opacity:0.8
        },
        default:{
            color:0xff0000,
            opacity:1
        }
    }

    function getStyle(style){
        if(styleHash[style]){
            return styleHash[style]
        }else{
            return styleHash["default"];
        }
    }

    function Poi(json){
        this.features=json.features;
        var californiaPts = []; //json.Pts;
        var coords=json.features.geometry.coordinates;
        for(var i=0;i<coords[0][0].length;i++){
            var c=coords[0][0][i];
            var latlng=Page.Parse.getLatlng({x:c[0],y:c[1]});
            latlng.lat*=600000;
            latlng.lng*=600000;
            latlng.lat+=400;
            latlng.lng-=450;
            californiaPts.push( new THREE.Vector2 ( latlng.lng, latlng.lat ) );
        }
        var poiStyle=json.features.properties.style;
        var shape= new THREE.Shape( californiaPts );
        var extrudeSettings = {
            curveSegments:5,
            amount:parseInt(Math.random()*10+30),
            steps:10,
            bevelSegments: 1,
            bevelSize: 0,
            bevelThickness:0 }; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5
        var geometry = shape.extrude(extrudeSettings);
        var material = new THREE.MeshLambertMaterial({
            //color:"#"+(parseInt(Math.random()*100000).toString(16)+"0000").substr(0,6),
            color:getStyle(poiStyle).color,
            transparent:true,
            opacity:getStyle(poiStyle).opacity,
        });
        material.side = THREE.DoubleSide;

        this.cube = new THREE.Mesh(geometry, material);
        this.cube.features=json.features;
        this.cube.material.linewidth = 3;
        window.ff=geometry.faces[0];
        this.cube.castShadow = true;
    }

    Poi.prototype.setPosition=function(x,y){
        this.cube.position.x=x;
        this.cube.position.y=y;
    };

    //poi Factory
    Rtmap.PoiFactory={
        createPoi:function(json){
            //return new Cube(json);
            var _poi=new Poi(json);
            Pois.push(_poi.cube);
            return _poi;
        },
        getPois:function(){
            return Pois;
        }
    }

})();

(function(){
    var _canvasBox,
        _scene,
        _camera,
        _camera2,
        _plane,
        _group,
        _renderer;

    function _createGround(){
        var geo=new THREE.PlaneBufferGeometry(800, 800);
        var mesh=new THREE.MeshLambertMaterial({color:0xdddddd});
        mesh.side = THREE.DoubleSide;
        _plane = new THREE.Mesh(geo, mesh);
        _plane.position.z=-1;
        _plane.castShadow = true;
        _plane.receiveShadow = true;
        //_plane.overdraw = true;
        //_scene.add(_plane);
        _scene.add(_group);
        _group.add(_plane);
    };

    function _initContext(){
        var width=window.innerWidth;
        var height=window.innerHeight;
        _scene = new THREE.Scene();
        _camera = new THREE.PerspectiveCamera(55);
        _camera2 = new THREE.PerspectiveCamera(55);

//        _camera.rotation.x = 45 * (Math.PI / 180);
        _group = new THREE.Object3D();
        _group.rotateX(-45 * (Math.PI / 180));

        var light = new THREE.DirectionalLight(0xffffff,0.4);
        light.position.set(0, -200, 380);
        _group.add(light);

        var myLight2=new MyLight(_group);
        myLight2.setPosition(-500,-200,500);

        _renderer = new THREE.WebGLRenderer({antialias:true});
        _renderer.setClearColor("#888888",1);
        _renderer.shadowMapEnabled = true;
        _renderer.shadowMapType = THREE.PCFSoftShadowMap;
        _renderer.domElement.style.width="100%";
        _renderer.domElement.style.height="100%";
        _canvasBox.appendChild(_renderer.domElement);
        _renderer.enableScissorTest ( true );
    }

    var mouseV=new THREE.Vector2();
    function _bindEvent(){
        var mouseStatus=false;
        var oldX=null;
        var oldY=null;
        function animate(){
            requestAnimationFrame(animate);
            _group.rotation.z+=0.01;
            Rtmap.Room.refresh();
        }
        animate();
        function start(events){
            events.preventDefault();
            mouseStatus=true;
        }
        var raycaster=new THREE.Raycaster();
        function move(events){
            if(mouseStatus){
                events.stopPropagation();
                events.preventDefault();
                var clientX=events.clientX||events.touches[0].clientX,
                    clientY=events.clientY||events.touches[0].clientY;
                if(oldX&&oldY){
                    var moveX=clientX-oldX;
                    var moveY=clientY-oldY;
                    _group.rotation.z+=moveX/(events.clientX?200:600);
                    _group.rotation.x+=moveY/(events.clientY?200:600);
                }
                oldX=clientX;
                oldY=clientY
            }else{

            }
            return false;
        }
        function stop(){
            mouseStatus=false;
            oldX=null;
            oldY=null;
        }
        function click(events){
          alert("f");
            _renderer.domElement.webkitRequestFullScreen();
            mouseV.x=(events.clientX/window.innerWidth)*2-1;
            mouseV.y=-(events.clientY/window.innerHeight)*2+1;
            raycaster.setFromCamera( mouseV, _camera );
            var intersects = raycaster.intersectObjects( Rtmap.PoiFactory.getPois());
            if(intersects.length>0){
                //console.log(intersects[0].object.features.properties.name_chinese);
                console.log(intersects[0]);
                Rtmap.Room.refresh();
            }
        }
        _renderer.domElement.addEventListener("click",click,false);
        _renderer.domElement.addEventListener("mousedown",start,false);
        _renderer.domElement.addEventListener("touchstart",start,false);
        _renderer.domElement.addEventListener("touchmove",move,false);
        _renderer.domElement.addEventListener("mousemove",move,false);
        _renderer.domElement.addEventListener("touchend", stop,false);
        _renderer.domElement.addEventListener("mouseup", stop,false);
        _renderer.domElement.addEventListener("mousewheel", function(events){
            var nowY=events.wheelDeltaY;
                _camera.position.z-=nowY/10;
                _camera2.position.z-=nowY/10;
                Rtmap.Room.refresh();
        },false);
        window.addEventListener("keydown",function(events){
            var codes=events.keyCode;
            switch(codes){
                case 38:
                    _camera.position.z-=10;
                    break;
                case 40:
                    _camera.position.z+=10;
                    break;
            }
        },false);
    }

    function MyLight(parent){
        var sphere_geo=new THREE.SphereGeometry(10, 10, 12);
        var material = new THREE.MeshBasicMaterial({color: 0xdddddd});
        this.sphere = new THREE.Mesh(sphere_geo, material);
        //this.light=new THREE.SpotLight(0xffffff,1,5200);
        this.light=new THREE.DirectionalLight(0xffffff,1,300);
        this.light.shadowDarkness = 0.3;
        this.light.castShadow=true;
        this.light.onlyShadow=false;
        this.light.shadowCameraFov = 10;
        this.light.shadowBias = 0;
        this.light.shadowCameraVisible = debug;
        parent.add(this.sphere);
        parent.add(this.light);
    }
    MyLight.prototype.setPosition=function(x,y,z){
        this.sphere.position.set(x,y,z);
        this.light.position.set(x,y,z);
    };

    function refreshLeft(width,height){
        _renderer.setSize(width, height);
        _renderer.setViewport(0,0,width/2,height)
        _renderer.setScissor( 0, 0,width/2,height);
        _camera.aspect = width / (height*2);
        _camera.position.set(-20,0,900);
        _camera.far=3000;
        _camera.updateProjectionMatrix();
        _renderer.render(_scene, _camera);
    }
    function refreshRight(width,height){
        _renderer.setSize(width, height);
        _renderer.setViewport(width/2,0,width/2,height);
        _renderer.setScissor( width/2, 0,width/2,height);
        _camera2.aspect = width / height/2;
        _camera2.far=3000;
        _camera2.updateProjectionMatrix();
        _camera2.position.set(20,0,900);
        _renderer.render(_scene, _camera2);
    }
    function refreshOne(width,height){
        _renderer.setSize(width, height);
        _renderer.setViewport(0,0,width,height)
        _renderer.setScissor( 0, 0,width,height);
        _camera.aspect = width / height;
        _camera.position.set(-50,0,1000);
        _camera.updateProjectionMatrix();
        _renderer.render(_scene, _camera);
    }


    Rtmap.Room={
        init:function(json){
            _canvasBox=json.canvasBox;
            _initContext();
            _createGround();
            _bindEvent();
            //_renderer.render(_scene, _camera);
        },
        addMesh:function(mesh){
            if(mesh.cube){
                _group.add(mesh.cube);
            }else if(mesh.cubes){
                for(var i=0;i<mesh.cubes.length;i++){
                    _group.add(mesh.cubes[i]);
                }
            }else{
                _group.add(mesh);
            }
            this.refresh();
        },
        refresh:function(){
            var width=window.innerWidth;
            var height=window.innerHeight;
            refreshLeft(width,height);
            refreshRight(width,height);
            //refreshOne(width,height);
        }
    }
})();


