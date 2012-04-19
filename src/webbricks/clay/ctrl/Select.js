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
            this.entity=CptUtil.getDom(option.entity,anchor);
            if(option.list)
                this.list=this.entity.find(option.list);
            else
                this.list=this.entity
            this.bar=CptUtil.getDom(option.bar,anchor);
            this.agent=this.anchor.find("input");
            this.listCtrl=new Single(this.entity,{
                item:option.item||"li",                                     
                trigger:"mouseover",                                        
                selectedClass:"hover"                                       
            });                                                             

            this.layer=new Layer(anchor,{                                   
                entity:this.entity,                                           
                trigger:"click",                                            
                hideOnClickOut:true,
                anchorActiveClass:"Selector-active"                
            });                                                             

            this.list.click(select,{scope:this});                           
        },                                                                  
        selectByIndex:function(index){                                      
            this.listCtrl.select(index);                                    
            this.selectedValue=this.listCtrl.select().find(".value").html();
            this.selectedContent=this.listCtrl.select().find(".content").html();
            if(!this.selectedContent)
                this.selectedContent=this.selectedValue
            if(this.bar.is("input"))                                        
                this.bar[0].value=this.selectedContent;                       
            else                                                            
                this.bar.html(this.selectedContent);
            if(this.agent.length){
                this.agent[0].value=this.selectedValue;
                this.agent.fire("focus");
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
        var _this=this;
        setTimeout(function(){
            _this.layer.hide();
        });
    }
    return exports;
});