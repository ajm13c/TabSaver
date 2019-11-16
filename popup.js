
let popup     = document.getElementById('popup');
let saveBtn   = document.getElementById('saveBtn');
let openBtn   = document.getElementById('openBtn');
let okBtn     = document.getElementById('okBtn');
let titleInput = document.getElementById('titleInput');
let cancelBtn = document.getElementById('cancelBtn');
titleInput.style.display = 'none';

var sessionTitles = new Set();
loadSessionTitles();

function loadSessionTitles() {
  chrome.storage.local.get({'sessions': []}, function (data) {
    console.log(data);
    for (var i = 0; i < data.sessions.length; i++) {
      sessionTitles.add(data.sessions[i]["title"]);
    }
  });

  console.log(sessionTitles);
}

function validateTitle() {
  //check if already exists -> change border color to error
  if (sessionTitles.has(titleInput.value)) {
    titleInput.style.borderColor = 'red';
    return false;
  }

  //else change border color to non error
  titleInput.style.borderColor = 'white';
  return true;
}

titleInput.oninput = function () {
  validateTitle();
}

okBtn.onclick = function () {
  console.log('ok clicked');

  if (!validateTitle())
    return;

  let title = titleInput.value;

  if (title == null || title == ''){
    titleInput.focus();
    titleInput.style.borderColor = 'red';
    return;
  }    

  // Query for all open tabs
  chrome.tabs.query({
    currentWindow: true
  }, function (currentWindowTabs) {

    var obj = {
      'title': title,
      'urls': [] 
    };

    // Add all URLs to a json object
    for ( var i = 0; i < currentWindowTabs.length; i++ ) {
      obj['urls'].push(currentWindowTabs[i].url);
    }

    // have to get the whole sessions array, append new session, and save
    chrome.storage.local.get({'sessions': []}, function (data) {
      console.log(data);

      data.sessions.push(obj);
      sessionTitles.add(obj['title']);

      chrome.storage.local.set({'sessions': data.sessions}, function () {
        console.log('Updated list');
        // close upon completion
        window.close();
      });

    })

    console.log(obj);
  });
}

saveBtn.onclick = function () {
  console.log('Save clicked.');

  //hide the openBtn and show the title Input
  openBtn.style.display = 'none';
  titleInput.style.display = 'table-cell';
  okBtn.style.display = 'table-cell';

  //hide the save button and show the cancel button
  saveBtn.style.display = 'none';
  cancelBtn.style.display = 'table-cell';

  titleInput.focus();
  return;
};

cancelBtn.onclick = function () {
  window.close();
}
