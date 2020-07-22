let tabs= document.querySelector('#tab_nums_max');
let runFlag = document.querySelector('#script_run_flag');
let chatFlag = document.querySelector('#chat_gift_flag');
let barrageFlag = document.querySelector('#barrage_gift_flag');
let hourRankFlag = document.querySelector('#hour_rank_gift_flag');
let hourRank = document.querySelector('#hour_rank_nums');

let userConfigs = {};

chrome.storage.local.get(['tabNumsMax','configs'],value => {
    if(!!tabs && !!value.tabNumsMax){
        tabs.value = value.tabNumsMax;
    }
    Object.assign(userConfigs,value.configs);
    if(!!value.configs){
        if(value.configs.script_run_flag){
            runFlag.setAttribute('class',"iconfont icon-gou");
            runFlag.style.color = "blue";
        }else{
            runFlag.setAttribute('class',"iconfont icon-shanchuguanbicha");
            runFlag.style.color = "red";
        }
        if(value.configs.chat_gift_flag){
            chatFlag.setAttribute('class',"iconfont icon-gou");
            chatFlag.style.color = "blue";
        }else{
            chatFlag.setAttribute('class',"iconfont icon-shanchuguanbicha");
            chatFlag.style.color = "red";
        }
        if(value.configs.barrage_gift_flag){
            barrageFlag.setAttribute('class',"iconfont icon-gou");
            barrageFlag.style.color = "blue";
        }else{
            barrageFlag.setAttribute('class',"iconfont icon-shanchuguanbicha");
            barrageFlag.style.color = "red";
        }
        if(value.configs.hour_rank_gift_flag){
            hourRankFlag.setAttribute('class',"iconfont icon-gou");
            hourRankFlag.style.color = "blue";
        }else{
            hourRankFlag.setAttribute('class',"iconfont icon-shanchuguanbicha");
            hourRankFlag.style.color = "red";
        }
        hourRank.value = value.configs.hourRankLength;
    }
});

tabs.addEventListener('change',e => {
    e.bubbles = false;
    let value = typeof Number(e.target.value) == 'number' ? Number(e.target.value) : undefined;
    if(!!value){
        chrome.storage.local.set({'tabNumsMax': value});
    }
});

runFlag.addEventListener('click',meHandler);
chatFlag.addEventListener('click',meHandler);
barrageFlag.addEventListener('click',meHandler);
hourRankFlag.addEventListener('click',meHandler);
// hourRankFlag.addEventListener('click',meHandler(event));

hourRank.addEventListener('change',e => {
    e.bubbles = false;
    let value = typeof Number(e.target.value) == 'number' ? Number(e.target.value) : undefined;
    if(!!value && value < 12){
        userConfigs.hourRankLength = value;
        chrome.storage.local.set({'configs': userConfigs});
    }
});

function meHandler(me){
    let key = me.target.id;
    console.log(key);
    me.bubbles = false;
    if(me.target.className.includes('icon-gou')){
        me.target.setAttribute('class',"iconfont icon-shanchuguanbicha");
        me.target.style.color = "red";
        userConfigs[key] = false;
        chrome.storage.local.set({'configs': userConfigs});
    }else{
        me.target.setAttribute('class',"iconfont icon-gou");
        me.target.style.color = "blue";
        userConfigs[key] = true;
        chrome.storage.local.set({'configs': userConfigs});
    }
}