kola("webbricks.clay.ctrl.Dialog",[
    "kola.lang.Object",
    "kola.lang.Class",
    "kola.html.Element",
    "kola.event.Dispatcher",
    "webbricks.clay.ctrl.Overlay"
],function(KolaObject, KolaClass, $, Dispatcher, Overlay) {
    var shell='<div  class="$mw">'
                +'<a href="javascript:void(0);" class="clay_hide $close" title="关闭"></a>'
                +'<div class="clay_title $mwHd"><h4>标题</h4></div>'
                +'<div class="clay_content $mwBd"></div>'
                +'<div class="clay_tool $mwFt"><span class="clay_confirm btn"></span><span class="clay_cancel btn"></span></div>'
              +'</div>';

              
    var exports=KolaClass.create(Dispatcher,{
        __ME:function(type,option){
            if(type=="plain"){
                var opt=KolaObject.extend({
                    content:"",
                    prefix:""
                },option||{});
            }else if(type=="confirm"){
                var opt=KolaObject.extend({
                    content:"",
                    confirmButton:"确定",
                    cancelButton:"取消",
                    prefix:""
                },option||{});
            }else if(type=="alert"){
                var opt=KolaObject.extend({
                    content:"",
                    confirmButton:"知道了",
                    prefix:""
                },option||{});
            }
            return new this(opt);
        },
        _init:function(option){
            if(option.html)
                this.entity=$(option.html);
            else
                this.entity=$(shell.replace(/\$/g,option.prefix));
            //tool bar
            if(option.confirmButton || option.cancelButton){
                if(option.confirmButton){
                    this.entity.find(".clay_confirm").html(option.confirmButton);
                    this.entity.find(".clay_confirm").click(function(){
                        this.hide();
                        this.fire("confirm");
                    },{scope:this});
                }else{
                    this.entity.find(".clay_confirm").addClass("hidden");
                }
                if(option.cancelButton){
                    this.entity.find(".clay_cancel").html(option.cancelButton);
                    this.entity.find(".clay_cancel").click(function(){
                        this.hide();
                        this.fire("cancel");
                    },{scope:this});
                }else{
                    this.entity.find(".clay_cancel").addClass("hidden");
                }
            }else{
                this.entity.find(".clay_tool").addClass("hidden");
            }
            //hide X
            this.entity.find(".clay_hide").click(this.hide,{scope:this});
            //title
            this.entity.children(".clay_title").html(option.title);
            //content
            this.entity.children(".clay_content").html(option.content);
            this.overlay=new Overlay(this.entity);
        },
        /**
            @des 显示窗口
            @event show{null}
        */
        show:function(){
            this.overlay.show();
            this.fire("show");
        },
        /**
            @des 隐藏窗口
            @event hide{null}
        */
        hide:function(){
            this.overlay.hide();
            this.fire("hide");
        },
        /**
            @des 设置标题
            @param title[String] 
        */
        /**
            @des 获取标题
            @param null
            @return title[String]
        */
        title:function(title){
            if(KolaObject.isUndefined(title)){
                return this.entity.children(".clay_title").html();
            }else{
                if(KolaObject.isString(title) && title.charAt(0)!="<"){
                    this.entity.children(".clay_title").html("<h4>"+title+"</h4>");
                }else{
                    this.entity.children(".clay_title").html("").append(title);
                }
            }
        },
        /**
            @des 设置内容区的dom
            @param content[context] 
        */
        /**
            @des 获取内容区的dom
            @param null
            @return 内容区的dom[KolaElement]
        */
        content:function(content){
            if(KolaObject.isUndefined(content)){
                return this.entity.children(".clay_content");
            }else if(KolaObject.isString(content)){
                this.entity.children(".clay_content").html(content);
            }else{
                this.entity.children(".clay_content").html("").append(content);
            }
        }
    });
    return exports;
});