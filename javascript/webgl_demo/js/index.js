var canvas;
var gl;
function main(){
    canvas=document.getElementById("canvas");
    gl=canvas.getContext("webgl");

    var v_shader=gl.createShader(gl.VERTEX_SHADER);
    var f_shader=gl.createShader(gl.FRAGMENT_SHADER);



    gl.shaderSource(v_shader,V_SHADER);
    gl.shaderSource(f_shader,F_SHADER);
    gl.compileShader(v_shader);
    gl.compileShader(f_shader);


    console.log(1,gl.getShaderParameter(v_shader, gl.COMPILE_STATUS));
    console.log(2,gl.getShaderInfoLog(v_shader));
    console.log(3,gl.getShaderInfoLog(f_shader));

    var pro=gl.createProgram();
    gl.getProgramInfoLog(pro);
    gl.attachShader(pro,v_shader);
    gl.attachShader(pro,f_shader);

    gl.linkProgram(pro);

    gl.useProgram(pro);

    gl.getProgramParameter(pro,gl.LINK_STATUS);



    var a_Position=gl.getAttribLocation(pro,"a_Position");

    var position=new Float32Array([0.2,0.2,0.0,0.1,0.1,0.0,0.0,0.5]);
    var buffer=gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,position,gl.STATIC_DRAW);

    gl.bindAttribLocation(pro,0,"a_Position");
    window.gl=gl;
    gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);

    console.dir(a_Position);
    gl.enableVertexAttribArray(a_Position);

    gl.clearColor(0,0,0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,4);
};




var V_SHADER="" +
    "attribute vec4 a_Position;" +
    "void main(){ " +
        "gl_Position = a_Position;" +
        "gl_PointSize= 10.0;" +
    "}";

var F_SHADER="void main(){ " +
    "gl_FragColor= vec4(1.0,0.0,0.0,1.0);" +
    "}";


