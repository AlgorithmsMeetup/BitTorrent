#BitTorrent

API:

- askForSeeds
  get('http://localhost:4000/seeds')
  // Returns list of seed urls.

- registerAsPeer
  `post('http://localhost:4000/seed/add')`
  // Adds posting url from list of seeds.

- deregisterAsSeed
  `post('http://localhost:4000/seed/remove')`
  // Removes posting url from list of seeds.

- askAboutAvailablePieces
  `get('http://localhost:4003/file/dilbert/pieces')`
  // Returns array of piece SHAs that seed has.

- requestPiece
  `get('http://localhost:4003/file/dilbert/piece/3453985493')`
  // Returns the data for that piece SHAs.
