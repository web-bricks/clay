/**
* Flash�ϴ����.
* @author jianbowang@sohu-inc.com
* @date   2011.10.26
*/

kola('webbricks.clay.ctrl.Uploader', [
    'kola.lang.Object',
    'kola.event.Dispatcher',
    'kola.lang.Class',
    'kola.html.Element',
    'webbricks.clay.lib.SwfUpload'
], function(KolaObject, Dispatcher, KolaClass, $, SwfUpload){
  
    var Klass=KolaClass.create(Dispatcher,{
        /**
        * ���ʼ������.
        * @param {JSON}cfg
        *   @item  {String}uploadUrl must �ϴ���������ַ
        *   @item  {int}maxSelectCount opt defaut 12
        */    
        _init : function(cfg){
            if(!cfg || !cfg.uploadUrl){
                throw "��������ò�������ָ���ϴ���������ַ��";
            }
            this.maxSelectCount = cfg.maxSelectCount || 12;
            this.maxFileSize = (function(){          
            if(!cfg.maxFileSize){
                return "10MB";
            }else{
                var maxSize = Math.abs(parseInt((cfg.maxFileSize || 0), 10));
                if(maxSize < 1024){
                    return Math.floor(maxSize) + "B";
                }else if(maxSize < 1024 * 1024){
                    return Math.floor(maxSize/1024) + "KB";
                }else{
                    return Math.floor(maxSize/(1024 * 1024)) + "MB";
                }
            }
            })();

            this.uploaderMap  = {};
            this.selectQueue  = [];
            //this.errorQueue = [];
            this.fileList     = [];
            this.fileMap      = {};
            this.config       = cfg;
            this.enableSelect = true;
            this.handlerScope = cfg.handlerScope;

            //��ʼ��Uploadʵ�ֶ���
            this.initUploaderImpl(cfg);
        },
        
        /**
        * ��ʼ�ϴ��ļ�.
        */
        upload : function(fileId){
          var file = this.fileMap[fileId];
          if(!file) return;      
          
          //�޸��ļ�״̬Ϊ�ϴ���
          file.status = this.FILE_UPLOADING;
          var uploader = this.uploaderMap[file.uploaderId];
          if(uploader){
            uploader.startUpload(fileId);
          }     
        },
             
        /**
        * ȡ���ļ����ϴ�.
        * @param {String}fileId
        */
        abort : function(fileId){
          //console.log('SwfUploader.abort:: fileId' +fileId);
          
          //ȡ���ļ����ϴ�
          this._cancelUpload(fileId);
          
          //ɾ���ļ���¼
          this.deleteFileRecord(fileId);
        },
        
        /**
        * ɾ���ļ���¼.
        * @param {String}fileId
        */
        deleteFileRecord : function(fileId){
          //��fileList��ɾ���ļ���¼
          var i, len, file, fileList = this.fileList;
          for(i=0, len=fileList.length; i<len; i++){
            file = fileList[i];
            if(file.id == fileId){
              fileList.splice(i,1);
              break;
            }
          }
          
          //��fileMap��ɾ���ļ���¼
          delete this.fileMap[fileId];      
        },
        
        /**
        * ȡ���ļ����ϴ�.
        * @param   {String}fileId
        * @private
        */
        _cancelUpload : function(fileId){
          var uploader, file = this.fileMap[fileId];  
          if(!file) return;
          
          var uploader = this.uploaderMap[file.uploaderId];
          if(uploader){        
            try{
              uploader.cancelUpload(fileId, false);
            }catch(e){
              //console.log('SwfUploader._cancelUpload:: ' + e);
            }
          } 
        },
        
        /**
        * ��ȡ�ļ���Ϣ
        */
        getFile : function(fileId){
          return this.fileMap[fileId];
        },
        
        /**
        * ��ȡ�ļ�����.
        * @return {Array<File>}
        */
        getFiles : function(){
          return this.fileList;
        },    
        
        /**
        * ��ȡ�ϴ�����Ĺ���״̬.
        */
        getStatus : function(){
          var i, len, status, file, fileList = this.fileList;
          
          if(fileList.length == 0){
            return this.STATUS_NOT_SELECT;     
          }      
          
          for(i=0, len=fileList.length; i<len; i++){
            file    = fileList[i];
            status  = file.status;          
            if(status == this.FILE_UPLOAD_ERROR){
              return this.STATUS_HAS_ERROR;          
            }else if(status == this.STATUS_UPLOADING){
              return this.STATUS_UPLOADING;          
            }
          }
          
          return this.STATUS_COMPLETE_ALL;     
        },
        
        /**
        * �Ƿ�����ѡ���ļ�.
        * @return {Boolean}
        */
        isEnableSelect : function(){
          return this.enableSelect;
        },
        
        /**
        * �����Ƿ����ѡ��.
        */
        setEnableSelect : function(isEnable){
          var i, uploaderMap = this.uploaderMap;
          
          this.enableSelect = isEnable;
          
          for(i in uploaderMap){
            if(i && uploaderMap.hasOwnProperty(i)){
              try{
                uploaderMap[i].setButtonDisabled(!isEnable);
              }catch(e){}
            }
          }
        },
        
        /**
        * �����ϴ����.
        */
        reset : function(){
          //����uploaer��reset����
          var i, upldr, upldrMap = this.uploaderMap;
          for(i in upldrMap){
            if(!upldrMap.hasOwnProperty(i)){
              continue;
            }
            
            upldr = upldrMap[i];        
            if(upldr){
              try{
                upldr.reset();
              }catch(e){
                //console.log('SwfUploader.reset:: a error eccored, info:' + e);
              }  
            }        
          }
        
          //���ö����ڲ�״̬
          this.fileMap = {};
          this.enableSelect = true;
          this.fileList.length = 0;
          this.selectQueue.length = 0;
          //this.errorQueue.length = 0;
          this.status = this.STATUS_NOT_SELECT;
        },    
        
        onClick : function(isEnabled){
            var config  = this.config;
            var handler = config.onClick;
          
            if(KolaObject.isFunction(handler)){
                handler.call(this.handlerScope, isEnabled);
            } 
        },
        
        /**
        * �ļ�ѡ��֮��Ĵ�����.
        * @param {int}selectCount   ѡ���ļ�����.
        */
        onSelect : function(selectCount){
            var files = this.selectQueue;
            if(files.length == 0) return;      

            var maxCount    = this.maxSelectCount;
            var fileList    = this.fileList

            var selectCount = files.length;
            var cachedCount = fileList.length;
            var handler     = this.config.onSelect;

            //��������ļ��Ѿ��ﵽ����ѡ���ļ���
            //���ֵ�����Դ��¼�.
            if(cachedCount >= maxCount) return;

            //��ѡ����ļ����ļ�����������
            files.sort(function(f1, f2){
                return f1.name < f2.name ? -1 : 1;
            });

            //��ѡ����ļ����뻺���Map����ѡ�Ĳ�������
            var i, len, file, 
                fileMap = this.fileMap,
                select  = files.slice(0, maxCount - fileList.length);      

            this.fileList = fileList.concat(select);

            for(i=0, len=select.length; i<len; i++){
                file = select[i];
                fileMap[file.id] = file;
            }

            //��ָ����onSelect��������������
            if(KolaObject.isFunction(handler)){
                handler.call(this.handlerScope, select, selectCount);
            }
        },

        /**
        * �ļ��ϴ����ȸı��¼�.
        * @param  {Json}file
        * @param  {int}complete
        * @param  {int}total
        */
        onProgress : function(file, complete, total){
            var handler = this.config.onProgress;
            if(KolaObject.isFunction(handler)){
                var transRate = Math.floor(complete / total * 100);
                handler.call(this.handlerScope, file.id,transRate);
            }      
        },
        
        /**
        * �ϴ��ɹ�֮��ĵĻص�����.
        * @param {Json}file
        * @param {String}serverData
        */
        onSuccess : function(file, serverData){          
          var fileId    = file.id;
          var config    = this.config;
          var json      = eval('('+serverData+')');
          var scope     = this.handlerScope;
          var percentHd = config.onProgress; 
          var successHd = config.onSuccess;
          
          //�Է��ؽṹ�����ж�, �����ؽ����Ϊ0����Ϊ�ϴ�ʧ��
          if(json.status != 0){
            this.onError(file, json.status, json.statusText);
            return;
          }
          
          //���ļ���¼���ڣ������ļ�״̬Ϊ�Դ������
          //������ָ���˻ص����������ص�
          var cachedFile = this.fileMap[fileId];
          
          if(cachedFile){          
            //�޸��ļ���״̬Ϊ�ϴ��ɹ�, ����
            //�洢��URL�洢��serverUrl��
            var data = json.data;
            cachedFile.serverUrl = data.smallest;
            cachedFile.sizeInfo  = data.extraData;
            cachedFile.status    = this.FILE_UPLOAD_SUCCESS;      
            
            //��ָ���˻ص�������ִ�лص�
            if(successHd instanceof Function){
              try{        
                successHd.call(scope, fileId, json);        
              }catch(e){
                //console.log("SwfUploader.onSuccess:" + e);
              } 
            }
          }
        },
        
        /**
        * �ϴ�����ʱ�Ļص�����.
        * @param {Json}file
        * @param {String}errorCode
        * @param {String}message
        */
        onError : function(file, errorCode, message){
          //console.log('SwfUploader.onError:: enter, file=' + file + ', code=' + errorCode + ", msg=" + message);
          
          if(file != null){
            var fileId     = file.id;
            var cachedFile = this.fileMap[fileId];
            var handler    = this.config.onError;
            
            if(cachedFile){      
              //�޸��ļ�״̬Ϊ�ϴ�ʧ��
              cachedFile.status = this.FILE_UPLOAD_ERROR;
              
              //��ָ���˴���ص���ִ�лص�
              if(handler instanceof Function){
                try{
                  handler.call(
                    this.handlerScope, 
                    fileId, 
                    errorCode, 
                    message
                  );
                }catch(e){
                  //console.log("SwfUploader.onError:" + e);
                }
              }
            }
          } 
        },
        
        /**
        * ����ͼ�����¼�.
        */
        onThumbOk : function(file){
            var handler = this.config.onThumbOk;    
            if(KolaObject.isFunction(handler)){
                handler.call(this.handlerScope, file);
            }
        },
            
        /**
        * ����ͼ����ʧ���¼�.
        * @param {File}file
        */
        onThumbError : function(file){
            var handler = this.config.onThumbError;    
            if(KolaObject.isFunction(handler)){
                handler.call(this.handlerScope, file);
            }     
        },
        
        /**
        * ��ʼ��uploaderʵ�ֶ���.
        * @param {Json}cfg
        */
        initUploaderImpl : function(cfg){
            var i, len, anchor, uploader, thiz = this,
                anchors = cfg.uploadAnchors;
          
            for(i=0, len=anchors.length; i<len; i++){
                anchor   = $(anchors[i]);
                loaderId = "__upldr__" + i;         
                uploader = this.buildUploader(loaderId, anchor);
            
                //����uploaderʵ�֡���Ϊ�ж��ʵ��,
                //���Ե���uploader����ʱ��Ҫ֪����
                //�ļ������ĸ�uploaderʵ��
                thiz.uploaderMap[loaderId] = uploader;
            }     
        },
        
        /**
        * ����uploaderʵ�ֵ�DOM�ṹ.
        * @param  {String}uploaderId
        * @param  {JQueryObj}anchor
        * @return {SwfUpload}
        */
        buildUploader : function(uploaderId, anchor){
            var configs = this.getImplConfigs(uploaderId,anchor);
          
            var swf=new SWFUpload(configs);
          
            var swfDom=$("#"+swf.movieName);
            swfDom.style("width","100%");
            swfDom.style("height","100%");
            swfDom.style("position","absolute");
            swfDom.style("left",0);
            swfDom.style("top",0);
            if(anchor.style("position")=="static")
                anchor.style("position","relative");
            return swf;
        },
        
        getImplConfigs : function(uploaderId, anchor){
          var holder, anchorEl, anchorParent,
              thiz       = this,
              config     = this.config,
              maxCount   = this.maxSelectCount,
              holder = $('<div></div>'),
              filter = (function(){
                var filterCfg = config.fileFilter || "";
                var filters   = filterCfg.match(/\w+/g) || [];        
                var i, len, a = [];
                
                if(filters.length > 0){
                  for(i=0, len=filters.length; i<len; i++){
                    a.push("*." + filters[i]);                
                  }
                  return a.join(";");
                }else{
                  return "*.*";
                } 
              })();
          
          anchor.append(holder);
          holder       = holder[0];
          
          return {
            "upload_url"         : config.uploadUrl,
            "post_params"        : config.postParams,
            "load_thumb"         : config.createThumb,
            "button_placeholder" : holder,
            "privew_img_width"   : (config.privewImgWidth  || 110),
            "privew_img_height"  : (config.privewImgHeight || 110),        
            
            //�ϴ������һЩ��������-----------------------
            "debug"           : false,
            "flash_url"       : config.flash_url,
            //"custom_settings" : {something : "here"},         
            
            "button_cursor"      : SWFUpload.CURSOR.HAND, 
            "button_window_mode" : SWFUpload.WINDOW_MODE.TRANSPARENT,
            "button_action"      : (config.singleSelect||(config.maxSelectCount==1))?SWFUpload.BUTTON_ACTION.SELECT_FILE:SWFUpload.BUTTON_ACTION.SELECT_FILES,
            "file_types"             : filter,
            "file_post_name"         : "Filedata",
            "file_size_limit"        : thiz.maxFileSize,
            "file_upload_limit"      : "0",
            "file_types_description" : "Image Files",       
            "prevent_swf_caching"    : false,
            
            //�ص�����------------------------------------
            
            //�ļ��������ϴ�����
            "file_queued_handler" : function(file){
                file.status     = this.FILE_NOT_UPLOAD;
                file.uploaderId = uploaderId;
                thiz.selectQueue.push(file);
                //��ָ����onSelect��������������
                var handler=config.fileQueueHandler
                if(KolaObject.isFunction(handler)){
                    handler.call(this.handlerScope, file);
                }
            },
            
            //�ļ�������д���
            "file_queue_error_handler" : config.file_queue_error_handler||function(file, errorCode, message){
              var fileName = file.name.length > 16
                           ? file.name.slice(0,13) + "..."
                           : file.name;
              
              switch(errorCode){
                case -130 : //File is not an allowed file type
                  alert('���ϴ����ļ�"' + fileName + '"�޷���ϵͳʶ��, ѡ������ͼƬ!');
                  break;
                  
                case -110 : //File size exceeds allowed limit"
                  var maxSize = thiz.maxFileSize;
                  alert('���ϴ����ļ�"' + fileName + '"̫��, �벻Ҫ�ϴ�����' + maxSize + '��ͼƬ!');
                  break;
              }
            },
            
            //ѡ�����
            "file_dialog_complete_handler" : function(selectCount, countInQueued){
              thiz.onSelect(selectCount);
              thiz.selectQueue.length = 0;
            },
            
            "upload_progress_handler" : function(){
              var args = [].slice.call(arguments);
              thiz.onProgress.apply(thiz, args);
            },
            
            "upload_error_handler" : function(){
              var args = [].slice.call(arguments);
              thiz.onError.apply(thiz, args);
            },
            
            "upload_success_handler" : function(){
              var args = [].slice.call(arguments);       
              thiz.onSuccess.apply(thiz, args);
            },

            "thumb_loaded_handler" : function(file){
              thiz.onThumbOk(file);
            },
            
            "thumb_load_error_handler" : function(file){
              thiz.onThumbError.call(thiz, file);          
            },
            
            "button_disabled_handler" : function(){
              thiz.onClick(false);
            }
          }
        },
        STATUS_NOT_SELECT     : 0,
        STATUS_UPLOADING      : 1,
        STATUS_HAS_ERROR      : 2,
        STATUS_COMPLETE_ALL   : 3,    
        
        FILE_NOT_UPLOAD     : 0,
        FILE_UPLOADING      : 1,
        FILE_UPLOAD_ERROR   : 2,
        FILE_UPLOAD_SUCCESS : 3
    });
  
  return Klass;
});