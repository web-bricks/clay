/*
tip:
anchor tip指向的dom
option
    entity
        type SELECTOR   tip的dom的选择器
        type HTML       tip的dom的html
        type {templete,data}tip的模板
    direction
        =up
        =down
        =left
        =right
    trigger:
        =direct 直接出现
        =click   鼠标点击
        =mouseenter anchor hover
        =mouseenter anchor || entity hover
    showLag
    hideLag
    hideOnClickOut 当鼠标在外部点击时关闭
show
hide
*/
kola("webbricks.clay.ctrl.Layer",[
    "kola.html.Element",
    "kola.lang.Class",
    "kola.lang.Object",
    "webbricks.clay.cpt.CptUtil"
],function($,C,KolaObject,CptUtil){
    var templete={
        simpleTip:""
    };
    /////////////////不知道放哪好
    var hoverElement=null;
    $(document.body).mouseover(function(e){
        hoverElement=e.target;
    })
    function isHover(elem){
        return elem.contains(hoverElement);
    }
    /////////////////////
    var Layer=function(anchor,option){
        var _this=this;
        _this.option=KolaObject.extend({
            hiddenClass:"hidden",
            anchorActiveClass:"",
            fly:false,
            direction:"b",
            topClass:"ncard_bl",
            bottomClass:"ncard_tl"
        },option||{});
        if(_this.option.trigger=="mouseenter" && !_this.option.hideLag)
            _this.option.hideLag=200;

        _this.anchor=K(anchor);
        _this.anchor.data("clay-Layer",this);
        //entity是模板
        if(_this.option.entity.templete){
            _this.entity=templete[_this.option.entity.templete](_this.option.entity.data);
        }else{
            _this.entity=CptUtil.getDom(_this.option.entity,this.anchor);
        }
        if(_this.option.trigger){
            if(_this.option.trigger == "direct"){
                _this.show();
            }else if(_this.option.trigger == "click") {
                _this.anchor.click(_this.show,{scope:_this});
            }else{
                //处理打开事件
                if(_this.option.showLag){
                    _this.anchor.mouseenter(lagShow,{scope:_this});
                }else{
                    _this.anchor.mouseenter(_this.show,{scope:_this});
                }
                //处理关闭事件
                if(_this.option.trigger=="mouseenter"){//mouseenter
                    _this.anchor.mouseleave(isBothOut,{scope:_this});
                    _this.entity.mouseleave(isBothOut,{scope:_this});
                }else{
                    if(_this.option.showLag){
                        _this.anchor.mouseleave(lagHide,{scope:_this});
                    }else{
                        _this.anchor.mouseleave(_this.hide,{scope:_this});
                    }
                }
            }
        }
    }
    //延时打开，定时器触法时如果鼠标不在anchor上，则取消
    function lagShow(){
        var _this=this;
        setTimeout(function(){
            if(isHover(_this.anchor))
                _this.show();
        },_this.option.showLag);
    }
    //延时关闭
    function lagHide(){
        var _this=this;
        setTimeout(function(){
            _this.hide();
        },_this.option.hideLag);
    }
    //鼠标不在anchor和
    function isBothOut(e){
        var _this=this;
        setTimeout(function(){
            if(!isHover(_this.anchor) && !isHover(_this.entity)){
                _this.hide();
            }
        },_this.option.hideLag);
    }
    C.buildProto(Layer,{
        show:function(e){
            if(!this.entity.hasClass(this.option.hiddenClass))
                return;
            this.anchor.addClass(this.option.anchorActiveClass);
            this.entity.removeClass(this.option.hiddenClass);
            for(var i=0;i<this.option.direction.length;i++){
                d=this.option.direction.charAt(i);
                if(d=="b"){
                    this.entity.removeClass(this.option.topClass).addClass(this.option.bottomClass);
                }else{
                    this.entity.removeClass(this.option.bottomClass).addClass(this.option.topClass);
                }
                if(this.option.fly){
                    var pos=this.anchor.pagePos();
                    pos.left+=this.anchor.width()/2;
                    if(d=="b")
                        pos.top+=this.anchor.height();
                    if(this.option.entityAnchor){
                        pos.left-=this.option.entityAnchor.pos().left+this.option.entityAnchor.width()/2;
                        pos.top-=this.option.entityAnchor.pos().top+this.option.entityAnchor.height()/2;
                    }
                    this.entity.style("top",pos.top);
                    this.entity.style("left",pos.left);
                }else{
                }
            }
            //如果可以点击外部关闭，则绑定事件
            if(this.option.hideOnClickOut){
                var self=this;
                setTimeout(function(){
                    self.entity.click(self.hide,{scope:self,out:true});
                },10);
            }
        },
        hide:function(e){
            if(this.entity.hasClass(this.option.hiddenClass))
                return;
            this.anchor.removeClass(this.option.anchorActiveClass);
            this.entity.addClass(this.option.hiddenClass);
            
            if(this.option.hideOnClickOut){
                this.entity.off("click",this.hide);
            }
        }
    });
    return Layer;
})