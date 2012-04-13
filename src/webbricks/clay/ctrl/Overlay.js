/**
    层组件
    @author guanyuxin
*/
kola("webbricks.clay.ctrl.Overlay",
    "kola.html.Element,kola.lang.Class,kola.lang.Object,kola.html.Document,webbricks.clay.ctrl.Expose",
function(K,C,O,D,Expose){

    D.createInlineCss('.coverlay{position:absolute;}');

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
            _this.options.anchor.append(_this.overlay);
            _this.overlay.style("display","none");
            _this.expose=new Expose(_this.overlay,_this.options.expose);
            _this.overlay.addClass("coverlay");
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
            if(!this.options.fixed)
                var scroll=D.scroll();
            else
                var scroll={top:0,left:0};
            this.overlay.style("left",Math.floor(scroll.left+(document.documentElement.clientWidth-w)/2));
            this.overlay.style("top",Math.floor(scroll.top+(document.documentElement.clientHeight-h)/2));
        },
        /**
            隐藏层
        */
        close:function(){
            this.expose.close();
            this.overlay.style("display","none");
        }
    });
    Overlay.topLayer=1000;
    return Overlay;
})