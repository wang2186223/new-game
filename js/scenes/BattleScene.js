/**
 * BattleScene - 战斗场景
 * 处理游戏的核心战斗逻辑
 */
class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
    }
    
    create() {
        console.log('BattleScene created');
        
        // 背景
        this.cameras.main.setBackgroundColor('#1a1a1a');
        
        // 绘制底部防御区域（敌人的目标）
        const centerX = this.scale.width / 2;
        const defenseY = this.scale.height - 80; // 底部防御线
        this.add.circle(centerX, defenseY, 30, 0xe74c3c, 0.3);
        this.add.circle(centerX, defenseY, 30, 0xe74c3c, 0).setStrokeStyle(2, 0xe74c3c);
        
        // 创建防御塔（位于屏幕底部）
        this.tower = new Tower(this, centerX, defenseY);
        
        // 敌人数组
        this.enemies = [];
        
        // 波次系统
        this.currentWave = 0;
        this.enemiesKilled = 0;
        this.enemiesInWave = 0;
        
        // UI 文本
        this.waveText = this.add.text(16, 16, 'Wave: 0', {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'Courier New'
        });
        
        this.killText = this.add.text(16, 46, 'Kills: 0/0', {
            fontSize: '16px',
            fill: '#fff',
            fontFamily: 'Courier New'
        });
        
        // 防御塔属性显示 UI（屏幕底部）
        this.createTowerStatsUI();
        
        // 监听敌人事件
        this.events.on('enemyKilled', this.onEnemyKilled, this);
        this.events.on('enemyReachCenter', this.onEnemyReachCenter, this);
        
        // 开始第一波
        this.time.delayedCall(1000, () => {
            this.startNextWave();
        });
    }
    
    update(time, delta) {
        // 更新防御塔
        if (this.tower) {
            this.tower.update(time, delta);
        }
        
        // 更新所有敌人
        this.enemies.forEach(enemy => {
            if (enemy.active) {
                enemy.update(delta);
            }
        });
        
        // 清理已死亡的敌人
        this.enemies = this.enemies.filter(e => e.active);
    }
    
    // 开始下一波
    startNextWave() {
        this.currentWave++;
        this.enemiesKilled = 0;
        
        // 根据波数生成敌人
        this.enemiesInWave = 5 + this.currentWave * 2;
        
        this.waveText.setText(`Wave: ${this.currentWave}`);
        this.killText.setText(`Kills: 0/${this.enemiesInWave}`);
        
        // 分批生成敌人
        for (let i = 0; i < this.enemiesInWave; i++) {
            this.time.delayedCall(i * 1000, () => {
                this.spawnEnemy();
            });
        }
    }
    
    // 生成敌人
    spawnEnemy() {
        // 只从屏幕上方生成
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const y = -30;
        
        // 随机敌人类型
        const types = ['basic', 'basic', 'fast', 'tank', 'slime'];
        const type = Phaser.Utils.Array.GetRandom(types);
        
        const enemy = new Enemy(this, x, y, type);
        this.enemies.push(enemy);
    }
    
    // 敌人被击杀
    onEnemyKilled(enemy) {
        this.enemiesKilled++;
        this.killText.setText(`Kills: ${this.enemiesKilled}/${this.enemiesInWave}`);
        
        // 检查是否完成本波
        if (this.enemiesKilled >= this.enemiesInWave) {
            this.waveComplete();
        }
    }
    
    // 敌人到达中心
    onEnemyReachCenter(enemy) {
        console.log('游戏结束！敌人突破防线！');
        GameState.setState('GAMEOVER');
        this.gameOver();
    }
    
    // 波次完成
    waveComplete() {
        console.log(`第 ${this.currentWave} 波完成！`);
        
        // 切换到准备阶段（抽卡）
        GameState.setState('PREPARING');
        
        // 显示抽卡界面
        this.time.delayedCall(500, () => {
            this.scene.launch('UIScene');
            this.scene.pause();
        });
    }
    
    // 游戏结束
    gameOver() {
        this.scene.pause();
        
        // 显示游戏结束界面
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        
        const bg = this.add.rectangle(centerX, centerY, this.scale.width, this.scale.height, 0x000000, 0.8);
        
        this.add.text(centerX, centerY - 50, 'GAME OVER', {
            fontSize: '48px',
            fill: '#e74c3c',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        this.add.text(centerX, centerY + 20, `Wave: ${this.currentWave}`, {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        const restartBtn = this.add.text(centerX, centerY + 80, '[ Restart ]', {
            fontSize: '20px',
            fill: '#3498db',
            fontFamily: 'Courier New'
        }).setOrigin(0.5).setInteractive();
        
        restartBtn.on('pointerdown', () => {
            this.scene.restart();
            GameState.setState('BATTLE');
        });
    }
    
    // 从 UI 场景继续游戏
    continueGame() {
        this.scene.resume();
        GameState.setState('BATTLE');
        
        // 更新属性显示
        this.updateTowerStatsUI();
        
        // 开始下一波
        this.time.delayedCall(1000, () => {
            this.startNextWave();
        });
    }
    
    // 创建防御塔属性显示 UI
    createTowerStatsUI() {
        const uiY = this.scale.height - 30;
        const uiX = this.scale.width / 2;
        
        // 背景框
        const bgWidth = 360;
        const bgHeight = 50;
        const bg = this.add.rectangle(uiX, uiY, bgWidth, bgHeight, 0x2c3e50, 0.9);
        bg.setStrokeStyle(2, 0x34495e);
        
        // 左侧：皮卡丘图标
        const iconSize = 30;
        const iconX = uiX - bgWidth/2 + 30;
        this.add.rectangle(iconX, uiY, iconSize, iconSize, 0xFFD700).setStrokeStyle(1, 0x000000);
        
        // 属性文本
        this.towerStatsText = this.add.text(iconX + 25, uiY, '', {
            fontSize: '12px',
            fill: '#ecf0f1',
            fontFamily: 'Courier New',
            align: 'left'
        }).setOrigin(0, 0.5);
        
        // 技能槽位显示
        const slotsX = uiX + bgWidth/2 - 100;
        this.add.text(slotsX - 50, uiY, '技能:', {
            fontSize: '11px',
            fill: '#95a5a6',
            fontFamily: 'Courier New'
        }).setOrigin(0, 0.5);
        
        // 技能槽位方块
        this.skillSlots = [];
        for (let i = 0; i < 6; i++) {
            const slot = this.add.rectangle(
                slotsX + i * 14,
                uiY,
                12, 12,
                0x34495e
            );
            slot.setStrokeStyle(1, 0x7f8c8d);
            this.skillSlots.push(slot);
        }
        
        // 初始化显示
        this.updateTowerStatsUI();
    }
    
    // 更新防御塔属性显示
    updateTowerStatsUI() {
        if (!this.tower || !this.towerStatsText) return;
        
        const atk = Math.floor(this.tower.atk);
        const spd = this.tower.spd.toFixed(1);
        const range = Math.floor(this.tower.range);
        
        this.towerStatsText.setText(
            `攻击: ${atk}  速度: ${spd}/s  范围: ${range}`
        );
        
        // 更新技能槽位
        if (this.skillSlots) {
            this.skillSlots.forEach((slot, index) => {
                if (index < this.tower.slots.length) {
                    slot.setFillStyle(0xf1c40f); // 已装备
                } else {
                    slot.setFillStyle(0x34495e); // 空槽位
                }
            });
        }
    }
}
