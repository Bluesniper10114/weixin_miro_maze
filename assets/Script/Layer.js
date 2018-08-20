cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad: function() {
        this.node.on(cc.Node.EventType.TOUCH_START, function(t) {
            t.stopPropagation(), console.log("TOUCH_STARTLayer");
        }, this.node);
    }
})