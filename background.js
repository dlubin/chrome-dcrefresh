var continueAttempts = {};
var suspended = {};
chrome.browserAction.setBadgeBackgroundColor({color: "#E01A10"});

var errorCallback = function (details) {
  if ((details.error == "net::ERR_INTERNET_DISCONNECTED" || details.error == "net::ERR_NAME_NOT_RESOLVED") && details.type == "main_frame") {
    var tabId = details.tabId || -1;
    var attempt = continueAttempts[tabId] || 1;
    console.log("DCR conditions met in tab " + tabId + " - attempt " + attempt);
    if(suspended[tabId] != undefined){
      console.log("Process suspended in tab");
      setTimeout(function(){
        chrome.browserAction.setBadgeText({text: "||", tabId: tabId});
        chrome.browserAction.setTitle({title: "Refreshing paused", tabId: tabId});
      }, 1000);
      return;
    }
    chrome.storage.sync.get({
      attemptDelay: 3,
      attemptLimit: -1
    },function(items){
      var delay = items.attemptDelay;
      var limit = items.attemptLimit;
      if(limit > 0 && attempt > limit){
        console.log("Attempt limit reached. Will not reload anymore");
        setTimeout(function(){
          chrome.browserAction.setBadgeText({text: "!", tabId: tabId});
          chrome.browserAction.setTitle({title: "Attempt Limit Reached", tabId: tabId});
        }, 1000);
        return;
      }
      var countdown = setInterval(function () {
        chrome.tabs.get(tabId, function(){
          if(!chrome.runtime.lastError){
            chrome.browserAction.setBadgeText({text: delay.toString(), tabId: tabId});
            if (delay <= 0) {
              continueAttempts[tabId] = attempt + 1;
              chrome.tabs.reload(tabId);
              //just in case
              clearInterval(countdown);
            } else {
              delay--;
            }
          }else{
            console.log("Tab with ID " + tabId + " can no longer be found");
            clearInterval(countdown);
            return;
          }
        });
      }, 1000);
    });
  }
}

var completedCallback = function(details){
  removeTab(details.tabId);
}

var filter = { urls: ["<all_urls>"] };

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
  if(request.message == "pause"){
      suspended[request.tab] = 1;
    }else if(request.message == "unpause"){
      delete suspended[request.tab];
      chrome.tabs.reload(request.tab);
    }else if(request.message == "getStatus"){
      sendResponse({status: suspended[request.tab] == undefined ? "unpaused" : "paused"});
    }
  }
);

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  removeTab(tabId);
});

chrome.webRequest.onErrorOccurred.addListener(errorCallback, filter);
chrome.webRequest.onCompleted.addListener(completedCallback, filter);

function removeTab(tabId){
  delete continueAttempts[tabId];
  delete suspended[tabId];
}