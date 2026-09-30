// server_scripts/ibarakasens_masu.js
const EFFECT_LIST = [
    "minecraft:speed",
    "minecraft:slowness",
    "minecraft:haste",
    "minecraft:mining_fatigue",
    "minecraft:strength",
    "minecraft:jump_boost",
    "minecraft:regeneration",
    "minecraft:resistance",
    "minecraft:fire_resistance",
    "minecraft:water_breathing",
    "minecraft:invisibility",
    "minecraft:night_vision",
    "minecraft:health_boost",
    "minecraft:absorption",
    "minecraft:saturation",
    "minecraft:glowing",
    "minecraft:luck",
    "minecraft:slow_falling",
    "minecraft:conduit_power",
    "minecraft:dolphins_grace",
    "kaleidoscope_end:dream",
    "kaleidoscope_end:void_erosion",
    "kaleidoscope_end:mint",
    "tofucraft:soy_healthy",
    "tofucraft:cough",
    "tofucraft:salt_boost",
    "tofucraft:miso_boost",
    "friendsandfoes:reach",
    "kaleidoscope_nether:crimson",
    "kaleidoscope_nether:warped",
    "kaleidoscope_nether:star_blessing",
    "kaleidoscope_nether:ghost",
    "kaleidoscope_nether:tropical_strider",
    "kaleidoscope_nether:mysterious_poison",
    "kaleidoscope_cookery:flatulence",
    "kaleidoscope_cookery:tundra_strider",
    "kaleidoscope_cookery:warmth",
    "kaleidoscope_cookery:satiated_shield",
    "kaleidoscope_cookery:vigor",
    "kaleidoscope_cookery:sulfur",
    "kaleidoscope_cookery:mustard",
    "kaleidoscope_cookery:preservation",
    "kaleidoscope_cookery:hinder",
    "kaleidoscope_cookery:projectile_dodge",
    "kaleidoscope_cookery:instant_smelting",
    "kaleidoscope_cookery:vitality",
    "kaleidoscope_grilling:heavy_metal",
    "kaleidoscope_grilling:dragon_blood",
    "kaleidoscope_tavern:slightly_tipsy",
    "kaleidoscope_tavern:high_heels",
    "kaleidoscope_tavern:grass_stealth",
    "kaleidoscope_tavern:vision",
    "kaleidoscope_tavern:bloody_mary",
    "kaleidoscope_tavern:ardent_heat",
    "kaleidoscope_tavern:long_reach",
    "kaleidoscope_tavern:tomb_raider",
    "kaleidoscope_tavern:xp_drain",
    "kaleidoscope_tavern:upside_down",
    "kaleidoscope_tavern:zenith",
    "kaleidoscope_tavern:shriek_attack",
    "kaleidoscope_world_liquor:tequila",
    "kaleidoscope_world_liquor:captain_gift",
    "kaleidoscope_world_liquor:treasure_guide",
    "kaleidoscope_world_liquor:multi_jump",
    "kaleidoscope_world_liquor:crazy",
    "kaleidoscope_world_liquor:respawn",
    "kaleidoscope_world_liquor:double_damage",
    "kaleidoscope_world_liquor:boating_master",
    "kaleidoscope_world_liquor:hostile_detection",
    "kaleidoscope_world_liquor:beheading",
    "kaleidoscope_world_liquor:frost_walker",
    "kaleidoscope_world_liquor:bonemeal_spreader",
    "kaleidoscope_world_liquor:treasure_sense",
    "kaleidoscope_world_liquor:ground_crit",
    "kaleidoscope_world_liquor:explosion",
    "kaleidoscope_world_liquor:level_boost",
    "smc:elbow_strike",
    "twilightforest:frosted",
    "kaleidoscope_twilight:witchcraft_protection",
    "kaleidoscope_twilight:mushroom_perception",
    "kaleidoscope_twilight:phantom",
    "kaleidoscope_twilight:sturdy_scales",
    "kaleidoscope_twilight:yeti_throw",
    "kaleidoscope_twilight:frost_cloud",
    "kaleidoscope_twilight:fire_breath",
    "kaleidoscope_twilight:erudition",
    "kaleidoscope_twilight:giant_blessing",
    "farmersdelight:nourishment",
    "farmersdelight:comfort",
    "youkaishomecoming:caffeinated",
    "youkaishomecoming:tea_polyphenols",
    "youkaishomecoming:sober",
    "youkaishomecoming:refreshing",
    "youkaishomecoming:thick",
    "youkaishomecoming:smoothing",
    "youkaishomecoming:phantom",
    "twilightdelight:fire_range",
    "twilightdelight:poison_range",
    "twilightdelight:frozen_range",
    "twilightdelight:temporal_sadness",
    "twilightdelight:aurora_glowing",
    "vinery:armor_effect",
    "vinery:health_effect",
    "vinery:luck_effect",
    "vinery:resistance_effect",
    "vinery:experience_effect",
    "vinery:double_jump",
    "vinery:party_effect",
    "vinery:creeper_effect",
    "vinery:climbing_effect",
    "vinery:frosty_armor",
    "vinery:jellie",
    "vinery:lava_walker",
    "vinery:magnet",
    "vinery:water_walker",
    "neapolitan:vanilla_scent",
    "neapolitan:agility",
    "neapolitan:slipping",
    "neapolitan:berserking",
    "neapolitan:harmony",
    "extradelight:pickled",
    "extradelight:sour_pucker",
    "extradelight:sunshine"
];

function getRandomUnique(arr, n) {
    var copy = arr.slice(0);
    var out = [];
    for(var i = 0; i < n && copy.length > 0; i++){
        var idx = Math.floor(Math.random() * copy.length);
        out.push(copy.splice(idx, 1)[0]);
    }
    return out;
}

ItemEvents.rightClicked("kubejs:ibarakasens_masu", function(event) {
    if (event.hand !== "main_hand") return;
    
    var player = event.player;
    var item = event.item;
    var level = event.level;
    if(!player || player.isFake()) return;


    var nbt = player.persistentData;
    var lastUse = nbt.ibarakasens_masu_last_use ?? 0;
    var currentTick = level.time;
    var cooldownTick = 60 * 20;

    // 冷却判定，移除玩家提示
    if(currentTick - lastUse < cooldownTick){
        return;
    }

    var selectedEffects = getRandomUnique(EFFECT_LIST, 4);
    console.log("[SilverChicken] " + player.name + " 触发，选中效果：" + selectedEffects.join(","));

    // 服务端执行effect指令
    for(var j = 0; j < selectedEffects.length; j++){
        var effectId = selectedEffects[j];
        var cmd = `effect give ${player.uuid} ${effectId} ${4800 / 20} ${2} false`;
        var ret = level.server.runCommandSilent(cmd);
        if(ret !== 1){
            console.warn("[SilverChicken] 指令执行失败 ID:"+effectId+" ret:"+ret);
        }
    }
    // 写入持久化冷却时间戳
    nbt.ibarakasens_masu_last_use = currentTick;
    // 物品栏显示冷却动画
    player.cooldowns.addCooldown(item.id, cooldownTick);
});
