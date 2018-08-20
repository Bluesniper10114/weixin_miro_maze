var event_handle = function() {
    function event_func() {}

    var return_func = [], tmp_func = [];

    event_func.addEvent = function(id, val, dep) {
        dep = null == dep ? 100 : dep;
        return_func[id] || (return_func[id] = []);

        var index = event_func.getIndex(id, val);

        if (-1 != index) return_func[id][index].depth = dep || index;
        else {
            var g = tmp_func.length ? tmp_func.shift() : new func_dep();
            g.func = val, g.depth = dep;
            return_func[id].push(g);
        }

        return_func[id].sort(btw_dep);
    },

    event_func.removeEvent = function(id, val) {
        if (return_func[id] && return_func[id].length) {
            var index = event_func.getIndex(id, val);
            -1 != index && tmp_func.push(return_func[id].splice(index, 1));
        }
    },

    event_func.dispatchEvent = function(id, val) {
        if (val = null == val ? null : val, return_func[id])
            for (var t = return_func[id].length - 1; 0 <= t; t--)
                return_func[id] && return_func[id][t] && return_func[id][t].func.apply(null, val);
        else
            trace("[Warn] CBM没有对应的回调类型 - " + id);
    };

    var btw_dep = function(n, e) {
        return e.depth - n.depth;
    };

    return event_func.getIndex = function(id, val) {
        for (var t = 0, a = return_func[id].length; t < a; t++)
            if (val == return_func[id][t].func) return t;
        return -1;
    },

    event_func;
}(),

func_dep = function() {
    this.func, this.depth;
};
module.exports = event_handle;
