#BitTorrent

API:

- askForSeeds
  get('http://localhost:7000/seeds')
  // Returns list of peer urls from tracker.

- registerAsPeer
  `post('http://localhost:7000/seed/add')`
  // Adds url to tracker's list of peers.

- askAboutAvailablePiecesFrom
  `get('http://localhost:7002/pieces')`
  // Returns array of SHAs that seed has.

- requestPiece
  `get('http://localhost:7002/piece/3453985493')`
  // Returns the piece for that SHA.

Basic Client Functionality:

- Get peers from tracker
- Find out what SHAs the peers have
- Filter out unneeded SHAs
- Request the pieces needed
- Assemble the data into the complete file
