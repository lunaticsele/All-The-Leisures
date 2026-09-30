var playerLastPos = {};
ServerEvents.tick(event => {
    var players = event.server.playerList.players;
    var onlineUuids = new Set();
    for(let i = 0; i < players.length; i++){
        onlineUuids.add(players[i].uuid.toString());
    }
    for(let key in playerLastPos){
        if(!onlineUuids.has(key)) delete playerLastPos[key];
    }
    for(let i = 0; i < players.length; i++){
        var p = players[i];
        var uuid = p.uuid.toString();
        if(playerLastPos[uuid] === undefined){
            playerLastPos[uuid] = {x:p.x, y:p.y, z:p.z};
        }
    }
});
function getPlayerRealWorldSpeed(player) {
    var uuid = player.uuid.toString();
    var lastPos = playerLastPos[uuid];
    if(!lastPos) return 0;
    let dx = player.x - lastPos.x;
    let dy = player.y - lastPos.y;
    let dz = player.z - lastPos.z;
    let distPerTick = Math.sqrt(dx*dx + dy*dy + dz*dz);
    playerLastPos[uuid] = {x: player.x, y: player.y, z: player.z};
    return distPerTick;
}
var moonPhaseNames = [
    "满月","亏凸月","下弦月","残月","新月","娥眉月","上弦月","盈凸月"
];
var oreTranslateMap = {
    "minecraft:ancient_debris":{"name":"远古残骸","priority":9,"color":"§6"},
    "minecraft:emerald_ore":{"name":"绿宝石矿石","priority":8,"color":"§a"},
    "minecraft:deepslate_emerald_ore":{"name":"深板岩绿宝石矿石","priority":7,"color":"§a"},
    "minecraft:diamond_ore":{"name":"钻石矿石","priority":6,"color":"§b"},
    "minecraft:deepslate_diamond_ore":{"name":"深板岩钻石矿石","priority":5,"color":"§b"},
    "minecraft:gold_ore":{"name":"金矿石","priority":4,"color":"§e"},
    "minecraft:deepslate_gold_ore":{"name":"深板岩金矿石","priority":3,"color":"§e"},
    "minecraft:iron_ore":{"name":"铁矿石","priority":2,"color":"§f"},
    "minecraft:deepslate_iron_ore":{"name":"深板岩铁矿石","priority":1,"color":"§f"},
    "minecraft:copper_ore":{"name":"铜矿石","priority":0,"color":"§7"},
    "minecraft:deepslate_copper_ore":{"name":"深板岩铜矿石","priority":-1,"color":"§7"}
};
var rareOres = Object.keys(oreTranslateMap);

ItemEvents.rightClicked(event => {
    if (event.hand !== "main_hand") return;
    var player = event.player;
    var level = event.level;
    var spd = 0;
    var mPhaseId = 0;
    var moonName = "";
    var hostileCount = 0;

    let foundOreSet = new Set();
    let bestOre = null;

    if (level.isClientSide()) return;
    if (event.hand !== "MAIN_HAND") return;
    if (player.getMainHandItem().getId() !== "kubejs:global_information_terminal" ) return;
    player.getCooldowns().addCooldown(event.getItem(), 20);
    try {
        spd = getPlayerRealWorldSpeed(player);
        mPhaseId = level.moonPhase;
        moonName = moonPhaseNames[mPhaseId];
        let px = Math.floor(player.x);
        let py = Math.floor(player.y);
        let pz = Math.floor(player.z);
        //24格敌对生物计数
        var aabb = player.boundingBox.inflate(24,24,24);
        var entityList = level.getEntities(null, aabb);
        for(let j=0; j < entityList.length; j++){
            let ent = entityList[j];
            if(ent.isLiving() && ent.isMonster()) hostileCount++;
        }
        //扫描20格立方体
        var scanRange = 20;
        for(let ox = -scanRange; ox <= scanRange; ox++){
            for(let oy = -scanRange; oy <= scanRange; oy++){
                for(let oz = -scanRange; oz <= scanRange; oz++){
                    var block = level.getBlock([px + ox, py + oy, pz + oz]);
                    var bid = block.id.toString();
                    if(rareOres.indexOf(bid) !== -1){
                        if(foundOreSet.has(bid)) continue;
                        foundOreSet.add(bid);

                        var dis = Math.sqrt(ox*ox + oy*oy + oz*oz);
                        let oreData = oreTranslateMap[bid];
                        //更新最优矿石
                        if(bestOre === null || oreData.priority > bestOre.priority){
                            bestOre = {
                                name: oreData.name,
                                distance: dis,
                                priority: oreData.priority,
                                color: oreData.color
                            };
                        }
                    }
                }
            }
        }
    } catch(e) {
        player.tell(Text.red("获取数据失败！"));
        console.log("异常",e);
        event.cancel();
        return;
    }
    player.tell(Text.gray("===== 全球信息终端 ====="));
    player.tell(Text.white("实时移动速度：" + Number(spd).toFixed(3) + " m/s"));
    player.tell(Text.white("当前月相：" + moonName + " (" + mPhaseId + ")"));
    player.tell(Text.white("半径24格敌对生物：" + hostileCount + " 只"));

    if(bestOre !== null){
        player.tell(Text.aqua("附近的矿石"));
        player.tell("价值最高的矿石:" + bestOre.color + bestOre.name + " §r距离:" + bestOre.distance.toFixed(1)+"m");
    }else{
        player.tell(Text.gray("未探测到矿石"));
    }

    event.cancel();
});
