var continueAttempts = {};

var callback = function (details) {
  if (details.error == "net::ERR_INTERNET_DISCONNECTED" && details.type == "main_frame") {
    var tabId = details.tabId || -1;
    var attempt = continueAttempts[tabId] || 1;
    console.log("DCR conditions met in tab " + tabId + " - attempt " + attempt);
    chrome.storage.sync.get({
      attemptDelay: 5,
      attemptLimit: -1
    },function(items){
      var delay = items.attemptDelay;
      var limit = items.attemptLimit;
      if(limit > 0 && attempt > limit){
        console.log("Attempt limit reached. Will not reload anymore");
        return;
      }
      var countdown = setInterval(function () {
        console.log(delay);
        if (delay <= 0) {
          continueAttempts[tabId] = attempt + 1;
          chrome.tabs.reload(tabId);
          //just in case
          clearInterval(countdown);
        } else {
          delay--;
        }
      }, 1000);
    });
  }
}

var filter = { urls: ["<all_urls>"] };

chrome.webRequest.onErrorOccurred.addListener(
  callback, filter);
