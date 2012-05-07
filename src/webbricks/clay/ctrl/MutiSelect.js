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
            renderItem:function(data){'<li><a href="javascript:void(0)">'+data+'<i class="removetab" title="ÒÆ³ýÕâ¸ö±êÇ©"></i></a></li>'}
        }
    }
    return KolaClass.create({
        _init:function(anchor,opt){
            anchor=$(anchor);
            this.option=KolaObject.extend({
                limit:10000,
                selectedClass:"checked"
            },opt||{});
            this.list=CptUtil.getDom(this.option.list,anchor);
            this.listItems=this.list.children("li");
            this.list.click(function(e){
                this.removeItem($(e.target).closest("li").find(".js_title").text());
            },{scope:this,delegate:this.option.removeHandle});
            this.candidate=CptUtil.getDom(this.option.candidate,anchor);
            this.candidateList=this.candidate.find("a")
            this.candidateList.click(candidateClick,{scope:this});
        },
        initData:function(){
        },
        addItem:function(data){
            var item=$(this.option.renderItem(data));
            this.list.append(item);
            this.candidate.find("a").filter(":contains("+data.title+")").addClass(this.option.selectedClass);
        },
        removeItem:function(title){
            this.list.find("li").filter(":contains("+title+")").remove();
            this.candidate.find("a").filter(":contains("+title+")").removeClass(this.option.selectedClass);
        }
    });
    function candidateClick(e){
        var candidate=$(e.target);
        //..if(!candidate.attr("data-MSID")){
         //   candidate.attr("data-MSID",MSIDC++);
        //}
        var data=this.option.parseCandidate(candidate);
        if(candidate.hasClass(this.option.selectedClass)){
            this.removeItem(data.title);
        }else{
            this.addItem(data);
        }
    }
});