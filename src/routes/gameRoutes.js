const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/create', gameController.createGame);
router.get('/active', gameController.getActiveGames);
router.post('/sendMissile', gameController.sendMissile);
router.post('/join', gameController.joinGame);
router.post('/set-pieces', gameController.setPieces);
router.get('/:id', gameController.getGame);

module.exports = router;
