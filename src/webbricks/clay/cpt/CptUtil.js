kola("webbricks.clay.cpt.CptUtil",
    "kola.html.Element,kola.lang.Class,kola.lang.Object,kola.lang.Array",
function(K,A){
    var Util={
        tl:function(language,kolaElement){
            var steps=language.split(").");
            for(var i=0,il=steps.length-1;i<il;i++){
                var step=steps[i].split('(');
                var name=step[0];
                var data=step[1];
                kolaElement=kolaElement[name](data);
            }
            return kolaElement;
        },
        getDom:function(src,element){
            //tarveller
            if(src instanceof K)
                return src;
            return Util.tl(src+".",element);
        }
    }
    return Util;
});