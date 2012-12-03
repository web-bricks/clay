/**
    层组件
    @author guanyuxin
*/
kola("webbricks.clay.ctrl.Overlay",[
    "kola.html.Element",
    "kola.lang.Class",
    "kola.lang.Object",
    "webbricks.clay.ctrl.Expose"
],function($, KolaClass, KolaObject, Expose){
    //.clay-overlay{position:fixed;left:0;top:0;}
    function refresh(){
        this.overlay.style("width",document.documentElement.clientWidth);
        this.overlay.style("height",document.documentElement.clientHeight);
    }
    var exports = KolaClass.create({
        /**
            content:被作为层显示的dom
            option
                .anchor:遮罩被放在哪里
                .expose：expose的option
        */
        _init:function(content, option){            
            var _this = this;
            _this.content = $(content);
            _this.option = KolaObject.extend({
                anchor: document.body,
                closeOnClickOut: false,
                expose: {
                    scrollEle:document,
                    color:"white",
                    opacity:0.8
                }
            }, option);
            _this.option.anchor = $(_this.option.anchor);
            _this.index = exports.count++;
            _this.option.expose = KolaObject.extend({
                anchor:_this.option.anchor
            }, this.option.expose);
            
            _this.content.style("position", "absolute");
            
            _this.overlay = $('<div class="clay-overlay" style="display:none"></div>');
            _this.overlay.append(this.content);

            refresh.call(this);
            
            _this.option.anchor.append(_this.overlay);
            
            _this.expose = new Expose(_this.overlay, _this.option.expose);
            if(_this.option.closeOnClickOut){
                _this.overlay.click(function(e){
                    if(e.target == _this.overlay[0])
                    _this.hide();
                });
            }
        },
        resetPos:function(){
            //居中
            var w=this.content.width();
            var h=this.content.height();

            var cl=Math.floor((document.documentElement.clientWidth-w)/2);
            var ct=Math.floor((document.documentElement.clientHeight-h)/2);
            if(ct<0)
                ct=0;
            new Anim(this.content,{
                trans:{
                    left:cl,
                    top:ct
                },
                dur:100
            });
        },
        /**
            显示层
        */
        show:function(){
            this.expose.show({z:exports.topLayer++});
            this.overlay.show(true).style("top", 0);
            //居中
            var w = this.content.width();
            var h = this.content.height();

            var cl = Math.floor((this.expose.mask[0].clientWidth - w) / 2);
            var ct = Math.floor((this.expose.mask[0].clientHeight - h) / 2);
            if(ct < 0)
                ct = 0;
            this.content.style("left", cl);
            this.content.style("top", ct);
            //Anim.slideIn(this.overlay);
            this.overlay.show();
            if(this.option.full){
                $("body").style("overflow", "hidden");//other
                $("html").style("overflow", "hidden");//ie
                $("body").style("padding-right", "16");
                if(Browser.IE6){
                    this.overlay.style("position", "absolute").style("top", document.body.scrollTop);
                }
                this.overlay.style("overflow-y", "scroll");
            }
            $(window).on("resize", refresh, {context: this});

            refresh.call(this);
        },
        /**
            隐藏层
        */
        hide:function(){
            if(this.option.full){
                $("body").style("overflow","");
                $("html").style("overflow","");
                $("body").style("padding-right","");
            }
            this.expose.hide();
            $(window).off("resize", refresh, {context: this});
            //Anim.slideOut(this.overlay);
            this.overlay.show(false);
        }
    });
    exports.topLayer=1000;
    return exports;
})
