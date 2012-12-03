/**
    表单验证组件
    实现kola-cpt接口
*/
kola("webbricks.clay.tools.FormValidator",[
    "kola.html.Element",
    "kola.lang.Class",
    "kola.lang.Object",
    'kola.lang.Function',
    "kola.lang.Array",
    "kola.event.Dispatcher"
], function($, KolaClass, KolaObject, KolaFunction, KolaArray, Dispatcher){
    /**
        预定义规则
    */
    var rules={
        email:[{pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: "email格式错误"}],
        name:[{pattern: /[\S]{2,13}/, message: "昵称应为2~12位"},
            {pattern: /^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){3,15}$/, message: "昵称格式错误"},
            {url: "isUserNameUnused?name="}
        ],
        phone:[
            {pattern: /^\d+$/, message: "电话号码必须是数字"},
            {pattern: /^((\(\d{3}\))|(\d{3}\-))?1(3|5|8)\d{9}$/, message: "电话号码格式错误"}
        ]
    }
    /**
        默认表单状态切换
    */
    var view=function(item,data){
        if(item._status==Form.STATUS_EMPTY || item._status==Form.STATUS_OK){
            item.outerElement.next(".frmTip").html("");
            item.outerElement.closest(".frm").css("frm_ok", true).css("frm_err", false);
        }else if(item._status==Form.STATUS_ERR){
            item.outerElement.next(".frmTip").html(data);
            item.outerElement.closest(".frm").css("frm_err", true).css("frm_ok", false);
        }
    }
    /**
        表单项验证
    */
    var Item = KolaClass.create(Dispatcher, {
        _init: function(outerElement, option){
            var _this = this;
            if(!option.view){
                _this.view = view;
            }else{
                _this.view = option.view;
            }
            _this.outerElement = outerElement;
            _this.el=outerElement.find("[name]");
            _this.pattern=outerElement.attr("pattern") || "";
            _this.require=outerElement.attr("require") || false;
            _this.status(Form.STATUS_EMPTY);
            if(_this.pattern)
                _this.rules=rules[_this.pattern];
            else
                _this.rules=[];
            _this.el.change(_this.validLocal, {scope:_this});
        },
        validRemote: function(){
            Ajax.json(rule.url + val, {
                succ:function(json){
                    _this.status(Form.STATUS_OK);
                    _this.fire("PASS");
                    _this.view(_this);
                },fail:function(){
                    _this.status(Form.STATUS_ERR, json.data);
                    _this.fire("ERR");
                }
            });
        },
        validLocal: function(){
            var _this = this;
            var rules = _this.pattern;
            var val = _this.el.val();
            //如果为空，交给非空验证
            if(val == ""){
                if(_this.require == "")
                    _this.status(Form.STATUS_EMPTY);
                else{
                    _this.status(Form.STATUS_ERR, _this.require);
                    _this.fire("ERR");
                }
                return;
            }
            if(_this.type){
                for(var i=0;i<rules.length;i++){
                    var rule=rules[i];
                    if(!rule.pattern.test(val)){
                        _this.status(Form.STATUS_ERR, rule.message);
                        _this.fire("ERR");
                        return;
                    }
                }
            }
            _this.status(Form.STATUS_OK);
            _this.fire("PASS");
        },
        status: function(status, errMessage){
            this._status = status;
            this.view(this, errMessage);
        }
    });

    function testAllPass(){
        for(var i=0;i<this.items.length;i++){
            if(this.items[i]._status!=Form.STATUS_OK)
                return;
        }
        for(i=0;i<this.items.length;i++){
            this.items[i].off("PASS",testAllPass);
            this.items[i].off("ERR",testErr);
        }
        this.options.submit();
    }
    function testErr(){
        for(var i=0;i<this.items.length;i++){
            this.items[i].off("PASS",testAllPass);
            this.items[i].off("ERR",testErr);
        }
    }
    function submit(e){
        for(var i=0,il=this.items.length;i<il;i++){
            this.items[i]._status=Form.STATUS_EMPTY;
        }
        for(var i=0,il=this.items.length;i<il;i++){
            this.items[i].on("PASS",testAllPass,{scope:this});
            this.items[i].on("ERR",testErr,{scope:this});
            this.items[i].valid();
        }
    }
    /**
        表单验证
        options
            .clearOnFocus 条目在得到焦点后清除错误状态
            .submit 点击提交按钮后所有验证通过的回调函数
    */

    var Form=KolaClass.create({
        _init:function(form, options){
            var _this = this;
            _this.options = KolaObject.extend({
                clearOnFocus: true,
                submit: KolaFunction.empty
            }, options);
            _this.items = [];
            form.find("[pattern]").add(form.find("[require]")).each(function(item){
                var newItem = new Item(item, {view:options.view});
                _this.items.push(newItem);
                if(_this.options.clearOnFocus){
                    item.on("focus",function(){
                        newItem.status(Form.STATUS_EMPTY);
                        newItem.view(newItem);
                    });
                }
            });
            form.find("[type=submit]").click(submit, {scope: this});
        },
        submit:function(){
            submit.call(this);
        }
    });
    Form.STATUS_EMPTY=0;
    Form.STATUS_OK=1;
    Form.STATUS_ERR=2;
    Form.STATUS_WAITING=3;
    return Form;
});