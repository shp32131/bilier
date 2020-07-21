/**
 * Module Introduction
 * This module will insert into the tab like https://live.bilibili.com/*
 * Functions:  try auto to get gifts
 * 
 */
!function(window,chrome){

/**
 * prevent reload this script
 */
if(window["run.js"]) return;
window["run.js"] = true;

// control this script run or stop
let RUN_FLAG = true;
let AUTO_CLOSE = true;
// get the url of current tab 
let CURRENT_URL = window.document.URL.split('?')[0];
// main tab flag
let MAIN_FLAG = false;
// config a default main tab 
let BILIERS = new Set(['https://live.bilibili.com/21999349']);
// get urls from chat node
let CHAT_URLS = new Set();
// HOUR_RANK_URLS_SIZE  need low 12
let HOUR_RANK_URLS_SIZE = 8;
// get urls form hour rank
let HOUR_RANK_URLS = new Set();

// detect main tab
if(BILIERS.has(CURRENT_URL)){
    MAIN_FLAG = true;
}
// when double click in body element means not close the tab  
let body = document.querySelector('body');
body.addEventListener('dblclick',function(){
    if(CURRENT_URL.includes("21999349")){
        RUN_FLAG ? RUN_FLAG = false : RUN_FLAG = true; 
    }else{
        AUTO_CLOSE ? AUTO_CLOSE = false : AUTO_CLOSE = true;
    }
});


/**
 * 1.get the gift if live page have gift 
 * 2.open gift url if have gift url
 * 3.close the live page if the page is not a bilier
 */
new Promise((resolve,reject)=>{
    let ticks = 0;
    let btn = null;
    let urls = [];
    let i = 0;
    let hour_rank_openable = true;
    let timer = setInterval(()=>{
        ticks++;
        if(ticks == 86400) ticks = 0;
        btn = document.querySelector(".function-bar");
        // detect and get current tab gifts
        if(btn){
            if(ticks % 5 == 0){
                btn.click();
            }
        }else if(ticks % 5 == 0){
            if(AUTO_CLOSE && !MAIN_FLAG){
                clearInterval(timer);
                timer = null;
                resolve("close");
            }
        }
        
        // to open other gift tab 
        if(MAIN_FLAG && RUN_FLAG){
            if(ticks % 90 == 0 && hour_rank_openable){
                let hr = document.querySelector('.hour-rank-content');
                if(hr) {
                    hr.click();
                    setTimeout(() => {
                        let close = document.querySelector('.fixed.rank>.close-btn');
                        if(close)   close.click()
                    },5000);
                }
            }

            if(ticks % 2 == 0 && urls.length == 0 ){
                if(HOUR_RANK_URLS.size > 0){
                    urls = [...HOUR_RANK_URLS];
                    HOUR_RANK_URLS.clear();
                    hour_rank_openable = false;
                }
            }
            if(CHAT_URLS.size > 0) {
                for(const item of CHAT_URLS.values()){
                    if(urls.indexOf(item) < 0){
                        urls.splice(i,0,item);
                    }
                }
                CHAT_URLS.clear();
                if(hour_rank_openable) hour_rank_openable = false;
            }
            if(ticks % 15 == 0 && urls.length > 0){
                window.open(urls[i]);
                i++;
                // console.log("---------------i= "+ i);
            }
            if(i == urls.length){
                urls.length = 0;
                i = 0;
                hour_rank_openable = true;
            }
        }

    },1000);
}).then(value => {
    window.opener = null;
    window.close();
}).catch(error => {
    window.location.reload();
});

/**
 * MutationObserver: observerOne / observerTwo  / observerThree
 * to get gift urls
 */
setTimeout(() => {
    //  observerOne #chat-items
    let chatItem = document.querySelector('#chat-items');
    if(chatItem){
        let observerOne = new MutationObserver(function(mutations){
            for(const mutation of mutations){
                if('childList' == mutation.type){
                    if(mutation.addedNodes.length > 0){
                        for(const addedNode of mutation.addedNodes){
                            if(addedNode.className.search('system-msg') > 0){
                                if(addedNode.childNodes[3] && addedNode.childNodes[3].childNodes[1].href){
                                    let url = addedNode.childNodes[3].childNodes[1].href;
                                    CHAT_URLS.add(url.split('?')[0]);
                                }
                            }
                        }
                    }
                }
            }
        });
        observerOne.observe(chatItem,{childList: true});
    }
    // observerTwo 
    let barrageUrl = document.querySelector('.bilibili-live-player-video-area>.bilibili-live-player-video-operable-container');
    if(barrageUrl){
        let observerTwo = new MutationObserver(mutations => {
            for(const mutation of mutations){
                if('childList' == mutation.type){
                    if(mutation.addedNodes.length > 0){
                        let a = document.querySelector('.announcement-wrapper>a');
                        if(a){
                            if(a.href){
                                CHAT_URLS.add(a.href.split('?')[0]);
                            }
                        }
                    }
                }
            }
        });
        observerTwo.observe(barrageUrl,{childList: true,subtree: true});
    }
    // observerThree .normal-mode>.dp-i-block.hour-rank
    let hourRank = document.querySelector('.normal-mode>.hour-rank');
    let timeout = null;
    if(hourRank){
        let observerThree = new MutationObserver(function(mutations){
            for(const mutation of mutations){
                if('childList' == mutation.type){
                    if(mutation.addedNodes.length > 0){
                        if(timeout) clearTimeout(timeout);
                        timeout = setTimeout(() => {
                            let iframe = document.querySelector('iframe[src*="room-current-rank"]');
                            if(iframe){
                                let alinks = iframe.contentWindow.document.querySelectorAll('.face>a');
                                if(alinks.length && alinks.length > 0){
                                    for(let i = 0;i < HOUR_RANK_URLS_SIZE;i++){
                                        HOUR_RANK_URLS.add(alinks[i].href.split('?')[0]);
                                    }
                                }
                            }
                        },2000);
                    }
                }
            }
        });
        observerThree.observe(hourRank,{childList: true});
    }
}, 5000);


}(window,chrome);