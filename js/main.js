/**
 * 主入口 - Phaser 游戏配置
 */

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 400,
    height: 700,
    backgroundColor: '#1a1a1a',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [BootScene, BattleScene, UIScene],
    pixelArt: true, // 启用像素艺术模式
    antialias: false // 禁用抗锯齿
};

const game = new Phaser.Game(config);

console.log('像素肉鸽自走棋防御 - 游戏启动！');
console.log('当前游戏状态:', GameState.currentState);
