import Buse from "../models/bus.model.js";

export const getBuses = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10; // Adjust limit as needed

    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const queryOptions = {};

    // Building the query based on available query parameters
    if (req.query.userId) {
      queryOptions.userId = req.query.userId;
    }
    if (req.query.type) {
      queryOptions.type = req.query.type;
    }
    if (req.query.startStation) {
      queryOptions.startStation = { $regex: new RegExp(req.query.startStation, 'i') };
    }
    if (req.query.toStation) {
      queryOptions.toStation = { $regex: new RegExp(req.query.toStation, 'i') };
    }
   

    // Querying the database with pagination and sorting
    const buses = await Buse.find(queryOptions)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      buses,
    });
  } catch (error) {
    next(error);
  }
};
