cc.Class({
    extends: cc.Component,
    properties: {
        _aMap: null,
        _player: null,
        _iMapCols: 0,
        _iMapRows: 0,
        _node: null,
        _IQ: 5
    },
    init: function(map, player, val) {
        switch (this._aMap = map, this._player = player, val) {
          case 1:
            this._IQ = 5;
            break;

          case 3:
            this._IQ = 9;
            break;

          default:
            this._IQ = 7;
        }

        this._iMapRows = this._aMap.length;
        this._iMapCols = this._aMap[0].length;
        this._IQ = Math.floor(13 * Math.random() + 1);
        this._player.route || (player.route = [], player.exclude = []);
    },
    movePredict: function(_cell, _id) {
        if (0 > _cell.route.indexOf(_id)) return null;

        var pos_cell = null, arrow = null;

        if (
            "left" === _id ? (
                pos_cell = this._aMap[_cell.row][_cell.col - 1],
                arrow = "right"
            ) : "right" === _id ? (
                    pos_cell = this._aMap[_cell.row][_cell.col + 1],
                    arrow = "left"
                ) : "up" === _id ? (
                        pos_cell = this._aMap[_cell.row - 1][_cell.col],
                        arrow = "bottom"
                    ) : "bottom" === _id ? (
                            pos_cell = this._aMap[_cell.row + 1][_cell.col],
                            arrow = "up"
                        ) : void 0, null == pos_cell
        ) return null;

        if (2 == pos_cell.route.length && "180" != pos_cell.id) {
            var _route = pos_cell.route.concat();
            return _route.splice(_route.indexOf(arrow), 1), this.movePredict(pos_cell, _route[0]);
        }
        return {
            cell: pos_cell,
            orientation: _id
        };
    },
    autoGo: function() {
        if (!cc.miroGame.b_isAI) return null;

        var self_player = this._player;

        if (self_player.canmove) {
            this._IQ = 13 < this._IQ ? 13 : this._IQ;

            var ran_IQ = Math.floor(3 * Math.random() + 1) * (1500 - 100 * this._IQ),
                self = this;

            setTimeout(function() {
                if (null != self_player.cell) {
                    var last = "";

                    0 < self_player.route.length && (last = self_player.route[self_player.route.length - 1].last);

                    var get_cell = function d(cell, orient, val) {
                        orient = self.getOppositeDirection(orient);
                        for (var r, o = cell.route.concat(); 0 < o.length; ) {
                            if (r = Math.floor(Math.random() * o.length), orient != o[r]) {
                                var n;
                                if (null == (n = self.movePredict(cell, o[r])) || 0 <= self_player.exclude.indexOf(n.cell.id) || "180" != n.cell.id && 2 > n.cell.route.length) {
                                    o.splice(r, 1);
                                    continue;
                                }
                                if (++val >= self._IQ || "180" == n.cell.id) return {
                                    orientation: o[r],
                                    last: n.orientation
                                };
                                if (null != d(n.cell, n.orientation, val)) return {
                                    orientation: o[r],
                                    last: n.orientation
                                };
                            }
                            o.splice(r, 1);
                        }
                        return null;
                    }(self_player.cell, last, 0);

                    if (null != get_cell)
                        self_player.route.push({
                            cell: self_player.cell,
                            orientation: get_cell.orientation,
                            last: get_cell.last
                        }),
                        cc.miroGame.that.node.emit("movePlayer2", get_cell.orientation);
                    else {
                        var pop_route = self_player.route.pop();
                        self_player.exclude.push(self_player.cell.id);
                        cc.miroGame.that.node.emit("movePlayer2", self.getOppositeDirection(pop_route.last));
                    }
                }
                null != self_player.cell && "180" == self_player.cell.id || self.autoGo();
            }, ran_IQ);
        }
    },
    getOppositeDirection: function(arrow) {
        return "left" === arrow ?
            "right" : "right" === arrow ?
                    "left" : "up" === arrow ?
                            "bottom" : "bottom" === arrow ?
                                        "up" : "";
    }
});
