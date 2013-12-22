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

page.ajax_removeProduct=function(json,callback){
    var pid=json.pid,
        cid=json.cid;
        $.ajax({
            "type":"post",
            "url":"/ajax_removeProductFromCustomer",
            "dataType":"json",
            "data":{
                "cusInfoId":cid,
                "productId":pid
            },
            "success":function(data){
                if(data.status=="ok"){
                    callback();
                }else{
                    alert(data.message);
                }
            }
        });
    }
page.ajax_subProduct=function(json,callback){
    var pid=json.pid,
        cid=json.cid;
        $.ajax({
            "type":"post",
            "url":"/ajax_subProductFromCustomer",
            "dataType":"json",
            "data":{
                "cusInfoId":cid,
                "productId":pid
            },
            "success":function(data){
                if(data.status=="ok"){
                    callback();
                }else{
                    alert(data.message);
                }
            }
        });
    }
page.ajax_bindProduct=function(json,callback){
    var pid=json.pid,
        cid=json.cid;
        $.ajax({
            "type":"post",
            "url":"/ajax_bindProductToCustomer",
            "dataType":"json",
            "data":{
                "cusInfoId":cid,
                "productId":pid
            },
            "success":function(data){
                if(data.status=="ok"){
                    callback();
                }else{
                    alert(data.message);
                }
            }
        });
    }

page.ajax_addCustomer=function(data,fun){
    $.ajax({
        "type":"post",
        "url":"/ajax_addCustomer",
        "dataType":"json",
        "data":data,
        "success":function(result){
            if("ok"==result.status){
                fun(result.data[0]);
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

page.ajax_getCusProducts=function(cusInfoId,callback){
    $.ajax({
        "type":"post",
        "url":"/ajax_getProductsFromCustomer",
        "dataType":"json",
        "data":{
            "cusInfoId":cusInfoId
        },
        "success":function(data){
            if(data.status=="ok"){
                callback(data.data);
            }
        }
    });
}

page.ajax_getAllProducts=function(json,callback){
    $.ajax({
        type:"post",
        url:"/getAllProduct",
        dataType:"json",
        success:function(data){
            if(data.status=="ok"){
                callback(data.data);
            }
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
                name.append("<a class='boy bname'>"+(this.boy.name||"--")+"</a>");
                name.append("<a class='girl gname'>"+(this.girl.name||"--")+"</a>");
            var tel=$("<div/>",{"class":"td tel"});
                tel.append("<a class='boy phone'>"+(this.boy.phone||"--")+"</a>");
                tel.append("<a class='girl phone'>"+(this.girl.phone||"--")+"</a>");
            var play=$("<div/>",{"class":"td play"});
            li.append(name,tel,play);
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
        this.jsonData=libJson;
        this.initUI(tage,libJson);
    };
    bar.prototype.initUI=function(tage,libJson){
        var that=this;
        var share=$("<a/>",{"text":"绑定链接"});
        this.bindUserId?share.addClass("active")&&share.text("已绑定")&&share.data("bd",true):"";
        var remove=$("<a/>",{"text":"删除"});
        var setModle=$("<a/>",{"text":"添加模板"});
        var setImage=$("<a/>",{"href":"/b/manage_image/"+that.cusId,"text":"管理图片"});
        var selectsList=$("<a/>",{"target":"_blank","href":"/b/selects/"+that.cusId,"text":"查看选片"});
            tage.append(share,remove,setModle,setImage,selectsList);
            this.bindEvent({
                share:share,
                setModle:setModle
            });
    };
    bar.prototype.bindEvent=function(json){
        var that=this;
            json.share.click(function(){
                if($(this).data("bd")){return false;};
                var box=$("<box/>",{"class":"bindPathBox"});
                var src="http://chart.apis.google.com/chart?chs=200x200&cht=qr&chld=|1&chl="+location.host+"/bindlink/"+that.cusId;
                var imgBox=$("<div/>",{"class":"imgBox"});
                var img=$("<img/>",{"src":src});
                var load=$("<i/>",{"src":src,"class":"fa fa-spinner fa-spin load"});
                var loadInfo=$("<p/>",{"class":"loadInfo","text":"加载二维码..."});
                imgBox.append(load,loadInfo);
                    img.load(function(){
                        load.remove();
                        loadInfo.remove();
                        imgBox.append(img); 
                    });

                var htmlStr="<h3>使用指南</h3>"
                            +"<p>请用手机扫描此二维码获取绑定地址，或者复制输入框中的地址发给用户。用户通过预留信息来绑定到客户信息，从而获取对应功能。</p>"
                            +"<p class='resMes'>用户预留信息: "+that.jsonData.reserverMessage+"</p>"
                var input=$("<input/>",{"class":"text pathInput","value":"http://"+location.host+"/bindlink/"+that.cusId});
                box.append(imgBox,htmlStr,input);
                box.dialog({
                    width:450,
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
                        page.ajax_addCustomer(value,function(dataReq){
                            addCustomerBox.dialog("close");
                            var Lib=page.Lib
                            var lib=new Lib(dataReq);
                            $(".list").append(lib.body);
                        });
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


var ProductBox=(function(){
    var cusInfoId=null;
    var html="<div class='product'>"+
                "<div class='overDiv'><i class='fa fa-spinner fa-spin'></i><p>初始化...</p></div>"+
                "<div class='allProduct'>"+
                    "<ul class='pList'></ul>"+
                "</div>"+
                "<div class='cusProduct'>"+
                    "<ul class='pList'></ul>"+
                "</div>"+
            "</div>";
    var body=$(html);
    var pList=body.find(".cusProduct .pList");
    var aList=body.find(".allProduct .pList");
    function _init(){
        body.dialog({
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
    body.find(".cusProduct").on({
        drop:function(e){
            var obj=ProductFactory.getActiveProduct();
                obj.add();
        },
        dragover:function(e){
            e.preventDefault();
        }
    });
    
    function _createCusProduct(data){
        var ary=data;
            for(var i=0,l=ary.length;i<l;i++){
                var json=ary[i];
                json.cusInfoId=cusInfoId;
                    json.type="pList";
                    json.tage=pList;
                    ProductFactory.createProduct(json);
            };
        $(body).find(".overDiv").hide();
    }

    function _createAllProduct(data){
        var ary=data;
            for(var i=0,l=ary.length;i<l;i++){
                var json=ary[i];
                    json.cusInfoId=cusInfoId;
                    json.type="aList";
                    json.tage=aList;
                    ProductFactory.createProduct(json);
            };
            page.ajax_getCusProducts(cusInfoId,_createCusProduct);
        }

    return {
        init:function(){
            _init();
        },
        open:function(cusId){
            cusInfoId=cusId;
            page.ajax_getAllProducts({},_createAllProduct);
            body.dialog("open");
        },
        cList:pList,
        aList:aList
    } 
})();

var ProductFactory=(function(){
    var originList={};
    var cusList={};

    var ActiveProduct;
    function OriginProduct(json){
        this.id=json["_id"];
        originList[this.id]=this;
        this.json=json;
        this.cusInfoId=json.cusInfoId;
        this.initUI(json);
    }
    OriginProduct.prototype.setCount=function(count){
        this.count=count||0;
        if(this.count==0){
            this.body.find(".countBox").hide();
        }else{
            this.body.find(".countBox").show().find(".setCount").text(count);
        }
    };
    OriginProduct.prototype.initUI=function(json){
        var that=this;
            var img=$("<img>",{src:"/public_image/"+json.imgPath+"?type=fill"});
                img.load(function(){
                    that.body.find(".thu").html("").append(img);
                });
        var html="<li class='productLi' draggable=true>"+
                    "<div class='countBox'><i class='fa fa-check check'></i><div class='setCount'></div></div>"+
                    "<div class='btnBlue add'><i class='fa fa-angle-double-right'></i>添加</div>"+
                    "<div class='thu'><i class='fa fa-picture-o'></i></div>"+
                    //"<div class='thu'><img src='/public_image/"+json.imgPath+"?type=fill' /></div>"+
                   // "<div class='thu'><img src='data:image/gif;base64,"+json.base64Img+"' /> </div>"+
                    "<div class='name'>"+json.name+"</div>"+
                    "<div class='size'>"+json.size+"</div>"+
                    "<div class='imgCount'>"+(json.imgCount||"1")+"</div>"+
                    "<div class='description'>"+json.description+"</div>"+
                "</li>";
           this.body=$(html); 
           this.body.on({
            dragstart:function(e){
                ActiveProduct=that;
                //e.preventDefault();
            }
           });
           var add=this.body.find(".add");
           add.click(function(){
               that.add();
           });
        ProductBox.aList.append(this.body);
    }
    OriginProduct.prototype.add=function(){
        var that=this;
       var jsonReq={};
            jsonReq.pid=that.id;
            jsonReq.cid=that.cusInfoId;
        page.ajax_bindProduct(jsonReq,function(){
            if(!that.count){
                json.type="pList"
                json.count=1;
                ProductFactory.createProduct(that.json);
            }else{
                that.count++;
                cusList[that.id].setCount(that.count); 
            }
        }); 
    }
    
    function CusProduct(json){
        this.id=json["_id"];
        this.count=parseInt(json.count)||0;
        this.cusInfoId=json.cusInfoId;
        this.initUI(json);
        cusList[this.id]=this;
        originList[this.id]?originList[this.id].setCount(this.count):"";
    }
    CusProduct.prototype.setCount=function(count){
        originList[this.id].setCount(count);
        this.count=count||0;
        this.body.find(".count").text(count);
    };
    CusProduct.prototype.initUI=function(json){
        var that=this;
        var img;
        if(json.base64Img){
            img="<div class='thu'><img src='data:image/gif;base64,"+json.base64Img+"' /> </div>";
        }else{
            img="<div class='thu'><i class='fa fa-picture-o'></i></div>";
        }
        var html="<li class='productLi'>"+
                    "<div class='countBox'><i class='fa fa-minus-square subOne'></i><div class='count'>"+(that.count||"NAN")+"</div><i class='fa fa-plus-square addOne'></i></div>"+
                    "<div class='btnRed remove'><i class='fa fa-trash-o'></i>移除</div>"+img+
                    //"<div class='thu'><img src='/public_image/"+json.imgPath+"?type=fill' /></div>"+
                    "<div class='name'>"+json.name+"</div>"+
                    "<div class='size'>"+json.size+"</div>"+
                    "<div class='imgCount'>"+(json.imgCount||"1")+"</div>"+
                    "<div class='description'>"+json.description+"</div>"+
                "</li>";
           this.body=$(html); 
            ProductBox.cList.append(this.body);
           var remove=this.body.find(".remove");
           var addOne=this.body.find(".addOne");
           var subOne=this.body.find(".subOne");
           var countUI=this.body.find(".count");

           var jsonReq={};
                jsonReq.pid=that.id;
                jsonReq.cid=that.cusInfoId;

           remove.click(function(){
                page.ajax_removeProduct(jsonReq,function(){
                    that.body.remove();
                    _changeCount(0);
                }); 
           });
           addOne.click(function(){
                page.ajax_bindProduct(jsonReq,function(){
                    that.count++;
                    _changeCount(that.count);
                }); 
           });
           subOne.click(function(){
                page.ajax_subProduct(jsonReq,function(){
                    that.count--;
                    if(that.count==0){
                        that.body.remove();
                    }
                    _changeCount(that.count);
                }); 
           });

           function _changeCount(count){
                countUI.text(count);
                originList[that.id].setCount(count);
           }
    }

   // return product;
    return {
        createProduct:function(json){
            if(json.type=="aList"){
               var p=new OriginProduct(json);
            }else{
               var p=new CusProduct(json);
            }
        }
        ,getActiveProduct:function(){
            var temp=ActiveProduct;
            ActiveProduct=null;
            return temp;
        }
    }
})();



