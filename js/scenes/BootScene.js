/**
 * BootScene - 启动场景
 * 用于预加载资源（目前使用简单图形，暂无资源需要加载）
 */
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }
    
    preload() {
        // 创建加载进度条
        const width = this.scale.width;
        const height = this.scale.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50);
        
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px Courier New',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 + 5,
            text: '0%',
            style: {
                font: '18px Courier New',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        // 监听加载进度
        this.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0x3498db, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 20, 300 * value, 30);
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
        
        // 这里可以加载图片、音频等资源
        // this.load.image('tower', 'assets/tower.png');
        // this.load.image('enemy', 'assets/enemy.png');
    }
    
    create() {
        console.log('BootScene: Assets loaded');
        
        // 启动战斗场景
        this.scene.start('BattleScene');
    }
}
