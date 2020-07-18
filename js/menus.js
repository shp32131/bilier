let Lover_Anchor = "https://live.bilibili.com/21999349";

let menus = [
    {
        id: "mainMenu", 
        title: "bilier",
        contexts: ["all"],
        onclick: function(info,tab){
            window.open(Lover_Anchor);
        }
    },
    { 
        id: "menuOne", 
        parentId: "mainMenu", 
        title: "Bilier Reverse",
        contexts: ["all"], 
        onclick: function(info,tab){
            let url = tab.url.split("?")[0];
            if(url.includes("live.bilibili")){
                chrome.storage.local.get('bilier',result => {
                    if(result.bilier && result.bilier == url){
                        url = url + "--remove";
                    }
                    chrome.storage.local.set({bilier: url});
                });

            }
        }
    },
    { 
        id: "menuTwo", 
        parentId: "mainMenu", 
        title: "bilibili...",
        contexts: ["all"],
        onclick: function(info,tab){
            // chrome.tabs.update(tab.id,{pinned:true},t => {
                // console.log(t);
            // });
        }
    }
];

/**
 * create menus
 */
chrome.runtime.onInstalled.addListener(() => {
    for(i = 0;i < menus.length; i++){
        chrome.contextMenus.create(menus[i],() => {
            if(chrome.extension.lastError){
                console.log("bilier run failed: "+chrome.extension.lastError.message);
            }
        });
    }
})

/**
 * addListener()
 * contextMenus onClick
 */
// chrome.contextMenus.onClicked.addListener((info,tab) => {
//     if('menuOne' == info.menuItemId){ }
// })
