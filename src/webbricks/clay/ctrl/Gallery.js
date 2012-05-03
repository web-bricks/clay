/**
    anchor
    option
        entity
        item
    selectedIndex
    selectedValue
*/
kola("webbricks.clay.ctrl.Gallery",[
    "kola.lang.Class",
    "kola.lang.Object",
    "kola.html.Element",
    "webbricks.clay.ctrl.Layer",
    "webbricks.clay.cpt.CptUtil",
    "webbricks.clay.ctrl.SingleSelect",
    "kola.event.Dispatcher"
],function(KolaClass, KolaObject, $, Layer, CptUtil, Single, Dispatcher){

    var exports=KolaClass.create(Dispatcher,{
        _init:function(anchor,option){
            var _this=this;
            this.anchor=anchor;
            this.content=CptUtil.getDom(option.content,anchor);
            this.left=CptUtil.getDom(option.left,anchor);
            this.right=CptUtil.getDom(option.right,anchor);
            
            this.left.click(adjustMargin,{scope:this})
        }
    });
    function adjustMargin(){
        var marginNow=parseInt(this.content.style("margin-left"));
        marginNow-=100;
        console.log(this.anchor.width()-this.content.width()+"  "+marginNow)
        if(this.anchor.width()-this.content.width()>marginNow)
            marginNow=this.anchor.width()-this.content.width();
        this.content.style("margin-left",marginNow);
    }
    return exports;
});