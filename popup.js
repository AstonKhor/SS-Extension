function main(items) {
	var global = items.global || { };
	console.log('glob', global)
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
	}).click().click(); // Initialize to DISABLED.
	// But enable if it gotta be enabled (the timeout is because setIcon sometimes doesn't catch up fast enough and also try not to abuse asyn methods 
	if(global.enabled) setTimeout( function() { $('#toggle_enable').click() }, 10 );
	// And then bind the event that actually saves the enabled state to storage
	$('#toggle_enable').click(function() {
		global.enabled = this.innerText == 'ENABLED';
		chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {
			if( global.enabled ) {
				// Run the content script on enable since we can still do what has not been done yet
				chrome.tabs.sendMessage(tabs[0].id, "run_cs", (item) => {
					console.log('it worked', item);
					updateCount();
				});
				console.log('here enabled');
			}
			else {
				updateCount(true);
				// Refresh on disable since we can't undo what was done
				chrome.tabs.sendMessage(tabs[0].id, "refresh");
			}

			chrome.storage.sync.set( { global: global } );
		});

	});

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

function updateCount(clear) {
	chrome.storage.sync.get('count', (items) => {
		let countEl = document.getElementById('count');
		if (clear) {
			countEl.innerHTML = 0;
		} else {
			countEl.innerHTML = items.count;
		}
		console.log('items', items);
	})
}

$(document).ready(function() {
	chrome.storage.sync.get('global', main);
});
