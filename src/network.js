// You shouldn't change anything in here, but you can reference it.
var network = {
  trackerUrl: 'http://localhost:7000',
  peers: {}  // peers can register themselves.
};

var get = function(url){
  var baseUrl = url.slice(0, url.indexOf('/', 2+url.indexOf('//')));
  var relativeUrl = url.slice(url.indexOf('/', 2+url.indexOf('//')));
  // console.log(this.url(), 'GET', url);
  if(url.indexOf(network.trackerUrl) === 0){
    return tracker(relativeUrl, this);
  } else {
    return network.peers[baseUrl].respondTo(relativeUrl);
  }
};

var tracker = function(action, client){
  var actions = {
    '/seeds': function listSeeds(){
      var seeds = Object.keys(network.peers);
      // don't include url of requester in response
      var clientUrlIndex = seeds.indexOf(client.url());
      if(clientUrlIndex !== -1){
        seeds.splice(clientUrlIndex, 1);
      }
      return seeds;
    },
    '/seed/add': function registerSeed(client){
      network.peers[client.url()] = client;
      return network.peers;
    },
    '/seed/remove': function deregisterSeed(client){
      network.peers.delete(client.url());
      return network.peers;
    }
  };
  return actions[action](client);
};
