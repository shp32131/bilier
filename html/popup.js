let tabs= document.querySelector('#tab_nums_max');
let runFlag = document.querySelector('#script_run_flag');
let chatFlag = document.querySelector('#chat_gift_flag');
let barrageFlag = document.querySelector('#barrage_gift_flag');
let hourRankFlag = document.querySelector('#hour_rank_gift_flag');
let hourRank = document.querySelector('#hour_rank_nums');
let msg = document.querySelector('footer>span');

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

hourRank.addEventListener('change',e => {
    e.bubbles = false;
    let value = typeof Number(e.target.value) == 'number' ? Number(e.target.value) : undefined;
    if(!!value && value < 12){
        userConfigs.hourRankLength = value;
        chrome.storage.local.set({'configs': userConfigs});
    }
});

let items = document.querySelectorAll('li>.option');
for(const item of items){
    item.addEventListener('mouseover',overHandler);
}

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

function overHandler(me){
    console.log(me.target.id);
    if(me.target.id == 'tab_nums_max'){
        msg.innerHTML = "窗口打开网页的最大数量,建议10-15之间,大多可能会比较卡...";
    }else if(me.target.id == 'script_run_flag'){
        msg.innerHTML = "选择是否开启插件...";
    }else if(me.target.id == 'chat_gift_flag'){
        msg.innerHTML = "选择是否抓取聊天区域的礼物...";
    }else if(me.target.id == 'barrage_gift_flag'){
        msg.innerHTML = "选择是否抓取弹幕中的礼物...";
    }else if(me.target.id == 'hour_rank_gift_flag'){
        msg.innerHTML = "选择是否启动小时总榜排行中的礼物查询...";
    }else if(me.target.id == 'hour_rank_nums'){
        msg.innerHTML = "要查询的小时总榜的个数,从第一名开始往后数,要在0-12之间...";
    }
}