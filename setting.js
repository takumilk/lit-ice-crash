// スプライト
var player;
var playerDirection;
var playerMode;
var logo;
var jewel;
var goal;
var breakingBlock;
var heading;

// グループ
var blackBlockGroup;
var blueBlockGroup;
var hardBlockGroup;
var allBlockGroup;
var timerItemGroup;
var jumpingForceItemGroup;
var jewelGroup;
var thornGroup;

// 画像
var logoImage;
var blackBlockImage;
var blueBlockImage;
var hardBlockImage;
var goalImage;
var jewelImage;
var thornImage;
var timerItemImage;
var jumpingItemImage;
var gameoverImage;
var escapedImage;

// アニメーション
var crashAnimation;
var goalAnimation;
var playerMoveFrontAnimation;
var playerMoveRightAnimation;
var playerPunchRightAnimation;
var playerMoveLeftAnimation;
var playerPunchLeftAnimation;
var playerPunchBottomAnimation;

// 音
var bgmSound;
var escapedSound;
var gameoverSound;
var punchSound;
var jumpSound;
var pickupSound;
var crashSound;

// その他
var gameMode;
var frame;
var timer;
var score;
var hardBlockLife;
var jewelCount;
var playerSpeed;
var jumpingForce;
var gravity;
var energy;
var stage;

function preload() {
  // 画像のロード
  logoImage = loadImage("data/logo.png");
  blackBlockImage = loadImage("data/stage.png");
  hardBlockImage = loadImage("data/block_blue.png");
  timerItemImage = loadImage("data/timer.png");
  jumpingItemImage = loadImage("data/jumpingitem.png");
  thornImage = loadImage("data/thorn.png");
  blueBlockImage = loadImage("data/blue_block00.png");
  jewelImage = loadImage("data/jewel.png");

  // プレイヤーアニメーション
  playerMoveFrontAnimation = loadAnimation(
    "data/player_front_0.png",
    "data/player_front_3.png"
  );
  playerMoveRightAnimation = loadAnimation(
    "data/player_right_0.png",
    "data/player_right_3.png"
  );
  playerMoveLeftAnimation = loadAnimation(
    "data/player_left_0.png",
    "data/player_left_3.png"
  );
  goalAnimation = loadAnimation(
    "data/goal_0.png",
    "data/goal_3.png"
  );

  // パンチアニメーション
  playerPunchRightAnimation = loadAnimation(
    "data/player_punch_right_0.png",
    "data/player_punch_right_2.png"
  );
  playerPunchRightAnimation.looping = false;
  playerPunchLeftAnimation = loadAnimation(
    "data/player_punch_left_0.png",
    "data/player_punch_left_2.png"
  );
  playerPunchLeftAnimation.looping = false;
  playerPunchBottomAnimation = loadAnimation(
    "data/player_punch_bottom_0.png",
    "data/player_punch_bottom_2.png"
  );
  playerPunchBottomAnimation.looping = false;

  // 破壊アニメーション
  crashAnimation = loadAnimation(
    "data/hard_block00.png",
    "data/hard_block03.png"
  );
  crashAnimation.looping = false;
  crashHardAnimation = loadAnimation(
    "data/hard_block00.png",
    "data/hard_block03.png"
  );
  crashHardAnimation.looping = false;

  // サウンドのロード
  bgmSound = loadSound("data/bgm.mp3");
  gameoverSound = loadSound("data/gameover.mp3");
  escapedSound = loadSound("data/escaped.mp3");
  punchSound = loadSound("data/punch.mp3");
  jumpSound = loadSound("data/jump.mp3");
  pickupSound = loadSound("data/pickup.mp3");
  crashSound = loadSound("data/crash.mp3");
}

function setup() {
  // キャンバスを作る
  createCanvas(50 * 9, 50 * 14);

  // ステージをレイアウトする
  stage = stageLayout1;

  // ゲームの初期化
  gameSetup();
}

function draw() {
  // 背景を表示
  background(0, 60, 90);

  if (gameMode == "playing") {
    playing();
  }

  // スプライトを表示
  drawSprite(logo);

  // カメラ位置でブロックスプライトの描画を調整
  for (var i = 0; i < allBlockGroup.length; i++) {
    if (
      allBlockGroup[i].position.y > camera.position.y - 400 &&
      allBlockGroup[i].position.y < camera.position.y + 400
    ) {
      drawSprite(allBlockGroup[i]);
    }
  }

  // スプライトを描画
  drawSprite(breakingBlock);
  drawSprites(jewelGroup);
  drawSprites(thornGroup);
  drawSprites(timerItemGroup);
  drawSprites(jumpingForceItemGroup);
  drawSprite(player);
  drawSprite(goal);

  // カメラをオフにする
  camera.off();
  
  // ゲームモードを切り替える
  if (gameMode == "gameover") {
    drawGameover();
  } else if (gameMode == "gameCleared") {
    drawGameCleared();
  }

  // タイムとスコアを表示
  drawUI();
}

// ゲーム全体の初期化
function gameSetup() {
  // ゲームのカスタマイズ関数を呼ぶ
  gameCustomize();

  // グループの作成
  blackBlockGroup = createGroup();
  timerItemGroup = createGroup();
  jumpingForceItemGroup = createGroup();
  blueBlockGroup = createGroup();
  hardBlockGroup = createGroup();
  allBlockGroup = createGroup();
  jewelGroup = createGroup();
  thornGroup = createGroup();

  // ロゴ表示
  logo = createSprite(230, 200);
  logo.addImage(logoImage);

  for (y = 0; y < stage.length; y++) {
    for (x = 0; x < stage[y].length; x++) {
      if (stage[y][x] == 1) {
        // 壊せないブロックを作る
        var block = createSprite(x * 50 + 25, y * 50 + 25, 50, 50);
        block.setCollider("rectangle", 0, 0, 40, 40);
        // block.debug = true;
        block.addImage(blackBlockImage);
        block.immovable = true;
        blackBlockGroup.add(block);
        allBlockGroup.add(block);
      } else if (stage[y][x] == 2) {
        // プレイヤーを作る
        player = createSprite(x * 50 + 21, y * 50 + 21);
        player.setCollider("rectangle", 0, 5, 40, 45);
        // player.debug = true;
        player.addAnimation("moveRight", playerMoveRightAnimation);
        player.addAnimation("moveLeft", playerMoveLeftAnimation);
        player.addAnimation("idling", playerMoveFrontAnimation);
        player.addAnimation("punchRight", playerPunchRightAnimation);
        player.addAnimation("punchLeft", playerPunchLeftAnimation);
        player.addAnimation("punchBottom", playerPunchBottomAnimation);
      } else if (stage[y][x] == 3) {
        // トゲを作る
        var thorn = createSprite(x * 50 + 25, y * 50 + 25);
        thorn.addImage(thornImage);
        thorn.setCollider("circle", 0, 0, 20);
        // thorn.debug = true;
        thorn.rotation += 4;
        thornGroup.add(thorn);
      } else if (stage[y][x] == 4) {
        // 宝石を作る
        var jewel = createSprite(x * 50 + 25, y * 50 + 25);
        jewel.setCollider("circle", 0, 0, 20);
        jewel.addImage(jewelImage);
        jewelGroup.add(jewel);
        // jewel.debug = true;
      } else if (stage[y][x] == 5) {
        // ゴールを作る
        goal = createSprite(x * 50 + 21, y * 50 + 28);
        goal.setCollider("rectangle", 0, 5, 35, 42);
        goal.addAnimation("idling", goalAnimation);
        // goal.debug = true;
      } else if (stage[y][x] == 6) {
        // 壊せるブロックを作る
        var block = createSprite(x * 50 + 25, y * 50 + 25, 50, 50);
        block.addImage(blueBlockImage);
        block.immovable = true;
        block.setCollider("rectangle", 0, 0, 40, 40);
        block.blockLife = 1;
        block.initialLife = 1;
        block.breakCost = 1;
        // block.debug = true;
        blueBlockGroup.add(block);
        allBlockGroup.add(block);
        //        block.debug = true;
      } else if (stage[y][x] == 7) {
        // 時間アイテムを作る
        var item = createSprite(x * 50 + 25, y * 50 + 25);
        item.setCollider("circle", 0, 0, 20);
        item.addImage(timerItemImage);
        timerItemGroup.add(item);
        //        item.debug = true;
      } else if (stage[y][x] == 8) {
        // 硬いブロックを作る
        var block = createSprite(x * 50 + 25, y * 50 + 25, 50, 50);
        block.addImage(hardBlockImage);
        block.immovable = true;
        block.setCollider("rectangle", 0, 0, 40, 40);
        block.blockLife = hardBlockLife;
        block.initialLife = hardBlockLife;
        block.breakCost = 10;
        // block.debug = true;
        hardBlockGroup.add(block);
        allBlockGroup.add(block);
      } else if (stage[y][x] == 9) {
        // ジャンプ力アイテムを作る
        var item = createSprite(x * 50 + 25, y * 50 + 25);
        item.setCollider("circle", 0, 0, 20);
        item.addImage(jumpingItemImage);
        jumpingForceItemGroup.add(item);
      }
    }
  }

  // いろんな数値を初期化
  frame = 0;
  if (stage == stageLayout1) {
    score = 0;
  }
  camera.position.y = 0;
  energy = 100;

  // プレイヤー初期化
  playerMode = "move";
  playerDirection = "front";

  // ゲームモードをplayingに戻す
  gameMode = "playing";

  // BGMを再生
  bgmSound.loop();
  
  // ジングルを停止
  gameoverSound.stop();
  escapedSound.stop();
  
}

function playing() {
  // カメラ
  cameraControl();

  // プレイヤーを動かす
  playerControl();

  // タイマー開始
  setTimer();
}

// プレイヤーをコントロールする
function playerControl() {
  // プレイヤーとブロックの当たり判定
  player.collide(allBlockGroup);

  //＝＝＝＝＝＝＝＝ 移動中 ＝＝＝＝＝＝＝＝
  if (playerMode == "move") {
    // 移動と向き
    if (keyDown("RIGHT")) {
      // 右に移動
      player.velocity.x = playerSpeed;
      // 右向きという情報
      playerDirection = "right";
    } else if (keyDown("LEFT")) {
      // 左に移動
      player.velocity.x = -playerSpeed;
      // 左向きという情報
      playerDirection = "left";
    } else {
      // 左右キーが押されていなければ横移動なし
      player.velocity.x = 0;
      playerDirection = "front";
    }

    if (playerDirection == "right") {
      // 右向きの移動アニメーション
      player.changeAnimation("moveRight");
    } else if (playerDirection == "left") {
      // 左向きの移動アニメーション
      player.changeAnimation("moveLeft");
    } else {
      // 正面のアニメーション
      player.changeAnimation("idling");
    }

    // 移動中にスペースキーを押したらパンチ
    if (keyDown("SPACE")) {
      // パンチモードに変える
      playerMode = "punch";

      var punch;
      if (playerDirection == "right") {
        // 右向きのパンチアニメーション
        player.changeAnimation("punchRight");
        // プレイヤーの右側にパンチのスプライトを作る
        punch = createSprite(player.position.x + 30, player.position.y, 10, 10);
      } else if (playerDirection == "left") {
        // 左向きのパンチアニメーション
        player.changeAnimation("punchLeft");
        // プレイヤーの左側にパンチのスプライトを作る
        punch = createSprite(player.position.x - 30, player.position.y, 10, 10);
      } else if (playerDirection == "front") {
        player.changeAnimation("punchBottom");
        punch = createSprite(player.position.x, player.position.y + 30, 10, 10);
      }

      // パンチと水色のブロックが重なったらcrash関数が呼ばれる
      punch.overlap(blueBlockGroup, crash);

      // パンチと青色のブロックが重なったらcrash関数が呼ばれる
      punch.overlap(hardBlockGroup, crash);

      // 判定が終わったらパンチを消す
      punch.remove();
    }

    // 画面外にいかないようにする
    if (player.position.x <= 21) {
      player.position.x = 21;
    } else if (player.position.x > width - 21) {
      player.position.x = width - 21;
    }
  }

  //＝＝＝＝＝＝＝＝パンチ中 ＝＝＝＝＝＝＝＝
  if (playerMode == "punch") {
    // パンチ中は横移動しない
    player.velocity.x = 0;

    if (!keyDown("SPACE")) {
      // スペースキーを離したら移動モードに変わる
      playerMode = "move";
    }
  }

  //＝＝＝＝＝＝＝＝ 移動中とパンチ中共通 ＝＝＝＝＝＝＝＝
  //重力
  player.velocity.y += gravity;

  // 着地している時
  if (player.touching.bottom) {
    if (keyDown("UP")) {
      // 上キーが押され、速度が下向きの時に
      if (player.velocity.y > 0) {
        // 速度を上向きにする
        player.velocity.y = -jumpingForce;
        // ジャンプ音
        jumpSound.play();

        // ヘディング
        // heading = createSprite(player.position.x, player.position.y, 10, 10);
      }
    } else {
      // 着地中は縦の速度≒ゼロ（コライドのバグ回避）
      player.velocity.y = 0.0001;
    }
  }
  
  // ヘディング
  // if (heading && !player.touching.bottom && player.velocity.y < 0) {
    // heading.position.y = player.position.y - 20;
    // ヘディングと水色のブロックが重なったらcrash関数が呼ばれる
    // heading.overlap(blueBlockGroup, crash);

    // ヘディングと青色のブロックが重なったらcrash関数が呼ばれる
    // heading.overlap(hardBlockGroup, crash);

  // }

  // プレイヤーと宝石が重なったら
  player.overlap(jewelGroup, pickup);

  // プレイヤーと時間アイテムが重なったら
  player.overlap(timerItemGroup, timeExtend);

  // プレイヤーとジャンプ力アイテムが重なったら
  player.overlap(jumpingForceItemGroup, jumpingForceUp);

  // プレイヤーとエネルギーアイテムが重なったら
  // player.overlap(timerItemGroup, getEnergy);

  // プレイヤーとトゲが重なったら
  player.overlap(thornGroup, gameover);

  // ゴールに重なったらescape関数が呼ばれる
  player.overlap(goal, gameCleared);
}

// 時間アイテムの処理
function timeExtend(player, timerItem) {
  // スコア
  score += 3000;

  // 時間延長
  timer += 5;

  // ひろった音
  pickupSound.play();

  // ひろったアイテムを消す
  timerItem.remove();
}

// ジャンプ力アイテムの処理
function jumpingForceUp(player, item) {
  // スコア
  score += 3000;

  // 時間延長
  jumpingForce += 5;

  // ひろった音
  pickupSound.play();

  // ひろったアイテムを消す
  item.remove();
}


// 宝石をひろう
function pickup(player, jewel) {
  // 壊れるアニメーション
  breakingBlock = createSprite(jewel.position.x, jewel.position.y);
  breakingBlock.addAnimation("crash", crashHardAnimation);

  // 宝石の数を増やす
  jewelCount += 1;

  // スコア
  score += 10000;

  // ひろった音
  pickupSound.play();

  // ひろった宝石を消す
  jewel.remove();
}

// ブロックを破壊する
function crash(punch, block) {
  // 壊れるアニメーション
  breakingBlock = createSprite(block.position.x, block.position.y);
  breakingBlock.addAnimation("crash", crashHardAnimation);
  block.blockLife -= 1;

  if (player.velocity.y < 0) {
    player.velocity.y = 0;
  }

  // 壊した音
  crashSound.play();
  if (block.blockLife <= 0) {
    // スコア
    score += 500 * block.initialLife;

    // エネルギーをへらす
    // energy -= block.breakCost;

    // if (energy < 0) {
    // gameover();
    // }

    // ブロックを消す
    block.remove();
  }
}

// エネルギーアイテムをひろう
function getEnergy(player, energyItem) {
  // エネルギーの取得
  energy += 10;

  // アイテムを拾った音
  pickupSound.play();

  // 拾ったアイテムを消す
  energyItem.remove();
}

// タイマー
function setTimer() {
  // １秒毎にタイマーを減らす
  if (frame++ >= 60) {
    if (timer > 0) {
      timer--;
    }
    frame = 0;
    if (timer == 0) {
      // タイマーがゼロになったらゲーム終了
      gameover();
    }
  }
}

// ゲームオーバーの処理
function gameover() {
  // モードをgameoverにする
  gameMode = "gameover";

  // 脱出の曲を流す
  bgmSound.stop();

  // 脱出の曲を流す
  gameoverSound.play();

  // 最初の設定に戻す
  stage = stageLayout1;

  // 動きを止める
  noLoop();
}

// ゲームクリアの処理
function gameCleared() {
  // モードをゲームクリアにする
  gameMode = "gameCleared";

  // bgmを止める
  bgmSound.stop();

  // 脱出の曲を流す
  escapedSound.play();

  // 制限時間が少ないほど大きいスコアボーナスをつける
  //  score += 1000 / timer;

  // 動きを止める
  noLoop();
}

// ゲームオーバーの描画
function drawGameover() {
  fill(255, 0, 0, 150);
  rect(0, 0, width, height);
  fill(255);
  textAlign(CENTER);
  textSize(80);
  text("GAMEOVER", width / 2, height / 2);
  textSize(30);
  text("Click to Restart", width / 2, height / 2 + 100);
}

// ゲームクリアの描画
function drawGameCleared() {
  var spacer = 150;
  var totalScore = score + timer * 10000;

  // トータルスコアが100万点以上
  if(totalScore > 1000000) {
    fill(0, 200, 100, 230);
    rect(0, 0, width, height);
    fill(255);
    textAlign(CENTER);
    textSize(80);
    text("FANTASTIC!", width / 2, spacer + 50);

  // その他
  } else {
    fill(0, 100, 255, 150);
    rect(0, 0, width, height);
    fill(255);
    textAlign(CENTER);
    textSize(80);
    text("GAME CLEAR!", width / 2, spacer + 50);
  }

  textSize(30);
  text("TIME BONUS = " + timer + " sec. × 10000", width / 2, spacer + 120);
  textSize(30);
  fill(255, 255, 0);
  text("TOTAL SCORE", width / 2, spacer + 200);

  textSize(80);
  text(totalScore, width / 2, spacer + 290);
  fill(255);
  textSize(30);
  text("Click to Restart", width / 2, spacer + 400);

  
  //  if (stage == stageLayout1) {
//    text("Click to Next stage", width / 2, spacer + 400);
//  } else {

  
}

// マウスクリックの処理
function mouseClicked() {
  // ゲームオーバー、またはゲームクリアの場合
  if (gameMode == "gameover" || gameMode == "gameCleared") {
    // スプライトを全て消す
    player.remove();
    goal.remove();
    logo.remove();

    blueBlockGroup.removeSprites();
    blackBlockGroup.removeSprites();
    hardBlockGroup.removeSprites();
    jewelGroup.removeSprites();
    thornGroup.removeSprites();
    timerItemGroup.removeSprites();
    allBlockGroup.removeSprites();

    // ゲームをクリアして、１面だった場合
    // if (gameMode == "gameCleared" && stage == stageLayout1) {
      // ２面に進む
      // stage = stageLayout2;
    // } else {
      // １面をくりかえす
      // stage = stageLayout1;
    // }

    // ゲームを初期化する
    gameSetup();
    loop();
  }
}

// スコアとタイマーの表示
function drawUI() {
  textFont("oswald");
  // タイマー
  textAlign(LEFT);
  textSize(20);
  text("TIME", 25, 30);
  textSize(50);
  if (timer <= 3) {
    fill(255, 0, 77);
  } else {
    fill(255);
  }
  textAlign(RIGHT);
  text(timer, 62, 80);

  // スコア
  fill(255);
  textSize(20);
  textAlign(RIGHT);
  text("SCORE", 430, 30);
  // text('ENERGY', 70, 30);
  textSize(50);
  text(score, 430, 80);
  // text(energy, 75, 80);
}
