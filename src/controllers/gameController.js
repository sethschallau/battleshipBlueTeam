const { Game } = require('../models');

exports.getGame = async (req, res) => {
  try {
    const gameId = req.params.id;
    const game = await Game.findById(gameId).populate('players').populate('currentPlayer');
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game data', error });
  }
};

exports.getActiveGames = async (req, res) => {
  try {
    const activeGames = await Game.find({ status: { $in: ['waiting', 'playing'] } })
      .populate('players')
      .populate('currentPlayer')
      .select('id players');

    res.status(200).json(activeGames);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active games data', error });
  }
};


  exports.createGame = async (req, res) => {
    try {
      const newGame = new Game({
        status: 'waiting',
        players: [req.body.player],
        currentPlayer: req.body.player,
      });
      await newGame.save();
      res.status(201).json(newGame);
    } catch (error) {
      res.status(500).json({ message: 'Error creating game', error });
    }
  };
  
  // This is the format we should use for set pieces:
  // {
  //   "gameId": "your_game_id",
  //   "username": "player_username",
  //   "ships": [
  //     {
  //       "coords": [
  //         { "x": 0, "y": 0 },
  //         { "x": 1, "y": 0 }
  //       ],
  //       "shipType": "Battleship",
  //       "direction": "r"
  //     },
  //     {
  //       "coords": [
  //         { "x": 2, "y": 2 },
  //         { "x": 2, "y": 3 }
  //       ],
  //       "shipType": "Destroyer",
  //       "direction": "u"
  //     }
  //   ]
  // }

  exports.setPieces = async (req, res) => {
    try {
      const { gameId, username, ships } = req.body;
  
      const game = await Game.findById(gameId);
      if (!game) {
        res.status(404).json({ message: 'Game not found' });
        return;
      }
  
      const playerIndex = game.ships.findIndex((entry) => entry.playerUserName === username);
      if (playerIndex === -1) {
        game.ships.push({ playerUserName: username, positions: ships });
      } else {
        game.ships[playerIndex].positions = ships;
      }
  
      await game.save();
      res.status(200).json(game);
    } catch (error) {
      res.status(500).json({ message: 'Error setting pieces', error });
    }
  };
  
  exports.sendMissile = async (req, res) => {
    try {
      const { gameId, username, coordinate } = req.body;
  
      const game = await Game.findById(gameId);
      if (!game) {
        res.status(404).json({ message: 'Game not found' });
        return;
      }
  
      const opponent = game.ships.find((entry) => entry.playerUserName !== username);
      if (!opponent) {
        res.status(404).json({ message: 'Opponent not found' });
        return;
      }
  
      let isHit = false;
      for (const ship of opponent.positions) {
        for (const coord of ship.coords) {
          if (coord.x === coordinate.x && coord.y === coordinate.y) {
            isHit = true;
            break;
          }
        }
        if (isHit) break;
      }
  
      const playerIndex = game.hits.findIndex((entry) => entry.playerUserName === username);
      if (isHit) {
        if (playerIndex === -1) {
          game.hits.push({ playerUserName: username, coordinates: [coordinate] });
        } else {
          game.hits[playerIndex].coordinates.push(coordinate);
        }
      } else {
        const missIndex = game.misses.findIndex((entry) => entry.playerUserName === username);
        if (missIndex === -1) {
          game.misses.push({ playerUserName: username, coordinates: [coordinate] });
        } else {
          game.misses[missIndex].coordinates.push(coordinate);
        }
      }
  
      await game.save();
      res.status(200).json({ result: isHit ? 'hit' : 'miss' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending missile', error });
    }
  };
  