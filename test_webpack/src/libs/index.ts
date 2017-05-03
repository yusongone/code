var a:Number =10;

interface Person{
    name:String,
    age:Number
}



function doIt(p:Person):Person{

    return p;
}


doIt({name:"ab",age:0});
