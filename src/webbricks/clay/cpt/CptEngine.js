/**
    ��ʾ�����
    Ѱ��ҳ������ data-cpt ���Ե�domԪ�أ��ҵ���Ӧ���������ʼ��
    �������ѭһ�¹淶
    ����һ���������ú�����һ��������
    new Ctrl(elem,data){}
        elem������������Ԫ�أ�Ҳ����ӵ�� data-cpt ���Ե�domԪ��
        data����ʼ��ʱ�Ĳ�������json��ʽд��data-cpt-data����
        
    ��ҳ���ʼ�����ɨ���ĵ���ҳ������½ڵ���ɨ���½ڵ㣬�ֶ�����ʱɨ��
*/
kola("webbricks.clay.cpt.CptEngine",
    ":Element,:Class,:Object,:Event,:Array",

function(K,C,O,Evt,A){
    //���¼�
    K.observe("ElementCreate",scan);
    //��ʼ��
    scan({data:[document]});
    function scan(evt){
        var elements=K(evt.data).find("[data-cpt]");
        A.forEach(elements,function(element){
            var element=K(element);
            var ctrl=element.attr("data-cpt");
            var data=eval(element.attr("data-cpt-data"));
            kola(ctrl,function(CtrlClass){
                new CtrlClass(element,data);
            });
        });
    }
    return scan;
});