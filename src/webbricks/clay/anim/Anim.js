kola("kola.base.Anim",
    "kola.html.Element,kola.lang.Object",
function(K,O){
    function doAnim(){
        this.count+=10;
        if(this.count>=this.options.dur){
            clearIntervavl(this.inter);
            this.options.callBack(this.options.callBackScope);
        }
        for(var key in trans){
            this.startStyle[key]=this.elem.style(key);
        }
    }
    var Anim=C.create({
        _init:function(elem,trans,options){
            this.options=O.extend({
                dur:1000,
                callBack:function(){},
                callBackScope:null
            },options||{});
            this.elem=K(elem);
            this.trans=this.trans;
            this.count=0;
            this.startStyle={};
            this.inter=setIntervavl(function(){doAnim.call(this)},10);
            for(var key in trans){
                this.startStyle[key]=this.elem.style(key);
            }
        }
    });
})