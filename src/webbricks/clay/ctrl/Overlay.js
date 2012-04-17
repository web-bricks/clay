/**
    层组件
    @author guanyuxin
*/
kola("webbricks.clay.ctrl.Overlay",
    "kola.html.Element,kola.lang.Class,kola.lang.Object,kola.html.Document,webbricks.clay.ctrl.Expose",
function(K,C,O,D,Expose){

    D.createInlineCss('.coverlay{position:relative;}.warp{position:fixed;left:0;top:0;overflow-y:scroll;}');

    var Overlay=C.create({
        /**
            overlay:被作为层显示的dom
            options
                .anchor:遮罩被放在哪里
                .expose：expose的option
        */
        _init:function(overlay,options){            
            var _this=this;
            options=options||{};
            _this.overlay=K(overlay);
            _this.options=O.extend({
                anchor:document.body,
                expose:{
                    scrollEle:document,
                    color:"white",
                    opacity:0.8
                }
            },options);
            _this.options.anchor=K(_this.options.anchor);
            _this.index=Overlay.count++;
            _this.options.expose=O.extend({
                anchor:_this.options.anchor
            },options.expose);
            
            _this.overlay.style("display","none").addClass("coverlay");
            
            _this.warp=K("<div></div>").addClass("warp");
            _this.refresh=function(){refresh.call(_this)};
            if(window.addEventListener)
                window.addEventListener("resize",this.refresh);
            else
                window.attachEvent("onresize",this.refresh);
            _this.warp.append(this.overlay);
            this.refresh();
            
            _this.options.anchor.append(_this.warp);
            
            _this.expose=new Expose(_this.warp,_this.options.expose);
            
            
        },
        /**
            显示层
        */
        show:function(){
            this.expose.show({z:Overlay.topLayer++});
            this.overlay.style("display","block");
            //居中
            var w=this.overlay.width();
            var h=this.overlay.height();

            var cl=Math.floor((document.documentElement.clientWidth-w)/2);
            var ct=Math.floor((document.documentElement.clientHeight-h)/2);
            if(ct<0)
                ct=0;
            this.overlay.style("left",cl);
            this.overlay.style("top",ct);
            
            K("body").style("overflow","hidden");//other
            K("html").style("overflow","hidden");//ie
            if(B.isIE6){
                this.warp.style("position","absolute").style("top",D.scroll().top);
            }
            this.refresh();
        },
        /**
            隐藏层
        */
        close:function(){
            K("body").removeStyle("overflow","hidden");
            K("html").removeStyle("overflow","hidden");
            
            this.expose.close();
            this.overlay.style("display","none");
        }
    });
    Overlay.topLayer=1000;
    return Overlay;
})
function refresh(){
    this.warp.style("width",document.documentElement.clientWidth);
    this.warp.style("height",document.documentElement.clientHeight);
}