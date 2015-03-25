var Client = function(clientURL){
  this.URL = clientURL;
  this.shasAcquired = {
    // '<sha>': '<data>'
  };
  this.urlForSha = {
    // '<sha>': '<peerUrl>'
  }
};
// End-to-end functionality:
Client.prototype.download = function(torrent){ // return a complete 'file' (string)
  var client = this; // to prevent loss of context

  return completeFile;
};
// Piece requesting and serving:
Client.prototype.askAboutAvailablePiecesFrom = function(peerUrl) { // return list of available shas

};
Client.prototype.requestPiece = function(url, sha) { // return piece data

};
Client.prototype.filterShasNeededForTorrent = function(torrent, shas){ // return list of only shas needed for torrent

};
Client.prototype.respondTo = function(relativeUrl){ // respond to requests from other clients
  if(relativeUrl.indexOf('/pieces') !== -1){
    // respond with list of piece SHAs available.

  } else {

  }
};
// 'File' read and write:
Client.prototype.readTorrent = function(pathToTorrent) { // return torrent object

};
Client.prototype.assemblePieces = function(torrentShas, pieces) { // return 'file' string
  var client = this; // to prevent loss of context

};
// Tracker interaction:
Client.prototype.askForSeeds = function(trackerURL){ // return list of peerUrls

};
Client.prototype.registerAsPeer = function(trackerURL){ // add self to tracker




}
// Helper methods (no need to touch these, but you can use them.)
Client.prototype.url = function() {
  return this.URL;
};
Client.prototype.get = function(url) {
  return get.call(this, url);
};

// Spec methods (these methods are only for the specs; don't use them.)
Client.prototype.givePiece = function(piece) {
  this.shasAcquired[piece.sha] = piece.data;
};
Client.prototype.piecesAcquired = function(){
  return this.shasAcquired;
};
