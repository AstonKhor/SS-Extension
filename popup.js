function main(items) {
	var global = items.global || { };
	// console.log('global', global)
	// $('#toggle_enable').click(function() {
	// 	this.innerText = this.innerText == 'DISABLED' ? 'ENABLED' : 'DISABLED';
	// 	if( this.innerText == 'ENABLED' ) {
	// 		$(this).css('color', '#00AA00');
	// 		//change icon
	// 	}
	// 	else {
	// 		$(this).css('color', '#CC0000');
	// 		// change icon
	// 	}
	// }).click(); // Initialize to ENABLED.
	// But enable if it gotta be enabled (the timeout is because setIcon sometimes doesn't catch up fast enough and also try not to abuse asyn methods 
	if(global.enabled) setTimeout( function() { $('#toggle_enable').click() }, 10 );
	// And then bind the event that actually saves the enabled state to storage
	$('#toggle_enable').click(function() {
		this.innerText = this.innerText == 'DISABLED' ? 'ENABLED' : 'DISABLED';
		if( this.innerText == 'ENABLED' ) {
			$(this).css('color', '#00AA00');
			//change icon
		}
		else {
			$(this).css('color', '#CC0000');
			// change icon
		}

		global.enabled = this.innerText == 'ENABLED';
		if( global.enabled ) {
			// Run the content script on enable since we can still do what has not been done yet
			chrome.runtime.sendMessage("intercept", (item) => {
				console.log('it worked', item);
			});
			console.log('here enabled');
		}
		else {
			// Refresh on disable since we can't undo what was done
			console.log('disabled: attempting to refresh')
			chrome.runtime.sendMessage("refresh", () => {
				console.log('disable worked');
			});
		}

		chrome.storage.sync.set( { global: global } );

	}).click().click();

	$('#open_options').click(function() {
		if (chrome.runtime.openOptionsPage) {
	    	// New way to open options pages, if supported (Chrome 42+).
	    	chrome.runtime.openOptionsPage();
		} else {
			// Reasonable fallback.
			window.open(chrome.runtime.getURL('options.html'));
		}
	});
}

chrome.runtime.onMessage.addListener(function(request, sender, cb) {
	console.log('inside updating intercepted');
	if (request.type === 'updateIntercepted') {
		$('#interceptedURL').val('hello world');
	}
})

$(document).ready(function() {
	chrome.storage.sync.get('global', main);
});
