
//增加磨粉配方(机械动力粉碎轮，森罗物语石磨配方使用kjs制作)
<recipetype:create:crushing>.addJsonRecipe("dragon_dust_crush", {
  "type": "create:crushing",
  "ingredients": [
    {
      "item": "ends_delight:dragon_tooth"
    }
  ],
  "results": [
    {
      "count": 1,
      "id": "kaleidoscope_end:dragon_dust"
    }
  ]}
 );
<recipetype:create:crushing>.addJsonRecipe("crushed_raw_platinum", {
  "type": "create:crushing",
  "ingredients": [
    {
      "item": "kubejs:platinum_oreberry"
    }
  ],
  "results": [
    {
      "count": 1,
      "id": "create:crushed_raw_platinum"
    }
  ]}
 );
<recipetype:create:crushing>.addJsonRecipe("netherite_scrap_crush", {
  "type": "create:crushing",
  "ingredients": [
    {
      "item": "minecraft:ancient_debris"
    }
  ],
  "results": [
    {
      "count": 3,
      "id": "minecraft:netherite_scrap"
    }
  ]}
 );


<recipetype:create:crushing>.addJsonRecipe("gunpowder_crush", {
  "type": "create:crushing",
  "ingredients": [
    {
      "item" : "minecraft:flint"
    }
  ],
  "results": [
    {
      "count": 1,
      "id": "minecraft:gunpowder"
    }
  ]}
 );

<recipetype:create:crushing>.addJsonRecipe("star_dust_crush", {
  "type": "create:crushing",
  "ingredients": [
    {
      "item": "minecraft:nether_star"
    }
  ],
  "results": [
    {
      "count": 4,
      "id": "kaleidoscope_nether:star_dust"
    }
  ]}
 );

