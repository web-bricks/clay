/**
    anchor
    option
        popup
        item
    selectedIndex
    selectedValue
*/
kola("webbricks.clay.ctrl.Select",[
    "kola.lang.Class",
    "kola.lang.Object",
    "kola.html.Element",
    "webbricks.clay.ctrl.Popup",
    "webbricks.clay.ctrl.SingleSelect",
    "kola.event.Dispatcher"
],function(KolaClass, KolaObject, $, Popup, Single, Dispatcher){
    function noWheelOverflow(e){
        e.currentTarget.scrollTop -= e.wheelDeltaY; 
        e.preventDefault();
    }
    var exports = KolaClass.create(Dispatcher,{
        /**
         * @param anchor
         */
        _init: function(anchor, option){
            var _this = this;
            this.anchor = anchor;
            this.popup = option.popup;
            this.bar = option.bar;
            this.agent = this.anchor.find("input");
            this.listCtrl = new Single(this.popup,{
                item: option.item || "li",                                     
                trigger: "click"
            });                                                             
            this.popup.on("mousewheel", noWheelOverflow);
            this.popup = new Popup(anchor, {                                   
                popup: this.popup,                                           
                trigger: "click",                                            
                hideOnClickOut: true,
                anchorActiveClass: option.anchorActiveClass,
                showClass: option.showClass
            });                                                             

            this.listCtrl.on("pick", select, {context: this});                           
        },
        selectByValue: function(value){
            var found = false;
            var _this = this;
            this.listCtrl.items().each(function(ele, i){
                if(ele.find('.clay_value').html() == value){
                    _this.listCtrl.select(i);
                    found = true;
                    return false;
                }
            });
            if(!found)
                this.listCtrl.select(-1);
            this.selectedValue = value;
            if(this.bar.is("input"))                                        
                this.bar[0].value = this.selectedValue;                       
            else                                                            
                this.bar.html(this.selectedValue);
            if(this.agent.length){
                this.agent[0].value = this.selectedValue;
            }
        },             
        selectByIndex: function(index){                                      
            this.listCtrl.select(index);                                    
            this.selectedValue = this.listCtrl.select().find(".clay_value").html();
            this.selectedContent = this.listCtrl.select().find(".clay_content").html();
            if(!this.selectedContent)
                this.selectedContent = this.selectedValue
            if(this.bar.is("input"))                                        
                this.bar[0].value = this.selectedContent;                       
            else                                                            
                this.bar.html(this.selectedContent);
            if(this.agent.length){
                this.agent[0].value = this.selectedValue;
            }
        },
        selectedIndex: function(){
            return this.listCtrl.selectedIndex();
        },
        selectedValue: function(){
            this.listCtrl.select().find(".clay_value").html();
        }
    });
    function select(e){
        var selectedIndex = this.listCtrl.selectedIndex();
        if(selectedIndex == -1) return;
        this.selectByIndex(selectedIndex);
        var _this = this;
        setTimeout(function(){
            _this.popup.hide();
        });
        this.fire("select");
    }
    return exports;
});