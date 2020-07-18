!function(window,chrome){
if(window['content.js']) return;
window['content.js'] = true;
console.log("content.js ---> running");

// config variable
let RUN_CONTENT = true;
let CurrentUrl = document.URL.split("?")[0];
let Biliers = new Set(["https://live.bilibili.com/21999349"]);
let Increment = 0;

// let video = document.querySelector('.bilibili-live-player-video>video');
// video.addEventListener('canplay',function(){
//     console.log("video...load");
// })

/**
 * 1.get the gift if live page have gift 
 * 2.open gift url if have gift url
 * 3.close the live page if the page is not a bilier
 * inquire--n.查询
 */
new Promise((resolve,reject)=>{
    let inquire = 1;
    let interval = setInterval(()=>{
        if(document.querySelector(".gift-animation")){
            drawLottery();
        }else if(inquire++ >= 3){
            if(!Biliers.has(CurrentUrl)){
                clearInterval(interval);
                interval = null;
                resolve("close");
            }
        }
    },3000);
}).then(value => {
    window.close();
}).catch(error => {
    window.location.reload();
});

/**
 * MutationObserver: observerOne  
 * detect the DOM Node has class = 'chat-items'
 * if detected a gift url then open to it
 */

setTimeout(() => {
    
if(document.querySelector('#chat-items') && CurrentUrl.includes("21999349")){
    let observerOne = new MutationObserver(function(mutations){
        if(!RUN_CONTENT) return;
        if(Increment == 10) Increment = 0;
        for(const mutation of mutations){
            if('childList' == mutation.type){
                if(mutation.addedNodes.length > 0){
                    for(const addedNode of mutation.addedNodes){
                        if(addedNode.className.search('system-msg') > 0){
                            if(addedNode.childNodes[3] && addedNode.childNodes[3].childNodes[1].href){
                                let url = addedNode.childNodes[3].childNodes[1].href;
                                setTimeout(() => {
                                    window.open(url);
                                },(Increment++)*1000);
                            }
                        }
                    }
                }
            }
        }
    });
    observerOne.observe(document.querySelector("#chat-items"),{childList: true});
}
    /*
    let barrageGift = document.querySelector('#link-video-vm+div');
    if(barrageGift){
        let observerTwo = new MutationObserver(mutations => {
            for(const mutation of mutations){
                if('childList' == mutation.type){
                    console.log("aaaaaaa");
                    if(mutation.addedNodes.length > 0){
                       let a = document.querySelector('#link-video-vm+div>div>div>a');
                       console.log(a);
                    }
                }
            }
        })
        observerTwo.observe(barrageGift,{childList: true});
    }
    */

}, 500);

/**
 * Listener: storage onChanged
 */
chrome.storage.onChanged.addListener((change,area) => {
    if('local' == area){
        if(change.bilier.newValue){
            if(change.bilier.newValue.includes("--remove")){
                Biliers.delete(change.bilier.newValue.split("--")[0]);
                chrome.storage.local.remove("bilier");
            }else{
                Biliers.add(change.bilier.newValue);
            }
        }
    }
});

/**
 * hour rank 
 */
//start HOUR
let RUN_HOUR_RANK_FLAG= true;
let HOUR_RANK_TIME = 4;
let HOUR_RANK_URL_COUNT = 6;

let body = document.querySelector('body');
body.addEventListener('dblclick',function(){
    RUN_HOUR_RANK_FLAG == true ? RUN_HOUR_RANK_FLAG = false : RUN_HOUR_RANK_FLAG = true; 
})
if(CurrentUrl.includes("21999349")){
    setInterval(() => {
        if(!RUN_HOUR_RANK_FLAG) return;
        let hr = document.querySelector('.hour-rank-content');
        if(!hr) return;
    
        hr.click();
    
        let observer = new MutationObserver(function(mutations){
            let timeout;
            for(const mutation of mutations){
                if('childList' == mutation.type){
                    if(mutation.addedNodes.length > 0){
                        let iframe = document.querySelector('iframe[src*="room-current-rank"]');
                        if(iframe){
                            if(timeout) clearTimeout(timeout);
                            timeout = setTimeout(()=>{
                                if(iframe.contentWindow){
                                    let alinks = iframe.contentWindow.document.querySelectorAll('.face>a');
                                    if(alinks.length > 0){
                                        for(let i = 0;i < HOUR_RANK_URL_COUNT;i++){
                                            setTimeout(() => {
                                                if(alinks[i].href) window.open(alinks[i].href);
                                            },15000*i + 1000);
                                        }
                                    }
                                }
                                let close = document.querySelector('.fixed.rank>.close-btn');
                                if(close)   close.click();
                                clearTimeout(timeout);
                                timeout = null;
                                observer.disconnect();
                            },2000);
                        }
                    }
                }
            }
        });
    
        observer.observe(document.querySelector('.room-info-upper-row'),{childList: true,subtree: true});
    
        let close = document.querySelector('.fixed.rank>.close-btn');
        if(close)   close.click();
    
    },HOUR_RANK_TIME * 60000);
    
}



/**
 * function drawLottery() 
 * 1.get the gift immediate if can do this
 * 2.wait specified seconds to get the gift
 */
let timeout;
function drawLottery(){
    let btn = document.querySelector(".function-bar");
    if(btn){
        let gift = document.querySelector(".gift-animation>.gift-sender-info").innerHTML.toString();
        if(gift.includes("舰长") || gift.includes("提督") || gift.includes("总督") || gift.includes("大乱斗")){
            btn.click();
        }else{
            let spans = document.querySelectorAll(".function-bar>span");
            if(spans.length > 1){
                let splits = spans[1].innerHTML.split(':');
                if(splits instanceof Array && 2 == splits.length){
                    if(timeout) clearTimeout(timeout);
                    timeout = setTimeout(()=>{
                        btn.click();
                        timeout = null;
                    },Number(splits[0]*60+splits[1]))
                }
            }else{
                btn.click();
            }
        }
    }
}
    
}(window,chrome);