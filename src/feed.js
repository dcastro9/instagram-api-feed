
function instagramFeed(){

    var model = {
        data: {
            "media":[],
            "thumbnails":[]
        }
    }
    var control = {
        init: function(){
            this.apiCall();
        },
        apiTimeout: function(){
            setTimeout(function() {
                if(model.data.media.length < 10){
                    view.showError();
                }
            }, 5000);
        },
        apiCall: function(){


            model.data.media = [];
            model.data.thumbnails = [];

            var apiUrl = 'https://api.instagram.com/v1/tags/2oceansbrewing/media/recent?access_token=',
                apiToken = '', // api token here.
                apiAjaxUrl = apiUrl + apiToken;

            $.ajax({
                url: apiAjaxUrl,
                type: 'GET',
                crossDomain: true,
                dataType: 'jsonp'
            }).done(function(response){
                var instagramResponse = response.data;
                if(instagramResponse){
                    var media = model.data.media;
                    instagramResponse.forEach(function(el) {
                        media.push(el);
                    });
                    control.makeThumbnails();
                } else {
                    control.apiTimeout();
                }

            }).fail(function(xhr,textStatus){
                control.apiTimeout();
            });

        },
        ThumbnailConstructor: function(image,likes,url){
            this.image = image;
            this.likes = likes;
            this.url = url;
        },
        makeThumbnails: function(){
            var media = model.data.media,
                thumbnails = model.data.thumbnails;

            if(media.length >= 10){
                media.forEach(function(el) {
                    thumbnails.push( new control.ThumbnailConstructor(el.images.thumbnail.url,el.likes.count,el.link));
                });
                view.init();
            }
        }
    }
    var view = {
        init: function(){
            this.showFeed();
        },
        showFeed: function(){
            var feed = $('#instagram-feed'),
                dataThumbnails = model.data.thumbnails,
                feedLimit = 10,
                listItem = '',
                feedTemplate = '<li><img src="%image%"></li>';

            $('#instagram-feed > li').remove();

            dataThumbnails.forEach(function(el,index) {
                if (index < feedLimit){
                    console.log(el);
                    listItem = feedTemplate.replace("%image%", el.image).replace("%count%",el.likes).replace("%url%",el.url);
                    feed.append(listItem);
                }
            });
            console.log('api call')
            setTimeout(control.apiCall, 10000);
        },
        showError: function(){
            console.log('Oops. Something went wrong.');
        }
    }

    control.init();

} instagramFeed();