let Url_Matches = 'live.bilibili.com';
let Schemes = ["https","http"];
let Room_Number = 21999349;
let Tab_Nums_Max = 10;

chrome.storage.local.set({'tabNumsMax': Tab_Nums_Max});

chrome.storage.onChanged.addListener((changes,area) => {
    if(area == 'local'){
        for(let key in changes){
            if(key == 'tabNumsMax'){
                Tab_Nums_Max = changes[key].newValue;
            }
        }
    }
});

/**
 * show popup.html 
 * when extension button onClick show popup.html if tab.url match the specified url
 */
chrome.declarativeContent.onPageChanged.removeRules(undefined,function(){
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions:[
            new chrome.declarativeContent.PageStateMatcher({ 
                pageUrl:{
                    urlMatches: Url_Matches+"/"+"21999349",
                    schemes: Schemes
                }
            })
        ],
        actions:[
            new chrome.declarativeContent.ShowPageAction()
        ]
    }])
});

/**
 * on tab create
 */
chrome.tabs.onCreated.addListener(tab => {
    // chrome.windows.update()
});



/**
 * webNavigation onCompleted
 * insert run.js when navigation to bilibili live tabs 
 * 1. if the tab open already then close 
 * 2. if the tabs more than Tab_Nums_Max then close 
 */
chrome.webNavigation.onCompleted.addListener(info => {
    if(info.url.includes(Url_Matches)){
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
            if(values.indexOf(info.url.split("?")[0]) > -1 || values.length > Tab_Nums_Max){
                chrome.tabs.remove(info.tabId);
            }else{
                chrome.tabs.executeScript(info.tabId,{
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