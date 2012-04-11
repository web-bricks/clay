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
        =mouseover anchor hover
        =mouseenter anchor || entity hover
    showLag
    closeLag
show
close
*/
kola("webbricks.clay.ctrl.Layer",
    ["kola.lang.Class","kola.lang.Object","webbricks.clay.cpt.CptUtil"],
function(C,O,CptUtil){
    var templete={};
    
    var Layer=function(anchor,option){
        var _this=this;
        _this.option=option;
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
                if(_this.option.showLag){
                    _this.anchor.mouseover(anchorOver,{scope:_this});
                    _this.anchor.mouseout(anchorOut,{scope:_this});
                }
                if(_this.option.trigger=="mouseenter"){
                    _this.entity.mouseover(entityOver,{scope:_this});
                    _this.entity.mouseout(entityOut,{scope:_this});
                }
                
                if(_this.option.showLag){
                    _this.anchor.mouseover(anchorOver,{scope:_this});
                }else{
                    _this.anchor.mouseover(_this.show,{scope:_this});
                }
                if(_this.option.closeLag){
                    /*
                    _this.anchor.mouseover(function(e){
                        var _this2=this;
                        this.anchorHover=true;
                        setTimeout(function(){
                            if(_this2.anchorHover)
                                _this2.show();
                        },this.option.showLag);
                        this.anchor.un("mouseover",arguments.callee);
                    },{scope:_this});
                    _this.anchor.mouseout(function(e){
                        this.anchorHover=false;
                        this.anchor.un("mouseout",arguments.callee);
                    },{scope:_this});
                    */
                }else{
                    if(_this.option.trigger == "mouseover"){
                        _this.anchor.mouseout(_this.close,{scope:_this});
                    }else if(_this.option.trigger == "mouseenter"){
                        _this.anchor.mouseout(isBothOut,{scope:_this});
                        _this.entity.mouseout(isBothOut,{scope:_this});
                        _this.anchor.mouseover(isAnyOver,{scope:_this});
                        _this.entity.mouseover(isAnyOver,{scope:_this});
                    }
                }
            }
        }
    }
    function lagStart(){
        var _this=this;
        setTimeout(function(){
            if(_this.anchorHover)
                _this.show();
        },_this.option.showLag);
        _this.anchor.un("mouseover",arguments.callee);
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
    
    function isBothOut(e){
        var _this=this;
        setTimeout(function(){
            if(_this.anchorHover==false && _this.entityHover==false){
                
                _this.close();
            }
        },200);
    }
    C.buildProto(Layer,{
        show:function(e){
            this.anchor.addClass("layer_open");
            this.entity.removeClass("noDis");
        },
        close:function(e){
            this.anchor.removeClass("layer_open");
            this.entity.addClass("noDis");
        }
    });
    return Layer;
})