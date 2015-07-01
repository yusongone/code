function init(){

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight,0.1, 1000);
    camera.position.z=3;

    var renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    var geometry = new THREE.BoxGeometry(10,10,10);
    var material = new THREE.MeshLambertMaterial({color: 0xffffff});
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

    var i=0;
    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        d.setPosition(0,0,i-=0.05);
    }
    render();
}



function MyLight(){
    var material = new THREE.MeshBasicMaterial({color: 0xffffff});
    var sphere_geo=new THREE.SphereGeometry(1, 18, 12);
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

for (var vertexIndex = 0; vertexIndex < Player.geometry.vertices.length; vertexIndex++)
{
    var localVertex = Player.geometry.vertices[vertexIndex].clone();
    var globalVertex = Player.matrix.multiplyVector3(localVertex);
    var directionVector = globalVertex.subSelf( Player.position );

    var ray = new THREE.Ray( Player.position, directionVector.clone().normalize() );
    var collisionResults = ray.intersectObjects( collidableMeshList );
    if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
    {
        // a collision occurred... do something...
    }
}
