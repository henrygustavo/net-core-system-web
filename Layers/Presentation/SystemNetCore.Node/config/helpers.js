var path = require('path');
var _root = path.resolve(__dirname, '..');

function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [_root].concat(args));
}

function orderChunk(list) {
    return function (chunk1, chunk2) {
        var index1 = list.indexOf(chunk1.names[0]);
        var index2 = list.indexOf(chunk2.names[0]);
        if (index2 === -1 || index1 < index2) {
            return -1;
        }
        if (index1 === -1 || index1 > index2) {
            return 1;
        }
        return 0;
    };
}

exports.root = root;

exports.orderChunk = orderChunk;