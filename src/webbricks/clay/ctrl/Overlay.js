/**
    层组件
    @author guanyuxin
*/
kola("webbricks.clay.ctrl.Overlay",[
    "kola.html.Element",
    "kola.lang.Class",
    "kola.lang.Object",
    "kola.html.Document",
    "kola.bom.Browser",
    "webbricks.clay.ctrl.Expose"
],function($,KolaClass,KolaObject,D,Browser,Expose){

    D.createInlineCss('.coverlay{position:absolute;}.warp{position:fixed;left:0;top:0;overflow-y:scroll;}');

    var Overlay=KolaClass.create({
        /**
            overlay:被作为层显示的dom
            options
                .anchor:遮罩被放在哪里
                .expose：expose的option
        */
        _init:function(overlay,options){            
            var _this=this;
            _this.overlay=$(overlay);
            _this.options=KolaObject.extend({
                anchor:document.body,
                closeOnClickOut:false,
                expose:{
                    scrollEle:document,
                    color:"white",
                    opacity:0.8
                }
            },options||{});
            _this.options.anchor=$(_this.options.anchor);
            _this.index=Overlay.count++;
            _this.options.expose=KolaObject.extend({
                anchor:_this.options.anchor
            },this.options.expose);
            
            _this.overlay.addClass("coverlay");
            
            _this.warp=$("<div></div>").addClass("warp").addClass("hidden");
            $(window).on("resize",refresh,{scope:this});
            _this.warp.append(this.overlay);
            refresh.call(this);
            
            _this.options.anchor.append(_this.warp);
            
            _this.expose=new Expose(_this.warp,_this.options.expose);
            if(_this.options.closeOnClickOut){
                _this.warp.click(function(e){
                    if(e.target==_this.warp[0])
                    _this.hide();
                });
            }
        },
        /**
            显示层
        */
        show:function(){
            this.expose.show({z:Overlay.topLayer++});
            this.warp.removeClass("hidden");
            //居中
            var w=this.overlay.width();
            var h=this.overlay.height();

            var cl=Math.floor((document.documentElement.clientWidth-w)/2);
            var ct=Math.floor((document.documentElement.clientHeight-h)/2);
            if(ct<0)
                ct=0;
            this.overlay.style("left",cl);
            this.overlay.style("top",ct);
            
            $("body").style("overflow","hidden");//other
            $("html").style("overflow","hidden");//ie
            if(Browser.IE6){
                this.warp.style("position","absolute").style("top",D.scroll().top);
            }
            refresh.call(this);
        },
        /**
            隐藏层
        */
        hide:function(){
            $("body").removeStyle("overflow","hidden");
            $("html").removeStyle("overflow","hidden");
            
            this.expose.hide();
            this.warp.addClass("hidden");
        }
    });
    Overlay.topLayer=1000;
    return Overlay;
})
function refresh(){
    this.warp.style("width",document.documentElement.clientWidth);
    this.warp.style("height",document.documentElement.clientHeight);
}