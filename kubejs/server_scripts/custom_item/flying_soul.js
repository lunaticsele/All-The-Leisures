var Player = Java.loadClass("net.minecraft.world.entity.player.Player");
var FoodData = Java.loadClass("net.minecraft.world.food.FoodData");

// 浮点近似工具
function floatEq(a, b, eps = 1e-4) {
    return Math.abs(a - b) < eps;
}

ItemEvents.rightClicked(event => {
    var player = event.player;
    var level = event.level;
    if (level.isClientSide()) return;
    if (player.getMainHandItem().getId() === "kubejs:flying_soul") {
        if (event.hand !== "main_hand") return;
        // 切换飞行状态
        if (player.abilities.mayfly) {
            if (player.abilities.flying) {
                var currentSpeed = player.abilities.flyingSpeed;
                if (floatEq(currentSpeed < 0.03)) {
                    player.abilities.setFlyingSpeed(0.04);
                    player.onUpdateAbilities();
                }
                if (floatEq(currentSpeed, 0.04)) {
                    player.abilities.setFlyingSpeed(0.08);
                    player.onUpdateAbilities();
                    player.sendSystemMessage(Component.literal("§6飞行状态: 二倍飞行"))
                } else if (floatEq(currentSpeed, 0.08)) {
                    player.abilities.setFlyingSpeed(0.12);
                    player.onUpdateAbilities();
                    player.sendSystemMessage(Component.literal("§6飞行状态: 三倍飞行"))
                } else if (floatEq(currentSpeed, 0.12)) {
                    player.abilities.setFlyingSpeed(0.2);
                    player.sendSystemMessage(Component.literal("§6飞行状态: 四倍飞行"))
                    player.onUpdateAbilities();
                } else if (floatEq(currentSpeed, 0.2)) {
                    player.abilities.setFlyingSpeed(1);
                    player.sendSystemMessage(Component.literal("§6飞行状态: 无双风神"))
                    player.onUpdateAbilities();
                } else if (floatEq(currentSpeed, 1)) {
                    player.abilities.setFlyingSpeed(0.04);
                    player.sendSystemMessage(Component.literal("§6飞行状态: 正常飞行"))
                    player.onUpdateAbilities();
                } else if (floatEq(currentSpeed, 0.03)) {
                    player.abilities.setFlyingSpeed(0.04);
                    player.sendSystemMessage(Component.literal("§6飞行状态: 正常飞行"))
                    player.onUpdateAbilities();
                }
            } else {
                if (player.isCreative()) return
                if (player.isSpectator()) return
                player.abilities.mayfly = false;
                player.abilities.flying = false;
                player.onUpdateAbilities();
                player.sendSystemMessage(Component.literal("§6飞行状态: 停止飞行"));
            }
        } else {
            player.abilities.mayfly = true;
            player.abilities.flying = true;
            player.onUpdateAbilities();
            player.abilities.setFlyingSpeed(0.04);
            player.onUpdateAbilities();
            player.sendSystemMessage(Component.literal("§6飞行状态: 飞行"));
        }
    }
});


PlayerEvents.tick(event => {
    var player = event.player;
    var level = player.level;
    if (player.isCreative()) return
    if (player.isSpectator()) return
    if (level.isClientSide()) return;

    var hasFlysoul = player.getInventory().contains('kubejs:flying_soul');

    if (hasFlysoul) {
        player.abilities.mayfly = true;
        player.onUpdateAbilities();};
    if (!hasFlysoul && player.abilities.mayfly) {
        player.abilities.mayfly = false;
        player.abilities.flying = false;
        player.onUpdateAbilities();
        player.sendSystemMessage(Component.literal("§c未持有飞行物品，强制关闭飞行！"));
        return;
    }
});


