kola("webbricks.clay.anim.Base",[
    "kola.html.Element",
    "kola.lang.Class",
    "kola.lang.Object",
    "kola.bom.Browser"
],function(K,KolaClass,KolaObject,Browser){
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
            this.options.callBack(this.options.callBackScope);
            this.options=null;
        }
    }
    var Anim=KolaClass.create({
        _init:function(elem,options){
            var _this=this;
            this.options=KolaObject.extend({
                dur:100,
                callBack:function(){},
                callBackScope:null
            },options||{});
            this.elem=K(elem);
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
            callBack:function(){
                if(option.callBack)
                    option.callBack.call(option.callBackScope);
            }
        });
    }
    Anim.fadeOut=function(elem,option){
        new Anim(elem,{
            trans:{opacity:0},
            dur:option.dur||100,
            callBack:function(){
                elem.addClass(option.hiddenClass||"hidden");
                elem.removeStyle("opacity");
                if(option.callBack)
                    option.callBack.call(option.callBackScope);
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
            callBack:function(){
                elem.style("top",leftBack);
                if(option.callBack)
                    option.callBack.call(option.callBackScope);
            }
        });
    }
    Anim.slideOut=function(elem,option){ 
        var leftBack=elem.style("left");
        var nowLeft=elem.pos().left;
        elem.style("left",nowLeft);
        new Anim(elem,{
            trans:{top:document.documentElement.clientHeight},
            dur:option.dur||100,
            callBack:function(){
                elem.addClass(option.hiddenClass||"hidden");
                elem.style("left",leftBack);
                if(option.callBack)
                    option.callBack.call(option.callBackScope);
            }
        });
    }
    Anim.expand=function(elem,dur,callBack,callBackScope){ 
        elem.removeClass("hidden");
        var h=elem.height();
        elem.style("height",0);
        new Anim(elem,{
            trans:{height:h},
            dur:dur||100,
            callBack:function(){
                elem.removeStyle("height");
                if(callBack)
                    callBack.call(callBackScope);
            }
        });
    }
    Anim.collapse=function(elem,dur,callBack,callBackScope){
        new Anim(elem,{
            trans:{height:0},
            dur:dur||100,
            callBack:function(){
                elem.removeStyle("height");
                elem.addClass("hidden");
                if(callBack)
                    callBack.call(callBackScope);
            }
        });
    }
    return Anim;
})