/**
 * @author guanyuxin
 * @date 2011.10.26
 * @des 使得某元素的子元素可以通过拖动排序
*/
kola("webbricks.clay.interact.Sortable",[
    "kola.html.Element",
    "kola.lang.Object",
    "webbricks.clay.interact.Draggable"
],function($,KolaObject,Draggable){
    var Sortable=function(ele,opt){
        var self=this;
        var lastDest=null;
        if(ele.data("sortable"))
            return;
        ele.data("sortable",this);
        opt=KolaObject.extend({
            pickable:"",
            escape : 0,
            darggableOpt:{},
            placeholder:"blank" //必须有一个名字
        },opt||{});
        
        opt.darggableOpt=KolaObject.extend({
            draggingClass:"dragging" //必须有一个名字
        },opt.darggableOpt);
        
        //禁止选择，并防止拖动时出发滚动条滚动
        ele.mousedown(function( evt ) {
            var handleSelect = opt.darggableOpt.handle || "";
            var isClkHandle  = $(evt.target).closest(handleSelect).length != 0;
          
            if(isClkHandle){
              evt.preventDefault();
            }  
        });
        
        ele.children(opt.pickable).each(function(e){
            new Draggable(e,opt.darggableOpt);
        });
        ele.data("draggable",this);
        this.add=function(e){
            new Draggable(e,opt.darggableOpt);
        }
        function initGird(){
            var first=$(ele.children()[0]);
            if(!first) return;

            //格子大小，现在假定格子大小都一样(margin不完善)
            var ml=parseInt(first.style("margin-left"));
            var mr=parseInt(first.style("margin-right"));
            var mu=parseInt(first.style("margin-top"));
            var md=parseInt(first.style("margin-bottom"));

            self.girdWidth=first.width();
            self.girdHeight=first.height();

            if(ml<=0 && mr<=0)
                self.girdWidth+=(ml<mr)?ml:mr;
            else if(ml>=0 && mr>=0)
                self.girdWidth+=(ml>mr)?ml:mr;
            else
                self.girdWidth+=ml+mr;

            if(mu<=0 && md<=0)
                self.girdHeight+=(mu<md)?mu:md;
            else if(mu>=0 && md>=0)
                self.girdHeight+=(mu>md)?mu:md;
            else
                self.girdHeight+=mu+md;
            //计算出来的列数
            if(first.style("display")!="block")
                self.columCount=Math.floor(ele.width()/self.girdWidth);
            else
                self.columCount=1;

            //复制一个占位符，tag和第一个子元素一样
            self.placeholder=$(document.createElement(first[0].tagName)).addClass(opt.placeholder);
            console.log(self.placeholder)
        }

        //拿起一个子元素的时候用占位符填充原来的区域
        Draggable.on("beforeDrag",function(evt){
            initGird();
            Draggable.off("beforeDrag");
        })
        Draggable.on("afterDrag",function(evt){
            ele[0].insertBefore(self.placeholder[0],evt.elem.next()[0]);
        });
        //移动的时候找到对应的格子
        Draggable.on("dragging",function(evt){
            
            var childrenStatic=ele.children(":not(."+opt.darggableOpt.draggingClass+")")
            
            var pos=evt.elem.pos();
            var posStatic=$(childrenStatic[0]).pos();
            childrenStatic.not(self.placeholder);
            
            x=pos.left-posStatic.left;
            y=pos.top-posStatic.top;
            
            x=Math.round(x/self.girdWidth);
            y=Math.round(y/self.girdHeight);
            
            if(x<0) x=0;
            if(x>=self.columCount)  x=self.columCount-1;
            if(y<0) y=0;
            if(y>Math.ceil(childrenStatic.length/self.columCount)-1) y=Math.ceil(childrenStatic.length/self.columCount)-1;

            count=y*self.columCount+x;
            
            if(count>=childrenStatic.length - opt.escape){
              var dest=childrenStatic[childrenStatic.length- 1 - opt.escape];
            }else{
              var dest=childrenStatic[count];
            }
            
            if(dest!=lastDest)
            {
                lastDest=dest;
                //ele.trigger("change");
                ele[0].insertBefore(self.placeholder[0],dest);
            }
        })
        //放下的时候用该元素替换占位符
        Draggable.on("afterDrop",function(evt){
            ele[0].replaceChild(evt.elem[0],self.placeholder[0]);
            evt.elem.removeStyle("position");
            evt.elem.removeStyle("left");
            evt.elem.removeStyle("top");
        })
    }
    return Sortable;
});
