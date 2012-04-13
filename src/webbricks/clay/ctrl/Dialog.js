kola("webbricks.clay.ctrl.Dialog",[
    "kola.lang.Object",
    "kola.lang.Class",
    "kola.html.Element",
    "kola.event.Dispatcher",
    "webbricks.clay.ctrl.Overlay"
],function(KolaObject, KolaClass, $, Dispatcher, Overlay) {
    var shell='<div>'
                +'<a href="javascript:void(0);" class="clay_close" title="关闭"><i>×</i></a>'
                +'<div class="clay_title"></div>'
                +'<div class="clay_content"></div>'
                +'<div class="clay_tool"><span class="clay_confirm"></span><span class="clay_cancel"></span></div>'
              +'</div>';

    var exports=KolaClass.create(Dispatcher,{
        _init:function(type,option){
            if(type=="plain"){
                this.option=KolaObject.extend({
                    content:"",
                },option||{});
            }else if(type=="confirm"){
                this.option=KolaObject.extend({
                    content:"",
                    confirmButton:"确定",
                    cancelButton:"取消"
                },option||{});
            }else if(type=="alert"){
                this.option=KolaObject.extend({
                    content:"",
                    confirmButton:"知道了",
                },option||{});
            }
            this.elem=$(shell);
            //tool bar
            if(this.option.confirmButton || this.option.cancelButton){
                if(this.option.confirmButton){
                    this.elem.find(".clay_confirm").html(this.option.confirmButton);
                    this.elem.find(".clay_confirm").click(function(){
                        this.close();
                        this.fire("confirm");
                    },{scope:this});
                }else{
                    this.elem.find(".clay_confirm").addClass("noDis");
                }
                if(this.option.cancelButton){
                    this.elem.find(".clay_cancel").html(this.option.cancelButton);
                    this.elem.find(".clay_cancel").click(function(){
                        this.close();
                        this.fire("cancel");
                    },{scope:this});
                }else{
                    this.elem.find(".clay_cancel").addClass("noDis");
                }
            }else{
                this.elem.find(".clay_tool").addClass("noDis");
            }
            //close X
            this.elem.find(".clay_close").click(this.close,{scope:this});
            //title
            this.elem.find(".clay_title").html(this.option.title);
            //content
            this.elem.find(".clay_content").html(this.option.content);
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