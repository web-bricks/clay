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
    "webbricks.clay.ctrl.Expose",
    "webbricks.clay.anim.Base"
],function($,KolaClass,KolaObject,D,Browser,Expose,Anim){

    D.createInlineCss('.coverlay{position:absolute;}.warp{position:fixed;left:0;top:0;}');

    var Overlay=KolaClass.create({
        /**
            overlay:被作为层显示的dom
            option
                .anchor:遮罩被放在哪里
                .expose：expose的option
        */
        _init:function(overlay,option){            
            var _this=this;
            _this.overlay=$(overlay);
            _this.option=KolaObject.extend({
                anchor:document.body,
                closeOnClickOut:false,
                expose:{
                    scrollEle:document,
                    color:"white",
                    opacity:0.8
                }
            },option||{});
            _this.option.anchor=$(_this.option.anchor);
            _this.index=Overlay.count++;
            _this.option.expose=KolaObject.extend({
                anchor:_this.option.anchor
            },this.option.expose);
            
            _this.overlay.addClass("coverlay");
            
            _this.warp=$("<div></div>").addClass("warp hidden");
            $(window).on("resize",refresh,{scope:this});
            _this.warp.append(this.overlay);
            refresh.call(this);
            
            _this.option.anchor.append(_this.warp);
            
            _this.expose=new Expose(_this.warp,_this.option.expose);
            if(_this.option.closeOnClickOut){
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
            Anim.slideIn(this.warp);
            //居中
            var w=this.overlay.width();
            var h=this.overlay.height();

            var cl=Math.floor((document.documentElement.clientWidth-w)/2);
            var ct=Math.floor((document.documentElement.clientHeight-h)/2);
            if(ct<0)
                ct=0;
            this.overlay.style("left",cl);
            this.overlay.style("top",ct);
           
            if(this.option.full){
                $("body").style("overflow","hidden");//other
                $("html").style("overflow","hidden");//ie
                $("body").style("padding-right","16px");
                if(Browser.IE6){
                    this.warp.style("position","absolute").style("top",D.scroll().top);
                }
                this.warp.style("overflow-y","scroll");
            }
            refresh.call(this);
        },
        /**
            隐藏层
        */
        hide:function(){
            if(this.option.full){
                $("body").removeStyle("overflow","hidden");
                $("html").removeStyle("overflow","hidden");
                $("body").removeStyle("padding-right");
            }
            this.expose.hide();
            Anim.slideOut(this.warp);
        }
    });
    Overlay.topLayer=1000;
    return Overlay;
})
function refresh(){
    this.warp.style("width",document.documentElement.clientWidth);
    this.warp.style("height",document.documentElement.clientHeight);
}