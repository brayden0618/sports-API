const router = require('express').Router();
const teamsController = require('../controllers/teams');

router.get('/', teamsController.getAll);

router.get('/:id', teamsController.getSingle);

router.post('/', teamsController.createTeam);

router.put('/:id', teamsController.updateTeam);

router.delete('/:id', teamsController.deleteTeam);

module.exports = router;