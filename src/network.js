var network = {
  trackerURL: 'http://tracker.com',
  endpoints: {}  // endpoints can register themselves.
};

var get = function(url){
  var baseURL = url.slice(0, url.indexOf('/', 2+url.indexOf('//')));
  var relativeURL = url.slice(url.indexOf('/', 2+url.indexOf('//')));
  if(url.indexOf(network.trackerURL) === 0){
    return tracker(relativeURL, this);
  } else {
    console.log(this.url(),'respondTo',url);
    return network.endpoints[baseURL].respondTo(relativeURL);
  }
};

var tracker = function(action, client){
  var actions = {
    '/seeds': function listSeeds(){
      var seeds = Object.keys(network.endpoints);
      // don't include url of requester in response
      seeds.splice(seeds.indexOf(client.url()), 1);
      return seeds;
    },
    '/seed/add': function registerSeed(client){
      network.endpoints[client.url()] = client;
      return '201 created';
    },
    '/seed/remove': function deregisterSeed(client){
      network.endpoints.delete(client.url());
      return '204 deleted';
    }
  };
  return actions[action](client);
};
