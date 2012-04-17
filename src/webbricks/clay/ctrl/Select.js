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
            this.bar=CptUtil.getDom(option.bar,anchor);
            if(option.name){
                this.agent=K('<input type="hidden" name="'+option.name+'">');
                this.anchor.append(this.agent);
            }
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

            this.list.click(select,{scope:this});                           
        },                                                                  
        selectByIndex:function(index){                                      
            this.listCtrl.select(index);                                    
            this.selectedValue=this.listCtrl.select().find(".value").html();
            if(this.bar.is("input"))                                        
                this.bar[0].value=this.selectedValue;                       
            else                                                            
                this.bar.html(this.selectedValue);
            if(this.agent){
                this.agent[0].value=this.selectedValue;
            }
        },
        selectedIndex:function(){
            return this.listCtrl.selectedIndex();
        },
        selectedValue:function(){
            this.listCtrl.select().find(".value").html();
        }
    });
    function select(e){
        var selectedIndex=this.listCtrl.selectedIndex();
        this.selectByIndex(selectedIndex);
        this.layer.hide();
    }
    return exports;
});