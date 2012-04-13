kola("webbricks.clay.ctrl.Menu",
    ["kola.html.Element","kola.lang.Class","kola.lang.Object","webbricks.clay.ctrl.Layer","webbricks.clay.cpt.CptUtil"],
function(K,C,O,Layer,CptUtil){
    /**
        option
            item
            content
        
    */
    var Menu=function(elem,option){
        this.opt=O.extend({
            
        },option||{});
        this.elem=K(elem);
        var itemElem=this.elem.find(this.opt.item);
        this.items=[];
        for(var i=0,il=itemElem.length;i<il;i++){
            var layer=new Layer(itemElem[i],{entity:this.opt.content});
            this.items[i]=layer;
            layer.menu=this;
            layer.anchor.on("click",itemClick);
        }
        this.elem.data("clay-Menu",this);
    }
    C.buildProto(Menu,{
        closeAll:function(){
            for(var i=0,il=this.items.length;i<il;i++){
                this.items[i].close();
            }
        },
        active:function(){
            var _this=this;
            if(this.actived)
                return;
            this.actived=true;
            for(var i=0,il=this.items.length;i<il;i++){
                this.items[i].anchor.on("click",itemHover);
            }
            K(document).on("click",function(e){
                if(_this.elem.contains(e.target))
                    return;
                _this.actived=false;
                for(var i=0,il=_this.items.length;i<il;i++){
                    _this.items[i].anchor.off("click",itemHover);
                };                
                K(document).off("click",arguments.callee);
                _this.closeAll();
            });
        }
    });
    function itemClick(e){
        var elem=K(this);
        var layer=elem.data("clay-Layer");
        layer.show();
        layer.menu.active();
    }
    function itemHover(e){
        var elem=K(this);
        var layer=elem.data("clay-Layer");
        layer.menu.closeAll();
        layer.show();
    }
    return Menu;
})