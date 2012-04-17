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
kola("webbricks.clay.ctrl.Layer",
    ["kola.lang.Class","kola.lang.Object","webbricks.clay.cpt.CptUtil"],
function(C,O,CptUtil){
    var templete={
        simpleTip:""
    };
    
    var Layer=function(anchor,option){
        var _this=this;
        _this.option=option;
        if(_this.option.trigger=="mouseenter" && !_this.option.hideLag)
            _this.option.hideLag=200;
        _this.anchorHover=false;
        _this.entityHover=false;
        
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
                //判断是否需要增加hover属性             
                if(_this.option.showLag){
                    _this.anchor.mouseenter(anchorOver,{scope:_this});
                    _this.anchor.mouseleave(anchorOut,{scope:_this});
                }
                if(_this.option.trigger=="mouseenter"){
                    _this.entity.mouseenter(entityOver,{scope:_this});
                    _this.entity.mouseleave(entityOut,{scope:_this});
                }
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
    function anchorOver(){
        this.anchorHover=true;
    }
    function anchorOut(){
        this.anchorHover=false;
    }
    function entityOver(){
        this.entityHover=true;
    }
    function entityOut(){
        this.entityHover=false;
    }
    //延时打开，定时器触法时如果鼠标不在anchor上，则取消
    function lagShow(){
        var _this=this;
        setTimeout(function(){
            if(_this.anchorHover)
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
            if(_this.anchorHover==false && _this.entityHover==false){
                _this.hide();
            }
        },_this.option.hideLag);
    }
    C.buildProto(Layer,{
        show:function(e){
            this.anchor.addClass("layer_open");
            this.entity.removeClass("noDis");
            //如果可以点击外部关闭，则绑定事件
            if(this.option.hideOnClickOut){
                var self=this;
                setTimeout(function(){
                    self.entity.click(self.hide,{scope:self,out:true});
                },0);
            }
        },
        hide:function(e){
            this.anchor.removeClass("layer_open");
            this.entity.addClass("noDis");
            
            if(this.option.hideOnClickOut){
                this.entity.off("click",this.hide);
            }
        }
    });
    return Layer;
})