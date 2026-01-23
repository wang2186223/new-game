/**
 * Enemy 类 - 敌人单位
 * 能够自动向屏幕中心移动
 */
class Enemy {
    constructor(scene, x, y, type = 'basic') {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.type = type;
        
        // 目标位置（屏幕底部）
        this.targetX = scene.scale.width / 2;
        this.targetY = scene.scale.height - 80; // 屏幕底部
        
        // 基础属性
        this.maxHp = 50;
        this.hp = this.maxHp;
        this.speed = 50; // 像素/秒
        this.active = true;
        
        // 根据类型调整属性
        this.initByType();
        
        // 渲染对象
        this.sprite = null;
        this.hpBar = null;
        this.hpBarBg = null;
        this.hpText = null; // 血量百分比文本
        
        this.createSprite();
    }
    
    initByType() {
        switch(this.type) {
            case 'basic':
                this.maxHp = 550; // 50 * 11
                this.speed = 25; // 降低50%
                this.color = 0xe74c3c;
                break;
            case 'fast':
                this.maxHp = 330; // 30 * 11
                this.speed = 50; // 降低50%
                this.color = 0x9b59b6;
                break;
            case 'tank':
                this.maxHp = 1650; // 150 * 11
                this.speed = 15; // 降低50%
                this.color = 0x2ecc71;
                break;
            default:
                this.color = 0xe74c3c;
        }
        this.hp = this.maxHp;
    }
    
    createSprite() {
        // 如果是绿水灵，使用特殊外观
        if (this.type === 'slime') {
            this.createSlimeSprite();
            return;
        }
        
        // 创建像素僵尸
        const zombie = this.scene.add.container(this.x, this.y);
        
        // 根据类型调整僵尸大小和颜色
        let scale = 1;
        let skinColor = 0x7cb342; // 绿色皮肤
        
        if (this.type === 'tank') {
            scale = 1.3;
            skinColor = 0x558b2f; // 深绿色
        } else if (this.type === 'fast') {
            scale = 0.8;
            skinColor = 0x9ccc65; // 浅绿色
        }
        
        // 头部
        const head = this.scene.add.rectangle(0, -6 * scale, 16 * scale, 16 * scale, skinColor);
        head.setStrokeStyle(1, 0x000000);
        zombie.add(head);
        
        // 身体
        const body = this.scene.add.rectangle(0, 6 * scale, 14 * scale, 14 * scale, 0x5d4037);
        body.setStrokeStyle(1, 0x000000);
        zombie.add(body);
        
        // 眼睛左（红色）
        const eyeL = this.scene.add.rectangle(-4 * scale, -8 * scale, 3 * scale, 3 * scale, 0xff0000);
        zombie.add(eyeL);
        
        // 眼睛右（红色）
        const eyeR = this.scene.add.rectangle(4 * scale, -8 * scale, 3 * scale, 3 * scale, 0xff0000);
        zombie.add(eyeR);
        
        // 嘴巴（锯齿状）
        const mouth = this.scene.add.rectangle(0, -2 * scale, 8 * scale, 2 * scale, 0x000000);
        zombie.add(mouth);
        
        // 左臂
        const armL = this.scene.add.rectangle(-10 * scale, 8 * scale, 4 * scale, 10 * scale, skinColor);
        armL.setStrokeStyle(1, 0x000000);
        zombie.add(armL);
        
        // 右臂
        const armR = this.scene.add.rectangle(10 * scale, 8 * scale, 4 * scale, 10 * scale, skinColor);
        armR.setStrokeStyle(1, 0x000000);
        zombie.add(armR);
        
        this.sprite = zombie;
        
        // 创建血条背景
        this.hpBarBg = this.scene.add.rectangle(this.x, this.y - 20, 30, 4, 0x000000);
        
        // 创建血条
        this.hpBar = this.scene.add.rectangle(this.x, this.y - 20, 30, 4, 0x27ae60);
        
        // 创建血量百分比文本
        this.hpText = this.scene.add.text(this.x, this.y - 32, '100%', {
            fontSize: '10px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
    }
    
    // 创建绿水灵外观
    createSlimeSprite() {
        const slime = this.scene.add.container(this.x, this.y);
        
        // 水滴形状的身体（用多个圆形模拟）
        const bodyBottom = this.scene.add.ellipse(0, 4, 20, 16, 0x66bb6a, 0.8);
        bodyBottom.setStrokeStyle(1, 0x2e7d32);
        slime.add(bodyBottom);
        
        const bodyTop = this.scene.add.circle(0, -2, 10, 0x81c784, 0.8);
        bodyTop.setStrokeStyle(1, 0x2e7d32);
        slime.add(bodyTop);
        
        // 高光效果（半透明白色）
        const highlight = this.scene.add.ellipse(-4, -4, 6, 8, 0xffffff, 0.4);
        slime.add(highlight);
        
        // 眼睛左（黑色）
        const eyeL = this.scene.add.ellipse(-5, 0, 4, 5, 0x000000);
        slime.add(eyeL);
        
        // 眼睛右（黑色）
        const eyeR = this.scene.add.ellipse(5, 0, 4, 5, 0x000000);
        slime.add(eyeR);
        
        // 眼睛高光
        const eyeHighlightL = this.scene.add.circle(-4, -1, 1.5, 0xffffff);
        slime.add(eyeHighlightL);
        
        const eyeHighlightR = this.scene.add.circle(6, -1, 1.5, 0xffffff);
        slime.add(eyeHighlightR);
        
        // 微笑的嘴巴
        const mouth = this.scene.add.arc(0, 4, 4, 0, 180, false, 0x000000);
        mouth.setStrokeStyle(1, 0x000000);
        mouth.setFillStyle();
        slime.add(mouth);
        
        this.sprite = slime;
        
        // 添加跳动动画（水灵特有的弹性）
        this.scene.tweens.add({
            targets: slime,
            scaleY: 1.1,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // 创建血条背景
        this.hpBarBg = this.scene.add.rectangle(this.x, this.y - 20, 30, 4, 0x000000);
        
        // 创建血条
        this.hpBar = this.scene.add.rectangle(this.x, this.y - 20, 30, 4, 0x27ae60);
        
        // 创建血量百分比文本
        this.hpText = this.scene.add.text(this.x, this.y - 32, '100%', {
            fontSize: '10px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
    }
    
    // 更新逻辑（每帧调用）
    update(delta) {
        if (!this.active) return;
        
        // 计算到目标的距离
        const dist = Phaser.Math.Distance.Between(this.x, this.y, this.targetX, this.targetY);
        
        // 如果已到达底部，游戏结束
        if (dist < 40) {
            this.reachCenter();
            return;
        }
        
        // 计算移动方向
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.targetX, this.targetY);
        
        // 移动敌人
        const moveSpeed = this.speed * (delta / 1000);
        this.x += Math.cos(angle) * moveSpeed;
        this.y += Math.sin(angle) * moveSpeed;
        
        // 限制移动范围，防止被击退出屏幕
        this.x = Phaser.Math.Clamp(this.x, 20, this.scene.scale.width - 20);
        this.y = Phaser.Math.Clamp(this.y, 20, this.scene.scale.height - 20);
        
        // 更新图形位置
        this.updateSprite();
    }
    
    updateSprite() {
        if (this.sprite) {
            this.sprite.setPosition(this.x, this.y);
        }
        if (this.hpBar) {
            this.hpBar.setPosition(this.x, this.y - 20);
        }
        if (this.hpBarBg) {
            this.hpBarBg.setPosition(this.x, this.y - 20);
        }
        if (this.hpText) {
            this.hpText.setPosition(this.x, this.y - 32);
        }
    }
    
    // 受到伤害
    takeDamage(damage) {
        this.hp -= damage;
        
        // 显示伤害数字（飘字效果）
        this.showDamageText(damage);
        
        // 打击感效果：闪烁
        this.hitEffect();
        
        // 更新血条
        const hpPercent = Math.max(0, this.hp / this.maxHp);
        if (this.hpBar) {
            this.hpBar.width = 30 * hpPercent;
            
            // 根据血量改变颜色
            if (hpPercent > 0.5) {
                this.hpBar.setFillStyle(0x27ae60);
            } else if (hpPercent > 0.2) {
                this.hpBar.setFillStyle(0xf39c12);
            } else {
                this.hpBar.setFillStyle(0xe74c3c);
            }
        }
        
        // 更新血量百分比文本
        if (this.hpText) {
            const percent = Math.max(0, Math.floor(hpPercent * 100));
            this.hpText.setText(percent + '%');
            
            // 根据血量改变文本颜色
            if (hpPercent > 0.5) {
                this.hpText.setFill('#27ae60');
            } else if (hpPercent > 0.2) {
                this.hpText.setFill('#f39c12');
            } else {
                this.hpText.setFill('#e74c3c');
            }
        }
        
        // 死亡
        if (this.hp <= 0) {
            this.die();
        }
    }
    
    // 显示伤害数字
    showDamageText(damage) {
        const damageText = this.scene.add.text(this.x, this.y, '-' + Math.floor(damage), {
            fontSize: '16px',
            fill: '#ff0000',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // 飘字动画：向上移动并淡出
        this.scene.tweens.add({
            targets: damageText,
            y: damageText.y - 50,
            alpha: 0,
            duration: 1000, // 停留1秒
            ease: 'Power2',
            onComplete: () => {
                damageText.destroy();
            }
        });
    }
    
    // 打击感效果
    hitEffect() {
        // 击退效果：向上（远离塔）推动
        const knockbackDistance = 0.1; // 再降低90%
        const originalY = this.y;
        
        // 计算击退后的Y坐标，确保不会超出屏幕
        const targetY = Math.max(20, this.y - knockbackDistance);
        
        this.scene.tweens.add({
            targets: this,
            y: targetY,
            duration: 100,
            ease: 'Power2',
            yoyo: true,
            onUpdate: () => {
                // 确保Y坐标在有效范围内
                this.y = Phaser.Math.Clamp(this.y, 20, this.scene.scale.height - 20);
                this.updateSprite();
            }
        });
        
        if (this.sprite) {
            // 短暂变白（闪烁效果） - 修改container中所有子元素
            const children = this.sprite.list;
            const originalColors = [];
            
            children.forEach((child, index) => {
                if (child.fillColor !== undefined) {
                    originalColors[index] = child.fillColor;
                    child.setFillStyle(0xffffff);
                }
            });
            
            // 轻微震动
            const originalX = this.x;
            const shakeIntensity = 3;
            
            this.scene.tweens.add({
                targets: this,
                x: originalX + shakeIntensity,
                duration: 50,
                yoyo: true,
                repeat: 1,
                onUpdate: () => {
                    this.updateSprite();
                },
                onComplete: () => {
                    this.x = originalX;
                    this.updateSprite();
                }
            });
            
            // 100ms后恢复原色
            this.scene.time.delayedCall(100, () => {
                if (this.sprite && this.sprite.list) {
                    children.forEach((child, index) => {
                        if (child.fillColor !== undefined && originalColors[index] !== undefined) {
                            child.setFillStyle(originalColors[index]);
                        }
                    });
                }
            });
        }
    }
    
    // 到达中心
    reachCenter() {
        console.log('敌人到达中心！');
        this.scene.events.emit('enemyReachCenter', this);
        this.destroy();
    }
    
    // 死亡
    die() {
        this.active = false;
        this.scene.events.emit('enemyKilled', this);
        
        // 死亡动画效果
        if (this.sprite) {
            this.scene.tweens.add({
                targets: this.sprite,
                alpha: 0,
                scale: 0,
                duration: 200,
                onComplete: () => this.destroy()
            });
        }
    }
    
    destroy() {
        this.active = false;
        if (this.sprite) this.sprite.destroy();
        if (this.hpBar) this.hpBar.destroy();
        if (this.hpBarBg) this.hpBarBg.destroy();
        if (this.hpText) this.hpText.destroy();
    }
}
