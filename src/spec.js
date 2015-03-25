var expect = chai.expect;

describe("BitTorrent Client", function(){
  var client;
  beforeEach(function(){
    client = new Client('http://localhost:7001');
    network = {
      trackerUrl: 'http://localhost:7000',
      peers: {}  // peers can register themselves.
    };
  });
  it('reads a .torrent file', function(){
    expect(client.readTorrent(sampleTorrent)).to.deep.equal({
      "trackerUrl": "http://localhost:7000",
      "name": "file1.txt",
      "piecesSize": 16,
      "shas": ["QWTSDFD3WT643", "D6765765fyhgf55G"]
    });
  });
  it('registers with the tracker', function(){
    client.registerAsPeer(network.trackerUrl);
    expect(Object.keys(network.peers)).to.include(client.url());
  });
  it('gets a list of peers from a tracker', function(){
    network.peers['http://localhost:7002'] = '<Client>';
    network.peers['http://localhost:7003'] = '<Client>';
    // make sure client doesn't receive its own url back
    client.registerAsPeer(network.trackerUrl);
    expect(Object.keys(network.peers)).to.deep.equal(['http://localhost:7002', 'http://localhost:7003', 'http://localhost:7001'])
    expect(client.askForSeeds(network.trackerUrl)).to.deep.equal(['http://localhost:7002', 'http://localhost:7003']);
  });
  it('requests a list of available pieces in a file from a peer', function(){
    var piece1 = {sha: 'g0f86f5hkuh', data: 'afnDFaG7KJhFHFDSs'};
    var piece2 = {sha: '175ugif65fg', data: 'u7875856guyg66fhf'};
    var peer = new Client('http://localhost:7002');
    peer.registerAsPeer(network.trackerUrl);
    peer.givePiece(piece1);
    peer.givePiece(piece2);
    expect(client.askAboutAvailablePiecesFrom(peer.url())).to.deep.equal([piece1.sha, piece2.sha]);
  });
  it('requests a piece from a peer', function(){
    var peer = new Client('http://localhost:7002');
    peer.registerAsPeer(network.trackerUrl);
    var piece = {sha: '23r23ggdf', data: '132g35haff2123'};
    peer.givePiece(piece);
    expect(client.requestPiece(peer.url(), piece.sha)).to.equal(piece.data);
  });
  it('serves a piece to a requesting peer', function(){
    client.registerAsPeer(network.trackerUrl);
    var piece = {sha: 'g4hghkjs223', data: 'g43iugh34hjhkg4'};
    client.givePiece(piece);
    var peer = new Client('http://localhost:7002');
    expect(peer.requestPiece(client.url(), piece.sha)).to.equal(piece.data)
  });
  it('asks for pieces it needs', function(){

  });
  it('assembles pieces when it has them all', function(){
    var torrentShas = ['1', '3', '2', '4'];
    var pieces = [
      {sha: '1', data: 'a'},
      {sha: '2', data: 'c'},
      {sha: '3', data: 'b'},
      {sha: '4', data: 'd'},
    ];
    pieces.forEach(function(piece){
      client.givePiece(piece);
    });
    var completeFile = client.assemblePieces(torrentShas, pieces);
    expect(completeFile).to.equal('abcd');
  });
  it('downloads all the pieces if only one peer', function(){
    var torrent = {
      "trackerUrl": "http://localhost:7000",
      "name": "file1.txt",
      "piecesSize": 1,
      "shas": ["1", "2", "3"]
    };
    var pieces = [
      {sha: '1', data: 'a'},
      {sha: '2', data: 'b'},
      {sha: '3', data: 'c'}
    ];
    var peer = new Client('http://localhost:7002');
    peer.registerAsPeer(network.trackerUrl);
    pieces.forEach(function(piece){
      peer.givePiece(piece);
    });
    expect(client.download(torrent)).to.equal('abc');
  });
  it('downloads all the pieces if split among multiple peers', function(){
    var torrent = {
      'trackerUrl': 'http://localhost:7000',
      'name': 'file1.txt',
      'piecesSize': 1,
      'shas': ['6', '5', '4', '3', '2', '1' ]
    };
    var pieces1 = [
      {sha: '1', data: 't'},
      {sha: '3', data: 'd'},
      {sha: '5', data: 'd'}
    ];
    var pieces2 = [
      {sha: '2', data: 'i'},
      {sha: '4', data: 'i'},
      {sha: '6', data: 'u'}
    ];
    var peer1 = new Client('http://localhost:7002');
    var peer2 = new Client('http://localhost:7003');
    peer1.registerAsPeer(network.trackerUrl);
    peer2.registerAsPeer(network.trackerUrl);
    pieces1.forEach(function(piece){
      peer1.givePiece(piece);
    });
    pieces2.forEach(function(piece){
      peer2.givePiece(piece);
    });
    expect(client.download(torrent)).to.equal('udidit');
  })
  it('downloads *only* the pieces it needs', function(){
    var torrent = {
      'trackerUrl': 'http://localhost:7000',
      'name': 'file1.txt',
      'piecesSize': 1,
      'shas': ['1', '2', '3', '4']
    };
    var pieces1 = [
      {sha: '1', data: 'g'},
      {sha: '3', data: 'w'},
      {sha: '5', data: 'x'}
    ];
    var pieces2 = [
      {sha: '2', data: 'g'},
      {sha: '4', data: 'p'},
      {sha: '6', data: 'z'}
    ];
    var peer1 = new Client('http://localhost:7002');
    var peer2 = new Client('http://localhost:7003');
    peer1.registerAsPeer(network.trackerUrl);
    peer2.registerAsPeer(network.trackerUrl);
    pieces1.forEach(function(piece){
      peer1.givePiece(piece);
    });
    pieces2.forEach(function(piece){
      peer2.givePiece(piece);
    });
    expect(client.download(torrent)).to.equal('ggwp');
    expect(Object.keys(client.piecesAcquired())).to.not.include('5');
  });
  context('nightmare mode–implement one or more of the following:', function(){
    xit('generates a new .torrent from a file');
    xit('verifies the authenticity of a piece');
    xit('notices new peers');
    xit('handles peer disconnection');
    xit('continues to seed after it has all pieces');
    xit('trades more with peers who reciprocate');
    xit('refactor to use ExpressJS');
  });
});
