var page={};
$(document).ready(function(){
    page.bindEvent();
});



page.bindEvent=function(){
    //lgoin page
    $("#login").click(function(){
        page.ajax_login({
            username:$("#username").val(),
            pass:$("#pass").val(),
            path:$("#path").val()
        }); 
    }); 

    $(".login #cancel").click(function(){
    });
    //regeister page
    $("#register").click(function(){
        page.ajax_register({
            username:$("#username").val(),
            pass:$("#pass").val()
        }); 
    });

    $(".register #cancel").click(function(){
       alert("register"); 
    });

}

page.ajax_login=function(json){
    $.ajax({
        "type":"post",
        "url":"/ajax_login",
        "dataType":"json",
        "data":{"username":json.username,"pass":json.pass,"path":json.path},
        "success":function(result){
            if("ok"==result.status){
                finish_login(result);
            }else{
                alert(result.message);
            }
        },
        "error":function(){
        
        }
    });
    function finish_login(result){
        var path=json.path;
        if(path){
            window.location=path;
        }else{
            window.location="/";
        };
        //$("body").css({"background":"green"});
    }

};
page.ajax_register=function(json){
    $.ajax({
        "type":"post",
        "url":"/ajax_register",
        "dataType":"json",
        "data":{"username":json.username,"pass":json.pass},
        "success":function(result){
            if("ok"==result.status){
                finish_register(result);
            }else{
                alert(result.message);
            }
        },
        "error":function(){
        
        }
    });

    function finish_register(result){
        $("body").css({"background":"green"});
    }
}



