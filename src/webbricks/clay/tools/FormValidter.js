/**
    表单验证组件
    实现kola-cpt接口
*/
kola("webbricks.clay.tools.FormValidter",
    "kola.html.Element,kola.lang.Class,kola.lang.Object,kola.lang.Array,kola.net.Ajax,kola.event.Dispatcher",
function(K,C,O,A,Ajax,Dispatcher){
    /**
        预定义正则表达式
    */
    var regs={
        Require : /.+/,
		Username : /^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){3,15}$/,
		Realname : /^[\u4E00-\u9FA5]{2,6}$/,
		Nosign : /^[^\s]{1}[^-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*$/,
		Domain : /^([a-zA-Z0-9]|[-]){4,16}$/,
		V_code : /^[a-zA-Z0-9]{6}$/,
		Email : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		Phone : /^((\(\d{3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}$/,
		Mobile : /^((\(\d{3}\))|(\d{3}\-))?1(3|5|8)\d{9}$/,
		Url : /^([a-zA-z]+:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\?%&=]*)?/,
		IdCard : /^\d{15}(\d{2}[A-Za-z0-9])?$/,
		Currency : /^\d+(\.\d+)?$/,
		Number : /^\d+$/,
		Zip : /^[1-9]\d{5}$/,
		QQ : /^[1-9]\d{4,15}$/
    }
    /**
        预定义规则
    */
    var rules={
        email:{
            trigger:"blur",
            rule:[["Email","email格式错误"]]
        },
        name:{
            trigger:"blur",
            rule:[[/[\S]{2,13}/,"昵称应为2~12位"],["Username","昵称格式错误"],{url:"isUserNameUnused?name="}],
        },
        phone:{
            trigger:"blur",
            rule:[["Number","电话号码必须是数字"],["Mobile","电话号码格式错误"]]
        }
    }
    /**
        默认表单状态切换
    */
    var view=function(elem,data){
        if(elem.status==Form.STATUS_EMPTY || elem.status==Form.STATUS_OK){
            elem.el.next().html("");
        }else if(elem.status==Form.STATUS_ERR){
            elem.el.next().html(data);
        }
    }
    /**
        表单项验证
    */
    var Item=C.create(Dispatcher,{
        _init:function(el){
            var _this=this;
            _this.status=Form.STATUS_EMPTY;
            _this.el=el;
            _this.type=el.attr("data-valid")||"";
            _this.require=el.attr("data-require")||0;
            _this.view=el.attr("data-valid-view");
            if(!_this.view){
                _this.view=view;
            }else{
                kola(_this.view,function(v){_this.view=v});
            }
            if(_this.type)
                _this.code=rules[_this.type];
            else
                _this.code=[];
            _this.el.on(_this.code.trigger,function(){
                _this.valid.call(_this);
            });
        },
        valid:function(){
            var _this=this;
            var rules=_this.code.rule;
            var val=_this.el[0].value;
            //如果为空，交给非空验证
            if(val==""){
                if(_this.require=="")
                    _this.status=Form.STATUS_EMPTY;
                else{
                    _this.status=Form.STATUS_ERR;
                    _this.dispatch("ERR");
                }
                _this.view(_this,_this.require);
                return;
            }
            for(var i=0;i<rules.length;i++){
                var rule=rules[i];
                if(O.isArray(rule)){
                    if(O.isString(rule[0])){
                        var reg=regs[rule[0]];
                    }else{
                        var reg=rule[0];
                    }
                    if(!reg.test(val)){
                        _this.status=Form.STATUS_ERR;
                        _this.dispatch("ERR");
                        _this.view(_this,rule[1]);
                        return;
                    }
                }else{
                    Ajax.post(rule.url+val,{
                        succ:function(json){
                            if(json.status==0){
                                _this.status=Form.STATUS_OK;
                                _this.dispatch("PASS");
                                _this.view(_this);
                            }else{
                                _this.status=Form.STATUS_ERR;
                                _this.dispatch("ERR");
                                _this.view(_this,json.statusText);
                            }
                        },fail:function(){
                            _this.status=Form.STATUS_ERR;
                            _this.dispatch("ERR");
                            _this.view(_this,"网络不通");
                        }
                    });
                    return;
                }
            }
            _this.status=Form.STATUS_OK;
            _this.dispatch("PASS");
            _this.view(_this.el);
        }
    });

    function testAllPass(){
        for(var i=0;i<this.items.length;i++){
            if(this.items[i].status!=Form.STATUS_OK)
                return;
        }
        for(var i=0;i<this.items.length;i++){
            this.items[i].unObserve("PASS",testAllPass);
            this.items[i].unObserve("ERR",testErr);
        }
        this.submit();
    }
    function testErr(){
        for(var i=0;i<this.items.length;i++){
            this.items[i].unObserve("PASS",testAllPass);
            this.items[i].unObserve("ERR",testErr);
        }
    }
    /**
        表单验证
        options
            .clearOnFocus 条目在得到焦点后清除错误状态
            .submit 点击提交按钮后所有验证通过的回调函数
    */
    var Form=C.create({
        _init:function(form,options){
            var _this=this;
            _this.form=K(form);
            _this.options=O.extend({
                clearOnFocus:true,
                submit:function(){alert(1)}
            },options);
            _this.submit=_this.options.submit;
            _this.items=[];
            _this.form.find("[data-valid],[data-require]").each(function(){
                var item=this;
                var newItem=new Item(item);
                _this.items.push(newItem);
                if(_this.options.clearOnFocus){
                    item.on("focus",function(){
                        newItem.status=Form.STATUS_EMPTY;
                        newItem.view(newItem);
                    });
                }
            });
            _this.submitBtn=form.find("[data-submit]");
            if(_this.submitBtn.length>0){
                _this.submitBtn.click(function(e){
                    for(var i=0,il=_this.items.length;i<il;i++){
                        _this.items[i].status=Form.STATUS_EMPTY;
                    }
                    for(var i=0,il=_this.items.length;i<il;i++){
                        _this.items[i].observe("PASS",testAllPass,{scope:_this});
                        _this.items[i].observe("ERR",testErr,{scope:_this});
                        _this.items[i].valid();
                        //if(_this.items[i].status==Form.STATUS_ERR){
                        //    return;
                        //}
                    }
                });
            }
        }
    });
    Form.STATUS_EMPTY=0;
    Form.STATUS_OK=1;
    Form.STATUS_ERR=2;
    Form.STATUS_WAITING=3;
    return Form;
});