// ゲームの設定を変更する
function gameCustomize() {
  // 時間制限(20)
  timer = 20;

  // 重力(1)
  gravity = 1;

  // ジャンプ力(12)
  jumpingForce = 12;

  // プレイヤーの速度(5)
  playerSpeed = 5;

  // 硬い石(3)
  hardBlockLife = 3;
}

// カメラをコントロールする
function cameraControl() {
  // プレイヤーをカメラが追いかける
  camera.position.y = player.position.y - 30;

  // 自動的にスクロールする
  // camera.position.y += 1.5;
  // if (player.position.y < camera.position.y - height / 2) {
  //   gameover();
  // }

}
