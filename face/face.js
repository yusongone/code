		function Pic(){
			this.can=document.getElementById("myCanvas");
			this.ctx=this.can.getContext("2d");
			this.selectAry=[];
		}
		Pic.prototype.initImage=function(img){
			this.ctx.drawImage(img,40,50,300,225);
		}
		Pic.prototype.showBox=function(L,T,size){
			$("#box").css({"top":T+"px","left":L+"px",width:size+"px",height:size+"px"});
		}


		Pic.prototype.getData=function(){
			var data=this.ctx.getImageData(0,0,300,225).data;
			var color=[156,22,47];
			var x=0,y=0,count=0;
			var tolerance=50;
			for(var i=0;i<data.length;){
				var r=data[i++],
					g=data[i++],
					b=data[i++],
					p=data[i++];
					var rb=Math.abs(r-color[0])<tolerance;
					var gb=Math.abs(g-color[1])<tolerance;
					var bb=Math.abs(b-color[2])<tolerance;
					if(rb&&gb&&bb){
					x+=((i/4)%300);
					y+=((i/4)/300);
					count++;
				//	this.drawAdot((i/4)%300,(i/4)/300);
					}
			}
			var size=(count/(300*225))*5000;
			this.showBox(x/count-(size/2),y/count-(size/2),size);
		}
		Pic.prototype.drawAdot=function(x,y){
			this.ctx.fillStyle="green";
			this.ctx.fillRect(x,y,1,1);
		}

		Pic.prototype.beginCamera=function(){
			var v=document.getElementById("v");
			var that=this;
			navigator.webkitGetUserMedia({video:true},
				function(stream){
					v.src = webkitURL.createObjectURL(stream);
                    console.log("fefef");
				},function(error){
				console.log("不支持媒体流～ ", error);
			});

                var _RAF=window.mozRequestAnimationFrame||window.requestAnimationFrame||window.webkitRequestAnimationFrame;
                _RAF(_oneFrame);
                function _oneFrame(){
					pic.ctx.drawImage(v,0,0,300,225);
					pic.getData();
                    _RAF(_oneFrame);
                }

		}
