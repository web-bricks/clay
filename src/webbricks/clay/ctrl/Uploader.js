/**
* Flash上传组件.
* @author jianbowang@sohu-inc.com
* @date   2011.10.26
*/

kola('webbricks.clay.ctrl.Uploader', [
    'kola.lang.Class',
    'kola.html.Element',
    'webbricks.clay.lib.SwfUpload'
], function(KolaClass, $, SwfUpload){
  
    var Klass=KolaClass.create({
        /**
        * 类初始化函数.
        * @param {JSON}cfg
        *   @item  {String}uploadUrl must 上传服务器地址
        *   @item  {int}maxSelectCount opt defaut 12
        */    
        _init : function(cfg){
            if(!cfg || !cfg.uploadUrl){
                throw "错误的配置参数，请指定上传服务器地址！";
            }
            this.maxSelectCount = cfg.maxSelectCount || 12;
            this.maxFileSize = (function(){          
            if(!cfg.maxFileSize){
                return "20MB";
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

            //初始化Upload实现对象
            this.initUploaderImpl(cfg);
        },
        
        /**
        * 开始上传文件.
        */
        upload : function(fileId){
          var file = this.fileMap[fileId];
          if(!file) return;      
          
          //修改文件状态为上传中
          file.status = this.FILE_UPLOADING;
          var uploader = this.uploaderMap[file.uploaderId];
          if(uploader){
            uploader.startUpload(fileId);
          }     
        },
             
        /**
        * 取消文件的上传.
        * @param {String}fileId
        */
        abort : function(fileId){
          //console.log('SwfUploader.abort:: fileId' +fileId);
          
          //取消文件的上传
          this._cancelUpload(fileId);
          
          //删除文件记录
          this.deleteFileRecord(fileId);
        },
        
        /**
        * 删除文件记录.
        * @param {String}fileId
        */
        deleteFileRecord : function(fileId){
          //从fileList中删除文件记录
          var i, len, file, fileList = this.fileList;
          for(i=0, len=fileList.length; i<len; i++){
            file = fileList[i];
            if(file.id == fileId){
              fileList.splice(i,1);
              break;
            }
          }
          
          //从fileMap中删除文件记录
          delete this.fileMap[fileId];      
        },
        
        /**
        * 取消文件的上传.
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
        * 获取文件信息
        */
        getFile : function(fileId){
          return this.fileMap[fileId];
        },
        
        /**
        * 获取文件集合.
        * @return {Array<File>}
        */
        getFiles : function(){
          return this.fileList;
        },    
        
        /**
        * 获取上传组件的工作状态.
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
        * 是否允许选择文件.
        * @return {Boolean}
        */
        isEnableSelect : function(){
          return this.enableSelect;
        },
        
        /**
        * 设置是否可以选择.
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
        * 重置上传组件.
        */
        reset : function(){
          //调用uploaer的reset方法
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
        
          //重置对象内部状态
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
          
            if(typeof handler == 'function'){
                handler.call(this.handlerScope, isEnabled);
            } 
        },
        
        /**
        * 文件选择之后的处理函数.
        * @param {int}selectCount   选择文件个数.
        */
        onSelect : function(selectCount){
            var files = this.selectQueue;
            if(files.length == 0) return;      

            var maxCount    = this.maxSelectCount;
            var fileList    = this.fileList

            var selectCount = files.length;
            var cachedCount = fileList.length;
            var handler     = this.config.onSelect;

            //若缓存的文件已经达到允许选择文件的
            //最大值，忽略此事件.
            if(cachedCount >= maxCount) return;

            //对选择的文件按文件名进行排序
            files.sort(function(f1, f2){
                return f1.name < f2.name ? -1 : 1;
            });

            //将选择的文件存入缓存和Map，超选的部分舍弃
            var i, len, file, 
                fileMap = this.fileMap,
                select  = files.slice(0, maxCount - fileList.length);      

            this.fileList = fileList.concat(select);

            for(i=0, len=select.length; i<len; i++){
                file = select[i];
                fileMap[file.id] = file;
            }

            //若指定了onSelect函数，触发函数
            if(typeof handler == 'function'){
                handler.call(this.handlerScope, select, selectCount);
            }
        },

        /**
        * 文件上传进度改变事件.
        * @param  {Json}file
        * @param  {int}complete
        * @param  {int}total
        */
        onProgress : function(file, complete, total){
            var handler = this.config.onProgress;
            if(typeof handler == 'function'){
                var transRate = Math.floor(complete / total * 100);
                handler.call(this.handlerScope, file.id,transRate);
            }      
        },
        
        /**
        * 上传成功之后的的回调函数.
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
          
          //对返回结构进行判断, 若返回结果不为0则认为上传失败
          if(json.status != 200){
            this.onError(file, json.status, json.statusText);
            return;
          }
          
          //若文件记录存在，设置文件状态为以传送完毕
          //并且若指定了回调函数触发回调
          var cachedFile = this.fileMap[fileId];
          
          if(cachedFile){          
            //修改文件的状态为上传成功, 并将
            //存储的URL存储到serverUrl中
            var data = json.data;
            cachedFile.serverUrl = data.smallest;
            cachedFile.sizeInfo  = data.extraData;
            cachedFile.status    = this.FILE_UPLOAD_SUCCESS;      
            
            //若指定了回调函数，执行回调
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
        * 上传出错时的回调函数.
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
              //修改文件状态为上传失败
              cachedFile.status = this.FILE_UPLOAD_ERROR;
              
              //若指定了错误回调，执行回调
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
        * 缩率图生成事件.
        */
        onThumbOk : function(file){
            var handler = this.config.onThumbOk;    
            if(typeof handler == 'function'){
                handler.call(this.handlerScope, file);
            }
        },
            
        /**
        * 缩率图生成失败事件.
        * @param {File}file
        */
        onThumbError : function(file){
            var handler = this.config.onThumbError;    
            if(typeof handler == 'function'){
                handler.call(this.handlerScope, file);
            }     
        },
        
        /**
        * 初始胡uploader实现对象.
        * @param {Json}cfg
        */
        initUploaderImpl : function(cfg){
            var i, len, anchor, uploader, thiz = this,
                anchors = cfg.uploadAnchors;
          
            for(i=0, len=anchors.length; i<len; i++){
                anchor   = $(anchors[i]);
                loaderId = "__upldr__" + i;         
                uploader = this.buildUploader(loaderId, anchor);
            
                //缓存uploader实现。因为有多个实现,
                //所以调用uploader方法时需要知道该
                //文件来自哪个uploader实现
                thiz.uploaderMap[loaderId] = uploader;
            }     
        },
        
        /**
        * 创建uploader实现的DOM结构.
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
            
            //上传组件的一些常规设置-----------------------
            "debug"           : false,
            "flash_url"       : config.flash_url,
            //"custom_settings" : {something : "here"},         
            
            "button_cursor"      : SWFUpload.CURSOR.HAND, 
            "button_window_mode" : SWFUpload.WINDOW_MODE.TRANSPARENT,
            "button_action"      : (config.singleSelect||(config.maxSelectCount==1))?SWFUpload.BUTTON_ACTION.SELECT_FILE:SWFUpload.BUTTON_ACTION.SELECT_FILES,
            "file_types"             : filter,
            "file_post_name"         : config.file_post_name || "Filedata",
            "file_size_limit"        : thiz.maxFileSize,
            "file_upload_limit"      : "0",
            "file_types_description" : "Image Files",       
            "prevent_swf_caching"    : false,
            
            //回调设置------------------------------------
            
            //文件被加入上传队列
            "file_queued_handler" : function(file){
                file.status     = this.FILE_NOT_UPLOAD;
                file.uploaderId = uploaderId;
                thiz.selectQueue.push(file);
                //若指定了onSelect函数，触发函数
                var handler=config.fileQueueHandler
                if(typeof handler == 'function'){
                    handler.call(this.handlerScope, file);
                }
            },
            
            //文件加入队列错误
            "file_queue_error_handler" : config.file_queue_error_handler||function(file, errorCode, message){
              var fileName = file.name.length > 16
                           ? file.name.slice(0,13) + "..."
                           : file.name;
              
              switch(errorCode){
                case -130 : //File is not an allowed file type
                  alert('您上传的文件"' + fileName + '"无法被系统识别, 选择其他图片!');
                  break;
                  
                case -110 : //File size exceeds allowed limit"
                  var maxSize = thiz.maxFileSize;
                  alert('您上传的文件"' + fileName + '"太大, 请不要上传超过' + maxSize + '的图片!');
                  break;
              }
            },
            
            //选择完毕
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