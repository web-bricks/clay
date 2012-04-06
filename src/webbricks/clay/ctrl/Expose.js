/**
    �������
*/
kola("webbricks.clay.ctrl.Expose",
    ":Element,:Class,:Object,:Document",
function(K,C,O,D){
    
    D.createInlineCss('.cexpose{position:absolute;left:0;top:0;visibility:visible;}');
    
    function refresh(){
        var pageSize=D.pageSize();
        this.snow.style("width",pageSize.w);
        this.snow.style("height",pageSize.h);
    }
    var Expose=C.create({
        /**
            footPrint:��������֮�ϵ�Ԫ��
            options
                .anchor:���ֱ���������
                .scrollEle��������
                .fixed�������Ƿ���fix��λ
                .color:���ֵ���ɫ
                .opacity:���ֵ�͸����
        */
        _init:function(footPrint,options){            
            var _this=this;
            _this.footPrint=K(footPrint);
            _this.options=O.extend({
                fixed:false,
                anchor:document.body,
                scrollEle:document,
                color:"white",
                opacity:0.8
            },options);
            _this.options.anchor=K(_this.options.anchor);
            _this.refresh=function(){refresh.call(_this)}
            _this.snow=K('<div style="display:none" id="expose'+Expose.count+'"></div>');
            _this.snow.addClass("cexpose");
            _this.snow.style("background-color",_this.options.color);
            _this.index=Expose.count++;
            _this._showing=false;
            this.options.anchor.append(this.snow)
        },
        /**
            ��ʾ����
        */
        show:function(showOpt){
            showOpt=showOpt||{};
            showOpt.z=showOpt.z||1000;
            this.footPrint.style("z-index",showOpt.z+1);
            
            this._showing=true;
            var p=this.options;
            this.snow.style("display","block");
            this.snow.style("visibility","visible");
            
            if(!p.fixed)
                K(p.scrollEle).on("scroll",this.refresh);
            if(window.addEventListener)
                window.addEventListener("resize",this.refresh);
            else
                window.attachEvent("onresize",this.refresh);
            this.snow.style("z-index",showOpt.z);
            this.snow.style("opacity",p.opacity);
            refresh.call(this);
        },
        /**
            �ر�����
        */
        close:function(){
            this._showing=false;
            var p=this.options;
            if(!p.fixed)
                K(p.scrollEle).un("scroll",this.refresh);
            if(window.addEventListener)
                window.removeEventListener("resize",this.refresh);
            else
                window.detachEvent("onresize",this.refresh);
            this.snow.style("display","none");
        }
    });
    Expose.count=0;
    return Expose;

})