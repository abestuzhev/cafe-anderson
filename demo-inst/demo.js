/*
 * jQuery Instagram Browser Demo
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


$(document).ready(function(){
	// Calling the Plugin
	$('.demo').instagramBrowser({
		mode: 'user',
		// accessToken : '421631593.e029fea.0ab43b7d616641c9929ee8ec2112d8ed',
		// accessToken : '421631593.e029fea.0ab43b7d616641c9929ee8ec2112d8ed',
		// userID: '309982629'
		// userID: '2255098913'

		// FALLBACK
		userID: '2255098913',
		accessToken : '2255098913.1677ed0.67fe3a5539e94e58ba7cbe864d233d97',
	});

	// Demo Starter
	// $('.start-demo').click(function(){
	// 	$(window).scrollTop(600);
	// });

	$("ul.ibSearchType li").click(function(){
		// Remove Active
		$("ul.ibSearchType li").removeClass("active");

		// Switch Type Rel, Switch Type Default Value
		$(".searchContainer .searchBox").attr("rel",$(this).attr("class")).val("Search for a " + $(this).attr("class"));

		// Add Active
		$(this).addClass("active");
	});

	// Pretty-fy Demo
	// prettyPrint();

	// This is for demo purposes only...
	// var quickNavHtml = "";
	// quickNavHtml += '<div id="quicknav">';
	// quickNavHtml +=		'<strong class="close">Collapse</strong>';
	// quickNavHtml +=		'<h1>Quick Navigation</h1>';
	// quickNavHtml +=		'<ul class="support-options">';
	// quickNavHtml +=			'<li class="start-demo also">';
	// quickNavHtml +=				'<a class="clickable">Getting Started<span>Getting Started is easy, simply type in a simply type in a username or hashtag.</span></a>';
	// quickNavHtml +=			'</li>';
	// quickNavHtml +=			'<li class="theme-demo">';
	// quickNavHtml +=				'<a>Select A Search Mode<span>You can search by user or tags.</span></a>';
	// quickNavHtml +=				'<select class="modeDemoSelect">';
	// quickNavHtml +=					'<option selected="selected" value="user">Username</option>';
	// quickNavHtml +=					'<option value="hashtag">Hashtag</option>';
	// quickNavHtml +=				'</select>';
	// quickNavHtml +=			'</li>';
  //
	// quickNavHtml +=			'<li class="also">';
	// quickNavHtml +=				'<a>Search by Users<span>';
	// quickNavHtml +=				'You can search by users which will pull in a list of usernames that are close to your query. Upon clicking on a username, all of thier photos will load.';
	// quickNavHtml +=				'</span></a>';
	// quickNavHtml +=			'</li>';
  //
	// quickNavHtml +=			'<li class="also">';
	// quickNavHtml +=				'<a>Search by Hashtags<span>';
	// quickNavHtml +=				'You can search by hashtags which will pull in all photos that have that hashtag.';
	// quickNavHtml +=				'</span></a>';
	// quickNavHtml +=			'</li>';
  //
	// quickNavHtml +=			'<li class="also">';
	// quickNavHtml +=				'<a>Load More Functionality<span>By default, the instaram API only lets you pull in 20 items(photos,users) at a time. However, to provide the best experience this plugin has a load more button!';
	// quickNavHtml +=				' With this button, this plugin makes ajax calls to Instagram to pull in the next set of results. This is very powerful because you can keep "loading more" untill all items have been loaded.';
	// quickNavHtml +=				'</span></a>';
	// quickNavHtml +=			'</li>';
  //
	// quickNavHtml +=			'<li class="also">';
	// quickNavHtml +=				'<a>Other Features<span>There are a bunch of cool settings to help you cutsomize your plugin experience. This plugin comes with good documentation to show you the way!</span></a>';
	// quickNavHtml +=			'</li>';
	// quickNavHtml +=		'</ul>';
	// quickNavHtml +=		'<strong class="close">Collapse</strong>';
	// quickNavHtml +=		'<strong class="open">Expand</strong>';
	// quickNavHtml += '</div>';
  //
	// $("body").append(quickNavHtml);


	// $('#quicknav').delay(700).animate({
	// 	'right': '+=343px'
	// }, 250);

	// var navVisible = true;

	// $('.close').click(function() {
  // 		if(navVisible == true){
	// 		$('#quicknav').animate({
	// 			'right': '-=243px'
	// 		}, 250);
	// 		navVisible = false;
  //
	// 		$(this).hide();
	// 		$('.open').show();
	// 	}
	// });
  //
	// $('.open').click(function() {
  // 		if(navVisible == false){
	// 		$('#quicknav').animate({
	// 			'right': '+=243px'
	// 		}, 250);
	// 		navVisible = true;
  //
	// 		$(this).hide();
	// 		$('.close').show();
	// 	}
	// });

	$("div#quicknav .modeDemoSelect").change(function(){
		// Remove Active
		$("ul.ibSearchType li").removeClass("active");

		// Switch Type Rel, Switch Type Default Value
		$(".searchContainer .searchBox").attr("rel",$(this).val()).val("Search for a " + $(this).val());

		// Add Active
		$("ul.ibSearchType li." + $(this).val() ).addClass("active");
	});

});
