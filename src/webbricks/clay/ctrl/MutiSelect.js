/**
*@author:guanyuxin
*@date:2011.11.15
*@wiki:http://ptcdevp.sohu-inc.com/wiki/display/twitter/RadioButtonGroup
*/
kola("webbricks.clay.ctrl.MutiSelect",[
    "kola.html.Element",
    "kola.lang.Class",
    "kola.lang.Object",
    "webbricks.clay.cpt.CptUtil"
],function($,KolaClass,KolaObject,CptUtil){
    var template={
        "tag":{
            list:"children(.value)",
            candidate:"children(div.Tags)",
            item:function(value){'<li><a href="javascript:void(0)">'+value+'<i class="removetab" title="ÒÆ³ýÕâ¸ö±êÇ©"></i></a></li>'}
        }
    }
    return KolaClass.create({
        _init:function(anchor,opt){
            this.option=KolaObject.extend({
                limit:10000,
                selectedClass:"checked"
            },opt||{});
            this.list=CptUtil.getDom(this.option.list,anchor);
            this.candidate=CptUtil.getDom(this.option.candidate,anchor);
            this.candidate.click(candidateClick,{scope:this});
        },
        initData:function(){
        },
        addItem:function(e){
            
        }
    });
    function candidateClick(){
        var candidate=$(e.target);
        if(candidate.hasClass(this.option.selectedClass)){
            candidate.removeClass(this.option.selectedClass);
            this.addItem();
        }else{
            candidate.addClass(this.option.selectedClass);
        }
    }
});