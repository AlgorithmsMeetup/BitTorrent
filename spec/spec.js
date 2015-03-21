var expect = chai.expect;

describe("BitTorrent Client", function(){
  var client
  before(function(){
    client = new Client('http://localhost:7001');
  });
  it('reads a .torrent file', function(){
    expect(client.readTorrent(sampleTorrent)).to.deep.equal({
     "announce": {
         "trackerURL": "http://localhost:7000"
       },
       "info": {
         "files": [
           {
             "name": "file1.txt",
             "piecesSize": 16,
             "SHAs": ["QWTSDFD3WT643", "D6765765fyhgf55G"]
           }
         ]
       }
    });
  });
  it('gets a list of peers from a tracker', function(){
    network.endpoints['http://localhost:7002'] = true;
    network.endpoints['http://localhost:7003'] = true;
    // make sure client doesn't receive its own url back
    client.registerAsPeer(network.trackerURL);
    expect(Object.keys(network.endpoints)).to.deep.equal(['http://localhost:7002', 'http://localhost:7003', 'http://localhost:7001'])
    expect(client.askForSeeds(network.trackerURL)).to.deep.equal(['http://localhost:7002', 'http://localhost:7003']);
  });
  it('requests a list of available pieces in a file from a peer', function(){
    var peer = new Client('http://localhost:7002');
    peer.registerAsPeer(network.trackerURL);
    var piece1 = {file: 'ebook', sha: 'g0f86f5hkuh', data: 'afnDFaG7KJhFHFDSs'};
    peer.givePiece(piece1.file, piece1.sha, piece1.data);
    var piece2 = {file: 'ebook', sha: '175ugif65fg', data: 'u7875856guyg66fhf'};
    peer.givePiece(piece2.file, piece2.sha, piece2.data);
    var piece3 = {file: 'video', sha: '9758c68tuh', data: 'DSsdfsdf2123f6767'};
    peer.givePiece(piece3.file, piece3.sha, piece3.data);

    expect(client.askAboutAvailablePiecesFrom(peer.url(), piece1.file)).to.deep.equal([piece1.sha, piece2.sha]);
  });
  it('requests a piece from a peer', function(){
    var peer = new Client('http://localhost:7002');
    peer.registerAsPeer(network.trackerURL);
    var piece = {file: 'ebook', sha: '23r23ggdf', data: '132g35haff2123'};
    peer.givePiece(piece.file, piece.sha, piece.data);
    // var url = peer.url()+'/file/'+piece.file+'/piece/'+piece.sha;
    // stub network.get(url) and return piece.data
    expect(client.requestPiece(peer.url(), piece.file, piece.sha)).to.equal(piece.data);
  });
  xit('serves a piece to a requesting peer', function(){
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
  xit('assembles the file when it has all pieces', function(){
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
  xit('verifies the authenticity of a piece');
  xit('generates a new .torrent from a file');
  xit('handles peer disconnection');
  xit('notices new peers');
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
