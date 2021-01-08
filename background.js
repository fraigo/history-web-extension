(function(){
	console.log("Background started");
})();


chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});