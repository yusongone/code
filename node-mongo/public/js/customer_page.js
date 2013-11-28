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
    ProductBox.init();
};

page.ajax_addCustomer=function(data,fun){
    $.ajax({
        "type":"post",
        "url":"/ajax_addCustomer",
        "dataType":"json",
        "data":data,
        "success":function(result){
            if("ok"==result.status){
                fun();
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
page.ajax_getCusList=function(cusId){
    $.ajax({
        "type":"post",
        "url":"/ajax_getCustomer",
        "dataType":"json",
        "data":{"cusId":cusId},
        "success":function(data){
            if(data&&data.length>0){
                var Lib=page.Lib
                for(var i=0;i<data.length;i++){
                    var json=data[i];
                    var lib=new Lib(json);
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
        this.boy=json.member.boy;
        this.girl=json.member.girl;
        this.initUI(json);
        this.createBar(json);
    }
    lib.prototype.initUI=function(json){
        var li=$("<li/>",{}); 
            var name=$("<div/>",{"class":"td name"});
                this.boy.name?name.append("<a class='boy bname'>"+this.boy.name+"</a>"):"";
                this.girl.name?name.append("<a class='girl gname'>"+this.girl.name+"</a>"):"";
            var cus=$("<div/>",{"class":"td qq","text":json.qq||"--"});
            var date=$("<div/>",{"class":"td email","text":json.email||"--"});
            var tel=$("<div/>",{"class":"td tel"});
                this.boy.phone?tel.append("<a class='boy gphone'>"+this.boy.phone+"</a>"):"";
                this.girl.phone?tel.append("<a class='girl gphone'>"+this.girl.phone+"</a>"):"";
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
        this.cusId=libJson._id;
        this.bindUserId=libJson.bindUser;
        this.initUI(tage,libJson);
    };
    bar.prototype.initUI=function(tage,libJson){
        var that=this;
        var share=$("<a/>",{"text":"绑定链接"});
        this.bindUserId?share.addClass("active")&&share.text("已绑定")&&share.data("bd",true):"";
        var remove=$("<a/>",{"text":"删除"});
        var setModle=$("<a/>",{"text":"添加模板"});
        var setImage=$("<a/>",{"href":"/b/manage_image/"+that.cusId,"target":"_blank","text":"管理图片"});
            tage.append(share,remove,setModle,setImage);
            this.bindEvent({
                share:share,
                setModle:setModle
            });
    };
    bar.prototype.bindEvent=function(json){
        var that=this;
            json.share.click(function(){
                if($(this).data("bd")){return false;};
                var box=$("<box/>",{});
                var src="http://chart.apis.google.com/chart?chs=200x200&cht=qr&chld=|1&chl="+location.host+"/bindlink/"+that.cusId;
                var img=$("<img/>",{"src":src});
                var input=$("<input/>",{"value":"http://"+location.host+"/bindlink/"+that.cusId});
                box.append(img,input);
                box.dialog({
                    resizable:false,
                    modal: true,
                    close:function(){
                        box.remove();
                    }
                });
            });
            json.setModle.click(function(){
                ProductBox.open(that.cusId);
            });
    };
    return bar;
})();

page.customer=(function(){
    var addCustomerBox;
    var _initCustomerAddDialog=function(){
        var box=$("<div/>",{"class":"addCustomerBox"});
        var boy="<div class='boyBox'>"+
                    "<div>帅哥</div>"+
                    "<input placeholder='姓名' class='text name' />"+
                    "<input placeholder='电话' class='text phone' />"+
                    "<textarea class='text otherInfo'></textarea>"+
                "</div>";
        var girl="<div class='girlBox'>"+
                    "<div>美女</div>"+
                    "<input placeholder='姓名' class='text name' />"+
                    "<input placeholder='电话' class='text phone' />"+
                    "<textarea class='text otherInfo'></textarea>"+
                "</div>";
        var otherMessage="<div class='otherMessage'>"+
                            "<div></div>"+
                            "<input placeholder='预留信息' class='text message'/>"+
                            "<input placeholder='地址' class='text address'/>"
        box.append(boy,girl,otherMessage);
        box.dialog({
             autoOpen:false,
            // resizable:false,
            width:590,
            height:450,
            modal: true,
            buttons:{
                "提交":function(){
                    var value=getValue(); 
                    if(value){
                        page.ajax_addCustomer(value,function(){
                            addCustomerBox.dialog("close");
                        })
                    }
                }
            }
        });
        function getValue(){
            var member={};
            member={
                boyName:box.find(".boyBox .name").val(),
                boyPhone:box.find(".boyBox .phone").val(),
                boyOther:box.find(".boyBox .otherInfo").val(),
                girlName:box.find(".girlBox .name").val(),
                girlPhone:box.find(".girlBox .phone").val(),
                girlOther:box.find(".girlBox .otherInfo").val(),
                message:box.find(".message").val(),
                address:box.find(".address").val()
            }
            var boyInfo=!!(member.boyName&&member.boyPhone);
            var girlInfo=!!(member.girlName&&member.girlPhone);
            if(!(boyInfo||girlInfo)){
                    alert("最少输入一个姓名和电话");
                return false; 
            }
            if(!member.message){
                    alert("必须预留信息，用来登录绑定图片库!");
                return false; 
            }
            return member;
        }
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

//删除掉
page.customer_des=(function(){
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

var ProductBox=(function(){
    var cusInfoId=null;
    var html="<div class='product'>"+
                "<div class='allProduct'>"+
                    "<ul class='pList'></ul>"+
                "</div>"+
                "<div class='cusProduct'>"+
                    "<ul class='pList'></ul>"+
                "</div>"+
            "</div>";
    var z=$(html);
    var aList=z.find(".allProduct .pList");
    var pList=z.find(".cusProduct .pList");
    function _init(){
        z.dialog({
            autoOpen:false,
            resizable: true,
            width:800,
            modal: true,
            "close":function(){
                aList.html("");
                pList.html("");
            },
            "beforeclose":function(){
            }
        });
    }

    function _getCusProducts(cusInfoId){
        console.log(cusInfoId);
        $.ajax({
            "type":"post",
            "url":"/ajax_getProductsFromCustomer",
            "dataType":"json",
            "data":{
                "cusInfoId":cusInfoId
            },
            "success":function(data){
                if(data.status=="ok"){
                var ary=data.data;
                    for(var i=0,l=ary.length;i<l;i++){
                        var json=ary[i];
                        json.cusInfoId=cusInfoId;
                       var p=new Product(json);
                            pList.append(p.body);
                    };
                }
            }
        });
    }

    function _getAllProducts(){
        $.ajax({
            type:"post",
            url:"/getAllProduct",
            dataType:"json",
            success:function(data){
                if(data.status=="ok"){
                var ary=data.data;
                    for(var i=0,l=ary.length;i<l;i++){
                        var json=ary[i];
                            json.cusInfoId=cusInfoId;
                            json.type="aList";
                       var p=new Product(json);
                            aList.append(p.body);
                    };
                }
            }
        });

    }
    return {
        init:function(){
            _init();
        },
        open:function(cusId){
            cusInfoId=cusId;
            _getCusProducts(cusInfoId);
            _getAllProducts(cusInfoId);
            z.dialog("open");
        }
    } 
})();

var Product=(function(){
    function product(json){
        this.id=json["_id"];
        this.cusInfoId=json.cusInfoId;
        this.initUI(json);
    }
    product.prototype.initUI=function(json){
        var that=this;
        var str="";
        if(json.type=="aList"){
            str="<div class='btnBlue add'>添加</div>";
        }else{
            str="<div class='countBox'><div class='subOne'>-</div><input id='count' value='"+(json.count||"NAN")+"'><div class='addOne'>+</div></div>"
            str+="<div class='btnRed remove'>移除</div>";
        }
        console.log(json);
        var html="<li class='productLi'>"+str+
                    "<div class='thu'><img src='/public_image/"+json.imgPath+"?type=fill' /></div>"+
                    "<div class='name'>"+json.name+"</div>"+
                    "<div class='size'>"+json.size+"</div>"+
                    "<div class='imgCount'>"+(json.imgCount||"1")+"</div>"+
                    "<div class='description'>"+json.description+"</div>"+
                "</li>";
           this.body=$(html); 
           var add=this.body.find(".add");
           var remove=this.body.find(".remove");
           var addOne=this.body.find(".addOne");
           var subOne=this.body.find(".subOne");
           add.click(function(){
                _bindProduct(that.id,that.cusInfoId); 
           });
           remove.click(function(){
                _removeProduct(that.id,that.cusInfoId); 
           });
           addOne.click(function(){
                _bindProduct(that.id,that.cusInfoId); 
           });
           subOne.click(function(){
                _subProduct(that.id,that.cusInfoId); 
           });
    }
    function _removeProduct(pid,cid){
        $.ajax({
            "type":"post",
            "url":"/ajax_removeProductFromCustomer",
            "dataType":"json",
            "data":{
                "cusInfoId":cid,
                "productId":pid
            },
            "success":function(data){
                console.log(data);
            }
        });
    }
    function _subProduct(pid,cid){
        $.ajax({
            "type":"post",
            "url":"/ajax_subProductFromCustomer",
            "dataType":"json",
            "data":{
                "cusInfoId":cid,
                "productId":pid
            },
            "success":function(data){
                console.log(data);
            }
        });
    }
    function _bindProduct(pid,cid){
        $.ajax({
            "type":"post",
            "url":"/ajax_bindProductToCustomer",
            "dataType":"json",
            "data":{
                "cusInfoId":cid,
                "productId":pid
            },
            "success":function(data){
                console.log(data);
            }
        });
    }
    return product;
})();



