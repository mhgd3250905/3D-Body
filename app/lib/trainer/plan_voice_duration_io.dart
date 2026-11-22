import 'dart:io';
import 'dart:typed_data';

/// Read the duration of a verified M4A clip when it has no bundled receipt.
/// The ISO BMFF movie header has the time scale and duration without decoding
/// audio or opening an audio session.
Future<double?> readPlanVoiceDuration(Uri uri) async {
  if (uri.scheme != 'file' || !uri.path.endsWith('.m4a')) return null;
  RandomAccessFile? file;
  try {
    file = await File.fromUri(uri).open();
    final movie = await _box(file, 0, await file.length(), 'moov');
    if (movie == null) return null;
    final header = await _box(file, movie.start, movie.end, 'mvhd');
    if (header == null || header.end - header.start < 20) return null;
    await file.setPosition(header.start);
    final bytes = await file.read(
      header.end - header.start < 32 ? header.end - header.start : 32,
    );
    if (bytes.length < 20) return null;
    final data = ByteData.sublistView(bytes);
    final (scale, duration) = switch (data.getUint8(0)) {
      0 => (data.getUint32(12), data.getUint32(16)),
      1 when bytes.length == 32 => (data.getUint32(20), data.getUint64(24)),
      _ => (0, 0),
    };
    return scale > 0 && duration > 0 ? duration / scale : null;
  } on FileSystemException {
    return null;
  } finally {
    await file?.close();
  }
}

Future<({int start, int end})?> _box(
  RandomAccessFile file,
  int start,
  int end,
  String kind,
) async {
  while (end - start >= 8) {
    await file.setPosition(start);
    final bytes = await file.read(8);
    if (bytes.length < 8) return null;
    final data = ByteData.sublistView(bytes);
    var length = data.getUint32(0);
    var headerSize = 8;
    if (length == 0) {
      length = end - start;
    } else if (length == 1) {
      if (end - start < 16) return null;
      final extendedSize = await file.read(8);
      if (extendedSize.length < 8) return null;
      length = ByteData.sublistView(extendedSize).getUint64(0);
      headerSize = 16;
    }
    if (length < headerSize || length > end - start) return null;
    if (String.fromCharCodes(bytes.skip(4)) == kind) {
      return (start: start + headerSize, end: start + length);
    }
    start += length;
  }
  return null;
}
