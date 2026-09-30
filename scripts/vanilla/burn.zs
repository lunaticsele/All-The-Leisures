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

//修改包子类配方

campfire.addRecipe("samsa_from_campfire_cooking",<item:kaleidoscope_cookery:samsa>,<item:youkaishomecoming:raw_bun>,0.35,600);

furnace.addRecipe("samsa_from_smelting",<item:kaleidoscope_cookery:samsa>,<item:youkaishomecoming:raw_bun>,0.35,200);
furnace.addRecipe("gelatin",<item:butchercraft:gelatin>,<item:butchercraft:hoof>,0.35,200);
smoker.addRecipe("gelatin_from_smoking",<item:butchercraft:gelatin>,<item:butchercraft:hoof>,0.35,200);
smoker.addRecipe("samsa_from_smoking",<item:kaleidoscope_cookery:samsa>,<item:youkaishomecoming:raw_bun>,0.35,100);
