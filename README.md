#BitTorrent


- Get peers from tracker
- Find out what SHAs the peers have
- Filter out unneeded SHAs
- Request the pieces needed
- Assemble the data into the complete file

API:

- askForSeeds
  get('http://localhost:7000/seeds')
  // Returns list of seed urls.

- registerAsPeer
  `post('http://localhost:7000/seed/add')`
  // Adds posting url from list of seeds.

- deregisterAsSeed
  `post('http://localhost:7000/seed/remove')`
  // Removes posting url from list of seeds.

- askAboutAvailablePieces
  `get('http://localhost:7002/file/dilbert/pieces')`
  // Returns array of piece SHAs that seed has.

- requestPiece
  `get('http://localhost:7002/file/dilbert/piece/3453985493')`
  // Returns the data for that piece.
