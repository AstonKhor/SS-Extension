let cb = (details) => {
	console.log('details', details);
	return {redirectUrl: 'www.amazon.com'};
}
let filter = {urls: ['*://www.google.com/*']};
let opt_extraInfoSpec = [
	'blocking',
]
console.log('BLOCKING');
chrome.runtime.sendMessage({action: "block"}, function(response) {
  document.getElementById('interceptedHTML').value = response.farewell
});
// let main = function() {
//   console.log(chrome.webRequest);
//   chrome.webRequest.onBeforeRequest.addListener(cb, filter, opt_extraInfoSpec);
// }
// main();