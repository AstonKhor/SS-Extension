chrome.storage.sync.get({
    searches: {},
  }, function({ searches }) {
    for (let search in searches) {
      let replace = searches[key];
      if (search !== '' && replace !== '') {
          let regex_val = new RegExp('\\b' + search + '\\b', 'gi');
          document.body.innerHTML = document.body.innerHTML.replace(regex_val, replace);
      }
    }
});

