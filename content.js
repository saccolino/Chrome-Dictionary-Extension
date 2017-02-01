console.log("content loaded!");

var body = document.getElementsByTagName("BODY")[0];

body.addEventListener("mouseup",function(){
   var selection = window.getSelection();
   if (selection.isCollapsed)
        return;

    var strSelected = selection.toString().trim();
     console.log(strSelected);

    chrome.runtime.sendMessage(strSelected);
    
});