function main() {
	chrome.storage.sync.get({
    global: {},
  }, function(items) {
		// If the extension is disabled, do nothing.
		if( !items.global.enabled ) return;

    chrome.storage.sync.get(['searches'], function({ searches }) {
      let body = document.body.innerHTML;
      let count = 0;
      for (let search in searches) {
        let replace = searches[search];
        if (search !== '') {
          let regex_val = new RegExp('\\b' + search + '\\b', 'gi');
          body = body.replace(regex_val, () => {
            count++;
            return replace;
          });
        }
      }
      document.body.innerHTML = body;
      chrome.storage.sync.set({
        count: count
      })
    });
	});
}

// Bind events to communicate with the browser action
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  // CC was enabled 
  console.log('req', request);
  // return callback({farewell: "goodbye"});
	if( request == 'run_cs' ) {
		main();
	}
	// CC was disabled
	if( request == 'refresh' ) {
		location.reload();
	}
});

main();

// console.log('here');
//add funtionality for googs and ytubes and maybe linkedin
//