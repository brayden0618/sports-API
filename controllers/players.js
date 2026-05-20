const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('players').find();

    result.toArray().then((players) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(players);
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getSingle = async (req, res) => {
  try {
    const playerId = new ObjectId(req.params.id);

    const result = await mongodb
      .getDb()
      .db()
      .collection('players')
      .find({ _id: playerId });

    result.toArray().then((players) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(players[0]);
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const validatePlayer = (player) => {
  if (
    !player.firstName ||
    !player.lastName ||
    !player.age ||
    !player.team ||
    !player.position ||
    !player.jerseyNumber ||
    !player.nationality
  ) {
    return "Missing required player fields";
  }
  return null;
};

const createPlayer = async (req, res) => {
  try {
    const player = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      team: req.body.team,
      position: req.body.position,
      jerseyNumber: req.body.jerseyNumber,
      nationality: req.body.nationality,
      goals: req.body.goals || 0,
      assists: req.body.assists || 0
    };

    const error = validatePlayer(player);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const response = await mongodb
      .getDb()
      .db()
      .collection('players')
      .insertOne(player);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: "Failed to create player" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updatePlayer = async (req, res) => {
  try {
    const playerId = new ObjectId(req.params.id);

    const player = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      team: req.body.team,
      position: req.body.position,
      jerseyNumber: req.body.jerseyNumber,
      nationality: req.body.nationality,
      goals: req.body.goals || 0,
      assists: req.body.assists || 0
    };

    const error = validatePlayer(player);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const response = await mongodb
      .getDb()
      .db()
      .collection('players')
      .replaceOne({ _id: playerId }, player);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Player not found or not updated" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePlayer = async (req, res) => {
  try {
    const playerId = new ObjectId(req.params.id);

    const response = await mongodb
      .getDb()
      .db()
      .collection('players')
      .deleteOne({ _id: playerId });

    if (response.deletedCount > 0) {
      res.status(200).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getAll,
  getSingle,
  createPlayer,
  updatePlayer,
  deletePlayer
};