/**
 * Tower 类 - 防御塔
 * 包含基础属性（ATK, SPD）和技能插槽系统
 */
class Tower {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        
        // 基础属性
        this.atk = 10;           // 攻击力
        this.spd = 20;           // 攻击速度 (每秒攻击次数) - 每秒20次
        this.range = 400;        // 攻击范围 - 增加100%
        
        // 技能插槽系统
        this.slots = [];         // 已装备的技能
        this.maxSlots = 6;       // 最大技能槽位
        
        // 战斗相关
        this.lastFireTime = 0;
        this.bullets = [];       // 子弹数组
        
        // 渲染对象
        this.sprite = null;
        this.rangeCircle = null;
        
        this.createSprite();
    }
    
    createSprite() {
        // 创建像素皮卡丘
        const pikachu = this.scene.add.container(this.x, this.y);
        
        // 身体（黄色）
        const body = this.scene.add.rectangle(0, 0, 24, 28, 0xFFD700);
        body.setStrokeStyle(1, 0x000000);
        pikachu.add(body);
        
        // 耳朵左
        const earL = this.scene.add.rectangle(-10, -18, 6, 12, 0xFFD700);
        earL.setStrokeStyle(1, 0x000000);
        pikachu.add(earL);
        
        // 耳朵右
        const earR = this.scene.add.rectangle(10, -18, 6, 12, 0xFFD700);
        earR.setStrokeStyle(1, 0x000000);
        pikachu.add(earR);
        
        // 耳朵尖端（黑色）
        const earTipL = this.scene.add.rectangle(-10, -22, 6, 4, 0x000000);
        pikachu.add(earTipL);
        const earTipR = this.scene.add.rectangle(10, -22, 6, 4, 0x000000);
        pikachu.add(earTipR);
        
        // 眼睛左
        const eyeL = this.scene.add.rectangle(-6, -4, 4, 4, 0x000000);
        pikachu.add(eyeL);
        
        // 眼睛右
        const eyeR = this.scene.add.rectangle(6, -4, 4, 4, 0x000000);
        pikachu.add(eyeR);
        
        // 腮红左
        const cheekL = this.scene.add.circle(-12, 2, 4, 0xFF6B6B);
        pikachu.add(cheekL);
        
        // 腮红右
        const cheekR = this.scene.add.circle(12, 2, 4, 0xFF6B6B);
        pikachu.add(cheekR);
        
        // 嘴巴
        const mouth = this.scene.add.rectangle(0, 4, 8, 2, 0x000000);
        pikachu.add(mouth);
        
        // 尾巴（闪电形状简化）
        const tail = this.scene.add.rectangle(18, -8, 8, 16, 0xFFD700);
        tail.setStrokeStyle(1, 0x000000);
        pikachu.add(tail);
        
        this.sprite = pikachu;
        
        // 创建攻击范围圈（默认不可见）
        this.rangeCircle = this.scene.add.circle(this.x, this.y, this.range);
        this.rangeCircle.setStrokeStyle(1, 0xffffff, 0.3);
        this.rangeCircle.setFillStyle(0xffffff, 0.05);
        this.rangeCircle.setVisible(false);
    }
    
    // 挂载技能
    mountSkill(skill) {
        if (this.slots.length >= this.maxSlots) {
            console.warn('技能槽位已满！');
            return false;
        }
        
        this.slots.push(skill);
        
        // 应用技能效果
        if (skill.onMount) {
            skill.onMount(this);
        }
        
        console.log(`技能 "${skill.name}" 已挂载到防御塔`);
        return true;
    }
    
    // 更新逻辑（每帧调用）
    update(time, delta) {
        // 检查是否可以开火
        const fireInterval = 1000 / this.spd; // 转换为毫秒
        
        if (time - this.lastFireTime > fireInterval) {
            this.fire(time);
        }
        
        // 更新所有子弹
        this.bullets = this.bullets.filter(bullet => {
            if (bullet.active) {
                bullet.update(delta);
                return true;
            }
            return false;
        });
    }
    
    // 开火
    fire(time) {
        // 查找范围内的敌人
        const target = this.findNearestEnemy();
        
        if (target) {
            this.lastFireTime = time;
            
            // 创建子弹
            const bullet = new Bullet(this.scene, this.x, this.y, target, this.atk);
            this.bullets.push(bullet);
            
            // 触发技能的 onFire 效果
            this.slots.forEach(skill => {
                if (skill.onFire) {
                    skill.onFire(this, bullet, target);
                }
            });
        }
    }
    
    // 查找最近的敌人
    findNearestEnemy() {
        const enemies = this.scene.enemies || [];
        let nearest = null;
        let minDist = this.range;
        
        enemies.forEach(enemy => {
            if (enemy.active) {
                const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = enemy;
                }
            }
        });
        
        return nearest;
    }
    
    // 显示/隐藏攻击范围
    showRange(visible) {
        if (this.rangeCircle) {
            this.rangeCircle.setVisible(visible);
        }
    }
    
    destroy() {
        if (this.sprite) this.sprite.destroy();
        if (this.rangeCircle) this.rangeCircle.destroy();
        this.bullets.forEach(b => b.destroy());
    }
}

/**
 * Bullet 类 - 子弹
 */
class Bullet {
    constructor(scene, x, y, target, damage) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.speed = 900; // 像素/秒 - 增加200% (300 * 3)
        this.active = true;
        
        // 创建闪电形状的子弹
        this.sprite = this.createLightningBullet(scene, x, y);
    }
    
    createLightningBullet(scene, x, y) {
        const lightning = scene.add.container(x, y);
        
        // 闪电主体（黄色曲折线）- 增大尺寸
        const graphics = scene.add.graphics();
        graphics.lineStyle(3, 0xffeb3b, 1);
        
        // 绘制闪电形状（垂直Z字形，更大更明显）
        graphics.beginPath();
        graphics.moveTo(0, -10);    // 顶部
        graphics.lineTo(6, -3);     // 右上
        graphics.lineTo(-3, -3);    // 左中
        graphics.lineTo(4, 4);      // 右中
        graphics.lineTo(-4, 4);     // 左下
        graphics.lineTo(2, 10);     // 底部
        graphics.strokePath();
        
        // 添加外发光效果
        const glow = scene.add.graphics();
        glow.lineStyle(6, 0xffeb3b, 0.4);
        glow.beginPath();
        glow.moveTo(0, -10);
        glow.lineTo(6, -3);
        glow.lineTo(-3, -3);
        glow.lineTo(4, 4);
        glow.lineTo(-4, 4);
        glow.lineTo(2, 10);
        glow.strokePath();
        
        // 中心亮点
        const core = scene.add.circle(0, 0, 2, 0xffffff, 0.8);
        
        lightning.add(glow);
        lightning.add(graphics);
        lightning.add(core);
        
        // 取消旋转，保持垂直方向
        // 添加轻微闪烁效果
        scene.tweens.add({
            targets: [graphics, glow],
            alpha: 0.7,
            duration: 100,
            yoyo: true,
            repeat: -1
        });
        
        return lightning;
    }
    
    update(delta) {
        if (!this.active || !this.target.active) {
            this.destroy();
            return;
        }
        
        // 计算方向
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        
        // 移动子弹
        const moveSpeed = this.speed * (delta / 1000);
        this.x += Math.cos(angle) * moveSpeed;
        this.y += Math.sin(angle) * moveSpeed;
        
        // 更新图形位置
        if (this.sprite) {
            this.sprite.setPosition(this.x, this.y);
        }
        
        // 碰撞检测（圆形碰撞）
        const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
        if (dist < 20) { // 碰撞半径
            this.target.takeDamage(this.damage);
            this.destroy();
        }
        
        // 超出屏幕销毁
        if (this.x < -50 || this.x > this.scene.scale.width + 50 ||
            this.y < -50 || this.y > this.scene.scale.height + 50) {
            this.destroy();
        }
    }
    
    destroy() {
        this.active = false;
        if (this.sprite) {
            this.sprite.destroy();
        }
    }
}
