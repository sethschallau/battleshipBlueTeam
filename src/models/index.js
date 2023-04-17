const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// User schema
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  games: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
  wins: { type: Number, default: 0 },
});

//Chat schema
const ChatSchema = new Schema({
  gameId: { type: String, ref: 'Game'}, 
  chats: [
    {
      playerUserName: { type: String, required: true },
      imageFile: { type: String, required: true},
      note: { type: String, required: true}
    }
  ]
});

// Game schema
const GameSchema = new Schema({
  status: { type: String, enum: ['waiting', 'playing', 'completed', 'abandoned'], required: true },
  players: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  currentPlayer: { type: Schema.Types.ObjectId, ref: 'User' },
  ships: [
    {
      playerUserName: { type: String, required: true },
      positions: [
        {
          coords: [
            {
              x: { type: Number, required: true },
              y: { type: Number, required: true },
            },
          ],
          shipType: { type: String, required: true },
          direction: { type: String, enum: ['l', 'r', 'u', 'd'], required: true },
        },
      ],      
    },
  ],
  hits: [
    {
      playerUserName: { type: String, required: true },
      coordinates: [{ x: { type: Number, required: true }, y: { type: Number, required: true } }],
    },
  ],
  misses: [
    {
      playerUserName: { type: String, required: true },
      coordinates: [{ x: { type: Number, required: true }, y: { type: Number, required: true } }],
    },
  ],
});

const User = mongoose.model('User', UserSchema);
const Game = mongoose.model('Game', GameSchema);
const Chat = mongoose.model('Chat', ChatSchema);
module.exports = { User, Game, Chat };
