// 牌池配置：[显示名,奖励黄铜币数量,权重概率]
var CARD_POOL = [
    ["泥土", 0, 15],
    ["草方块", 0, 25],
    ["铁锭", 1, 25],
    ["金锭", 2, 15],
    ["钻石", 3, 12],
    ["下界合金", 5, 8]
];

var COIN_TYPES = [
    "create_currency_shops:brass_coin",
    "create_currency_shops:gold_coin",
    "create_currency_shops:netherite_coin"
];
var COIN_MULTIPLIER = {
    "create_currency_shops:brass_coin": 1,
    "create_currency_shops:gold_coin": 1,
    "create_currency_shops:netherite_coin": 1
};
/**
 * @returns
 */
function getRandomCard(){
    let totalWeight = 0;
    for(let item of CARD_POOL){
        totalWeight += item[2];
    }
    let r = Math.random() * totalWeight;
    for(let item of CARD_POOL){
        r -= item[2];
        if(r <= 0){
            return [item[0], item[1]];
        }
    }
    return ["铁锭",1];
}

function startGame(player){
    let offhandStack = player.getOffhandItem();
    let offhandId = offhandStack.id;

    if(!COIN_TYPES.includes(offhandId) || offhandStack.count < 1){
        player.tell("§c副手必须持有黄铜硬币/金硬币/下界合金硬币才能开启翻牌游戏！");
        return false;
    }
    offhandStack.shrink(1);

    player.persistentData.putString("entryCoin", offhandId);

    let nameArr = [];
    let rewardArr = [];
    for(let i=0;i<16;i++){
        let [name,point] = getRandomCard();
        nameArr.push(name);
        rewardArr.push(point);
    }
    player.persistentData.putByte("inCardGame",1);
    player.persistentData.putString("cardNames", nameArr.join(","));
    player.persistentData.putString("cardRewards", rewardArr.join(","));
    player.persistentData.putString("openedMask","");

    player.tell("§a翻牌游戏已开始！消耗副手1枚入场币，聊天输入数字1‑16翻开卡牌");
    player.tell("§e1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16");
    return true;
}

function endGame(player){
    player.persistentData.remove("inCardGame");
    player.persistentData.remove("cardNames");
    player.persistentData.remove("cardRewards");
    player.persistentData.remove("openedMask");
    player.persistentData.remove("entryCoin");
    player.tell("§7本局翻牌游戏结束");
}

function checkAndSettle(player, openedNames){
    let entryCoin = player.persistentData.getString("entryCoin");
    let mul = COIN_MULTIPLIER[entryCoin] ?? 1;

    let countMap = {};
    for(let n of openedNames){
        countMap[n] = (countMap[n]||0)+1;
    }
    for(let cardName in countMap){
        if(countMap[cardName] >= 3){
            let found = CARD_POOL.find(x=>x[0]===cardName);
            if(!found) return false;
            let baseReward = found[1];
            let finalReward = baseReward * mul;
            if(finalReward > 0){
                player.tell(`§6恭喜，你凑齐了三张【${cardName}】！获得 ${finalReward} 枚入场币种奖励`);
                player.give(Item.of(entryCoin, finalReward));
            }else{
                player.tell(`§7可惜，你凑齐了三张【${cardName}】...没有奖励`);
            }
            endGame(player);
            return true;
        }
    }
    return false;
}

ItemEvents.rightClicked(event => {
    var player = event.player;
    var level = event.level;
    if(level.isClientSide()) return;
    var mainItem = player.getMainHandItem();
    if(mainItem.id !== "kubejs:silver_chicken") return;

    // Shift‑右键强行终止当前对局
    if(player.isShiftKeyDown()){
        if(player.persistentData.contains("inCardGame") && player.persistentData.getByte("inCardGame")===1){
            player.tell("§cShift‑右键：强制终止翻牌对局，无奖励（消耗的入场币不予返还）");
            endGame(player);
        }else{
            player.tell("§c当前没有正在进行的翻牌对局");
        }
        return;
    }

    if(player.persistentData.contains("inCardGame") && player.persistentData.getByte("inCardGame")===1){
        player.tell("§c你正在一局翻牌游戏中，请先完成本局！按住Shift右键可以强制结束");
        return;
    }
    startGame(player);
})

PlayerEvents.chat(event => {
    var player = event.player;
    var rawMsg = event.message.trim();

    if(!player.persistentData.contains("inCardGame") || player.persistentData.getByte("inCardGame")!==1){
        return;
    }

    if(rawMsg.toLowerCase() === "exit"){
        player.tell("§7手动退出翻牌游戏，消耗入场币不返还");
        endGame(player);
        event.cancel();
        return;
    }

    if(!/^\d+$/.test(rawMsg)){
        player.tell("§c请输入1‑16之间数字翻牌，一次输入只能翻开一张");
        event.cancel();
        return;
    }
    var num = parseInt(rawMsg,10);
    if(num <1 || num>16){
        player.tell("§c数字必须在1‑16范围内！");
        event.cancel();
        return;
    }
    var posIndex = num -1;

    var nameStr = player.persistentData.getString("cardNames");
    var rewardStr = player.persistentData.getString("cardRewards");
    var maskStr = player.persistentData.getString("openedMask");

    var nameArr = nameStr.split(",");
    var rewardArr = rewardStr.split(",");
    var openedList = maskStr === "" ? [] : maskStr.split(",").map(x=>parseInt(x));

    if(openedList.includes(posIndex)){
        player.tell(`§c位置 ${num} 已经翻开过，请选其他数字！`);
        event.cancel();
        return;
    }

    var cardName = nameArr[posIndex];
    openedList.push(posIndex);
    player.persistentData.putString("openedMask", openedList.join(","));

    player.tell(`§b位置${num}翻开：【${cardName}】`);

    let openedCardNames = [];
    for(let idx of openedList){
        openedCardNames.push(nameArr[idx]);
    }

    let hasSettle = checkAndSettle(player, openedCardNames);

    if(!hasSettle && openedList.length >= 16){
        player.tell("§7所有卡牌已全部翻开，本局没有凑齐三张相同，游戏结束！");
        endGame(player);
    }

    event.cancel();
})
