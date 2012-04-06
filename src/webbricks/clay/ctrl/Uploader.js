kola("kola.base.Uploader",
    ":Element,:Class,newt.swf.SwfUpload",
function(K,C,SwfUpload){
    var onProgress=function(file,current,total){
        console.log("prog "+total+"  "+current);
    }
    var onQueue=function(){
        //console.log("queue")
    }
    var onQueueError=function(){}
    var onThumbOk=function(file){
        K("#PREV").style("background-image","url(data:"+file.priviewData+")");
        console.log(file);
        Uploader.instances[0].startUpload(file.id);
    }
    var onThumbError=function(){
        console.log("onThumbError");
    }
    var onSuccess=function(){
        console.log("onSuccess");
    }
    var onUploadError=function(){
        console.log("onUploadError");
    }
    var onClick=function(){
        console.log("onClick");
    }
    var Uploader=C.create({
        _init:function(config){
            var anchors=config.anchors;
            for(var i=0;i<anchors.length;i++){
                var anchor=anchors[i];
                
                var upload=new SwfUpload({
                    "upload_url"         : config.uploadUrl,
                    "post_params"        : config.postParams,
                    "load_thumb"         : config.createThumb,
                    "button_width"       : K(anchor).width(),
                    "button_height"      : K(anchor).height(),
                    "button_placeholder" : anchor,
                    "privew_img_width"   : (config.privewImgWidth  || 110),
                    "privew_img_height"  : (config.privewImgHeight || 110),        
                    
                    //上传组件的一些常规设置-----------------------
                    "debug"           : false,
                    "flash_url"       : "swfupload-43.swf",  
                    
                    "button_cursor"      : SWFUpload.CURSOR.HAND, 
                    "button_window_mode" : SWFUpload.WINDOW_MODE.TRANSPARENT,
                    "button_action"      : config.MAX_SELECT_COUNT==1?SWFUpload.BUTTON_ACTION.SELECT_FILE:SWFUpload.BUTTON_ACTION.SELECT_FILES,
                    "file_types"             : config.filter,
                    "file_post_name"         : "Filedata",
                    "file_size_limit"        : config.maxFileSize,
                    "file_upload_limit"      : "0",
                    "file_types_description" : "Image Files",       
                    "prevent_swf_caching"    : false,
                    
                    //回调设置------------------------------------
                    
                    "file_queued_handler" :         onQueue,
                    "file_queue_error_handler" :    onQueueError,        
                    "upload_progress_handler" :     onProgress,        
                    "upload_error_handler" :        onUploadError,
                    "upload_success_handler" :      onSuccess,
                    "thumb_loaded_handler" :        onThumbOk,
                    "thumb_load_error_handler" :    onThumbError,
                    "button_disabled_handler" :     onClick
                });
                
                Uploader.instances[upload.movieName]=upload;
            }
        },
        upload:function(){
            
        }
    });
    Uploader.instances=[];
    return Uploader;
});