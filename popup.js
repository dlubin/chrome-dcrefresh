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
                var note = document.getElementById("note");
                note.innerText = "This will cause the page to reload.";
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
    var note = document.getElementById("note");
    if(state == "unpaused"){
        state = "paused";
        img.src = "resumebtn.png";
        note.innerText = "Note: This will cause the page to reload.";
        chrome.runtime.sendMessage({"message":"pause", "tab":tabId});
    }else if(state == "paused"){
        state ="unpaused";
        img.src = "pausebtn.png";
        note.innerText = "Note: Pause will only work when a page is failing to load.";
        chrome.runtime.sendMessage({"message":"unpause", "tab":tabId});
    }
}