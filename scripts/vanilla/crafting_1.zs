import crafttweaker.api.item.IItemStack;
import crafttweaker.api.ingredient.IIngredient;
import crafttweaker.api.data.IData;
import crafttweaker.api.util.random.Percentaged;
import crafttweaker.api.recipe.CraftingTableRecipeManager;
import crafttweaker.api.recipe.IRecipeManager;
import crafttweaker.api.item.NeoForgeItemStack;
import crafttweaker.api.item.MCItemStack;
import crafttweaker.api.loot.condition.LootTableIdLootCondition;
import crafttweaker.api.loot.condition.LootConditions;
import crafttweaker.api.ingredient.type.IIngredientEmpty;

craftingTable.addShaped("flying_soul",<item:kubejs:flying_soul>,
[[<item:minecraft:phantom_membrane>,<item:minecraft:ghast_tear>,<item:minecraft:phantom_membrane>],
[<item:minecraft:feather>,<item:kubejs:weavers_star>,<item:minecraft:feather>],
[<item:twilightforest:fluffy_cloud>,<item:twilightforest:fluffy_cloud>,<item:twilightforest:fluffy_cloud>]]);
craftingTable.addShaped("detonator",<item:kubejs:detonator>,
[[<item:minecraft:tnt>,<item:refinedstorage_quartz_arsenal:wireless_crafting_grid>,<item:minecraft:white_carpet>],
[<item:kaleidoscope_world_liquor:jerk>,<item:kubejs:weavers_star>,<item:kaleidoscope_world_liquor:jerk>],
[<item:minecraft:tnt>,<item:minecraft:nether_star>,<item:minecraft:tnt>]]);
craftingTable.addShaped("ibarakasens_masu",<item:kubejs:ibarakasens_masu>,
[[<tag:item:kaleidoscope_tavern:cocktail_ingredient>,<tag:item:kaleidoscope_tavern:cocktail_ingredient>,<tag:item:kaleidoscope_tavern:cocktail_ingredient>],
[<tag:item:kaleidoscope_tavern:cocktail_ingredient>,<tag:item:kaleidoscope_tavern:cocktail_ingredient>,<tag:item:kaleidoscope_tavern:cocktail_ingredient>],
[<item:kubejs:weavers_star>,<item:minecraft:bowl>,<item:kubejs:weavers_star>]]);