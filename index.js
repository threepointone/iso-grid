module.exports = Grid;
"use strict";

var slice = [].slice,
    beam = require('beam'),
    each = require('each'),
    extend = require('extend'),
    iso = require('iso'),
    times = require('times'),
    flatten = require('flatten'),
    isArray = require('isArray'),
    doc = document,
    isValue = function(v) {
        return v != null;
    };


function Grid(el, options) {
    if (!(this instanceof Grid)) return new Grid(el, options);
    this.el = el || document.body;
    this.el.className = (this.el.className || '').split(' ').concat(['iso-grid']).join(' ');
    options = options || {};
    this.side = options.side || 10;
    this.faces = [];
    this.offset = options.offset || 0;

    this.colorMap = {
        front: '#444444',
        left: '#222222',
        top: '#777777'
    };

}

extend(Grid.prototype, {
    add: function() {
        var els = flatten(slice.call(arguments, 0)),
            me = this.el,
            t = this;
        each(els, function(el) {
            if (el.parentNode !== me) {
                me.appendChild(el);
                t.faces.push(el);
            }
        });
    },
    face: function(pos) {
        var el = doc.createElement('div');
        el.className = 'face';
        el.style.zIndex = 1;
        el.style.opacity = 0;

        el.style.backgroundColor = '#000';

        var dir = pos.dir || 'front';
        var coOrds = extend({
            backgroundColor: this.colorMap[dir]
        }, iso.transform(null, null, pos.x, pos.y, pos.z, this.offset), {
            transform: iso.face(dir),
            opacity: 1
        });
        el.setAttribute('face', dir);
        el.setAttribute('x:y:z', [pos.x, pos.y, pos.z].join(':'));

        beam(el, coOrds);

        // guh.

        el.__beam__.multiply(0.007);
        el.__beam__.tweens.zIndex.multiply(0.5);
        el.__beam__.transformer.multiply(0.007);

        return el;

    },
    cube: function(pos) {
        var t = this;
        return times(['front', 'left', 'top'], function(i, face) {
            return t.face(extend({
                dir: face
            }, pos));
        });
    },
    move: function(faces, pos) {
        var t = this;

        each(!isArray(faces) ? [faces] : faces, function(face) {

            var position = (typeof pos === 'function' ? pos(face) : pos),
                pieces = face.getAttribute('x:y:z').split(':'),
                dir = pos.dir || face.getAttribute('face'),
                xyz = times(pieces, function(i, p) {
                    return parseFloat(p, 10);
                }),
                x = isValue(pos.x) ? pos.x : xyz[0],
                y = isValue(pos.y) ? pos.y : xyz[1],
                z = isValue(pos.z) ? pos.z : xyz[2];

            var coOrds = extend({
                backgroundColor: t.colorMap[dir]
            }, iso.transform(null, null, x, y, z, t.offset), {
                transform: iso.face(dir)
            });

            face.setAttribute('face', dir);
            face.setAttribute('x:y:z', [x, y, z].join(':'));

            beam(face, coOrds);

        });

        return this;
    },
    closest: function(x, y, faces) {
        // return an array sorted by 'distance' to x, y

        faces = times(faces || this.faces); // a quick clone
        faces.sort(function(a, b) {
            var axyz = a.getAttribute('x:y:z').split(':');
            var bxyz = b.getAttribute('x:y:z').split(':');

            var ax = parseFloat(axyz[0], 10),
                ay = parseFloat(axyz[1], 10);
            var bx = parseFloat(bxyz[0], 10),
                by = parseFloat(bxyz[1], 10);

            var expr = Math.sqrt(((ax - x) * (ax - x)) + ((ay - y) * (ay - y))) - Math.sqrt(((bx - x) * (bx - x)) + ((by - y) * (by - y)));

            return -1 * expr;

        });
        return faces;

    }
});

Grid.each = each;
Grid.times = times;
Grid.isArray = isArray;
Grid.extend = extend;
Grid.iso = iso;
Grid.beam = beam;