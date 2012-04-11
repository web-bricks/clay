kola("webbricks.clay.cpt.CptUtil",
    "kola.html.Element,kola.lang.Class,kola.lang.Object,kola.lang.Array",
function(K,A){
    var Util={
        tl:function(language,kolaElement){
            var steps=language.split(">");
            for(var i=1,il=steps.length;i<il;i++){
                var step=steps[i].split(',');
                var name=step[0];
                var data=step[1];
                kolaElement=kolaElement[name](data);
            }
            return kolaElement;
        },
        getDom:function(src,element){
            //tarveller
            if(src.charAt(0)=='>'){
                return Util.tl(src,element);
            }
            //html直接转换为dom
            if(src.charAt(0)=='<'){
                return K(src);
            }
        }
    }
    return Util;
});