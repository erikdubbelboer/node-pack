
function unpacker(data) {
  if (!Buffer.isBuffer(data)) {
    throw 'data is not a Buffer';
  }
      
  var length = data.readUInt32BE(0);

  if (length != data.length) {
    throw 'data length mismatch';
  }

  var _s = 4;

  return {
    unpack_int8_t: function() {
      var d = data.readInt8(_s);
      _s += 1;
      return d;
    },

    unpack_uint8_t: function() {
      var d = data.readUInt8(_s);
      _s += 1;
      return d;
    },

    unpack_int16_t: function() {
      var d = data.readInt16BE(_s);
      _s += 2;
      return d;
    },

    unpack_uint16_t: function() {
      var d = data.readUInt16BE(_s);
      _s += 2;
      return d;
    },

    unpack_int32_t: function() {
      var d = data.readInt32BE(_s);
      _s += 4;
      return d;
    },

    unpack_uint32_t: function() {
      var d = data.readUInt32BE(_s);
      _s += 4;
      return d;
    },

    unpack_int64_t: function() {
      var b = data.slice(_s, _s + 8);
      _s += 8;
      return b;
    },

    unpack_uint64_t: function() {
      var b = data.slice(_s, _s + 8);
      _s += 8;
      return b;
    },

    unpack_string: function() {
      for (var i = _s; i < data.length; ++i) {
        if (data[i] == 0) {
          break;
        }
      }

      var s = data.toString('ascii', _s, i);
      _s = i + 1;
      return s;
    },

    unpack_buffer: function() {
      var d = data.readUInt32BE(_s);
      _s += 4;

      var b = data.slice(_s, _s + d);
      _s += d;
      return b;
    },

    unpack_reset: function() {
      _s = 4;
    },

    unpack_data: function() {
      return data;
    }
  };
}


function packer() {
  var data = [new Buffer(0)];

  return {
    pack_int8_t: function(d) {
      var b = new Buffer(1);
      b.writeInt8(d, 0);
      data.push(b);
    },

    pack_uint8_t: function(d) {
      var b = new Buffer(1);
      b.writeUInt8(d, 0);
      data.push(b);
    },

    pack_int16_t: function(d) {
      var b = new Buffer(2);
      b.writeInt16BE(d, 0);
      data.push(b);
    },

    pack_uint16_t: function(d) {
      var b = new Buffer(2);
      b.writeUInt16BE(d, 0);
      data.push(b);
    },

    pack_int32_t: function(d) {
      var b = new Buffer(4);
      b.writeInt32BE(d, 0);
      data.push(b);
    },

    pack_uint32_t: function(d) {
      var b = new Buffer(4);
      b.writeUInt32BE(d, 0);
      data.push(b);
    },

    pack_int64_t: function(d) {
      if (!Buffer.isBuffer(d)) {
        throw '64 bit integers should be buffers';
      }

      data.push(d);
    },

    pack_uint64_t: function(d) {
      if (!Buffer.isBuffer(d)) {
        throw '64 bit integers should be buffers';
      }

      data.push(d);
    },

    pack_string: function(s) {
      var b = new Buffer(s.length + 1);
      b.write(s, 0, s.length, 'ascii');
      b[s.length] = 0;
      data.push(b);
    },

    pack_buffer: function(b) {
      data.push(b);
    },

    pack_finish: function() {
      var length = 4;

      for (var i = 0; i < data.length; ++i) {
        length += data[i].length;
      }

      data[0] = new Buffer(4);
      data[0].writeUInt32BE(length, 0);

      return Buffer.concat(data, length);
    }
  };
}


module.exports.packer = function() {
  return new packer();
};


module.exports.unpacker = function(data) {
  return new unpacker(data);
};

