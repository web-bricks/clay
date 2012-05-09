/**
    层组件
    @author guanyuxin
*/
kola("webbricks.clay.ctrl.Tip",[
    "kola.html.Element",
    "kola.lang.Class",
    "kola.lang.Object",
    "kola.bom.Browser",
    "webbricks.clay.anim.Base"
],function($,KolaClass,KolaObject,Browser,Anim){
    var exports=KolaClass.create({
        /**
            overlay:被作为层显示的dom
            option
                .anchor:遮罩被放在哪里
                .expose：expose的option
        */
        _init:function(overlay,option){            
            var _this=this;
            _this.overlay=$(overlay).style("position","absolute").style("z-index","1000");
            _this.option=KolaObject.extend({
                anchor:document.body
            },option||{});
            _this.option.anchor=$(_this.option.anchor);

            var pos=option.mm.pagePos();
            _this.overlay.style("top",pos.top);
            _this.overlay.style("left",pos.left);
            _this.option.anchor.append(_this.overlay);
            new Anim(_this.overlay,{
                dur:1000,
                trans:{
                    top:pos.top-100,
                    opacity:0
                },
                succ:function(){
                    this.overlay.remove();
                }
            });
        }
    });
    return exports;
})
/*
kola(["kola.html.Element","webbricks.clay.ctrl.Tip"],function($,tip){
    $(".num").each(function(ele){
        ele.click(function(){
            new tip("<div>+1+1+1</div>",{mm:ele})
        });
    });
});
*/