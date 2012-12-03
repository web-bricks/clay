kola("webbricks.clay.anim.Base",[
    "kola.html.Element",
    "kola.lang.Class",
    "kola.lang.Object",
    "kola.bom.Browser"
],function($, KolaClass, KolaObject, Browser){
    var noPx={
		"zIndex": true,
		"fontWeight": true,
		"opacity": true,
		"zoom": true,
		"lineHeight": true
	};
    function doAnim(){
        this.count+=16;
        for(var key in this.trans){
            var value=this.startStyle[key]+(this.trans[key]-this.startStyle[key])*this.count/this.options.dur;
            var st = this.element.style;
            if (key == 'opacity') {
                if (Browser.IEStyle) {
                    st.filter = 'Alpha(Opacity=' + value*100 + ')'; 
                } else {
                    st.opacity = (value == 1 ? '': '' + value);
                }
            } else {
                if(!noPx[key])
                    value=value+"px";
                st[key] = value;
            }
        }
        if(this.count>=this.options.dur){
            clearInterval(this.inter);
            this.options.callback(this.options.callbackScope);
            this.options=null;
        }
    }
    var Anim=KolaClass({
        _init:function(elem,options){
            var _this=this;
            this.options=KolaObject.extend({
                dur:100,
                callback:function(){},
                callbackScope:null
            },options||{});
            this.elem=$(elem);
            this.element=elem[0];
            this.trans=this.options.trans;
            this.count=0;
            this.startStyle={};
            this.inter=setInterval(function(){doAnim.call(_this)},10);
            for(var key in this.trans){
                this.startStyle[key]=parseFloat(this.elem.style(key));
            }
        }
    });
    Anim.fadeIn=function(elem,option){
        elem.removeClass(option.hiddenClass||"hidden");
        var currentOpacity=elem.style("opacity");
        elem.style("opacity",0);
        
        new Anim(elem,{
            trans:{opacity:currentOpacity},
            dur:option.dur||100,
            callback:function(){
                if(option.callback)
                    option.callback.call(option.callbackScope);
            }
        });
    }
    Anim.fadeOut=function(elem,option){
        new Anim(elem,{
            trans:{opacity:0},
            dur:option.dur||100,
            callback:function(){
                elem.addClass(option.hiddenClass||"hidden");
                elem.removeStyle("opacity");
                if(option.callback)
                    option.callback.call(option.callbackScope);
            }
        });
    }
    Anim.slideIn=function(elem,option){
        elem.removeClass(option.hiddenClass||"hidden");
        var leftBack=elem.style("top");
        var nowLeft=elem.pos().top;
        elem.style("top",-elem.outerHeight());
        new Anim(elem,{
            trans:{top:nowLeft},
            dur:option.dur||100,
            callback:function(){
                elem.style("top",leftBack);
                if(option.callback)
                    option.callback.call(option.callbackScope);
            }
        });
    }
    Anim.slideOut=function(elem,option){
        var styleStr=elem.attr("style");
        var pos=elem.pos();
        elem.style("left",pos.left);
        elem.style("top",pos.top);
        if(option.direction=="left"){
            var trans={top:-elem.width()}
        }else if(option.direction=="right"){
            var trans={top:document.documentElement.clientleft}
        }else if(option.direction=="top"){
            var trans={top:-elem.height()}
        }else{
            var trans={top:document.documentElement.clientHeight}
        }    
        new Anim(elem,{
            trans:{top:document.documentElement.clientHeight},
            dur:option.dur||100,
            callback:function(){
                elem.addClass(option.hiddenClass||"hidden");
                elem.attr("style",styleStr);
                if(option.callback)
                    option.callback.call(option.callbackScope);
            }
        });
    }
    Anim.expand=function(elem,dur,callback,callbackScope){ 
        elem.removeClass("hidden");
        var h=elem.height();
        elem.style("height",0);
        new Anim(elem,{
            trans:{height:h},
            dur:dur||100,
            callback:function(){
                elem.removeStyle("height");
                if(callback)
                    callback.call(callbackScope);
            }
        });
    }
    Anim.collapse=function(elem,dur,callback,callbackScope){
        new Anim(elem,{
            trans:{height:0},
            dur:dur||100,
            callback:function(){
                elem.removeStyle("height");
                elem.addClass("hidden");
                if(callback)
                    callback.call(callbackScope);
            }
        });
    }
    return Anim;
})