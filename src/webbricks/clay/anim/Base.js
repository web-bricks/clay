kola("webbricks.clay.anim.Base",[
    "kola.html.Element",
    "kola.lang.Class",
    "kola.lang.Object"
],function(K,KolaClass,KolaObject){
    function doAnim(){
        this.count+=10;
        for(var key in this.trans){
            this.elem.style(key,this.startStyle[key]+(this.trans[key]-this.startStyle[key])*this.count/this.options.dur);
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
            this.trans=this.options.trans;
            this.count=0;
            this.startStyle={};
            this.inter=setInterval(function(){doAnim.call(_this)},10);
            for(var key in this.trans){
                this.startStyle[key]=parseFloat(this.elem.style(key));
            }
        }
    });
    Anim.fadeIn=function(elem,dur,callBack,callBackScope){
        elem.removeClass("hidden");
        var currentOpacity=elem.style("opacity");
        elem.style("opacity",0);
        
        new Anim(elem,{
            trans:{opacity:currentOpacity},
            dur:dur||100,
            callBack:function(){
                if(callBack)
                    callBack.call(callBackScope);
            }
        });
    }
    Anim.fadeOut=function(elem,dur,callBack,callBackScope){
        new Anim(elem,{
            trans:{opacity:0},
            dur:dur||100,
            callBack:function(){
                elem.addClass("hidden");
                elem.removeStyle("opacity");
                if(callBack)
                    callBack.call(callBackScope);
            }
        });
    }
    Anim.slideIn=function(elem,dur,callBack,callBackScope){
        elem.removeClass("hidden");
        var leftBack=elem.style("left");
        var nowLeft=elem.pos().left;
        elem.style("left",-elem.outerWidth());
        new Anim(elem,{
            trans:{left:nowLeft},
            dur:dur||100,
            callBack:function(){
                elem.style("left",leftBack);
                if(callBack)
                    callBack.call(callBackScope);
            }
        });
    }
    Anim.slideOut=function(elem,dur,callBack,callBackScope){ 
        var leftBack=elem.style("left");
        var nowLeft=elem.pos().left;
        elem.style("left",nowLeft);
        new Anim(elem,{
            trans:{left:-elem.outerWidth()},
            dur:dur||100,
            callBack:function(){
                elem.addClass("hidden");
                elem.style("left",leftBack);
                if(callBack)
                    callBack.call(callBackScope);
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