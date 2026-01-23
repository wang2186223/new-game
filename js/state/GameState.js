const GameState = {
    // 定义游戏状态枚举
    states: {
        PREPARING: 'PREPARING', // 整备阶段/抽卡
        BATTLE: 'BATTLE',       // 战斗开始
        GAMEOVER: 'GAMEOVER'    // 游戏结束
    },

    // 当前游戏状态
    currentState: null,

    // 初始化状态机
    init() {
        this.currentState = this.states.PREPARING;
        console.log(`Game state initialized to: ${this.currentState}`);
    },

    // 切换状态
    setState(newState) {
        if (this.states[newState] && this.currentState !== newState) {
            this.currentState = this.states[newState];
            console.log(`Game state changed to: ${this.currentState}`);
            // 在状态切换时可以触发事件
            // 例如： document.dispatchEvent(new CustomEvent('gameStateChanged', { detail: this.currentState }));
        } else {
            console.warn(`Invalid state transition to: ${newState}`);
        }
    },

    // 检查当前是否为某个特定状态
    is(state) {
        return this.currentState === this.states[state];
    }
};

// 初始化游戏状态
GameState.init();
