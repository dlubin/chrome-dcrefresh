var state = "unpaused";
var tabId = "-1";

document.addEventListener("DOMContentLoaded", function(){
    var query = { active: true, currentWindow: true };
    chrome.tabs.query(query,function(tabs){
        tabId = tabs[0].id;
    });
    var button = document.getElementById("pausebtn");
    var image = document.getElementById("pauseimg");
    button.onclick = function(e){
        e.preventDefault();
        changeState(image);
    }
});

changeState = function(img){
    if(state == "unpaused"){
        state = "paused";
        img.src = "resumebtn.png";
        chrome.runtime.sendMessage({"message":"pause", "tab":tabId});
    }else{
        state ="unpaused";
        img.src = "pausebtn.png";
        chrome.runtime.sendMessage({"message":"unpause", "tab":tabId});
    }
}