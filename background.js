chrome.browserAction.onClicked.addListener(function() {
  let status = document.getElementsByTagName('BODY')[0];
  console.log('hello world')
  status.innerHTML = 'hello world';
  chrome.tabs.executeScript({ file: "content.js" });
});

//check if setting is false