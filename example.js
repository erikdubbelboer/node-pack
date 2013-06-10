
// Usage: node example.js 1337 | node example.js

var pack = require('./index.js');


if (process.argv.length < 3) {
  // Reading.
  process.stdin.resume();

  var buffers = [];

  process.stdin.on('data', function(chunk) {
    buffers.push(chunk);
  });

  process.stdin.on('end', function() {
    var p   = pack.unpacker(Buffer.concat(buffers));
    var num = p.unpack_int32_t();

    console.log(num);
  });
} else {
  // Writing.
  var num = parseInt(process.argv[2]);
  var p   = pack.packer();

  p.pack_int32_t(num);

  process.stdout.write(p.pack_finish());
}

