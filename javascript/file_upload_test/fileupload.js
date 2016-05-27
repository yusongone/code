(function(factory){
   if(typeof(define)==="function"){
      define(factory);
   }else{
      window.FU=window.FU||{};
      factory(window.FU);
   }
})(function(_fu){
   !_fu?_fu={}:"";

   _fu.upload=function(options){
      var fd = new FormData();
      fd.append("files",options.files[0]);

      var xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", options.progress, false);
      options.done?xhr.addEventListener("load", options.done, false):"";
      options.error?xhr.addEventListener("error", options.error, false):"";
      options.abort?xhr.addEventListener("abort", options.abort, false):"";
      xhr.open("POST",options.url);//修改成自己的接口
      xhr.send(fd);
   }
   return _fu;
});