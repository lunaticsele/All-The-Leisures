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
import  crafttweaker.api.ingredient.type.IIngredientEmpty;

//锻造
smithing.addTransformRecipe("wooden_stick",<item:constructionstick:wooden_stick>,IIngredientEmpty.getInstance(),<item:minecraft:stick>,<item:minecraft:stick>);
smithing.addTransformRecipe("copper_stick",<item:constructionstick:copper_stick>,IIngredientEmpty.getInstance(),<item:minecraft:stick>,<item:minecraft:copper_ingot>);
smithing.addTransformRecipe("iron_stick",<item:constructionstick:iron_stick>,IIngredientEmpty.getInstance(),<item:minecraft:stick>,<item:minecraft:iron_ingot>);
smithing.addTransformRecipe("diamond_stick",<item:constructionstick:diamond_stick>,IIngredientEmpty.getInstance(),<item:minecraft:stick>,<item:minecraft:diamond>);
smithing.addTransformRecipe("netherite_stick",<item:constructionstick:netherite_stick>,IIngredientEmpty.getInstance(),<item:minecraft:stick>,<item:minecraft:netherite_ingot>);



smithing.addTransformRecipe("unbreakable_diamond_grit_sandpaper",<item:createaddition:diamond_grit_sandpaper>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:createaddition:diamond_grit_sandpaper>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);

smithing.addTransformRecipe("unbreakable_grater",<item:extradelight:grater>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:extradelight:grater>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);

smithing.addTransformRecipe("unbreakable_tofu_metal_shears",<item:tofucraft:tofu_metal_shears>.withJsonComponent(<componenttype:minecraft:max_damage>, 2147483647),<item:constructionstick:template_unbreakable>,<item:tofucraft:tofu_metal_shears>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_dragon_tooth_knife",<item:ends_delight:dragon_tooth_knife>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:ends_delight:dragon_tooth_knife>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_dragon_egg_shell_knife",<item:ends_delight:dragon_egg_shell_knife>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:ends_delight:dragon_egg_shell_knife>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_k_dragon_tooth_knife",<item:kaleidoscope_end:dragon_tooth_knife>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:kaleidoscope_end:dragon_tooth_knife>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_primitive_machete",<item:kaleidoscope_nether:primitive_machete>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:kaleidoscope_nether:primitive_machete>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_netherite_pickaxe",<item:minecraft:netherite_pickaxe>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:minecraft:netherite_pickaxe>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_tofu_diamond_pickaxe",<item:tofucraft:tofu_diamond_pickaxe>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:tofucraft:tofu_diamond_pickaxe>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_netherite_knife",<item:farmersdelight:netherite_knife>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:farmersdelight:netherite_knife>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_blazing_iron_kitchen_knife",<item:kaleidoscope_twilight:blazing_iron_kitchen_knife>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:kaleidoscope_twilight:blazing_iron_kitchen_knife>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_fiery_knife",<item:twilightdelight:fiery_knife>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:twilightdelight:fiery_knife>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_tofu_diamond_knife",<item:tofudelight:tofu_diamond_knife>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:tofudelight:tofu_diamond_knife>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_cherry_iron_knife",<item:trailandtales_delight:cherry_iron_knife>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:trailandtales_delight:cherry_iron_knife>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_netherite_axe",<item:minecraft:netherite_axe>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:minecraft:netherite_axe>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_tofu_diamond_axe",<item:tofucraft:tofu_diamond_axe>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:tofucraft:tofu_diamond_axe>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_diamond_minotaur_axe",<item:twilightforest:diamond_minotaur_axe>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:twilightforest:diamond_minotaur_axe>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_sickle",<item:kaleidoscope_cookery:sickle>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:kaleidoscope_cookery:sickle>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_netherite_hoe",<item:minecraft:netherite_hoe>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:minecraft:netherite_hoe>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_tofu_diamond_hoe",<item:tofucraft:tofu_diamond_hoe>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:tofucraft:tofu_diamond_hoe>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_giant_sword",<item:twilightforest:giant_sword>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:twilightforest:giant_sword>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_giant_pickaxe",<item:twilightforest:giant_pickaxe>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:twilightforest:giant_pickaxe>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_kitchen_shovel",<item:kaleidoscope_cookery:kitchen_shovel>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:kaleidoscope_cookery:kitchen_shovel>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_netherite_spoon",<item:extradelight:netherite_spoon>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:extradelight:netherite_spoon>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_butcher_knife",<item:butchercraft:butcher_knife>.withJsonComponent(<componenttype:minecraft:max_damage>, 2147483647),<item:constructionstick:template_unbreakable>,<item:butchercraft:butcher_knife>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_skinning_knife",<item:butchercraft:skinning_knife>.withJsonComponent(<componenttype:minecraft:max_damage>, 2147483647),<item:constructionstick:template_unbreakable>,<item:butchercraft:skinning_knife>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_bone_saw",<item:butchercraft:bone_saw>.withJsonComponent(<componenttype:minecraft:max_damage>, 2147483647),<item:constructionstick:template_unbreakable>,<item:butchercraft:bone_saw>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_gut_knife",<item:butchercraft:gut_knife>.withJsonComponent(<componenttype:minecraft:max_damage>, 2147483647),<item:constructionstick:template_unbreakable>,<item:butchercraft:gut_knife>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_shears",<item:minecraft:shears>.withJsonComponent(<componenttype:minecraft:max_damage>, 2147483647),<item:constructionstick:template_unbreakable>,<item:minecraft:shears>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_netherite_shovel",<item:minecraft:netherite_shovel>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:minecraft:netherite_shovel>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_diamond_fishing_rod",<item:aquaculture:diamond_fishing_rod>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:aquaculture:diamond_fishing_rod>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
smithing.addTransformRecipe("unbreakable_tofu_diamond_shovel",<item:tofucraft:tofu_diamond_shovel>.withJsonComponent(<componenttype:minecraft:unbreakable>, {}),<item:constructionstick:template_unbreakable>,<item:tofucraft:tofu_diamond_shovel>.anyDamage(),<item:kaleidoscope_end:dragon_dust>);
