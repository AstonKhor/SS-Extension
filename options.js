// Saves options to chrome.storage
function save_options() {
  var search = document.getElementById('search').value;
  var replace = document.getElementById('replace').value;
  chrome.storage.sync.get([
    'searches'
    ], function({ searches }) {
      if (!searches) {
        searches = {};
      }
      searches[search] = replace;
    chrome.storage.sync.set({
        searches: searches,
      }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        restore_options();
        setTimeout(function() {
          status.textContent = '';
        }, 1500);
      });
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    searches: {},
  }, function({ searches }) {
    document.getElementById('search').value = '';
    document.getElementById('replace').value = '';
    let tableBody = document.getElementById('data');
    tableBody.innerHTML = '';
    for (let key in searches) {
      let row = document.createElement('tr');
      row.id = `${key},${searches[key]}`
      let search = document.createElement('td');
      search.innerHTML = key;
      let replace = document.createElement('td');
      replace.innerHTML = searches[key];
      let remove = document.createElement('button');
      remove.innerHTML = "X";
      remove.addEventListener('click', () => {removeSearch(row.id)})
      //handle click of remove
      row.appendChild(search);
      row.appendChild(replace);
      row.appendChild(remove);
      tableBody.appendChild(row);
    }
  });
}

function removeSearch(rowId) {
  chrome.storage.sync.get({
    searches: {},
  }, function({ searches }) {
    let tableBody = document.getElementById(rowId);
    tableBody.remove();
    let key = rowId.split(',')[0];
    delete searches[key];
    chrome.storage.sync.set({
      searches: searches
    }, function() {
      var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        restore_options();
        setTimeout(function() {
          status.textContent = '';
        }, 1500);
    })
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);