/**
 * @author guanyuxin
 * @date 2011.10.26
 * @des 使得某元素可以拖动
*/
kola("webbricks.clay.interact.Draggable",[
    "kola.html.Element",
    "kola.html.Document",
    "kola.lang.Class",
    "kola.lang.Object",
    "kola.bom.Selection",
    "kola.event.Dispatcher"
],function($,KolaDocument,KolaClass,KolaObject,Selection,Dispatcher){
    var lastY=0;
    var documentScrollElement=$(KolaDocument.scroll().element);
    var exports=KolaClass.create(Dispatcher,{
        _init:function(ele,opt){
            this.opt=KolaObject.extend({
                handle:"*",
                draggingClass:"dragging",
                dragStyle:"absolute",
                confined:false,
                confinedTarget:null,
                marginTop:0,
                marginBottom:0,
                marginLeft:0,
                marginRight:0,
                scrollSpeed:0,
                fixed:false
            },opt||{});

            var _this=this;
            if(_this.opt.handle=="*")
                _this.handles=ele;
            else
                _this.handles=ele.find(this.opt.handle);
            _this.ele=$(ele);
            _this.eleW=_this.ele.scrollWidth();
            _this.eleH=_this.ele.scrollHeight();
            Selection.setUnselectable(_this.handles);
            //绑定事件
            _this.handles.mousedown(mouseDown,{scope:this});
        },
        terminate:function(){
            handles.off("mousedown",mouseDown);
        }
    });
    function mouseMove(e){
        if(!e.clientY)
            e.clientY=lastY;
        lastY=e.clientY;
        this.eleW=this.ele.width();
        this.eleH=this.ele.height();
		var mouseX=this.oldEleX+e.clientX-this.oldMouseX;
		var mouseY=this.oldEleY+e.clientY-this.oldMouseY+(documentScrollElement[0].scrollTop);
		//confine
        if(this.opt.confined=="box"){
			if(mouseX<this.opt.marginLeft)
				mouseX=this.opt.marginLeft;
			if(mouseX+this.eleW>$(this.opt.confinedTarget).width()-this.opt.marginRight)
				mouseX=$(this.opt.confinedTarget).width()-this.opt.marginRight-this.eleW;
			if(mouseY<this.opt.marginTop)
				mouseY=this.opt.marginTop;
			if(mouseY+this.eleH>$(this.opt.confinedTarget).height()-this.opt.marginBottom)
				mouseY=$(this.opt.confinedTarget).height()-this.opt.marginBottom-this.eleH;
		}
        //this.fire({type:"beforeDragging",elem:this.ele,data:{left:mouseX}});
        //autoScroll
        if(this.opt.scrollSpeed>0){
            var clientHeight=KolaDocument.clientSize().h;
            var eleTop=this.ele.clientPos().top;
            if(e.clientY<40 && eleTop<100){
                documentScrollElement[0].scrollTop-=this.opt.scrollSpeed;
            }
            if( (eleTop+this.eleH>clientHeight-100) && (e.clientY+40>clientHeight)){
                documentScrollElement[0].scrollTop+=this.opt.scrollSpeed;
            }
        }
        
		this.ele.style("left",mouseX);
		this.ele.style("top",mouseY);
		this.fire({type:"dragging",elem:this.ele});
	}
    function mouseUp(e){
		this.fire("beforeDrop");
		this.ele.removeClass(this.opt.draggingClass);
		$(document).off("mousemove",mouseMove);
		$(document).off("mouseup",mouseUp);
        $(window).off("scroll",mouseMove);
		this.fire({type:"afterDrop",elem:this.ele});
	}
    function mouseDown(e){
		//只允许左键
		if(e.button!=0)
			return;
		this.fire("beforeDrag");
		//在拿起后取消全部选择

		//Selection.clearSelection();
		this.oldEleX=this.ele.pos().left;
		this.oldEleY=this.ele.pos().top;
		//初始化位置，并转换为绝对定位
		this.ele.style("left",this.oldEleX);
		this.ele.style("top",this.oldEleY);
		this.ele.style("position",this.opt.dragStyle);
		this.ele.addClass(this.opt.draggingClass);

		this.oldMouseX=e.clientX;
		this.oldMouseY=e.clientY+(documentScrollElement[0].scrollTop);
		$(document).mousemove(mouseMove,{scope:this});
		$(document).mouseup(mouseUp,{scope:this});
        $(window).on("scroll",mouseMove,{scope:this});
		this.fire({type:"afterDrag",elem:this.ele});
	}
    return exports;
});