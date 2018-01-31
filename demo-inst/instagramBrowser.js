/*
 * jQuery Instagram Browser
 * Version: 1.0
 *
 * Author: Chris Rivers
 * http://chrisriversdesign.com
 *
 *
 * Changelog:
 * Version: 1.0
 *
 */

// Global
var ibObj;
var instagramBrowserNextMax;
// var instagramBrowserNextURL;

/* Instagram Popular Fetch
------------------------------*/
function instagramFetch(settings){
	var access_token = settings.accessToken;
    var param = {access_token:access_token};
    fetchCMD(param, settings);
}

function fetchCMD(param, settings){

	var cmdURL = "";

	if( settings.mode == 'user' ){
		// User Mode
		cmdURL = 'https://api.instagram.com/v1/users/' + settings.userID + '/media/recent/?callback=?';
	} else {
		// Popular Mode
    	cmdURL = 'https://api.instagram.com/v1/media/popular?callback=?';
	}

   	$.getJSON(cmdURL, param, function(data){
		onPhotoLoaded(data, settings);
	});

}

/* Instagram Tag Search
------------------------------*/
function instagramSearch(settings){
	var access_token = settings.accessToken;
    var param = {access_token:access_token};

	var searchQuery = $(".searchBox").val().replace(/ /g,'');
	console.log(searchQuery);

    searchCMD(param, settings, searchQuery);
}

function searchCMD(param, settings, searchQuery){

	var cmdURL = "";

	// Tag Search
	cmdURL = 'https://api.instagram.com/v1/tags/' + searchQuery + '/media/recent?callback=?';

   	$.getJSON(cmdURL, param, function(data){
		onPhotoLoaded(data, settings);
	});

}

/* Instagram User Search
------------------------------*/
function instagramUserSearch(settings){
	var access_token = settings.accessToken;
	var searchQuery = $(".searchBox").val().replace(/ /g,'');
	var param = {access_token:access_token,q:searchQuery};

    userSearchCMD(param, settings);
}

function userSearchCMD(param, settings){
	var cmdURL = 'https://api.instagram.com/v1/users/search?callback=?';

   	$.getJSON(cmdURL, param, function(data){
		onUserLoaded(data, settings);
	});
}

function onUserLoaded(data, settings){
	if( data.meta.code == 200 ){
        var users = data.data;
		// console.log(data);

		if( users.length > 0 ){
            for( var key in users ){
				// Build UI
				var user = users[key];
				var instagramUser = '';

				instagramUser = '<div class="instagram-user" id="p' + user.id + '" title="' + user.username + '" rel="' + user.id + '">';
				instagramUser += 	"<img src='" + user.profile_picture + "' />";
				instagramUser += 	"<span class='instagram-username'>" + user.username + "</span>";
				instagramUser += 	"<span class='instagram-fullname'>" + user.full_name + "</span>";
				instagramUser += '</div>';

	            $(instagramUser).appendTo(ibObj);

			}
		}

	}
}

/*
https://instagram.com/oauth/authorize/?client_id=b57e75ea6a1e4a30bdab8fe0829d30f0&redirect_uri=https://abestuzhev.github.io/cafe-anderson&response_type=token
*/

/* Instagram Load More
---------------------------------*/
function instagramLoadMore(settings){
	var access_token = settings.accessToken;
    var param = {access_token:access_token, max_tag_id: instagramBrowserNextMax};

	var searchQuery = $(".searchBox").val().replace(/ /g,'');

    loadMoreCMD(settings,param,searchQuery);
}

function loadMoreCMD(settings, param, searchQuery){

	var cmdURL = "";
	cmdURL = "https://api.instagram.com/v1/tags/" + searchQuery + "/media/recent?callback=?";

   	$.getJSON(cmdURL, param, function(data){
		onPhotoLoaded(data, settings);
	});

}

/* Photo Handler
------------------------------*/
function onPhotoLoaded(data, settings){

	// Store Next Page of Results...
	if( data.pagination ){
		// instagramBrowserNextURL = data.pagination.next_url;
		instagramBrowserNextMax = data.pagination.next_max_id;

	} else {
		instagramBrowserNextMax = "Empty";
	}

    if( data.meta.code == 200 ){

		// Testing
		// console.log(data);

		// Setting Up Variables
        var photos = data.data;

		if( ibObj.html() != "" ){
			var addingToList = true;
		} else {
			var addingToList = false;
		}

        if( photos.length > 0 ){

			// console.log(photos);

            for( var key in photos ){

				// Get Photo Data
				var photo = photos[key];

				// Build DOM
				var instagramPhoto = '';
				var photoCaption = '';

				if( photo.caption ){
					photoCaption = photo.caption.text;
				} else {
					photoCaption = "Instagram Photo";
				}

				instagramPhoto = '<span class="instagram-photo" rel="' + photo.user.full_name + '" id="p' + photo.id + '" title="' + photoCaption + ' (' + photo.likes.count + ' Likes)" data-created="' + photo.created_time + '">';
				instagramPhoto +=    '<img src="' + photo.images.standard_resolution.url + '" width="100%">';
				instagramPhoto += '</span>';

	            $(instagramPhoto).appendTo(ibObj);
            }

			// Count photos
			var photoCount = $('.instagram-photo').size() - 1;
			console.log(photoCount);

			$('.count-phoro span').appendTo(photoCount + 1);

			if( addingToList == false ){
				$('.instagram-photo').hide();
			}

			$('.instagram-photo').each(function(index){

				// Store Current Photo
				currentPhoto = $(this);

				// Render Effect
				currentPhoto.delay( settings.delayInterval * index ).fadeIn(settings.speed);

				// TEMPORARILY REMOVED LOAD MORE LOGIC. NEED TO FIX USER LOAD MORE.
				/*
				// Load More Logic
				if( index == photoCount && instagramBrowserNextMax != "Empty" ){
					// Clear Any Existing Load More Buttons
					$("#seachInstagramLoadMoreContainer").remove();

					// Load More Button
					$('<div id="seachInstagramLoadMoreContainer"><a class="seachInstagramLoadMore btn btn-inverse">Load More</a></div>').appendTo(ibObj);
				}
				*/

			});

        } else {
            alert('empty');
        }

    } else {
        alert(data.meta.error_message);
    }
}

$.fn.instagramBrowser = function ( options ) {

	/* Setting Up Variables
	------------------------------*/
	var settings = {
		mode : 'popular', // This sets the mode to either "user" or "popular". Either pull from the popular feed or your user feed. Default is set to popular
		accessToken : '3794301.f59def8.e08bcd8b10614074882b2d1b787e2b6f', // This a mandatory setting that allows you to specify a user token. Default is 3794301.f59def8.e08bcd8b10614074882b2d1b787e2b6f
		userID : '1138644', // This is a setting that you have to use if your using "user" mode. Default is "For stunning photography – Kevin Burg".
		speed: 700, // Sets the speed of the images fade in effect, default is 700.
		delayInterval : 80, // Sets the interval of the delay between photos appearing, default is 80.
		searchBox : ".searchContainer .searchBox"
	};

	ibObj = $(this);

	// Combine your options with our settings...
	$.extend(settings, options);

	/* Plugin Logic
	------------------------------*/
	return this.each(function() {

		// Powers Activate...
		$(document).ready(function(){
			instagramFetch(settings);
		});

		// Events
		$(".searchInstagram").click(function(){
			// Clear UI
			ibObj.html("");

			// Detect if the input has user rel or tag rel and use different methods for each...
			if( $(settings.searchBox).attr("rel") == "user" ){
				instagramUserSearch(settings);
			} else {
				instagramSearch(settings);
			}

		});

		$(".seachInstagramLoadMore").live("click", function(){
			instagramLoadMore(settings);
		});

		$(".instagram-user").live("click", function(){
			// Clear UI
			ibObj.html("");

			var customSettings = settings;
			customSettings.mode = 'hashtag';
			customSettings.userID = $(this).attr("rel");
			// console.log(customSettings);

			instagramFetch(settings);
		});

		$(".instagram-photo").live({
			mouseenter: function() {
				var thisPhoto = $(this);
				var obHeight = thisPhoto.height();
				var obWidth = thisPhoto.width();

				// Date Conversion
				var obDate = parseInt(thisPhoto.attr("data-created"));
				obDate = new Date( obDate * 1000 );
				obDate = dateFormat(obDate, "dddd, mmmm dS, yyyy, h:MM:ss TT");

				var photoDesc = '<div class="instagram-hover-cover">';
				photoDesc +=        '<h3>' + thisPhoto.attr("rel") + '</h3>';
				photoDesc +=        '<em>' + obDate + '</em>';
				photoDesc +=        '<p>' + thisPhoto.attr("title").substring(0,196) + '</p>';
				photoDesc +=    '</div>';

				// Add Hover UI
				thisPhoto.append(photoDesc);

				// Size Hover UI
				$('.instagram-hover-cover').hide().css({
					"height" : "114px", // obHeight,
					"width" : obWidth
				}).slideDown("fast");
			},
			mouseleave: function(){
				var thisPhoto = $(this);

				thisPhoto.find(".instagram-hover-cover").delay(500).slideUp("fast", function(){
					$(this).remove();
				});
			}
		});

	});
}
