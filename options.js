function save_options(){
  var delay = document.getElementById("delay").value;
  var limit = document.getElementById("limit").value;

  chrome.storage.sync.set({
    attemptDelay: delay,
    attemptLimit: limit
  }, function(){
    var status = document.getElementById("status");
    status.textContent = "Options Saved";
    setTimeout(function(){
      status.textContent = "";
    }, 750);
  });
}

function restore_options(){
  chrome.storage.sync.get({
    attemptDelay: 5,
    attemptLimit
  }, function(items){
    document.getElementById("delay").value = items.attemptDelay;
    document.getElementById("limit").value = items.attemptLimit;
  });
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
