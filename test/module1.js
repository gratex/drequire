define(["require"], function(_require) {

    return function(cb) {
        setTimeout(function() {
            _require(["./module2"], function(mod2) {
                cb(null, mod2);
            })
        }, 1000);
    };

});
