kola("webbricks.clay.ctrl.Select",[
    "kola.lang.Class",
    "kola.lang.Object",
    "webbricks.clay.ctrl.Layer",
    "webbricks.clay.cpt.CptUtil",
    "webbricks.clay.ctrl.SingleSelect"
],function(KolaClass,KolaObject,Layer,CptUtil,Single){
    var Item=function(elem,value){
        this.elem=elem;
        this.value=value;
    }
    var exports=KolaClass.create({
        _init:function(anchor,option){
            var _this=this;
            this.anchor=anchor;
            this.list=CptUtil.getDom(option.entity,anchor);
            this.listCtrl=new Single(CptUtil.getDom(option.entity,anchor),{item:"li",trigger:"mouseover",selectedClass:"hover"});
            this.layer=new Layer(anchor,{entity:this.list,trigger:"click"});
            setInterval(function(){
                _this.listCtrl.next();
            },100)
            //this.list.onout("click",function(){
            //    this.layer.hide();
            //},{scope:this});
        }
    })
    return exports;
});