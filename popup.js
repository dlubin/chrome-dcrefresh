var state = "unpaused";
var tabId = "-1";

window.onload = function(){
    var query = { active: true, currentWindow: true };
    chrome.tabs.query(query,function(tabs){
        tabId = tabs[0].id;
        chrome.runtime.sendMessage({"message":"getStatus", "tab":tabId}, function(response){
            state = response.status != undefined ? response.status : "unpaused";
            if(state == "paused"){
                var image = document.getElementById("pauseimg");
                image.src = "resumebtn.png";
            }
        });
    });
}
document.addEventListener("DOMContentLoaded", function(){
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