(function () {
    "use strict";

    var _;


    var isPrimitiveType = function(type) {
        return ['string', 'number', 'integer', 'boolean', 'array'].indexOf(type) > -1;
    };



    var isCustomType = function(type) {
        return !this.isPrimitiveType(type);
    };



    /*
        Clones an object.
    */
    var __Clone = function() {};
    var clone = function(obj) {
        __Clone.prototype = obj;
        return new __Clone();
    };



    /*
        Deep clones an object
    */
    var deepClone = function(obj) {
        var key, temp, value;
        if ((obj === null) || (typeof obj !== 'object')) {
            return obj;
        } else {
            temp = {};
            for (key in obj) {
                value = obj[key];
                temp[key] = deepCloneObject(value);
            }
            return temp;
        }
    };



    /*
        Visits a data structure recursively, running transformation fn(x) on each property.
        Returns a new transformed data structure
    */
    var _visit = function(obj, fn, visited) {
        var alreadyVisited;

        for(var vIndex = 0; vIndex < visited.length; vIndex++) {
            if (visited[vIndex].src === obj) {
                alreadyVisited = visited[vIndex];
                break;
            }
        }

        if(!alreadyVisited) {
            if (obj instanceof Array) {
                var newArray = [];
                for(var i = 0; i < obj.length; i++) {
                    newArray.push(_visit(obj[i], fn, visited));
                }
                visited.push({ src: obj, dest: newArray });
                return newArray;
            } else {
                var visitResult = fn(obj) || { value: obj };

                if (typeof(obj) === "object") {
                    if (visitResult.stop) {
                        return visitResult.value;
                    } else {
                        var newObject = {};

                        for (var key in obj) {
                            if (!visitResult.fnMustVisit || visitResult.fnMustVisit(key, obj)) {
                                var newKey = visitResult.fnKey ? visitResult.fnKey(key) : key;
                                if (newKey)
                                    newObject[newKey] = _visit(obj[key], fn, visited);
                            }
                        }

                        if (visitResult.fnAfterVisit)
                            visitResult.fnAfterVisit(newObject);

                        visited.push({ src: obj, dest: newObject });
                        return newObject;
                    }
                } else {
                    return visitResult.value;
                }
            }
        } else {
            return alreadyVisited.dest;
        }
    };


    var visit = function(obj, fn) {
        return _visit(obj, fn, []);
    };


    module.exports = {
        clone: clone,
        deepClone: deepClone,
        visit: visit
    };

})();
