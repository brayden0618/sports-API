const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const validateTeam = (team) => {
  if (!team.name || !team.city || !team.coach || !team.founded) {
    return "Missing required team fields";
  }
  return null;
};

// GET ALL
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().collection('teams').find();

    const teams = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ONE
const getSingle = async (req, res) => {
  try {
    const teamId = new ObjectId(req.params.id);

    const result = await mongodb
      .getDb()
      .collection('teams')
      .find({ _id: teamId });

    const teams = await result.toArray();

    if (!teams.length) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(teams[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
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
      .collection('teams')
      .insertOne(team);

    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
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

// DELETE
const deleteTeam = async (req, res) => {
  try {
    const teamId = new ObjectId(req.params.id);

    const response = await mongodb
      .getDb()
      .collection('teams')
      .deleteOne({ _id: teamId });

    if (response.deletedCount > 0) {
      res.status(200).send();
    } else {
      res.status(404).json({ message: "Team not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createTeam,
  updateTeam,
  deleteTeam
};