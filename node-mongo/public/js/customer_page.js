var page={};
$(document).ready(function(){
    page.bindEvent();
    page.ajax_getCusList();
    page.customer.init();
});

page.bindEvent=function(){
    $("#add").click(function(){
        //page.ajax_addCustomer($("#customer_name").val());
    });
    $("#addCustomer").click(function(){
        page.customer.openAddBox();
    });
};

page.ajax_addCustomer=function(username){
    $.ajax({
        "type":"post",
        "url":"/ajax_addCustomer",
        "dataType":"json",
        "data":{"cusUsername":username},
        "success":function(result){
            if("ok"==result.status){
                alert("create ok");
            }else{
            }
        },
        "error":function(){
        
        }
    });
};

page.ajax_searchUser=function(username,callback){
    $.ajax({
        "type":"post",
        "url":"/ajax_searchUser",
        "dataType":"json",
        "data":{"keyword":username},
        "success":function(result){
            callback(result);
        },
        "error":function(){
        
        }
    });
}
page.ajax_getCusList=function(){
    $.ajax({
        "type":"post",
        "url":"/ajax_getCustomer",
        "dataType":"json",
        "success":function(data){
            if(data&&data.length>0){
                var Lib=page.Lib
                for(var i=0;i<data.length;i++){
                    var lib=new Lib(data[i]);
                    $(".list").append(lib.body);
                } 
            }
        },
        "error":function(){
        
        }
    });
};

page.Lib=(function(){
    function lib(json){
        this.initUI(json);
        this.createBar(json);
    }
    lib.prototype.initUI=function(json){
        var li=$("<li/>",{}); 
            var name=$("<div/>",{"class":"td name","text":json.username});
            var cus=$("<div/>",{"class":"td qq","text":json.qq||"--"});
            var date=$("<div/>",{"class":"td email","text":json.email||"--"});
            var tel=$("<div/>",{"class":"td tel","text":json.mobile||"--"});
            var play=$("<div/>",{"class":"td play"});
            li.append(name,cus,date,tel,play);
        this.body=li;
        this.playBox=play;
    }
    lib.prototype.createBar=function(json){
        var bar=page.LibBar;
            this.bar=new bar(this.playBox,json);
    }
    return lib;
})();
page.LibBar=(function(){
    function bar(tage,libJson){
        this.initUI(tage,libJson);
        this.id=libJson.id;
    };
    bar.prototype.initUI=function(tage,libJson){
        var share=$("<a/>",{"text":"公开"});
        var remove=$("<a/>",{"text":"删除"});
        var setModle=$("<a/>",{"text":"添加模板"});
        var setImage=$("<a/>",{"href":"/b/manage_image/"+libJson.id,"target":"_blank","text":"管理图片"});
            tage.append(share,remove,setModle,setImage);
            this.bindEvent(share);
    };
    bar.prototype.bindEvent=function(share){
        var that=this;
            share.click(function(){
                alert(that.id);
            
            });
    };
    return bar;
})();

page.customer=(function(){
    var addCustomerBox;
    var _createSearchList=function(data,tag){
        for(var i=0;i<data.length;i++){
            var li=$("<li/>",{"text":data[i].name});
            tag.append(li);
        }
    }


    var _initCustomerAddDialog=function(){
        var box=$("<div/>",{"class":"addCustomerBox"});
        var inputBox=$("<div/>",{"class":"inputBox"});
        var select=$("<select/>",{ "class":"select"});
            var Ousername=$("<option/>",{value:"用户名","text":"用户名"});
            var Oemail=$("<option/>",{value:"Email","text":"Email"});
            var Oqq=$("<option/>",{value:"QQ账号","text":"QQ账号"});
            select.append(Ousername,Oemail,Oqq);
        var input=$("<input/>",{"class":"text searchCusInput","placeholder":"用户名/邮箱/第三方账号"});
        var typeTab=$("<div/>",{"class":"typeTab"}); 
        var add=$("<div/>",{"class":"btnBlue add","text":"添加"});
            inputBox.append(input,typeTab);
        var barBox=$("<div/>",{});
        var progressBar=$("<div/>",{class:"progress"});
        var ul=$("<div/>",{class:"searchList"});
        box.append(barBox.append(inputBox,add),progressBar,ul);
        box.dialog({
             autoOpen:false,
             resizable:false,
            height:500,
             modal: true
        });
        var interval=null;
        var username;
        
        //input bind event
        var json={"email":"邮件","qq":"QQ帐号","mobile":"手机","err":"用户名"};
        input.bind("keyup",function(){
            var val=input.val();
            var type=Common.Type.getType(val);
            typeTab.html(json[type]);
            interval?clearTimeout(interval):"";
            interval=setTimeout(function(){
                clearTimeout(interval);
                page.ajax_searchUser(val,function(data){
                    var l=data.length; 
                    ul.html("");
                    if(l>0){
                        username=data[0].name;
                        _createSearchList(data,ul);
                        Common.Btn.buttonOpreta(add,1);
                    }else{
                        username=null;
                        if("err"==type){
                            Common.Btn.buttonOpreta(add,0);
                        }else{
                            Common.Btn.buttonOpreta(add,1);
                        }
                    }
                });
            },500);
        });

        //add bind event
        add.click(function(){
            if(!$(this).data("status")){return;}
            var value=username||input.val();
            page.ajax_addCustomer(value);
            username=null;
        });
        addCustomerBox=box;
    }
    
    return {
        init:function(){
            _initCustomerAddDialog();
        },
        openAddBox:function(){
            addCustomerBox.dialog("open");
        }
    }
})();

