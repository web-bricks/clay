/**
    遮罩组件
*/
kola("webbricks.clay.ctrl.Expose",[
    "kola.html.Element",
    "kola.lang.Class",
    "kola.lang.Object",
    "kola.html.Document",
    "webbricks.clay.anim.Base"
],function($,C,O,D,Anim){
    
    D.createInlineCss('.cexpose{position:absolute;left:0;top:0;visibility:visible;}');
    
    function refresh(){
        var pageSize=D.pageSize();
        this.snow.style("width",pageSize.w);
        this.snow.style("height",pageSize.h);
    }
    var Expose=C.create({
        /**
            footPrint:放在遮罩之上的元素
            options
                .anchor:遮罩被放在哪里
                .scrollEle：滚动条
                .fixed：遮罩是否是fix定位
                .color:遮罩的颜色
                .opacity:遮罩的透明度
        */
        _init:function(footPrint,options){            
            var _this=this;
            _this.footPrint=$(footPrint);
            _this.options=O.extend({
                fixed:false,
                anchor:document.body,
                scrollEle:document,
                color:"white",
                opacity:0.5
            },options);
            _this.options.anchor=$(_this.options.anchor);
            _this.snow=$('<div class="hidden" id="expose'+Expose.count+'"></div>');
            _this.snow.addClass("cexpose");
            _this.snow.style("background-color",_this.options.color);
            _this.index=Expose.count++;
            _this._showing=false;
            this.options.anchor.append(this.snow)
        },
        /**
            显示遮罩
        */
        show:function(showOpt){
            showOpt=showOpt||{};
            showOpt.z=showOpt.z||1000;
            this.footPrint.style("z-index",showOpt.z+1);
            
            this._showing=true;
            var p=this.options;
            this.snow.style("opacity",p.opacity);
            Anim.fadeIn(this.snow);
            
            if(!p.fixed)
                $(p.scrollEle).on("scroll",refresh,{scope:this});
            $(window).on("resize",refresh,{scope:this});
            this.snow.style("z-index",showOpt.z);
            
            refresh.call(this);
        },
        /**
            关闭遮罩
        */
        hide:function(){
            this._showing=false;
            var p=this.options;
            if(!p.fixed)
                $(p.scrollEle).off("scroll",refresh);
            $(window).off("resize",refresh);
            Anim.fadeOut(this.snow);
        }
    });
    Expose.count=0;
    return Expose;

})