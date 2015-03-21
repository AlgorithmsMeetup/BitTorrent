var Client = function(clientURL){
  this.URL = clientURL;
  this.files = {
  // fileName: {
  //   piecesNeeded: file.SHAs, //decreases as pieces are acquired
  //   pieces: {
  //     '<sha>': {
  //       index: 0, // can be reconstructed from original torrent sha order.
  //       data: '<data>',
  //       URLsOfPeersThatHaveIt: ['<url>', '<url>', '<url>']
  //     }
  //   }
  // }
  };
};

Client.prototype.downloadTorrent = function(fileToRead, pathToWriteFile) {
  var torrent = this.readTorrent(fileToRead);
  var peerUrls = this.askForSeeds(torrent.announce.trackerURL);
  // register as a seed
  this.registerAsSeed(torrent.announce.trackerURL);
  // the following process should be non-blocking async.
  torrent.info.files.forEach(function(file){
    this.files[file.name] = {
      pieces: new Array(file.SHAs.length),
      piecesNeeded: file.SHAs,
      piecesPeersHave: {},
      SHAs: file.SHAs,
      ownedSHAs: []
    };
    var file = this.files[file.name];
    // time passes
    while( piecesNeeded ){
      // Pick a needed SHA at random.
      var neededSHA = piecesNeeded[Math.random()*piecesNeeded.length];
      // Do any peers have that SHA?
      if(this.piecesPeersHave[neededSHA]){
        // Yes? Ask a peer that has that SHA for it.
        var peerURL = this.piecesPeersHave[neededSHA];
        var pieceData = this.requestPiece(peerURL, file.name, neededSHA);
        // Place the piece in the correct slot in array.
        var indexOfPiece = file.SHAs.indexOf(neededSHA);
        file.pieces[indexOfPiece] = pieceData;
        // Remove SHA from piecesNeeded list.
        file.piecesNeeded.splice(file.piecesNeeded.indexOf(neededSHA));
      } else {
        // No? Refresh peers' SHAs for this file and retry.
        file.piecesPeersHave = {};
        this.askForSeeds().forEach(function(seedURL){
          this.askAboutAvailablePiecesFrom(seedURL, file.name).forEach(function(SHA){
            file.piecesPeersHave[SHA] = seedURL;
          });
        });
      }
    }
    return this.assemblePiecesIntoFile(file.pieces, file.name);
  });
};

// Piece requesting and serving:
Client.prototype.askAboutAvailablePiecesFrom = function(peerURL, fileName) {
  return this.get(peerURL+'/file/'+fileName+'/pieces');
};
Client.prototype.requestPiece = function(peerURL, fileName, pieceSHA) {
  return this.get(peerURL+'/file/'+fileName+'/piece/'+pieceSHA);
};
Client.prototype.respondTo = function(relativeURL){
  if(relativeURL.indexOf('/pieces') !== -1){
    // respond with list of piece SHAs available.
    var file = relativeURL.split('file/')[1].split('/pieces')[0];
    return Object.keys(this.files[file].pieces);
  } else {
    // respond with requested piece.
    var fileName = relativeURL.split('file/')[1].split('/piece/')[0];
    var pieceSHA = relativeURL.split('file/')[1].split('/piece/')[1];
    return this.files[fileName].pieces[pieceSHA].data;
  }
};

// File read and write:
Client.prototype.readTorrent = function(pathToTorrent) {
  var torrent = pathToTorrent;
  return torrent;
};
Client.prototype.assemblePiecesIntoFile = function(pieces, pathToWriteFile) {
  var orderedPieces = [];
  var assembledData = orderedPieces.join('');
  return assembledData;
};

// Tracker interaction:
Client.prototype.askForSeeds = function(torrentURL){
  return this.get(torrentURL+'/seeds');
};
Client.prototype.registerAsPeer = function(torrentURL){
  return this.get(torrentURL+'/seed/add');
}

// Spec/helper methods
Client.prototype.url = function() {
  return this.URL;
};
Client.prototype.givePiece = function(fileName, pieceSHA, pieceData) {
  var piece = {fileName: fileName, sha: pieceSHA, data: pieceData};
  this.files[fileName] = this.files[fileName] || {pieces: []};
  this.files[fileName].pieces[pieceSHA] = {data: pieceData, URLsOfPeersThatHaveIt: []};
};
Client.prototype.get = function(url) {
  return get.call(this, url);
};
