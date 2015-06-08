// TODO: double quotes -> single quotes
// TODO: Convert to vanilla javascript

var folders = JSON.parse(localStorage.getItem('folders'));

if (!folders) {
    
    folders = {
	"initialized": false,
	"inbox": [],
	"lists": [
	    {
		"name": "Urgent",
		"messages": []
	    }, {
		"name": "To Do",
		"messages": []
	    }
	],
	"archive": []
    };

    localStorage.setItem('folders', JSON.stringify(folders));
}

var folderHasValue = function(folder, val) {
       
    for (var i = 0; i < folders[folder].length; i++) {
	if (folders[folder][i] === val) {
	    return true;
	}
    }
    return false;
};

var removeFromFolder = function(folder, val) {
    var index = folders[folder].indexOf(val);
    folders[folder] = folders[folder].slice(0,index).concat(folders[folder].slice(index + 1));
};

var getCurrentFolder = function() {
    if ($('.folder-name.active').hasClass('folder-inbox')) {
	return 'inbox';
    } else if ($('.folder-name.active').hasClass('folder-archive')) {
	return 'archive';
    }
};

var spinner = "_3u55 _3qh2 img sp_IK9bak_1Td0 sx_01dd90";

var prependSideBarToBody = function() {
    $('body').prepend('<div class="side"><div class="top"><div class="folder-title">Folders</div></div><div class="folder-name folder-inbox active"><i class="mdi-content-inbox fb-blue"></i><div><p>Inbox<span class="grey" style="float:right;">' + folders.inbox.length + '</span></p></div></div><div class="folder-name folder-lists folder-lists-top"><i class="mdi-action-list brown"></i><div><p>Lists</p></div></div><div class="folder-name folder-archive"><i class="mdi-action-done green"></i><div><p>Archive</p></div></div></div>');

    folders.lists.forEach(function(val, index, arr) {
	$('.folder-lists-top').after('<div class="folder-name folder-lists folder-sub-list folder-' + val.name.replace(/\s+/g, '-').toLowerCase() + '"><div><p>' + val.name + '<span style="float:right;">' + val.messages.length + '</span></p></div></div>');
    });

    $('.folder-name').click(function(){
	if(!$(this).hasClass('active')) {
	    $('.active').removeClass('active');
	    $(this).addClass('active');
	}

	if ($(this).hasClass('folder-archive')) {
	    changeFolder('archive');
	}

	if ($(this).hasClass('folder-inbox')) {
	    changeFolder('inbox');
	}
    });

    
};



var prependButtonsToTopBar = function() {
    $('._5742').prepend('<div class="folder-buttons"><i class="mdi-content-inbox inbox-button fb-blue"></i><i class="mdi-action-done archive-button green"></i><i class="mdi-action-list list-button brown"></i></div>');

    $('.archive-button').click(function() {
	console.log('archive button pressed');
	if (getCurrentFolder() !== 'archive') {
	    swipeRight($('._1ht1._1ht2')[0]);
	}
    });

    $('.inbox-button').click(function() {
	console.log('inbox button pressed');
	if (getCurrentFolder() !== 'inbox') {
	    swipeRight($('._1ht1._1ht2')[0]);
	}
    });
};



var changeFolder = function(folder) {
    $('._1ht1').hide();

    if (folder === 'archive') {
	folders.archive.forEach(function(threadID) {
	    $('[data-reactid="' + threadID + '"]').show();
	});
    }

    if (folder === 'inbox') {
	$('._1ht1').each(function(index, el) {
	    if(!folderHasValue('archive', $(el).attr('data-reactid'))) {
		$(el).show();
	    }
	});
    }
    
    
}


var swipeRight = function(el) {
    var greenBox = '<li class="_1ht1 green-box"><i class="mdi-action-done green"></i></li>'
    var blueBox = '<li class="_1ht1 blue-box"><i class="mdi-content-inbox blue"></i></li>'
    // can pull out of function

    var currentFolder = getCurrentFolder();
    
    console.log('swipe right');
    
    $(el).addClass("slide-right");

    if (currentFolder === 'inbox') {
	$(el).before(greenBox);
    } else if (currentFolder === 'archive') {
	$(el).before(blueBox);
    }
    
    
    $(el).on('animationend webkitAnimationEnd', function() {
    	console.log("animationend");
	// have to check if there is a next element, if not, click the previous, if that doesn't exist, deal with that case.
	$(this).next().children()[0].click(); 
    	$(this).hide();

	if (currentFolder === 'inbox') {
	    $('.green-box').remove();
	} else if (currentFolder === 'archive') {
	    $('.blue-box').remove();
	}

	if (currentFolder === 'inbox') {
	    if(folderHasValue('inbox', $(this).attr('data-reactid'))) {
		removeFromFolder('inbox', $(this).attr('data-reactid'));
	    }
	    
	    if(!folderHasValue('archive', $(this).attr('data-reactid'))) {
		folders.archive.push($(this).attr('data-reactid'));
		localStorage.setItem('folders', JSON.stringify(folders));
	    }
	} else if (currentFolder === 'archive') {
	    if(folderHasValue('archive', $(this).attr('data-reactid'))) {
		removeFromFolder('archive', $(this).attr('data-reactid'));
	    }
	    
	    if(!folderHasValue('inbox', $(this).attr('data-reactid'))) {
		folders.inbox.push($(this).attr('data-reactid'));
		localStorage.setItem('folders', JSON.stringify(folders));
	    }
	}
	
	
    });
};



var showAdded = new Event('show-added');
var threadAdded = new Event('thread-added');

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {

	// Debug Stuff
	// console.log(mutation);
	// debugger;
	// if (!!mutation.addedNodes[0]) {
	//     console.log(mutation.addedNodes[0]);
	// }

	
	
	if (!!mutation.removedNodes[0] && mutation.removedNodes[0].className === "_3u55 _3qh2 img sp_IK9bak_1Td0 sx_01dd90") {
	    console.log('continue');
	}

	if (!!mutation.removedNodes[0] && mutation.removedNodes[0].className === "_19hf") {
	    console.log("END");
	    $('.message-container').html('<p>Finished!</p><a href="#" class="button archive-all-button">Archive all threads</a>');

	    $('.archive-all-button').click(function() {
		$('._1ht1').each(function() {
		    if(!folderHasValue('archive', $(this).attr('data-reactid'))) {
			$(this).hide();
			folders.archive.push($(this).attr('data-reactid'));
			localStorage.setItem('folders', JSON.stringify(folders));
		    }
		});

		$('._1ht1').slice(20).remove();

		folders.initalized = true;
		localStorage.setItem('folders', JSON.stringify(folders));

		$('.scan').remove();
	    });
	    
	    // continue checking till next mutation's previousSibling !== '_1ht1' to ensure all _1ht1's are loaded in?
	}


	// Fire show-added event
	if (!!mutation.addedNodes[0] && mutation.target.className === "_19hf" && mutation.addedNodes[0].attributes['data-reactid'].nodeValue === ".0.1.$0.0.1.1.0.0.0.0.1.1.0") {
	    window.dispatchEvent(showAdded);
	}
	

	// Prepend sidebar
	if (!!mutation.addedNodes[0] && mutation.addedNodes[0].nodeName === "BODY") {
	    prependSideBarToBody();
	}



	// Prepend topBar and initalize folders
	if (!!mutation.addedNodes[0] && mutation.target.className === "_2sdm") {	    
	    prependButtonsToTopBar();

	    if (!folders.initalized) {
		$('._2xhi._5vn4').prepend('<div class="scan"><div class="message-container"><a href="#" class="button scan-button">Start Scan</a></div></div>');

		$('.scan-button').click(function() {

		    $('.message-container').html('<p><i class="_3u55 _3qh2 img sp_IK9bak_1Td0 sx_01dd90"></i>Scanning...</p>');
		    var threadCount = $('._1ht1').length;
		    $('.message-container').append('<p class="scan-count grey">' + $('._1ht1').length + ' messages scanned...</p>');
		    window.addEventListener('thread-added', function() {
			threadCount++;
			$('.scan-count').text(threadCount + ' messages scanned...');
		    });
		    
		    $('[data-reactid=".0.1.$0.0.1.1.0.0.0.0.1.1.0"]')[0].click();
		    
		    window.addEventListener('show-added', function() {
			$('[data-reactid=".0.1.$0.0.1.1.0.0.0.0.1.1.0"]')[0].click();
		    });
		});
	    }
	    
	}



	// Adds dbclick listener for swipe right on _1ht1's
	if (!!mutation.addedNodes[0] &&
	    (mutation.addedNodes[0].className === "_1ht1" ||
	     mutation.addedNodes[0].className === "_1ht1 _1ht2")) {
	    
	    window.dispatchEvent(threadAdded);

	    if (folderHasValue('archive', mutation.addedNodes[0].attributes['data-reactid'].nodeValue)) {
		console.log('in archive');
		$(mutation.addedNodes[0]).hide();
	    }
	    
	    $(mutation.addedNodes[0]).dblclick(function(){
	        swipeRight(this);
	    });
	    
	}
    });    
});

observer.observe($('html')[0], { childList: true, subtree: true });
