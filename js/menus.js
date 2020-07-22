let Lover_Anchor = "https://live.bilibili.com/21999349";
let menu = {
    id: "mainMenu", 
    title: "去看汉三直播",
    contexts: ["all"],
    onclick: function(info,tab){
        window.open(Lover_Anchor);
    }
}
/**
 * create menus
 */
chrome.runtime.onInstalled.addListener(() => {
        chrome.contextMenus.create(menu,() => {
            if(chrome.extension.lastError){
                console.log("bilier run failed: "+chrome.extension.lastError.message);
            }
        });
})
