const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

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

// GET ALL
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().collection('players').find();

    const players = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ONE
const getSingle = async (req, res) => {
  try {
    const playerId = new ObjectId(req.params.id);

    const result = await mongodb
      .getDb()
      .collection('players')
      .find({ _id: playerId });

    const players = await result.toArray();

    if (!players.length) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(players[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
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
      .collection('players')
      .insertOne(player);

    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
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

// DELETE
const deletePlayer = async (req, res) => {
  try {
    const playerId = new ObjectId(req.params.id);

    const response = await mongodb
      .getDb()
      .collection('players')
      .deleteOne({ _id: playerId });

    if (response.deletedCount > 0) {
      res.status(200).send();
    } else {
      res.status(404).json({ message: "Player not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createPlayer,
  updatePlayer,
  deletePlayer
};