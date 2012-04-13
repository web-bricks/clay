/**
    anchor
    option
        entity
        item
    selectedIndex
    selectedValue
*/
kola("webbricks.clay.ctrl.Select",[
    "kola.lang.Class",
    "kola.lang.Object",
    "kola.html.Element",
    "webbricks.clay.ctrl.Layer",
    "webbricks.clay.cpt.CptUtil",
    "webbricks.clay.ctrl.SingleSelect"
],function(KolaClass, KolaObject, $, Layer, CptUtil, Single){

    var exports=KolaClass.create({
        _init:function(anchor,option){
            var _this=this;
            this.anchor=anchor;
            this.list=CptUtil.getDom(option.entity,anchor);
            
            this.listCtrl=new Single(this.list,{
                item:option.item||"li",
                trigger:"mouseover",
                selectedClass:"hover"
            });
            
            this.layer=new Layer(anchor,{
                entity:this.list,
                trigger:"click",
                hideOnClickOut:true
            });
            
            this.list.click(function(e){
                this.selectedIndex=this.listCtrl.selectedIndex();
                this.selectedValue=this.listCtrl.select().find("p").html();
                this.anchor[0].value=this.selectedValue;
                this.layer.hide();
            },{scope:this});
        }
    });
    return exports;
});