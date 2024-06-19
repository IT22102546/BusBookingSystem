import Bus from "../models/bus.model.js";

export const getBuses = async (req, res, next) => {
  try {
    const queryOptions = {};

    if (req.query.startStation) {
      queryOptions.startStation = { $regex: new RegExp(req.query.startStation, 'i') };
    }
    if (req.query.toStation) {
      queryOptions.toStation = { $regex: new RegExp(req.query.toStation, 'i') };
    }
    if (req.query.type) {
      queryOptions.type = { $regex: new RegExp(req.query.type, 'i') };
    }
    if (req.query.company) {
      queryOptions.company = { $regex: new RegExp(req.query.company, 'i') };
    }

    let departureTimeQuery = {};
    switch (req.query.departureTime) {
      case "0:00-10:00":
        departureTimeQuery = { $lt: 10 };
        break;
      case "10:01-17:00":
        departureTimeQuery = {
          $gte: 10.01,
          $lt: 17,
        };
        break;
      case "17:01-24:00":
        departureTimeQuery = { $gte: 17.01 };
        break;
      default:
        break;
    }

    if (Object.keys(departureTimeQuery).length > 0) {
      queryOptions.departureTime = departureTimeQuery;
    }

    const buses = await Bus.find(queryOptions);

    res.status(200).json({
      buses,
    });
  } catch (error) {
    next(error);
  }
};
