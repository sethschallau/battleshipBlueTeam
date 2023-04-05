const { Game } = require('../models');
const { User } = require('../models');

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
        return res.status(404).json({ message: 'Game not found' });
      }
  
      const playerIndex = game.players.findIndex(player => player.username === username);
  
      if (playerIndex === -1) {
        return res.status(400).json({ message: 'Player not found in the game' });
      }
  
      game.ships[playerIndex].positions = ships;
  
      // Check if both players have set their pieces
      let allPlayersSet = true;
      for (const ship of game.ships) {
        if (ship.positions.length === 0) {
          allPlayersSet = false;
          break;
        }
      }
  
      // If both players have set their pieces, update the game status to 'playing'
      if (allPlayersSet) {
        game.status = 'playing';
      }
  
      // Save the updated game to the database
      await game.save();
  
      res.status(200).json({ message: 'Pieces set successfully', gameStatus: game.status });
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
      game.currentPlayer = opponent;
      await game.save();
      res.status(200).json({ result: isHit ? 'hit' : 'miss' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending missile', error });
    }
  };

  exports.joinGame = async (req, res) => {
    try {
      const { gameId, username } = req.body;
      const game = await Game.findById(gameId).populate('players');
  
      if (!game) {
        return res.status(404).json({ message: 'Game not found' });
      }
  
      if (game.players.length >= 2) {
        return res.status(400).json({ message: 'Game already has two players' });
      }
  
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      game.players.push(user);
      await game.save();
  
      res.status(200).json({ message: 'Player added successfully', game });
    } catch (error) {
      res.status(500).json({ message: 'Error joining game', error });
    }
  };
  