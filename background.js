var currentVersion = '1.0';
var defaultReplaces = {
  'covid': '[Removed]',
  'COVID-19': '[Removed]',
  'COVID19': '[Removed]',
  'COVID 19': '[Removed]',
  'CORONA': '[Removed]',
  'CORONA VIRUS': '[Removed]',
  'CORONAVIRUS': '[Removed]',
  'CDC': '[Removed]',
  'NCOV': '[Removed]',
  'PANDEMIC': '[Removed]',
  'COV': '[Removed]',
  'SARS-COV-2': '[Removed]',
  'N95': '[Removed]',
}


chrome.storage.sync.get(['global'], function(items) {
	var global = items.global || { };

	// // Update icon
	// if( global.enabled ) {
	// 	chrome.browserAction.setIcon( { path: 'images/icon_19.png' } );
	// }
	// else {
	// 	chrome.browserAction.setIcon( { path: 'images/icon_19_disabled.png' } );
	// }

	if( global.version != currentVersion ) {
		// Update version
		global.version = currentVersion;
		// Update some variables to their default value
		global.enabled = true;

		global.showChangelog = true;
	}

	chrome.storage.sync.set({ global: global, searches: defaultReplaces, count: 0 });
});