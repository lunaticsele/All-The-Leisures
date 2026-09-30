function floatEq(a, b, eps) {
    if(!eps) eps = 1e-4;
    return Math.abs(a - b) < eps;
}
// 获取同一维度球形64格内全部其他玩家
function getAllPlayerInRange(player, maxRange) {
    var myDimId = player.level.dimensionId;
    var outPlayerList = [];
    var allOnlinePlayers = player.server.playerList.players;
    for (var i = 0; i < allOnlinePlayers.length; i++) {
        var target = allOnlinePlayers[i];
        if (target === player) continue;
        if (target.level.dimensionId !== myDimId) continue;
        var dx = target.x - player.x;
        var dy = target.y - player.y;
        var dz = target.z - player.z;
        var dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (dist <= maxRange) {
            outPlayerList.push(target);
        }
    }
    return outPlayerList;
}
ItemEvents.rightClicked(event => {
    var player = event.player;
    var level = event.level;
    if (level.isClientSide()) return;
    if (event.hand !== "MAIN_HAND") return;
    if (player.getMainHandItem().getId() !== "kubejs:third_eye") return;
    player.getCooldowns().addCooldown(event.getItem(), 20);
    var isShift = player.isShiftKeyDown();
    if (!isShift) {
        try { player.tell(Text.gold("===== 第三只眼 =====")); } catch(e) {}
        try { player.tell(Text.white("玩家名称: " + player.getName().getString())); } catch(e) {}
        try { player.tell(Text.white("游戏模式: " + player.gameMode.getGameModeForPlayer().getName())); } catch(e) {}
        try { player.tell(Text.white("生命值: " + player.health.toFixed(1) + "/" + player.maxHealth.toFixed(1))); } catch(e) {}
        try { player.tell(Text.white("经验等级: " + player.experienceLevel)); } catch(e) {}
        try { player.tell(Text.white("护甲值: " + player.armorValue)); } catch(e) {}
        try { player.tell(Text.white("盔甲韧性: " + player.getAttribute("minecraft:generic.armor_toughness").getValue().toFixed(1))); } catch(e) { player.tell(Text.white("盔甲韧性: 获取失败")); }
        try { player.tell(Text.white("基础攻击伤害: " + player.getAttribute("minecraft:generic.attack_damage").getValue().toFixed(1))); } catch(e) { player.tell(Text.white("攻击伤害: 获取失败")); }
        try { player.tell(Text.white("攻击速度: " + player.getAttribute("minecraft:generic.attack_speed").getValue().toFixed(2))); } catch(e) { player.tell(Text.white("攻击速度: 获取失败")); }
        try { player.tell(Text.white("移动速度: " + player.getAttribute("minecraft:generic.movement_speed").getValue().toFixed(3))); } catch(e) { player.tell(Text.white("移动速度: 获取失败")); }
        try {
            player.tell(Text.white("是否飞行: " + (player.abilities.flying ? "是" : "否")));
            player.tell(Text.white("是否允许飞行: " + (player.abilities.mayfly ? "是" : "否")));
            if (floatEq(player.abilities.flyingSpeed, 0.04)) {player.tell(Text.white("飞行状态:正常飞行(飞行大师的超音速之魂)"))}
            else if (floatEq(player.abilities.flyingSpeed, 0.03)) {player.tell(Text.white("飞行状态:正常飞行(金色鸡)"))}
            else if (floatEq(player.abilities.flyingSpeed, 0.08)) {player.tell(Text.white("飞行状态:二倍飞行"))}
            else if (floatEq(player.abilities.flyingSpeed, 0.12)) {player.tell(Text.white("飞行状态:三倍飞行"))}
            else if (floatEq(player.abilities.flyingSpeed, 0.2)) {player.tell(Text.white("飞行状态:四倍飞行"))}
            else if (floatEq(player.abilities.flyingSpeed, 1)) {player.tell(Text.white("飞行状态:无双风神"))}
        } catch(e) {}
    } else {
        try {
            player.tell(Text.aqua("正在搜索..."));
            var targetPlayerList = getAllPlayerInRange(player, 64);
            player.tell(Text.aqua("搜索完成，收集到数量: " + targetPlayerList.length));
            if(targetPlayerList.length === 0){
                player.tell(Text.red("64格范围内没有其他玩家！"));
            }else{
                player.tell(Text.gold("===== 64格范围内共 " + targetPlayerList.length + " 名玩家 ====="));
                for(var j = 0; j < targetPlayerList.length; j++){
                    var target = targetPlayerList[j];
                    try { player.tell(Text.yellow("-------- 玩家【" + target.getName().getString() + "】--------")); } catch(e) {}
                    try { player.tell(Text.white("玩家名称: " + target.getName().getString())); } catch(e) {}
                    try { player.tell(Text.white("游戏模式: " + target.gameMode.getGameModeForPlayer().getName())); } catch(e) {}
                    try { player.tell(Text.white("生命值: " + target.health.toFixed(1) + "/" + target.maxHealth.toFixed(1))); } catch(e) {}
                    try { player.tell(Text.white("经验等级: " + target.experienceLevel)); } catch(e) {}
                    try { player.tell(Text.white("护甲值: " + target.armorValue)); } catch(e) {}
                    try { player.tell(Text.white("盔甲韧性: " + target.getAttribute("minecraft:generic.armor_toughness").getValue().toFixed(1))); } catch(e) { player.tell(Text.white("盔甲韧性: 获取失败")); }
                    try { player.tell(Text.white("基础攻击伤害: " + target.getAttribute("minecraft:generic.attack_damage").getValue().toFixed(1))); } catch(e) { player.tell(Text.white("攻击伤害: 获取失败")); }
                    try { player.tell(Text.white("攻击速度: " + target.getAttribute("minecraft:generic.attack_speed").getValue().toFixed(2))); } catch(e) { player.tell(Text.white("攻击速度: 获取失败")); }
                    try { player.tell(Text.white("移动速度: " + target.getAttribute("minecraft:generic.movement_speed").getValue().toFixed(3))); } catch(e) { player.tell(Text.white("移动速度: 获取失败")); }
                    try {
                        player.tell(Text.white("是否飞行: " + (target.abilities.flying ? "是" : "否")));
                        player.tell(Text.white("是否允许飞行: " + (target.abilities.mayfly ? "是" : "否")));
                        if (floatEq(target.abilities.flyingSpeed, 0.04)) {player.tell(Text.white("飞行状态:正常飞行(飞行大师的超音速之魂)"))}
                        else if (floatEq(target.abilities.flyingSpeed, 0.03)) {player.tell(Text.white("飞行状态:正常飞行(金色鸡)"))}
                        else if (floatEq(target.abilities.flyingSpeed, 0.08)) {player.tell(Text.white("飞行状态:二倍飞行"))}
                        else if (floatEq(target.abilities.flyingSpeed, 0.12)) {player.tell(Text.white("飞行状态:三倍飞行"))}
                        else if (floatEq(target.abilities.flyingSpeed, 0.2)) {player.tell(Text.white("飞行状态:四倍飞行"))}
                        else if (floatEq(target.abilities.flyingSpeed, 1)) {player.tell(Text.white("飞行状态:无双风神"))}
                    } catch(e) {}
                }
            }
        }catch(err){
            player.tell(Text.red("Shift检测玩家发生异常！"));
            console.log("Shift异常:", err);
        }
    }
});
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
    let foundOreList = [];
    if (level.isClientSide()) return;
    if (event.hand !== "MAIN_HAND") return;
    if (player.getMainHandItem().getId() !== "kubejs:third_eye" ) return;
    var isShift = player.isShiftKeyDown();
    if (isShift) return;
    player.getCooldowns().addCooldown(event.getItem(), 20);
    try {
        spd = getPlayerRealWorldSpeed(player);
        mPhaseId = level.moonPhase;
        moonName = moonPhaseNames[mPhaseId];
        let px = Math.floor(player.x);
        let py = Math.floor(player.y);
        let pz = Math.floor(player.z);
        var aabb = player.boundingBox.inflate(24,24,24);
        var entityList = level.getEntities(null, aabb);
        for(let j=0; j < entityList.length; j++){
            let ent = entityList[j];
            if(ent.isLiving() && ent.isMonster()) hostileCount++;
        }
        var scanRange = 22;
        for(let ox = -scanRange; ox <= scanRange; ox++){
            for(let oy = -scanRange; oy <= scanRange; oy++){
                for(let oz = -scanRange; oz <= scanRange; oz++){
                    var block = level.getBlock([px + ox, py + oy, pz + oz]);
                    var bid = block.id.toString();
                    if(rareOres.indexOf(bid) !== -1){
                        //同种矿石只处理一次
                        if(foundOreSet.has(bid)) continue;
                        foundOreSet.add(bid);
                        var dis = Math.sqrt(ox*ox + oy*oy + oz*oz);
                        let oreData = oreTranslateMap[bid];
                        foundOreList.push({
                            name: oreData.name,
                            distance: dis,
                            priority: oreData.priority,
                            color: oreData.color
                        });
                    }
                }
            }
        }
        //按珍贵度从高到低排序
        foundOreList.sort((a,b)=> b.priority - a.priority);
    } catch(e) {
        player.tell(Text.red("获取数据失败！"));
        console.log("异常",e);
        event.cancel();
        return;
    }
    player.tell(Text.gray("===== 有关世界的信息 ====="));
    player.tell(Text.white("实时移动速度：" + Number(spd).toFixed(3) + " m/s"));
    player.tell(Text.white("当前月相：" + moonName + " (" + mPhaseId + ")"));
    player.tell(Text.white("半径24格敌对生物：" + hostileCount + " 只"));

    if(foundOreList.length > 0){
        player.tell(Text.aqua("附近的矿石"));
        let showMax = Math.min(foundOreList.length,6);
        for(let k=0;k<showMax;k++){
            let ore = foundOreList[k];
            player.tell(ore.color + ore.name + " §r距离:" + ore.distance.toFixed(1)+"m");
        }
        if(foundOreList.length>6){
            player.tell(Text.gray("...还有更多矿石未列出"));
        }
    }else{
        player.tell(Text.gray("未探测到矿石"));
    }

    event.cancel();
});
