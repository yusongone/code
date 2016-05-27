var Page=window.Page||{};
(function(){
   var _sence,_mainGroup;

   /*

   var layer=[[1,2,3]
    [4,5,6]
    [7,8,9]]
   * */

   var Group=(function(){
      var Top={
         front:{1:{},2:{},3:{},coord:{1:[-10,10,10],2:[0,10,10],3:[10,10,10]}},
         mid:{1:{},2:{},3:{},coord:{1:[-10,10,0],2:[0,10,0],3:[10,10,0]}},
         back:{1:{},2:{},3:{},coord:{1:[-10,10,-10],2:[0,10,-10],3:[10,10,-10]}}
      }

      var Mid={
         front:{1:{},2:{},3:{},coord:{1:[-10,0,10],2:[0,0,10],3:[10,0,10]}},
         mid:{1:{},2:{},3:{},coord:{1:[-10,0,0],2:[0,0,0],3:[10,0,0]}},
         back:{1:{},2:{},3:{},coord:{1:[-10,0,-10],2:[0,0,-10],3:[10,0,-10]}}
      }

      var Bottom={
         front:{1:{},2:{},3:{},coord:{1:[-10,-10,10],2:[0,-10,10],3:[10,-10,10]}},
         mid:{1:{},2:{},3:{},coord:{1:[-10,-10,0],2:[0,-10,0],3:[10,-10,0]}},
         back:{1:{},2:{},3:{},coord:{1:[-10,-10,-10],2:[0,-10,-10],3:[10,-10,-10]}}
      }



      var rotateGroup={
         Top: {
            centerCoord:[0,10,0],
            rotate:function(callback){
               var self=this;
               var center=this.centerCoord;
               var step=0;
               function frame(){
                  step++;
                  for(var i=0;i<self.cubes.length;i++){
                     self.cubes[i].body.body.rotateY(1*(Math.PI / 180));
                  }
                  if(step==90){
                     Page.Context.removeFrame(frame);
                     self.reFill(0);
                     callback?callback():"";
                  }
               };
               Page.Context.bindFrame(frame);
            },
            cubes: [Top.front["1"], Top.front["2"], Top.front["3"], Top.mid["1"], Top.mid["2"], Top.mid["3"], Top.back["1"], Top.back["2"], Top.back["3"]],
            reFill:function(dir){
               console.log(Top);
               if(dir){
                  var temp=Top.front["1"];
                  Top.front["1"]=Top.front["3"];
                  Top.front["3"]=Top.back["3"];
                  Top.back["3"]=Top.back["1"];
                  Top.back["3"]=temp;
                  var temp=Top.front["2"];
                  Top.front["2"]=Top.mid["3"];
                  Top.mid["3"]=Top.back["2"];
                  Top.back["2"]=Top.mid["1"];
                  Top.mid["1"]=temp;
               }else{
                  var temp=Top.front["1"].body;
                  Top.front["1"].body=Top.back["1"].body;
                  Top.back["1"].body=Top.back["3"].body;
                  Top.back["3"].body=Top.front["3"].body;
                  Top.front["3"].body=temp;
                  var temp2=Top.front["2"].body;
                  Top.front["2"].body=Top.mid["1"].body;
                  Top.mid["1"].body=Top.back["2"].body;
                  Top.back["2"].body=Top.mid["3"].body;
                  Top.mid["3"].body=temp2;
                  for(var i=0;i<this.cubes.length;i++){
                     this.cubes[i].body.clearRotate();
                  }
               }
            }
         },
         Bottom: {
            centerCoord:[1,2,3],
            cubes: [Bottom.front["1"], Bottom.front["2"], Bottom.front["3"], Bottom.mid["1"], Bottom.mid["2"], Bottom.mid["3"], Bottom.back["1"], Bottom.back["2"], Bottom.back["3"]],
         },
         Left: {
            centerCoord:[1,2,3],
            rotate:function(callback){
               var self=this;
               var center=this.centerCoord;
               var step=0;
               function frame(){
                  step++;
                  for(var i=0;i<self.cubes.length;i++){
                     self.cubes[i].body.body.rotateX(1*(Math.PI / 180));
                     if(step==90){
                        Page.Context.removeFrame(frame);
                        self.reFill();
                        callback?callback():"";
                     }
                  }
               };
               Page.Context.bindFrame(frame);
            },
            cubes: [Top.front["1"], Top.mid["1"], Top.back["1"], Mid.front["1"], Mid.mid["1"], Mid.back["1"], Bottom.front["1"], Bottom.mid["1"], Bottom.back["1"]],
            reFill:function(dir){

            }
         },
         Right: {
            centerCoord:[10,0,0],
            rotate:function(dir,callback){
               var self=this;
               var center=this.centerCoord;
               var step=0;
               function frame(){
                  step++;
                  for(var i=0;i<self.cubes.length;i++){
                     self.cubes[i].body.body.rotateX(1*(Math.PI / 180));
                     if(step==90){
                        Page.Context.removeFrame(frame);
                        self.reFill();
                        callback?callback():"";
                     }
                  }
               };
               Page.Context.bindFrame(frame);
            },
            cubes: [Top.front["3"], Top.mid["3"], Top.back["3"], Mid.front["3"], Mid.mid["3"], Mid.back["3"], Bottom.front["3"], Bottom.mid["3"], Bottom.back["3"]],
            reFill:function(dir){

            }
         }
      }

      /*

       Top //1
       Bottom //2
       left//3
       right//4
       front//5
       back//6

       XMid //7
       YMid //8
       ZMid //9

       */

      return {
         rotate:function(layer,callback){
            rotateGroup[layer].rotate(callback);
         },
         each:function(handler){
            for(var i in Top){
               var c=Top[i].coord;
               for(var j in c){
                  if(c[j]){
                     Top[i][j]._layer="Top";
                     Top[i][j]._index=j;
                     Top[i][j]._key=i;
                     handler(c[j],Top[i][j]);
                  }
               }
            }
            for(var i in Mid){
               var c=Mid[i].coord;
               for(var j in c){
                  if(c[j]){
                     Mid[i][j]._layer="Mid";
                     Mid[i][j]._index=j;
                     Mid[i][j]._key=i;
                     handler(c[j],Mid[i][j]);
                  }
               }
            }
            for(var i in Bottom){
               var c=Bottom[i].coord;
               for(var j in c){
                  if(c[j]){
                     Bottom[i][j]._layer="Bottom";
                     Bottom[i][j]._index=j;
                     Bottom[i][j]._key=i;
                     handler(c[j],Bottom[i][j]);
                  }
               }
            }
         }
      }
   })();


   var materials = [
      new THREE.MeshBasicMaterial({
         color:0xff0000
      }),
      new THREE.MeshBasicMaterial({
         color:0xffff00
      }),
      new THREE.MeshBasicMaterial({
         color:0x0000ff
      }),
      new THREE.MeshBasicMaterial({
         color:0x00ff00
      }),
      new THREE.MeshBasicMaterial({
         color:0xff8800
      }),
      new THREE.MeshBasicMaterial({
         color:0xffffff
      })
   ];


   function smallCube(x,y,z){
      var geometry = new THREE.BoxGeometry( 9, 9, 9, 0, 0, 0,materials ),
          cube     = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(materials));
      cube.position.set( x, y, z );
      var group=new THREE.Object3D();
         group.add(cube);

      _mainGroup.add(group);
      this.rotWorldMatrix;
      this.body=group;
      this.cube=cube;
   }

// Rotate an object around an arbitrary axis in world space
   smallCube.prototype.rotate=function(axis, radians) {
      this.rotWorldMatrix = new THREE.Matrix4();
      this.rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
      this.rotWorldMatrix.multiplySelf(this.cube.matrix);        // pre-multiply
      this.cube.matrix = this.rotWorldMatrix;
      this.cube.rotation.getRotationFromMatrix(this.cube.matrix, this.cube.scale);
   }
   smallCube.prototype.clearRotate=function(){
      var euler = new THREE.Euler( 0,-this.body.rotateY, 0, 'XYZ' );
      this.body.position.applyEuler(euler);
   }

   /*
   smallCube.prototype.moveCenterTo=function(x,y,z){
      var position=this.body.position;
      var subx=position.x-x;
      var suby=position.y-y;
      var subz=position.z-z;
      this.body.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(subx, suby, subz ) );
      this.body.position.set( x, y, z );
   }
   */




   Page.Cube={
      init:function(option){
         _sence=option.scene;
         _mainGroup= new THREE.Object3D();
         _mainGroup.rotateX(30* (Math.PI / 180));
         _mainGroup.rotateY(-30 * (Math.PI / 180));
         _sence.add(_mainGroup);
         Group.each(function(coord,cube){
            cube.body=new smallCube(coord[0],coord[1],coord[2],1);
            if(false&&cube._index=="1"&&cube._key=="mid"&&cube._layer=="Top"){
               cube.body.body.rotateY(-90*(Math.PI / 180));
            }
         });
         Group.rotate("Top",function(){
                Group.rotate("Right");
            return;
            // Group.rotate("Right");
            Group.each(function(coord,cube){
               if(cube._index=="3"&&cube._key=="front"&&cube._layer=="Top"){
                  //cube.body.moveCenterTo(0,10,0);
                  cube.body.body.rotateY(-90*(Math.PI / 180));
               }
            });
         });

      },
      getCube:function(x,y,z){
         //return cube;
      }
   }
})();

Page.Context=(function(){

   var scene,camera,renderer,frameHandlers=[];

   function loop(){
      _refresh();
      for(var i=0;i<frameHandlers.length;i++){
         frameHandlers[i]();
      }
      window.requestAnimationFrame(loop)
   }

   function _refresh(){
      camera.updateProjectionMatrix();
      renderer.render(scene,camera);
   }

   return {
      refresh:_refresh,
      init:function(){
         scene = new THREE.Scene();
         camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight,0.1, 1000);
         camera.position.z=100;
         camera.aspect = window.innerWidth / window.innerHeight;
         renderer = new THREE.WebGLRenderer({antialias:true});
         renderer.setSize(window.innerWidth, window.innerHeight);
         document.body.appendChild(renderer.domElement);


         loop();
      },
      getScene:function(){
         return scene;
      },
      bindFrame:function(handler){
         frameHandlers.push(handler);
      },
      removeFrame:function(handler){
         var index=frameHandlers.indexOf(handler)
         frameHandlers.splice(index,1);
      }
   }
})();
