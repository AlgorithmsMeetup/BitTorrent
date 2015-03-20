var expect = chai.expect;

describe("BitTorrent Client", function(){
  var client
  before(function(){
    client = new Client('http://localhost:7001');
  });
  it('reads a .torrent file', function(){
    console.log(client.readTorrent(sampleTorrent));
    expect(client.readTorrent(sampleTorrent)).to.deep.equal({
      "announce": {
        "tracker_url": "http://localhost:6789/tracker"
      }
    });
  });
  it('gets a list of peers from a tracker', function(){
    network.endpoints['123'] = true;
    network.endpoints['abc'] = true;
    expect(client.askForSeeds(network.trackerURL)).to.deep.equal(['123', 'abc']);
  });
  it('requests a piece from a peer', function(){
    var piece = {file: 'ebook', sha: '1', data: 'af^DF&G#KJ@FHFDSsdfsdf2123'};
    var peer = new Client('http://localhost:6782');
    var url = peer.url+'/file/'+file+'/piece/'+sha;
    // stub network.get(url) and return piece.data
    expect(client.requestPiece(peer.url, piece.file, piece.sha)).to.equal(piece.data);
  });
  it('serves a piece to a requesting peer', function(){
    var piece = {file:'bob', sha: '2', data: 'F*^%*FT#FHi'};
    client.files[piece.file].pieces[piece.sha] = piece.data;
    var peer = new Client('http://localhost:6783');
    var servePiece = spyOn(client.servePiece);
    client.givePiece(piece.sha, piece.data);
    expect(servePiece).to.have.been.called.with(piece.sha, peer.url);
    expect(peer.requestPiece(piece.sha, client.url)).to.equal(piece.data)
  });
  xit('asks for pieces it needs', function(){

  });
  xit('registers with the tracker', function(){

  });
  xit('continues to seed after it has all pieces', function(){

  });
  it('assembles the file when it has all pieces', function(){
    var pathToWriteFile = 'completeFile.txt';
    var pieces = [
      {sha: '3', data: '123'},
      {sha: '4', data: '456'},
      {sha: '5', data: '789'},
    ];
    client.assemblePiecesIntoFile(pieces, pathToWriteFile);
    expect(fs.existsSync(pathToWriteFile));
    expect(fs.readFileSync(pathToWriteFile)).to.equal(pieces.join(''));
    fs.deleteFileSync(pathToWriteFile);
  });
  it('verifies the authenticity of a piece');
  it('handles peer disconnection');
  it('notices new peers');
});

//   it('should accurately calculate the distance between two cities', function(){
//     expect(Math.floor(distance)).to.equal(2852653);
//   });


//   it('should not modify the original city list', function(){
//     expect(route).to.not.equal(testCitiesShort);
//   });
// });

//   it('should return a partially optimized solution for n=50', function(){
//     expect(distance).to.be.below(40000000);
//   });
// });
