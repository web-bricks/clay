kola("webbricks.clay.ctrl.Input",[
    "kola.html.Element",
    "kola.lang.Class",
    "kola.lang.Object",
    "kola.event.Dispatcher",
    "kola.bom.Browser",
    "kola.bom.Selection"
],function($,KolaClass,KolaObject,Dispatcher,Browser,KolaSelection){
    /**
        option
            restrict
            onChange
    */
    
    function onpropertychange(e){
        if(this._program)
            return
        if (e.propertyName == "value"){
            onInput.call(this);
        }
    }
    function onInput(){
        if(this.value==this.entity.val())
            return;
        this.value=this.entity.val();
        this.fire("change",{value:this.value});
        
        //autosize
        var dom=this.entity[0];
        dom.style.height=null;
        var px = dom.scrollHeight;
        if(px>80)
            px=80;
        dom.style.height = px+"px";
    }
    function onkeyup(e){
        if(e.ctrlKey && e.keyCode==13){
            if(this.option.ctrlEnter)
                this.option.ctrlEnter();
        }
    }
    var exports=KolaClass.create(Dispatcher,{
        _init:function(entity,option){
            this.entity=entity;
            this.option=KolaObject.extend({
            },option);
            this.value=entity.val();
            entity.data("input",this);
            if(Browser.IEStyle){
                entity.attachEvent("onpropertychange",function(){
                    onpropertychange.call(this,window.event);
                });
            }else{
                entity.on("input",onInput,{scope:this});
            }
            if(this.option.ctrlEnter){
                entity.on("keyup",onkeyup,{scope:this});
            }
        },
        val:function(value){
            if(KolaObject.isUndefined(value)){
                return this.entity.val();
            }else{
                if(Browser.IEStyle){
                    this._program=true;
                    this._program=false;
                }else{
                    this.entity.val(value);
                }
            }
        },
        select:function(start,end){
            KolaSelection.select(this.entity,start,end);
        }
    })
    return exports;
})