(work in progress)

# iso-grid

 a generic isometric grid implemented in css

## Installation

    $ component install threepointone/iso-grid

## API

```js
var grid = require('iso-grid')();

var cube = grid.cube({
    x: 0,
    y: 10,
    z: -1
});

grid.add(cube);

grid.move(cube, {
    x:10, y:1, z:6
});

// tada!

```


## License

  MIT
