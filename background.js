var continueAttempts = {};

var callback = function(details){
  if(details.error == "net::ERR_INTERNET_DISCONNECTED" && details.type == "main_frame"){
    var tabId = details.tabId || -1;
    console.log("DCR conditions met in tab " + tabId);
    continueAttempts[tabId] = continueAttempts[tabId] == undefined ? 1 : continueAttempts[tabId]+1;
  var limit = 5;  
  var countdown = setInterval(function(){
      console.log(limit);
      if(limit <= 0){
        chrome.tabs.reload(tabId);
        //just in case
        clearInterval(countdown);
      }else{
        limit--;
      }
    }, 1000);
  }
}

var filter = { urls: ["<all_urls>"]};

chrome.webRequest.onErrorOccurred.addListener(
  callback, filter);
