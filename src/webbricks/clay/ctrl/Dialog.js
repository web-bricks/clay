kola("webbricks.clay.ctrl.Dialog",[
    "kola.lang.Object",
    "kola.lang.Class",
    "kola.html.Element",
    "kola.event.Dispatcher",
    "webbricks.clay.ctrl.Overlay"
],function(KolaObject, KolaClass, $, Dispatcher, Overlay) {
    var shell='<div  class="mw">'
                +'<a href="javascript:void(0);" class="clay_close close" title="关闭"><i>关闭</i></a>'
                +'<div class="clay_title mwHd"><h4>标题</h4></div>'
                +'<div class="clay_content mwBd"></div>'
                +'<div class="clay_tool mwFt"><span class="clay_confirm btn"></span><span class="clay_cancel btn"></span></div>'
              +'</div>';

              
    var exports=KolaClass.create(Dispatcher,{
        __ME:function(type,option){
            if(type=="plain"){
                var opt=KolaObject.extend({
                    content:""
                },option||{});
            }else if(type=="confirm"){
                var opt=KolaObject.extend({
                    content:"",
                    confirmButton:"确定",
                    cancelButton:"取消"
                },option||{});
            }else if(type=="alert"){
                var opt=KolaObject.extend({
                    content:"",
                    confirmButton:"知道了"
                },option||{});
            }
            return new this(opt);
        },
        _init:function(option){            
            this.elem=$(shell);
            //tool bar
            if(option.confirmButton || option.cancelButton){
                if(option.confirmButton){
                    this.elem.find(".clay_confirm").html(option.confirmButton);
                    this.elem.find(".clay_confirm").click(function(){
                        this.close();
                        this.fire("confirm");
                    },{scope:this});
                }else{
                    this.elem.find(".clay_confirm").addClass("hidden");
                }
                if(option.cancelButton){
                    this.elem.find(".clay_cancel").html(option.cancelButton);
                    this.elem.find(".clay_cancel").click(function(){
                        this.close();
                        this.fire("cancel");
                    },{scope:this});
                }else{
                    this.elem.find(".clay_cancel").addClass("hidden");
                }
            }else{
                this.elem.find(".clay_tool").addClass("hidden");
            }
            //close X
            this.elem.find(".clay_close").click(this.close,{scope:this});
            //title
            this.elem.find(".clay_title").html(option.title);
            //content
            this.elem.find(".clay_content").html(option.content);
            this.overlay=new Overlay(this.elem);
        },
        show:function(){
            this.overlay.show();
            this.fire("show");
        },
        close:function(){
            this.overlay.close();
            this.fire("close");
        }
    });
    return exports;
});