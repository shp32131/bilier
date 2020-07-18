/**
 * show popup.html 
 * when extension button onClick show popup.html if tab.url match the specified url
 */
chrome.declarativeContent.onPageChanged.removeRules(undefined,function(){
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions:[
            new chrome.declarativeContent.PageStateMatcher({ 
                pageUrl:{
                    urlMatches: "live.bilibili",
                    schemes: ["https","http"]
                }
            })
        ],
        actions:[
            new chrome.declarativeContent.ShowPageAction()
        ]
    }])
});

/**
 * listener: tabs onCreated
 * purpose: remove duplicate tab 
 * Note: the url properties not set immediate when a tab was created
 */
chrome.tabs.onCreated.addListener(tab => {
    chrome.tabs.query({
        currentWindow: true,
        discarded: false,
        active: false,
    },tabs => {
        if(tabs.length > 15){
            chrome.tabs.remove(tab.id);
        }
    });
});

/**
 * webNavigation onCompleted
 * insert contentScript.js when navigation to bilibili live tabs 
 */
chrome.webNavigation.onCompleted.addListener(info => {
if(info.url.includes("live.bilibili")){
    new Promise((resolve,reject) => {
        let urls = [];
        chrome.tabs.query({
            currentWindow: true,
            discarded: false,
            active: false,
        },tabs => {
            for(const item of tabs){
                urls.push(item.url.split("?")[0]);
            }
            resolve(urls);
        });
    }).then(values => {
        if(values.indexOf(info.url.split("?")[0]) >= 0){
            chrome.tabs.remove(info.tabId);
        }else{
                chrome.tabs.executeScript(info.tabId,{
                    // file: "./js/contentScript.js",
                    file: "./js/run.js",
                    runAt: "document_end"
                },results => {
                    if(chrome.runtime.lastError){
                        console.log("webNavigation_executeScript: "+chrome.runtime.lastError.message);
                    }
                });
        }
    }).catch(error => {
        console.log("webNavigation wrong: "+error);
    });
}
});

/**
 * function removeDuplicateTab()
 * remove tab if duplicated more than 2 
 */
function removeDuplicateTab(){
    chrome.tabs.query({
        currentWindow: true,
        active:false,
        discarded: false
    },tabs => {
        let set = new Set();
        let mp = new Map();
        let map = new Map();
        let removes = [];

        for(const tab of tabs){
            set.add(tab.url.split('?')[0]);
            mp.set(tab.id,tab.url.split('?')[0]);
        }
        if(set.size !== mp.size){
            for(const url of set){
                let ids = [];
                for(const [key,value] of mp.entries()){
                    if(url.includes(value)){
                        ids.push(key);
                    }
                }
                map.set(url,ids);
            }
            for(const tabIds of map.values()){
                if(tabIds.length > 1){
                    for(let i = 1;i < tabIds.length;i++){
                        removes.push(tabIds[i]);
                    }
                }
            }
        }
        if(removes.length > 0){
            chrome.tabs.remove(removes,() => {
                if(chrome.runtime.lastError){
                    console.log('remove tab wrong: '+chrome.runtime.lastError.message);
                }
            });
        }
        set.clear();
        mp.clear();
        map.clear();
        removes.length = 0;
    });
}