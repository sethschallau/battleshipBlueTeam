const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/create', gameController.createGame);
router.get('/active', gameController.getActiveGames);
router.post('/sendMissile', gameController.sendMissile);
router.post('/join', gameController.joinGame);
router.get('/:id', gameController.getGame);
router.post('/:id/set-pieces', gameController.setPieces);

module.exports = router;
