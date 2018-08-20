cc.Class({
    extends: cc.Component,
    properties: {
        winAudio: {
            default: null,
            url: cc.AudioClip
        },
        loseAudio: {
            default: null,
            url: cc.AudioClip
        },
        bgm: {
            default: null,
            url: cc.AudioClip
        }
    },
    playMusic: function() {
        cc.audioEngine.playMusic(this.bgm, !0);
    },
    pauseMusic: function() {
        cc.audioEngine.pauseMusic();
    },
    resumeMusic: function() {
        cc.audioEngine.resumeMusic();
    },
    _playSFX: function(t) {
        cc.audioEngine.playEffect(t, !1);
    },
    playWin: function() {
        this._playSFX(this.winAudio);
    },
    playLose: function() {
        this._playSFX(this.loseAudio);
    }
})