$(document).ready(function() {

    /*
    * accessToken : 309982629.b57e75e.9741571cf6c840a18a8ada2ae207ef5e
    * userID: 309982629
    * clientId: b57e75ea6a1e4a30bdab8fe0829d30f0
    * */
    var loadButton = document.getElementById('load-more');
    var userFeed = new Instafeed({
        // get: 'tagged',
        get: 'user',
        userId: '309982629',
        limit: 20,
        resolution: 'standard_resolution',
        // tagName: 'людиАндерСона',
        accessToken: '309982629.b57e75e.9741571cf6c840a18a8ada2ae207ef5e',
        sortBy: 'most-recent',
        // filter: function(image) {
        //     return image.tags.indexOf('tag') >= 0;
        // },
        success: function(json) {
            console.log(json);
        },
        // after: function() {
        //     if (!this.hasNext()) {
        //         loadButton.setAttribute('disabled', 'disabled');
        //     }
        // },
        template: '<div class="ins-photo">' +
        '<div class="ins-photo__hash"><a href="{{link}}">{{caption}}</a></div>' +
        '<a class="ins-photo__img" href="{{link}}" title="" target="_blank">' +
        '<img src="{{image}}" alt="" class="img-fluid"/>' +
        '</a>' +
        '</div>'
    });


    // loadButton.addEventListener('click', function() {
    //     feed.next();
    // });
    userFeed.run();


});
