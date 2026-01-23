/**
 * UIScene - UI 场景
 * 处理抽卡界面和技能选择
 */
class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }
    
    create() {
        console.log('UIScene created');
        
        // 半透明背景
        const bg = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            this.scale.width,
            this.scale.height,
            0x000000,
            0.8
        );
        
        // 标题
        this.add.text(this.scale.width / 2, 80, '选择你的强化', {
            fontSize: '32px',
            fill: '#f1c40f',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        
        // 生成3张随机卡片
        this.generateCards();
    }
    
    generateCards() {
        // 技能池
        const skillPool = [
            {
                name: '双重射击',
                desc: '攻击速度 +50%',
                rarity: 'common',
                icon: '🔫',
                tags: ['attack', 'speed'],
                onMount: (tower) => {
                    tower.spd *= 1.5;
                }
            },
            {
                name: '燃烧核心',
                desc: '攻击力 +30%',
                rarity: 'rare',
                icon: '🔥',
                tags: ['fire', 'damage'],
                onMount: (tower) => {
                    tower.atk *= 1.3;
                }
            },
            {
                name: '电磁脉冲',
                desc: '攻击范围 +50',
                rarity: 'common',
                icon: '⚡',
                tags: ['electric', 'range'],
                onMount: (tower) => {
                    tower.range += 50;
                    if (tower.rangeCircle) {
                        tower.rangeCircle.radius = tower.range;
                    }
                }
            },
            {
                name: '冰霜之心',
                desc: '攻击力 +20%, 速度 +20%',
                rarity: 'rare',
                icon: '❄️',
                tags: ['ice', 'damage', 'speed'],
                onMount: (tower) => {
                    tower.atk *= 1.2;
                    tower.spd *= 1.2;
                }
            },
            {
                name: '穿透弹',
                desc: '攻击力 +40%',
                rarity: 'common',
                icon: '💥',
                tags: ['damage', 'pierce'],
                onMount: (tower) => {
                    tower.atk *= 1.4;
                }
            },
            {
                name: '狂暴',
                desc: '攻击速度 +100%',
                rarity: 'rare',
                icon: '💢',
                tags: ['speed', 'attack'],
                onMount: (tower) => {
                    tower.spd *= 2;
                }
            }
        ];
        
        // 随机选择3个技能
        const selectedSkills = Phaser.Utils.Array.Shuffle([...skillPool]).slice(0, 3);
        
        // 创建卡片（竖屏布局：竖向排列）
        const cardWidth = 280;
        const cardHeight = 100;
        const spacing = 20;
        const startY = 150;
        const cardX = this.scale.width / 2;
        
        selectedSkills.forEach((skill, index) => {
            const y = startY + (cardHeight + spacing) * index;
            this.createCard(cardX, y, cardWidth, cardHeight, skill);
        });
    }
    
    createCard(x, y, width, height, skill) {
        // 卡片容器
        const container = this.add.container(x, y);
        
        // 卡片背景
        const cardBg = this.add.rectangle(0, 0, width, height, 0x34495e);
        cardBg.setStrokeStyle(4, 0x000000);
        container.add(cardBg);
        
        // 根据稀有度改变边框颜色
        if (skill.rarity === 'rare') {
            cardBg.setStrokeStyle(4, 0xf1c40f);
        }
        
        // 图标（左侧）
        const icon = this.add.text(-width/2 + 40, 0, skill.icon, {
            fontSize: '40px'
        }).setOrigin(0.5);
        container.add(icon);
        
        // 技能名称（右上）
        const nameColor = skill.rarity === 'rare' ? '#f1c40f' : '#ecf0f1';
        const name = this.add.text(-width/2 + 100, -20, skill.name, {
            fontSize: '16px',
            fill: nameColor,
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        container.add(name);
        
        // 描述（右下）
        const desc = this.add.text(-width/2 + 100, 10, skill.desc, {
            fontSize: '12px',
            fill: '#bdc3c7',
            fontFamily: 'Courier New',
            align: 'left',
            wordWrap: { width: width - 120 }
        }).setOrigin(0, 0.5);
        container.add(desc);
        
        // 标签（右下角）
        const tagsText = skill.tags.map(t => `#${t}`).join(' ');
        const tags = this.add.text(width/2 - 10, height/2 - 10, tagsText, {
            fontSize: '8px',
            fill: '#7f8c8d',
            fontFamily: 'Courier New'
        }).setOrigin(1, 1);
        container.add(tags);
        
        // 交互
        cardBg.setInteractive({ useHandCursor: true });
        
        cardBg.on('pointerover', () => {
            cardBg.setFillStyle(0x3e5871);
            this.tweens.add({
                targets: container,
                y: y - 10,
                duration: 100
            });
        });
        
        cardBg.on('pointerout', () => {
            cardBg.setFillStyle(0x34495e);
            this.tweens.add({
                targets: container,
                y: y,
                duration: 100
            });
        });
        
        cardBg.on('pointerdown', () => {
            this.selectCard(skill);
        });
    }
    
    selectCard(skill) {
        console.log(`选择了技能: ${skill.name}`);
        
        // 获取 BattleScene 中的防御塔
        const battleScene = this.scene.get('BattleScene');
        if (battleScene && battleScene.tower) {
            battleScene.tower.mountSkill(skill);
        }
        
        // 关闭 UI 场景，继续游戏
        this.scene.stop();
        battleScene.continueGame();
    }
}
