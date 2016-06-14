//在全局和所有元素类型的父类型的原型中，封装相同的$方法
//专用于在各种情况下用选择器查询元素对象
//接收一个字符串格式的选择器作为参数
//返回找到的一个元素对象或多个元素对象的数组
window.$=HTMLElement.prototype.$=function(selector){
  //如果在全局直接调$，就再document范围内查询
  //否则，就再当前元素范围内查询
  var elems=(this==window?document:this).querySelectorAll(selector);
  if(!elems){//如果没找到结果
    return null;
  }else if(elems.length==1){//如果直找到一个结果
    return elems[0];
  }else{//否则
    return elems;
  }
}
window.onload=function(){
  /*顶部弹出菜单*/
  var lis=$(".app_jd,.service");
  for(var i=0;i<lis.length;i++){
    lis[i].addEventListener("mouseover",function(){
	  this.$("."+this.className+">a").className="hover";
	  this.$("[id$='_items']").style.display="block";
	},false);
	lis[i].addEventListener("mouseout",function(){
	  this.$("."+this.className+">a").className="";
	  this.$("[id$='_items']").style.display="none";
	},false);
  }
  /*全部商品分类*/
  $("#category").onmouseover=$("#category").onmouseout=function(){
   /*太复杂，贼多
	($("#cate_box").style.display=="block")?($("#cate_box").style.display="none"):($("#cate_box").style.display="block");
   */
	$("#cate_box").style.display=$("#cate_box").style.display=="block"?"none":"block";
  }

  var lis=$("#cate_box>li");
  for(var i=0;i<lis.length;i++){
	lis[i].addEventListener("mouseover",function(){
	  
	  //留住hover
	  this.$("h3").className="hover";
	  this.$(".sub_cate_box").style.display="block";
	},false);
	lis[i].addEventListener("mouseout",function(){
	  this.$("h3").className="";
	  this.$(".sub_cate_box").style.display="none";
	},false);
  }
  /*商品详情中的标签页*/
  //在ul下每个li下的a中手动定义属性data-i为0,1,2,-1,3
  //找到id为product_detail下的class为main_tabs的ul
  var ul=$("#product_detail>.main_tabs");
  ul.onclick=function(){
    //获得事件对象e
	var e=window.event||arguments[0];
	//获得目标元素
	var target=e.srcElement||e.target;
	if(target.nodeName=="A"){
	  $("#product_detail>.main_tabs>.current").className="";
	  target.parentNode.className="current";
	  var contents=$("#product_detail>.main_tabs~[id^='product_']");
	  if(target.dataset.i!=-1){
	    for(var i=0;i<contents.length;i++){
		  contents[i].style.display=i!=target.dataset.i?"none":"block";
		}
	  }else{
	    for(var i=0;i<contents.length;i++){
		  contents[i].style.display="none";
		}
	  }
	}
  }

  picture.init();
  console.log(picture);
}

//封装放大图功能的对象
var picture={
  LIWIDTH:62,//每个小图片li的固定宽度
     LEFT:20,//ul起始left值
	   ul:null,//包含小图片li的ul，是移动的主体
	aback:null,//左侧按钮-->右移一个li
	 afor:null,//右侧按钮-->左移一个li
	moved:0,//记录ul左移的次数，每左移一次+1，右移-1
  liCount:0,//记录li的总数

    maskH:0,//mask的高
	maskW:0,//mask的宽
   maxTop:0,//mask可用的最大top值
  maxLeft:0,//mask可用的最大left值
  //如果liCount-5==moved,就禁用afor
  //如果moved==0,就禁用aback
  init:function(){
    var self=this;
	self.ul=$("#icon_list");
	self.liCount=$("#icon_list>li").length;
	self.aback=$("#preview>h1>a:first-child");
    //self.aback=$("#preview>h1>a")[0];
	self.aback=$("#preview>h1>a:first-child+a");
	//self.afor=$("#preview>h1>a")[1];

	//为aback和afor绑定相同单击事件处理函数
	//MD问题大大的！！！！！
	self.aback.onclick=self.afor.onclick=function(){
	  if(this.className.indexOf("_disabled")==-1){
	    self.moved+=this.className=="forward"?1:-1;
		self.ul.style.left=-self.moved*self.LIWIDTH+self.LEFT+"px";
		if(self.moved==0){
		  self.aback.className+="_disabled";
		}else if(self.liCount-self.moved==5){
		  self.afor.className+="_disabled";
		}else{
		  self.aback.className="backward";
		  self.afor.className="forward";
		}
	  }
	}

	//为ul绑定onmouseover事件
	self.ul.addEventListener("mouseover",function(){
	  var e=window.event||arguments[0];
	  var target=e.srcElement||e.target;
	  if(target.ondeName=="IMG"){
	    var src=target.src;
		var i=src.lastIndexOf(".");
		$("#mImg").src=src.slice(0,i)+"-m"+src.slice(i);
	  }
	},false);

	//为superMask绑定onmouseover和onmouseout为同一函数
	$("#superMask").onmouseover=$("#superMask").onmouseout=function(){
	  if($("#mask").style.display=="block"){
	    $("#mask").style.display="none";
		$("#largeDiv").style.display="none";
	  }else{
	    $("#mask").style.display="block";
		$("#largeDiv").style.dislpay="block";
		var src=$("#mImg").src;
		var i=src.lastIndexOf(".");
		$("#largeDiv").style.backgroundImage="url("+src.slice(0,i-2)+"-1"+src.slice(i)+")";
	  }
	}

	var style=getComputedStyle($("#mask"));
	self.maskH=parseFloat(style.height);
	self.maskW=parseFloat(style.width);
	style=getComputedStyle($("#superMask"));
	self.maxTop=parseFloat(style.height)-self.maskH;
	self.maxLeft=parseFloat(style.width)-self.maskW;
	//为superMask绑定onmousemove事件
	$("#superMask").onmousemove=function(){
	  var e=window.event||arguments[0];
	  var x=e.offsetX,y=e.offsetY;
	  var top=y-self.maskH/2,left=x-maskW/2;
	    top=top<0?0:
            top>self.maxTop?self.maxTop:
		          top;
		left=left<0?0:
             left>self.maxLeft?self.maxLeft:
		          left;
		$('#mask').style.top=top+"px";
		$('#mask').style.left=left+"px";

		//修改largeDiv的背景位置
		$("#largeDiv").style.backgroundPosition=-left*16/7+"px -"+top*16/7+"px";
	}
	
  }
}