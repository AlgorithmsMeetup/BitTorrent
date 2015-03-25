var Client = function(clientURL){
  this.URL = clientURL;
  this.shasAcquired = {
    // '<sha>': '<data>'
  };
  this.urlForSha = {
    // '<sha>': '<peerUrl>'
  }
};

Client.prototype.download = function(torrent){
  var client = this; // to prevent loss of context
  // Get peers from tracker
  var peerUrls = this.askForSeeds(torrent.trackerUrl);
  // console.log('peerUrls:', peerUrls);
  // Find out what SHAs the peers have
  var availableShas = peerUrls.map(function(url){
    return client.askAboutAvailablePiecesFrom(url).map(function(sha){
      client.urlForSha[sha] = url;
      return sha;
    });
  }).reduce(function(allShas, aPeersShas){
    return allShas.concat(aPeersShas);
  }, []);
  // console.log('availableShas:',availableShas);
  // console.log('urlsForSha:', client.urlForSha);
  // Filter out unneeded SHAs
  var filteredShas = this.filterShasNeededForTorrent(torrent, availableShas);
  // console.log('filteredShas', filteredShas.map(function(pair){ return pair.sha; }));
  // Request the pieces needed
  var allPieces = filteredShas.map(function(sha){
    // console.log('client.urlForSha[sha]',client.urlForSha[sha])
    var response = client.requestPiece(client.urlForSha[sha], sha);
    client.shasAcquired[sha] = response;
    return response;
  });
  // console.log('allPieces:', allPieces, this.shasAcquired);
  // Assemble the data into the complete file
  var completeFile = this.assemblePieces(torrent.shas, allPieces);
  // console.log('completeFile:',completeFile);
  return completeFile;
};

// Piece requesting and serving:
Client.prototype.askAboutAvailablePiecesFrom = function(peerUrl) {
  return this.get(peerUrl+'/pieces');
};
Client.prototype.requestPiece = function(url, sha) {
  return this.get(url+'/piece/'+sha);
};
Client.prototype.filterShasNeededForTorrent = function(torrent, shas){
  return shas.filter(function(sha){
    return torrent.shas.indexOf(sha) !== -1;
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

// 'File' read and write:
Client.prototype.readTorrent = function(pathToTorrent) { // return torrent object
  return pathToTorrent;
};
Client.prototype.assemblePieces = function(torrentShas, pieces) { // return 'file' string
  var client = this;
  return torrentShas.map(function(sha){
    return client.shasAcquired[sha];
  }).join('');
};

// Tracker interaction:
Client.prototype.askForSeeds = function(trackerURL){ // return list of peerUrls
  return this.get(trackerURL+'/seeds');
};
Client.prototype.registerAsPeer = function(trackerURL){ // add self to tracker
  return this.get(trackerURL+'/seed/add');
}

// Helper methods
Client.prototype.url = function() {
  return this.URL;
};
Client.prototype.get = function(url) {
  return get.call(this, url);
};

// Spec methods
Client.prototype.givePiece = function(piece) {
  this.shasAcquired[piece.sha] = piece.data;
};
Client.prototype.piecesAcquired = function(){
  return this.shasAcquired;
};
