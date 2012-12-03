/**
 * @author guanyuxin
 * @date 2011.10.26
 * @des 使得某元素的子元素可以通过拖动排序
*/
kola("webbricks.clay.interact.Sortable",[
    "kola.html.Element",
    "kola.lang.Object",
    "webbricks.clay.interact.Draggable"
],function($, KolaObject, Draggable){
    var lastDest = null;
    var exports = function(ele, opt){
        var self = this;
        this.ele = ele;
        this.opt = KolaObject.extend({
            pickable: "*",
            escape : 0,
            darggableOpt: {
            },
            placeholderTag: "div",
            placeholder: "blank"
        },opt || {});
        this.columCount = opt.columCount;
        this.girdWidth = ele[0].clientWidth / this.columCount;
        this.girdHeight = opt.height;

        ele.find(this.opt.pickable).each(function(e){
            var draggable = new Draggable(e, self.opt.darggableOpt);
            draggable.on('afterDrag', afterDrag, {context: self});
            draggable.on('dragging', dragging, {context: self});
            draggable.on('afterDrop', afterDrop, {context: self});
        });
        this.placeholder = $(document.createElement(this.opt.placeholderTag)).css(this.opt.placeholder, true);
    }
    function afterDrag(e){
        this.draggingElem = e.target.ele;
        this.draggingElem.next().before(this.placeholder);
    };
    function dragging(e){
        var childrenStatic = this.ele.children().not(this.draggingElem);
        
        var pos = this.draggingElem.pagePosition();
        var posStatic = childrenStatic.pagePosition();
        childrenStatic.not(this.placeholder);
        
        x=pos.left-posStatic.left;
        y=pos.top-posStatic.top;
        
        x=Math.round(x/this.girdWidth);
        y=Math.round(y/this.girdHeight);
        
        if(x<0) x=0;
        if(x>=this.columCount)  x=this.columCount-1;
        if(y<0) y=0;
        if(y>Math.ceil(childrenStatic.length/this.columCount)-1) y=Math.ceil(childrenStatic.length/this.columCount)-1;

        count=y*this.columCount+x;
        
        if(count >= childrenStatic.length - this.opt.escape){
          var dest = childrenStatic[childrenStatic.length - 1 - this.opt.escape];
        }else{
          var dest = childrenStatic[count];
        }
        
        if(dest != lastDest){
            lastDest = dest;
            this.ele[0].insertBefore(this.placeholder[0],dest);
        }
    };
    function afterDrop(e){
        this.ele[0].replaceChild(this.draggingElem[0], this.placeholder[0]);
        this.draggingElem.style("position", undefined);
        this.draggingElem.style("left", undefined);
        this.draggingElem.style("top", undefined);
    };
    return exports;
});
