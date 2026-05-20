const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('teams').find();

    result.toArray().then((teams) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(teams);
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getSingle = async (req, res) => {
  try {
    const teamId = new ObjectId(req.params.id);

    const result = await mongodb
      .getDb()
      .db()
      .collection('teams')
      .find({ _id: teamId });

    result.toArray().then((teams) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(teams[0]);
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const validateTeam = (team) => {
  if (!team.name || !team.city || !team.coach || !team.founded) {
    return "Missing required team fields";
  }
  return null;
};

const createTeam = async (req, res) => {
  try {
    const team = {
      name: req.body.name,
      city: req.body.city,
      founded: req.body.founded,
      coach: req.body.coach
    };

    const error = validateTeam(team);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const response = await mongodb
      .getDb()
      .db()
      .collection('teams')
      .insertOne(team);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: "Failed to create team" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTeam = async (req, res) => {
  try {
    const teamId = new ObjectId(req.params.id);

    const team = {
      name: req.body.name,
      city: req.body.city,
      founded: req.body.founded,
      coach: req.body.coach
    };

    const error = validateTeam(team);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const response = await mongodb
      .getDb()
      .db()
      .collection('teams')
      .replaceOne({ _id: teamId }, team);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Team not found or not updated" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const teamId = new ObjectId(req.params.id);

    const response = await mongodb
      .getDb()
      .db()
      .collection('teams')
      .deleteOne({ _id: teamId });

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
  createTeam,
  updateTeam,
  deleteTeam
};