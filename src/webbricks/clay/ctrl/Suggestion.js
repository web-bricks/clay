/**
    anchor
    option
        entity
        item
    selectedIndex
    selectedValue
*/
kola("webbricks.clay.ctrl.Suggestion",[
    "kola.lang.Class",
    "kola.lang.Object",
    "kola.html.Element",
    "kola.event.Dispatcher",
    "webbricks.clay.ctrl.Layer",
    "webbricks.clay.cpt.CptUtil",
    "webbricks.clay.ctrl.SingleSelect"
],function(KolaClass, KolaObject, $, Dispatcher, Layer, CptUtil, Single){

    var exports=KolaClass.create(Dispatcher, {
        _init:function(anchor,option){
            var _this=this;
            this.anchor=anchor;
            this.inputDom=this.anchor.find("input");
            this.option=option;
            this.list=CptUtil.getDom(option.entity,anchor);
            
            this.listCtrl=new Single(this.list,{
                item:option.item||"li",
                trigger:"mouseover",
                selectedClass:option.selectedClass||"hover"
            });
            
            this.layer=new Layer(anchor,{
                entity:this.list,
                hideOnClickOut:true
            });
            
            this.inputDom.keydown(keydown,{scope:this});
            this.inputDom.keyup(keyup,{scope:this});
            this.list.click(select,{scope:this});
            this.inputDom.blur(function(){setTimeout(function(){_this.layer.hide()},500)},{scope:this});
            
        }
    }); 
    function keydown(e){
        var special=true;
        if(e.keyCode==38){//up
            this.listCtrl.prev();
        }else if(e.keyCode==40){//down
            this.listCtrl.next();
        }else if(e.keyCode==13 || e.keyCode==32){//space && enter
            select.call(this);
        }else{
            special=false;
        }
        if(special){
            e.preventDefault();
        }
    }
    function keyup(e){
        if(e.keyCode!=13 && e.keyCode!=32 && e.keyCode!=38 && e.keyCode!=40){
            if(this.inputDom[0].value.length!=0){
                this.layer.show();
                this.fire({type:"change",value:this.inputDom[0].value,container:this.list});
            }
        }
    }
    function select(e){
        this.selectedIndex=this.listCtrl.selectedIndex();
        this.selectedValue=this.listCtrl.select().find(".clay_value").html();
        this.anchor[0].value=this.selectedValue;
        this.layer.hide();
    }
    return exports;
});