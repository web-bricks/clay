/**
 * @author guanyuxin
 * @date 2011.10.26
 * @des 使得某元素可以拖动
*/
//ISSUE: Draggable适应于挂载在body下，如果Draggable和body之间有其他scroll则会出错
kola('webbricks.clay.interact.Draggable',[
    'kola.html.Element',
    'kola.lang.Class',
    'kola.lang.Object',
    'kola.event.Dispatcher',
    'kola.bom.Selection'
],function($, KolaClass, KolaObject, Dispatcher, Selection){

    //if(document.ontouchmove !== undefined || document.ontouchmove === null){
    //    var downEvent = 'touchstart';
    //    var upEvent = 'touchend';
    //    var moveEvent = 'touchmove';
    //}else{
        var mouse;
        var downEvent = 'mousedown';
        var upEvent = 'mouseup';
        var moveEvent = 'mousemove';
    //}
    
    var lastY = 0;
    if (navigator.userAgent.indexOf('Chrome') >= 0){
        var documentScrollElement = document.body;
    }else{
        var documentScrollElement = document.documentElement;
    }
    var exports = KolaClass.create(Dispatcher, {
        _init:function(ele, options){
            this.options=KolaObject.extend({
                handle: '*',
                preventDefault: false,
                draggingClass: 'dragging',
                confinedTarget: '',
                marginTop: 0,
                marginBottom: 0,
                marginLeft: 0,
                marginRight: 0,
                scrollSpeed: 0,
                fixed:false
            }, options);
            this.dispatcher = this.options.dispatcher || this;
            var _this = this;
            if(_this.options.handle == '*')
                _this.handles = ele;
            else
                _this.handles = ele.find(this.options.handle);
            _this.ele = $(ele);
            //绑定事件
            _this.handles.on(downEvent, mouseDown,{context: this});

            if(this.options.confinedTarget.nodeType == 1){
                this.box = this.ele.clientPosition(this.options.confinedTarget);
                this.box.left -= this.oldLeft;
                this.box.top -= this.oldTop;
            }
        },
        terminate: function(){
            this.handles.off(downEvent, mouseDown);
        },
        adjust: function(newLeft, newTop){
            this.eleW = this.ele[0].offsetWidth;
            this.eleH = this.ele[0].offsetHeight;
            if(this.options.confinedTarget == 'client'){//约束在视口中
                if(e.clientX - this.oldMouseX + this.oldLeft < 0)
                    newLeft = 0;
                if(e.clientX - this.oldMouseX + this.oldLeft + this.eleW > document.documentElement.clientWidth)
                    newLeft = document.documentElement.clientWidth - this.eleW;
                if(e.clientY - this.oldMouseY + this.oldTop < 0)
                    newTop = (this.options.fixed ? 0 : documentScrollElement.scrollTop);
                if(e.clientY - this.oldMouseY + this.oldTop + this.eleH > document.documentElement.clientHeight)
                    newTop = document.documentElement.clientHeight - this.eleW + (this.options.fixed ? 0 : documentScrollElement.scrollTop);
            }else if(this.options.confinedTarget){//约束在dom中
                if(this.box.left + newLeft < 0)
                    newLeft = -this.box.left;
                if(this.box.left + newLeft + this.eleW > this.options.confinedTarget.clientWidth)
                    newLeft = -this.box.left + this.options.confinedTarget.clientWidth - this.eleW;
                if(this.box.top + newTop < 0)
                    newTop = -this.box.top;
                if(this.box.top + newTop + this.eleH > this.options.confinedTarget.clientHeight)
                    newTop = -this.box.top + this.options.confinedTarget.clientHeight - this.eleH;
            }
            return {left: newLeft, top: newTop};
        }
    });
    function mouseMove(e){
        e.preventDefault();
        if(!e.clientY)
            e.clientY = lastY;
        lastY = e.clientY;
        
		var newLeft = this.oldLeft + e.clientX - this.oldMouseX;
		var newTop = this.oldTop + e.clientY - this.oldMouseY + (this.options.fixed ? 0 : documentScrollElement.scrollTop);
        var res = this.adjust(newLeft, newTop);
        
        //autoScroll
        if(this.options.scrollSpeed > 0){
            var clientHeight = document.documentElement.clientHeight;
            var eleTop = e.clientY - this.oldMouseY + this.oldTop;
            if(e.clientY < 40 && eleTop < 100){
                documentScrollElement.scrollTop -= this.options.scrollSpeed;
            }
            if( (eleTop + this.eleH > clientHeight - 100) && (e.clientY + 40 > clientHeight)){
                documentScrollElement.scrollTop += this.options.scrollSpeed;
            }
        }  
		this.ele.left(res.left);
		this.ele.top(res.top);
		this.dispatcher.fire({type:'dragging', elem: this.ele});
	}
    function mouseUp(e){
		this.dispatcher.fire('beforeDrop');

		this.ele.css(this.options.draggingClass, false);
        Selection.selectable(document , true);
		$(document).off(moveEvent, mouseMove);
		$(document).off(upEvent, mouseUp);
        $(window).off('scroll', mouseMove);
        
		this.dispatcher.fire({type:'afterDrop', elem: this.ele});
	}
    function mouseDown(e){
		//只允许左键
		if(mouse && e.button != 0)
			return;
        //不允许draggable冒泡多次触发
        if(e.event.dragEvent)
            return;
        e.event.dragEvent = true;
        if(this.options.preventDefault)
            e.preventDefault();
		this.dispatcher.fire('beforeDrag');

        //初始化位置，并转换为绝对定位
		this.oldLeft = this.ele.left();
		this.oldTop = this.ele.top();
		
		this.ele.left(this.oldLeft);
		this.ele.top(this.oldTop);
		this.ele.style('position', 'absolute');
		this.oldMouseX = e.clientX;
		this.oldMouseY = e.clientY + (this.options.fixed ? 0 : documentScrollElement.scrollTop);
        if(this.options.confinedTarget.nodeType == 1){
            this.box = this.ele.clientPosition(this.options.confinedTarget);
            this.box.left -= this.oldLeft;
            this.box.top -= this.oldTop;
        }
		$(document).on(moveEvent, mouseMove, {context: this});
		$(document).on(upEvent, mouseUp, {context: this});
        $(window).on('scroll', mouseMove, {context: this});

        Selection.selectable(document , false);
        this.ele.css(this.options.draggingClass, true);
		
        this.dispatcher.fire({type: 'afterDrag', elem: this.ele, data:{e:e}});
	}
    return exports;
});