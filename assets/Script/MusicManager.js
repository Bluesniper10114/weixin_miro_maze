var t = cc.Class({
    extends: cc.Component,
    properties: {
        backgroundAudio: cc.AudioSource,
        sfxAudio: cc.AudioSource,
        backgroundAudioClip: [ cc.AudioClip ],
        sfxAudioClips: [ cc.AudioClip ]
    },
    statics: {
        instance: null
    },
    onLoad: function() {
        (t.instance = this).playBackgroundAudio(0);
    },
    playBackgroundAudio: function(t) {
        this.backgroundAudio.clip != this.backgroundAudioClip[t] && (this.backgroundAudio.clip = this.backgroundAudioClip[t], 
        this.backgroundAudio.play(), this.backgroundAudio.loop = !0);
    },
    playBackgroundAudioOnce: function(t) {
        this.backgroundAudio.clip != this.backgroundAudioClip[t] && (this.backgroundAudio.clip = this.backgroundAudioClip[t], 
        this.backgroundAudio.play(), this.backgroundAudio.loop = !1);
    },
    playSfxAudio: function(t) {
        this.sfxAudio.clip = this.sfxAudioClips[t], this.sfxAudio.play(), this.sfxAudio.loop = !1;
    }
});