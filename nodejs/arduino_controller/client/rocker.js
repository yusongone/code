(function(factory){
    if(typeof(define)==="function"){
        define(factory);
    }else{
        window.R=window.R||{};
        factory(window.R);
    }

})(function(_rocker){
    !_rocker?_rocker={}:"";


    function Rocker(options){
        this.body=document.createElement("div");
        this.body.innerHTML='<div>' +
                '<div class="overflow"></div>' +
                '<svg class="svg">' +
                    '<circle r="10" x="10" y="40" fill="green"></circle>' +
                '</svg>' +
            '</div>';
        options.parentDOM.appendChild(this.body);
    }
    Rocker.prototype.test=function(){

    }

    _rocker.getRocker=function(options){
        return new Rocker(options);
    }
    return _rocker;
});