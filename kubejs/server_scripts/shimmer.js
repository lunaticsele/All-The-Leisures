// kubejs/server_scripts/shimmer_liquid.js
var $GameType = Java.loadClass("net.minecraft.world.level.GameType");
PlayerEvents.tick(playerEvent => {
    var player = playerEvent.player;
    if (!player.isAlive()) return;

    if (player.gameMode.getGameModeForPlayer() === $GameType.CREATIVE) return;
    var hasDragonDust = player.inventory.contains(Item.of("kaleidoscope_end:dragon_dust"));
    if (hasDragonDust) return;

    var blockPos = player.blockPosition();
    var blockState = player.level.getBlockState(blockPos);
    var inShimmerBlock = blockState.getBlock().getId() === "kubejs:shimmer";

    var posYPlus1 = blockPos.above();
    var posIsAir = player.level.getBlockState(blockPos).isAir();
    var posYPlus1IsAir = player.level.getBlockState(posYPlus1).isAir();
    var triggerExit = posIsAir && posYPlus1IsAir;

    if (inShimmerBlock) {

        if (!player.persistentData.getBoolean("in_shimmer")) {
            player.persistentData.putBoolean("in_shimmer", true);
            player.persistentData.remove("exitTriggered");
            player.setGameMode($GameType.SPECTATOR);
            player.abilities.mayfly = false;
            player.abilities.flying = false;
            player.onUpdateAbilities();
        }
    }

    else if (triggerExit) {
        if (player.persistentData.getBoolean("in_shimmer") && !player.persistentData.getBoolean("exitTriggered")) {
            player.persistentData.putBoolean("in_shimmer", false);
            player.persistentData.putBoolean("exitTriggered", true);
            player.setGameMode($GameType.SURVIVAL);
        }
    }

    else {
        if (player.persistentData.getBoolean("exitTriggered")) {
            player.persistentData.putBoolean("exitTriggered", false);
        }
    }
});
