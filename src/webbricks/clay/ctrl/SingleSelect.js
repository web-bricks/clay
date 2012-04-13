/**
*@author:guanyuxin
*@date:2011.11.15
*@wiki:http://ptcdevp.sohu-inc.com/wiki/display/twitter/RadioButtonGroup
*/
kola("webbricks.clay.ctrl.SingleSelect",[
    "kola.html.Element",
    "kola.lang.Class",
    "kola.lang.Object"
],function($,C,KolaObject){
    return C.create({
        _init:function(elem,opt){
            var _this=this;
            _this.elem=$(elem);
            _this.opt=KolaObject.extend({
                item:"",
                selectedClass:"on",
                trigger:"click"
            },opt||{});
            _this.selected=$(this.elem).find(this.opt.item).filter("."+this.opt.selectedClass);
            $(this.elem).on(this.opt.trigger,_this._pick,{delegate:_this.opt.item,scope:this});
			this.active=true;
        },
        _pick:function(to,program){
            if(to.currentTarget)
                to=$(to.currentTarget);
			if(!this.active && !program)
				return;
            if(this.selected[0]==to[0])
                return;
            this.selected.removeClass(this.opt.selectedClass);
            to.addClass(this.opt.selectedClass);
            this.selected=to;
        },
        select:function(par){
            if(par===undefined)
                return this.selected;
            else if(typeof par =="number"){
				this.select(this.elem.find(this.opt.item+":eq("+par+")"));
            }else if(typeof par =="string"){
                //this.select(this.elem.find(par));
            }else{
                this._pick($(par),true);
            }
        },
        selectedIndex:function(){
            return this.selected.index(this.opt.item);
        },
        next:function(){
            var index=this.selectedIndex();
            if(index==this.elem.find(this.opt.item).length-1)
                return false;
            this.select(index+1);
            return index+1;
        },
        prev:function(){
            var index=this.selectedIndex();
            if(index==0)
                return false;
            this.select(index-1);
            return index-1;
        },
		turnOn:function(){
			this.active=true;
		},
		turnOff:function(){
			this.active=false;
		}
    });
});