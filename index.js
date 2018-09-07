function Avatar(option) {
    var self = this,
        crop = undefined,
        setting = {
            crop: {
                viewport: {
                    width: 200,
                    height: 200
                }
            }
        };
    
    const messages = {
        error: [
            'Avatar: Объект crop не найдет, необходимо вызвать метод init'
        ]
    }
        
    if (option) $.extend(setting, option);
    
    
        //инициализация
    this.init = function(cropContainer) {
        crop = $(cropContainer).croppie(setting.crop);
    }

    
    //отобразить изображение
    this.setUrl = function(url, ready) {
        if(crop == undefined) throw messages.error[0];
        crop.croppie('bind', {
            url: url
        }).then(function(){
            if(ready)
                ready();
        });
    }

    this.setImage = function(file, ready) {
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                self.setUrl(e.target.result, ready);
            }
            reader.readAsDataURL(file);
        }
        else {
            //Sorry - you're browser doesn't support the FileReader API
        }
    }

    //получить изображение
    this.getCroppedImage = function(format, callback) {
        if(crop == undefined) throw messages.error[0];
        crop.croppie('result', {
            type: format,
            size: 'viewport',
            resultSize: {
                width: 50,
                height: 50
            }
        }).then(function (result) {
            if(callback)
                callback(result);
        });
    }

    //отправить изображение
    this.sendToServer = function(url, callback) {
        self.getCroppedImage('blob', function(result) {
            var fd = new FormData();
            fd.append("image", result);
            $.ajax({
                url: url,
                data: fd, 
                type:"POST",
                contentType:false,
                processData:false,
                cache:false,
                dataType:"json",  
                error:function(err){
                    callback({status: 'error', data: err});
                },
                success:function(data){
                    callback({status: 'success', data: data});
                },
                complete:function(){
                    callback({status: 'complete'});
                }
            });

        });
    }
}
