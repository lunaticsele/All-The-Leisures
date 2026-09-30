const CONFIG_EXPLOSION = {
    cooldownSeconds: 0.2   
};

ItemEvents.rightClicked(event => {
    if (event.hand !== "main_hand") return;
    var player = event.player;
    var level = event.level;
    var server = event.server;
    if (level.isClientSide()) return;
    var mainItem = player.getMainHandItem();
    if (mainItem.id !== 'kubejs:detonator') return;


    var nbt = player.persistentData;
    var lastUse = nbt.silver_chicken_last_use ?? 0;
    var currentTick = level.time;
    var cooldownTick = CONFIG_EXPLOSION.cooldownSeconds * 20;
    if(currentTick - lastUse < cooldownTick){
        return;
    }
    nbt.silver_chicken_last_use = currentTick;
    player.cooldowns.addCooldown(mainItem.item, cooldownTick);


    var px = player.getX();
    var py = player.getY();
    var pz = player.getZ();
    var uuid = player.uuid;
    let baseDamage = player.health;
    let damageType = "minecraft:player_explosion";
    let hasTnt = false;
    let hasWeaversStar = false;
    // 获取副手物品
    var offHand = player.getOffHandItem();
    if (offHand.id === "minecraft:tnt" && offHand.count >= 1) {
        hasTnt = true;
    }
    if (offHand.id === "kubejs:mixed_seed" && offHand.count >= 1) {
        hasWeaversStar = true;
    }
    baseDamage -= 1.0;
    if (hasTnt) {
        offHand.shrink(1);
        player.setOffHandItem(offHand);

        baseDamage *= 1.5;
    }
    if (hasWeaversStar) {
        offHand.shrink(1);
        player.setOffHandItem(offHand);
        baseDamage *= 0.5
        damageType = "minecraft:out_of_world";
    }
    console.log(`[SilverChicken]玩家${player.name} 基础生命:${player.health} 最终伤害:${baseDamage} 伤害类型:${damageType} hasTnt:${hasTnt} hasStar:${hasWeaversStar}`);
    // 不过滤掉落物，沿用你原来的damage命令格式
    var damageCmd = `execute as ${uuid} at @s run execute as @e[distance=..6] run damage @s ${baseDamage} ${damageType} by ${uuid} from ${uuid}`;
    server.runCommandSilent(damageCmd);
    server.runCommandSilent(`particle minecraft:explosion_emitter ${px} ${py} ${pz} 0 0 0 0 1`);
    server.runCommandSilent(`playsound minecraft:entity.dragon_fireball.explode master @a ${px} ${py} ${pz} 1 1`);
})
