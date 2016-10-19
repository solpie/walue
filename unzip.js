var DecompressZip = require('decompress-zip');
var unzipper = new DecompressZip('update2.zip');

unzipper.on('error', function (err) {
    console.log('Caught an error');
});

unzipper.on('extract', function (log) {
    console.log('Finished extracting');
});

unzipper.on('progress', function (fileIndex, fileCount) {
    console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
});

unzipper.extract({
    path: 'api/',
    filter: function (file) {
        return file.type !== "SymbolicLink";
    }
});