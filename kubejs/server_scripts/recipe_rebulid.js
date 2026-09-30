ServerEvents.recipes(event => {


    event.custom({
  "type": "kaleidoscope_cookery:stockpot",
  "carrier": {
    "item": "minecraft:bowl"
  },
  "ingredients": [
{tag: "kaleidoscope_grilling:ingredients/sweet_potatoes"},
     {tag: "kaleidoscope_grilling:ingredients/sweet_potatoes"},
     {tag: "kaleidoscope_grilling:ingredients/sweet_potatoes"},
     {tag: "c:rice"},
     {tag: "c:rice"},
     {tag: "c:rice"}
  ],
  "result": {
    "count": 3,
    "id": "kaleidoscope_grilling:red_sweet_potato_porridge"
  },
  "soup_base": "minecraft:water"
    });
//酒桶
    event.custom({
  "type": "kaleidoscope_tavern:barrel",
  "carrier": {
    "item": "kaleidoscope_tavern:empty_bottle"
  },
  "fluid": "minecraft:water",
  "ingredients": [
    {
      "tag": "c:coconut_slice"}
  ],
  "result": {
    "count": 1,
    "id": "kaleidoscope_world_liquor:pina_colada"
  }
    });
    event.custom({
  "type": "kaleidoscope_tavern:barrel",
  "carrier": {
    "item": "kaleidoscope_tavern:empty_bottle"
  },
  "fluid": "minecraft:water",
  "ingredients": [
    {
      "tag": "c:rice_panicle"},{"item":"minecraft:wheat"
    }
  ],
  "result": {
    "count": 1,
    "id": "kaleidoscope_world_liquor:spiryt_vodka"
  }
    });
    event.custom({
  "type": "kaleidoscope_tavern:barrel",
  "carrier": {
    "item": "kaleidoscope_tavern:empty_bottle"
  },
  "fluid": "minecraft:water",
  "ingredients": [
    {
      "tag": "c:rice_panicle"},{"item":"minecraft:potato"
    }
  ],
  "result": {
    "count": 1,
    "id": "kaleidoscope_world_liquor:smirnoff_red_vodka"
  }
    });

    event.custom({
  "type": "kaleidoscope_tavern:barrel",
  "carrier": {
    "item": "kaleidoscope_tavern:empty_bottle"
  },
  "fluid": "minecraft:water",
  "ingredients": [
{tag: "c:rice"},
   {item: "minecraft:bamboo"}
  ],
  "result": {
    "count": 1,
    "id": "kaleidoscope_world_liquor:bamboo_leaf_green_liquor"
  }
    });
    event.custom({
  "type": "kaleidoscope_tavern:barrel",
  "carrier": {
    "item": "kaleidoscope_tavern:empty_bottle"
  },
  "fluid": "minecraft:water",
  "ingredients": [
{tag: "c:rice"}
  ],
  "result": {
    "count": 1,
    "id": "kaleidoscope_world_liquor:dassai"
  }
    });
    
event.recipes.kaleidoscope_cookery.pot(
"kaleidoscope_cookery:sticky_rice_cake",["#c:cooked_rice"],"minecraft:paper",50,1);

event.recipes.kaleidoscope_cookery.pot(
"kaleidoscope_nether:braised_pork_rice",["#c:foods/raw_pork","#c:foods/raw_pork","#c:vegetables/pepper","#c:vegetables/pepper","#c:eggs","#c:eggs"],"#c:cooked_rice",300,4);

event.recipes.kaleidoscope_cookery.pot(
"kaleidoscope_twilight:stir_fried_fat_caterpillar_rice_bowl",["kaleidoscope_twilight:twilight_caterpillar","kaleidoscope_cookery:green_chili","kaleidoscope_cookery:green_chili","kaleidoscope_cookery:green_chili",],"#c:cooked_rice",300,4);

event.recipes.kaleidoscope_cookery.pot(
"kaleidoscope_twilight:deer_stew_potato_rice_bowl",["twilightforest:raw_venison","twilightforest:raw_venison","minecraft:potato","minecraft:potato","minecraft:potato",],"#c:cooked_rice",300,4);



})
