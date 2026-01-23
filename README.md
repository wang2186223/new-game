# 项目名称：像素肉鸽自走棋防御 (Pixel Rogue Defense)

## 1. 开发目标
一款面向移动端的像素风格、肉鸽构筑+自走棋模式的防守游戏。玩家通过组合随机掉落的技能插件来强化防御设施，抵御成群的敌人。

## 2. 核心技术栈
- 引擎选择：Phaser.js (计划接入) 或 纯原生 Canvas + JS
- 风格：像素画 (Pixel Art)，抗锯齿禁用 (image-rendering: pixelated)
- 适配：移动端优先 (Portrait 竖屏布局)

## 3. 已完成部分 (Current Progress)
- [x] 移动端响应式抽卡 UI 原型
- [x] 核心抽卡随机逻辑 (GachaEngine.js)
- [x] 像素风格 CSS 基础样式

## 4. 下一阶段任务 (Current Tasks for AI)
> 提示：请辅助工具根据以下需求编写代码

### A. 游戏主状态机 (GameState)
- 实现三种状态：`PREPARING` (整备阶段/抽卡), `BATTLE` (战斗开始), `GAMEOVER`。
- 状态切换逻辑：点击卡片后进入战斗，敌人全部消灭后回到抽卡。

### B. 核心战斗引擎 (Combat Engine)
- 建立 `Tower` (防御塔) 类：包含基础 ATK, SPD 属性，以及一个 `slots` 数组。
- 建立 `Enemy` (敌人) 类：能够自动向屏幕中心的坐标移动。
- 碰撞检测：简单的圆形或矩形碰撞，用于子弹击中怪物。

### C. 技能挂载系统 (Skill Mounting)
- 让抽到的卡片能够修改 `Tower` 实例的属性（如：`tower.atk *= 1.2`）。

## 5. 设计约束 (Constraints)
- 保持代码解耦：逻辑层 (Logic) 与 渲染层 (Render) 分开。
- 技能设计：采用“标签化”，方便后续做技能联动（如：水+电=感电）。