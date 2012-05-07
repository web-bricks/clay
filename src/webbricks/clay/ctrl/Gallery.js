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
    "webbricks.clay.cpt.CptUtil",
    "kola.event.Dispatcher",
    "webbricks.clay.anim.Base"
],function(KolaClass, KolaObject, $,  CptUtil, Dispatcher,Anim){

    var exports=KolaClass.create(Dispatcher,{
        _init:function(anchor,option){
            var _this=this;
            this.anchor=anchor;
            this.content=CptUtil.getDom(option.content,anchor);
            this.left=CptUtil.getDom(option.left,anchor);
            this.right=CptUtil.getDom(option.right,anchor);
            
            this.innerWidth=this.content.find("li");
            this.itemWidth=$(this.innerWidth[0]).outerWidth();
            if(this.innerWidth.length)
                this.innerWidth=this.innerWidth.length*this.itemWidth;
            else
                this.innerWidth=0;
            this.content.width(this.innerWidth);
            
            this.lineWidth=Math.floor(this.anchor.width()/this.itemWidth)*this.itemWidth;
            
            this.left.click(adjustMargin,{scope:this,data:-1});
            this.right.click(adjustMargin,{scope:this,data:1});
        }
    });
    function adjustMargin(e){
        var marginNow=parseInt(this.content.style("margin-left"));
        marginNow-=this.lineWidth*e.data;
        if(this.anchor.width()-this.innerWidth>marginNow)
            marginNow=this.anchor.width()-this.innerWidth;
        if(marginNow>0)
            marginNow=0;
        new Anim(this.content,{
            trans:{"margin-left":marginNow}
        });
    }
    return exports;
});