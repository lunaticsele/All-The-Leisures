ItemEvents.rightClicked(event => {
    var player = event.player;
    var server = event.server;
    if (event.level.isClientSide()) return;
    if (player.getMainHandItem().getItem() === 'kubejs:lich_doll') {
        player.getMainHandItem().shrink(1);
        server.runCommandSilent(`summon twilightforest:lich ${player.getX()} ${player.getY()+12} ${player.getZ()}`);
        server.runCommandSilent(`effect give @e[type=twilightforest:lich,sort=nearest,limit=1] minecraft:slow_falling 12 4 true`);
        server.runCommandSilent(`particle minecraft:explosion_emitter ${player.getX()} ${player.getY()+12} ${player.getZ()} 0 0 0 0 1`);
        server.runCommandSilent(`playsound minecraft:entity.dragon_fireball.explode master @a ${player.getX()} ${player.getY()+12} ${player.getZ()} 1 1`);
        server.runCommandSilent(`execute as @e[type=twilightforest:lich,sort=nearest,limit=1] run say §6你杀死了我，又复活了我...是想要更多的巫术材料吗?`);
    };
    if (player.getMainHandItem().getItem() === 'kubejs:naga_feast') {
        player.getMainHandItem().shrink(1);
        server.runCommandSilent(`summon twilightforest:naga ${player.getX()} ${player.getY()+12} ${player.getZ()}`);
        server.runCommandSilent(`effect give @e[type=twilightforest:naga,sort=nearest,limit=1] minecraft:slow_falling 12 4 true`);
        server.runCommandSilent(`particle minecraft:explosion_emitter ${player.getX()} ${player.getY()+12} ${player.getZ()} 0 0 0 0 1`);
        server.runCommandSilent(`playsound minecraft:entity.dragon_fireball.explode master @a ${player.getX()} ${player.getY()+12} ${player.getZ()} 1 1`);
        server.runCommandSilent(`execute as @e[type=twilightforest:naga,sort=nearest,limit=1] run say §2意义明确的吼叫(食物！)`);
    };
    if (player.getMainHandItem().getItem() === 'kubejs:mushroom_meat') {
        player.getMainHandItem().shrink(1);
        server.runCommandSilent(`summon twilightforest:minoshroom ${player.getX()} ${player.getY()+12} ${player.getZ()}`);
        server.runCommandSilent(`effect give @e[type=twilightforest:minoshroom,sort=nearest,limit=1] minecraft:slow_falling 12 4 true`);
        server.runCommandSilent(`particle minecraft:explosion_emitter ${player.getX()} ${player.getY()+12} ${player.getZ()} 0 0 0 0 1`);
        server.runCommandSilent(`playsound minecraft:entity.dragon_fireball.explode master @a ${player.getX()} ${player.getY()+12} ${player.getZ()} 1 1`);
        server.runCommandSilent(`execute as @e[type=twilightforest:minoshroom,sort=nearest,limit=1] run say §4哞~(我为啥在这？)`);
    };
    if (player.getMainHandItem().getItem() === 'kubejs:hydra_egg') {
        player.getMainHandItem().shrink(1);
        server.runCommandSilent(`summon twilightforest:hydra ${player.getX()} ${player.getY()+12} ${player.getZ()}`);
        server.runCommandSilent(`effect give @e[type=twilightforest:hydra,sort=nearest,limit=1] minecraft:slow_falling 12 4 true`);
        server.runCommandSilent(`particle minecraft:explosion_emitter ${player.getX()} ${player.getY()+12} ${player.getZ()} 0 0 0 0 1`);
        server.runCommandSilent(`playsound minecraft:entity.dragon_fireball.explode master @a ${player.getX()} ${player.getY()+12} ${player.getZ()} 1 1`);
        server.runCommandSilent(`execute as @e[type=twilightforest:hydra,sort=nearest,limit=1] run say §3此为我口信：相信你已然听到过我最后拼死一搏的——怒吼！`);
    };
    if (player.getMainHandItem().getItem() === 'kubejs:totem_of_phantom') {
        player.getMainHandItem().shrink(1);
        server.runCommandSilent(`summon twilightforest:knight_phantom ${player.getX()} ${player.getY()+12} ${player.getZ()}`);
        server.runCommandSilent(`effect give @e[type=twilightforest:knight_phantom ,sort=nearest,limit=1] minecraft:slow_falling 12 4 true`);
        server.runCommandSilent(`particle minecraft:explosion_emitter ${player.getX()} ${player.getY()+12} ${player.getZ()} 0 0 0 0 1`);
        server.runCommandSilent(`playsound minecraft:entity.dragon_fireball.explode master @a ${player.getX()} ${player.getY()+3} ${player.getZ()} 1 1`);
        server.runCommandSilent(`execute as @e[type=twilightforest:knight_phantom ,sort=nearest,limit=1] run say §a随往日的幻影一同消散吧...`);
    };
    if (player.getMainHandItem().getItem() === 'kubejs:ur_ghast_blood_tear') {
        player.getMainHandItem().shrink(1);
        server.runCommandSilent(`summon twilightforest:ur_ghast ${player.getX()} ${player.getY()+12} ${player.getZ()}`);
        server.runCommandSilent(`effect give @e[type=twilightforest:ur_ghast ,sort=nearest,limit=1] minecraft:slow_falling 12 4 true`);
        server.runCommandSilent(`particle minecraft:explosion_emitter ${player.getX()} ${player.getY()+12} ${player.getZ()} 0 0 0 0 1`);
        server.runCommandSilent(`playsound minecraft:entity.dragon_fireball.explode master @a ${player.getX()} ${player.getY()+8} ${player.getZ()} 1 1`);
        server.runCommandSilent(`execute as @e[type=twilightforest:ur_ghast ,sort=nearest,limit=1] run say §c我看着这片森林变为地狱，也已经再次经过了地狱之旅...你可曾享受？`);
    };
    if (player.getMainHandItem().getItem() === 'kubejs:iceberg_princess') {
        player.getMainHandItem().shrink(1);
        server.runCommandSilent(`summon twilightforest:snow_queen ${player.getX()} ${player.getY()+12} ${player.getZ()}`);
        server.runCommandSilent(`effect give @e[type=twilightforest:snow_queen ,sort=nearest,limit=1] minecraft:slow_falling 12 4 true`);
        server.runCommandSilent(`particle minecraft:explosion_emitter ${player.getX()} ${player.getY()+12} ${player.getZ()} 0 0 0 0 1`);
        server.runCommandSilent(`playsound minecraft:entity.dragon_fireball.explode master @a ${player.getX()} ${player.getY()+12} ${player.getZ()} 1 1`);
        server.runCommandSilent(`execute as @e[type=twilightforest:snow_queen ,sort=nearest,limit=1] run say §b哈？咱可是最强的！...除非你吃了那些东西...`);
    };
})