$(document).ready(function() {

    /*
    * accessToken : 309982629.b57e75e.9741571cf6c840a18a8ada2ae207ef5e
    * userID: 309982629
    * clientId: b57e75ea6a1e4a30bdab8fe0829d30f0
    * */

    var userFeed = new Instafeed({
        get: 'user',
        userId: '309982629',
        limit: 20,
        resolution: 'standard_resolution',
        tagName: 'awesome',
        accessToken: '309982629.b57e75e.9741571cf6c840a18a8ada2ae207ef5e',
        sortBy: 'most-recent',
        template: '<div class="ins-photo">' +
        '<a class="ins-photo__img" href="{{link}}" title="{{caption}}" target="_blank">' +
        '<img src="{{image}}" alt="{{caption}}" class="img-fluid"/>' +
        '</a>' +
        '</div>'
    });


    userFeed.run();


});
