jQuery('.portfolio-thumbnail-holder span').stop().animate({ "opacity": 0 }, 0);
	
jQuery(".portfolio-thumbnail-holder,.gallery.clearfix").hover(function(){
	jQuery(this).css("background-color", "#111"); 
	jQuery(this).find('div').stop().animate({ opacity: .2 }, 350);
	jQuery(this).find('span').stop().animate({ opacity: 1}, 350);
}, function(){
	jQuery(this).find('span').stop().animate({ opacity: 0}, 350);	
	jQuery(this).find('div').stop().animate({ opacity: 1 }, 350);
	jQuery(this).css("background-color", "#EFEFF0"); 
});

jQuery("a.n").attr("target", "_blank");
jQuery("a").attr("target", "_blank");
jQuery(".seo").hide();