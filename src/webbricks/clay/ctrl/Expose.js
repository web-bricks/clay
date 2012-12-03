/**
    遮罩组件
*/
kola("webbricks.clay.ctrl.Expose",[
    "kola.html.Element",
    "kola.lang.Class",
    "kola.lang.Object"
],function($, KolaClass, KolaObject){
    var client = document.documentElement;
    function refresh(){
        this.mask.style("width", client.clientWidth);
        this.mask.style("height", client.clientHeight);
    }
    var Expose = KolaClass.create({
        /**
            target:放在遮罩之上的元素
            option
                .anchor:遮罩被放在哪里
                .scrollEle：滚动条
                .fixed：遮罩是否是fix定位
                .color:遮罩的颜色
                .opacity:遮罩的透明度
        */
        _init:function(target, option){            
            var _this = this;
            _this.target = $(target);
            _this.option = KolaObject.extend({
                fixed: false,
                anchor: document.body,
                scrollEle: document,
                color: "white",
                opacity: 0.5
            }, option);
            _this.option.anchor = $(_this.option.anchor);
            _this.mask = $('<div class="clay-expose" id="expose'
             + Expose.count + '" style="background-color:'
             + _this.option.color + '"></div>').appendTo(this.option.anchor);
            _this.index = Expose.count++;
        },
        /**
            显示遮罩
        */
        show: function(showOpt){
            showOpt = showOpt ||{};
            showOpt.z = showOpt.z||1000;
            this.target.style("z-index",showOpt.z + 1);
            
            this.mask.style("opacity", this.option.opacity);

            //Anim.fadeIn(this.mask);
            this.mask.show(true);

            if(!this.option.fixed)
                $(this.option.scrollEle).on("scroll", refresh, {context: this});
            $(window).on("resize",refresh, {context: this});
            this.mask.style("z-index",showOpt.z);
            
            refresh.call(this);
        },
        /**
            关闭遮罩
        */
        hide:function(){
            if(!this.option.fixed)
                $(this.option.scrollEle).off("scroll", refresh);
            $(window).off("resize", refresh);
            //Anim.fadeOut(this.mask);
            this.mask.show(false);
        }
    });
    Expose.count = 0;
    return Expose;

})