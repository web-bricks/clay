/**
    显示层组件
    寻找页面上有 data-cpt 属性的dom元素，找到对应的组件并初始化
    组件需遵循一下规范
    返回一个函数，该函数是一个构造器
    new Ctrl(elem,data){}
        elem：组件的最外层元素，也就是拥有 data-cpt 属性的dom元素
        data：初始化时的参数，按json格式写在data-cpt-data上面
        
    在页面初始化后会扫描文档，页面插入新节点是扫描新节点，手动调用时扫描
*/
kola("webbricks.clay.cpt.CptEngine",
    "kola.html.Element,kola.lang.Class,kola.lang.Object,kola.lang.Array",

function(K,C,O,A){
    //绑定事件
    K.on("ElementCreate",scan);
    //初始化
    scan({data:document});
    function scan(evt){
        var elements=K(evt.data).find("[data-cpt]");
        if(!elements)
            return;
        A.forEach(elements,function(element){
            var element=K(element);
            var ctrl=element.attr("data-cpt");
            var data=eval('('+element.attr("data-cpt-data")+')');
            kola(ctrl,function(CtrlClass){
                new CtrlClass(element,data);
            });
        });
    }
    return scan;
});