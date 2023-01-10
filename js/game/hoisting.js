/* ==============================================================
	Wilderness
=============================================================== */

// Map
var wilderness_width = 100;
var wilderness_height = 100;
var _wilderness_mapcontainer = new PIXI.Container();
var _wilderness_container_tiles = new PIXI.Container();
var _wilderness_container_items = new PIXI.Container();
var _wilderness_container_fog = new PIXI.Container();
var wilderness_map;
var wilderness_camera;

// Player
var wilderness_player;

var app = new PIXI.Application({width:960, height:540});
var sprite = PIXI.Sprite.from('data/gfx/test.jpg');

var hexagon_flat = PIXI.Texture.from('data/gfx/hex_flat.png');
var hexagon_water = PIXI.Texture.from('data/gfx/hex_water.png');
var hexagon_start = PIXI.Texture.from('data/gfx/hex_start.png');
var hexagon_end = PIXI.Texture.from('data/gfx/hex_end.png');
var hexagon_forest = PIXI.Texture.from('data/gfx/hex_forest.png');
var hexagon_mountain = PIXI.Texture.from('data/gfx/hex_mountain.png');
var hexagon_mountain_dead = PIXI.Texture.from('data/gfx/hex_mountain_dead.png');
var hexagon_fog = PIXI.Texture.from('data/gfx/hex_fog.png');
var icon_water = PIXI.Texture.from('data/gfx/water.png');
var icon_berry = PIXI.Texture.from('data/gfx/berry.png');
var icon_sleep = PIXI.Texture.from('data/gfx/sleep.png');

var player = PIXI.Sprite.from('data/gfx/player.png');
app.stage.addChild(sprite);
sprite.transform.position.x = 100;

//============================================================= EOF