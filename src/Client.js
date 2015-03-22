var Client = function(clientURL){
  this.URL = clientURL;
  this.shasAcquired = {
    // '<sha>': '<data>'
  };
};

// Piece requesting and serving:
Client.prototype.askAboutAvailablePiecesFrom = function(peerUrl) {
  return this.get(peerUrl+'/pieces');
};
Client.prototype.requestPiece = function(peerUrl, sha) {
  return this.get(peerUrl+'/piece/'+sha);
};
Client.prototype.shasNeededForTorrent = function(torrent){
  return torrent.shas.filter(function(sha){
    return this.shasAcquired.indexOf(sha) === -1;
  });
};
Client.prototype.respondTo = function(relativeUrl){
  if(relativeUrl.indexOf('/pieces') !== -1){
    // respond with list of piece SHAs available.
    var client = this;
    var validShas = Object.keys(client.shasAcquired).filter(function(sha){
      return client.shasAcquired[sha];
    });
    return validShas;
  } else {
    // respond with requested piece.
    var sha = relativeUrl.split('/piece/')[1];
    return this.shasAcquired[sha];
  }
};

// File read and write:
Client.prototype.readTorrent = function(pathToTorrent) {
  var torrent = pathToTorrent;
  return torrent;
};
Client.prototype.assemblePieces = function(torrentShas, pieces) {
  var client = this;
  return torrentShas.map(function(sha){
    return client.shasAcquired[sha];
  }).join('');
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
Client.prototype.givePiece = function(piece) {
  this.shasAcquired[piece.sha] = piece.data;
};
Client.prototype.get = function(url) {
  return get.call(this, url);
};
