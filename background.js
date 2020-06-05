window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
function onInitFs(fs) {
  console.log(fs);
  console.log('Opened file system: ' + fs.name);

  chrome.runtime.onMessage.addListener(function(request, sender, cb) {
    console.log('inside background message recieved');
    if (request.type === 'save') {
      console.log('save here');
      console.log(request.file);
      console.log(request.fileName);
      
      fs.root.getFile(request.fileName, {create: true, exclusive: true}, function(fileEntry) {
        console.log('success on file created')
        fileEntry.createWriter(function(fileWriter) {
          
          fileWriter.onwriteend = function(e) {
            console.log('Write completed.');
            chrome.runtime.sendMessage({type: 'file saved', file: request.file, fileName: request.fileName})
          };
    
          fileWriter.onerror = function(e) {
            console.log('Write failed: ' + e.toString());
          };
    
          // Create a new Blob and write it to log.txt.
          var blob = new Blob([request.file], {type: 'text/plain'});
          console.log(blob);
    
          fileWriter.write(blob);

          // var link = document.createElement("a");


          // document.body.appendChild(link); // for Firefox

          // link.setAttribute("href", base64);
          // link.setAttribute("download", fileName);
          // link.click();
    
        }, errorHandler);
        console.log('created file');
      }, errorHandler);

    }
    if (request.type === 'clicked') {
      fs.root.getFile(request.fileName, {}, function(fileEntry) {

        // Get a File object representing the file,
        // then use FileReader to read its contents.
        fileEntry.file(function(file) {
           var reader = new FileReader();
    
           reader.onloadend = function(e) {
             console.log('success reading file')
             chrome.runtime.sendMessage({type: 'download', img: this.result})
           };
    
           reader.readAsDataURL(file);
        }, errorHandler);
    
      }, errorHandler);
    }
  })


}

function errorHandler(e) {
  var msg = '';

  // switch (e.code) {
  //   case FileError.QUOTA_EXCEEDED_ERR:
  //     msg = 'QUOTA_EXCEEDED_ERR';
  //     break;
  //   case FileError.NOT_FOUND_ERR:
  //     msg = 'NOT_FOUND_ERR';
  //     break;
  //   case FileError.SECURITY_ERR:
  //     msg = 'SECURITY_ERR';
  //     break;
  //   case FileError.INVALID_MODIFICATION_ERR:
  //     msg = 'INVALID_MODIFICATION_ERR';
  //     break;
  //   case FileError.INVALID_STATE_ERR:
  //     msg = 'INVALID_STATE_ERR';
  //     break;
  //   default:
  //     msg = 'Unknown Error';
  //     break;
  // };

  console.log('Error: ' + e);
}
var req = 5*024*1024;

navigator.webkitPersistentStorage.requestQuota (
  req, function(grantedBytes) {  
      console.log('we were granted ', grantedBytes, 'bytes');
      window.requestFileSystem(window.PERSISTANT, 5*1024*1024, onInitFs, errorHandler);
  }, function(e) { console.log('Error', e); }
);


// navigator.webkitPersistentStorage.requestQuota(5*1024*1024, function(grantedBytes) {
//   console.log(grantedBytes, 'granted as storage');
//   window.webkitRequestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler);
// }, function(e) {
//   console.log('Error', e);
// });