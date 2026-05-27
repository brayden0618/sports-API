const router = require('express').Router();
const teamsController = require('../controllers/teams');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', teamsController.getAll);

router.get('/:id', teamsController.getSingle);

router.post('/', auth, teamsController.createTeam);

router.put('/:id', auth, teamsController.updateTeam);

router.delete('/:id', auth, teamsController.deleteTeam);

module.exports = router;