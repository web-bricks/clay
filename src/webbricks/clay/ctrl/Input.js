kola("webbricks.clay.ctrl.Input",[
    "kola.html.Element",
    "kola.lang.Class",
    "kola.lang.Object",
    "kola.event.Dispatcher",
    "kola.bom.Browser"
],function($,KolaClass,KolaObject,Dispatcher,Browser){
    /**
        option
            restrict
            onChange
    */
    
    function onpropertychange(e){
        if(this._program)
            return
        if (e.propertyName == "value"){
            this.onInput();
        }
    }
    
    var exports=KolaClass.create({
        _init:function(entity,option){
            this.option=KolaObject.extend({
                ctrlEnter
            },option);
            this.value=entity.val();
            entity.data("Input",this);
            if(Browser.IEStyle){
                entity.attachEvent("onpropertychange",function(){
                    onpropertychange.call(this,window.event);
                });
            }else{
                entity.on("input",this.onInput,{scope:this});
            }
        },
        onInput:function(){
            if(this.value==entity.val())
                return;
            this.value=entity.val();
        },
        val(value):function(){
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
        onkeyup:function(e){
            if(e.ctrlkey && e.keycode==32){
                //....
            }
        }
    })
    return exports;
})