const router = require('express').Router();
const playersController = require('../controllers/players');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', playersController.getAll);

router.get('/:id', playersController.getSingle);

router.post('/', auth, playersController.createPlayer);

router.put('/:id', auth, playersController.updatePlayer);

router.delete('/:id', auth, playersController.deletePlayer);

module.exports = router;