import Bus from "../models/bus.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  try {
    const {
      company,
      busNumber,
      price,
      type,
      arrivalTime,
      departureTime,
      seat,
      seatLayout,
      travelTime,
      availability,
      startStation,
      toStation
    } = req.body;

    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to add Bus'));
    }

    if (!company || !busNumber || !price || !type || !arrivalTime || !departureTime || !seat || !seatLayout || !travelTime || !availability || !startStation || !toStation) {
      return next(errorHandler(400, 'Please provide all required fields'));
    }

    if (/\s/.test(company) || /\s/.test(busNumber)) {
      return next(errorHandler(400, 'Company and bus number should not contain spaces'));
    }

    if (!/^(3x2|2x2)$/.test(seatLayout)) {
      return next(errorHandler(400, 'Seat layout should be in 3x2 or 2x2 format'));
    }

    const slug = busNumber.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    const newBus = new Bus({
      ...req.body,
      slug,
      userId: req.user.id,
    });

    const savedBus = await newBus.save();
    res.status(201).json(savedBus);
  } catch (error) {
    next(error);
  }
};

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
    res.status(200).json({ buses });
  } catch (error) {
    next(error);
  }
};

export const getStations = async (req, res, next) => {
  try {
    const startStations = await Bus.distinct("startStation");
    const toStations = await Bus.distinct("toStation");
    res.status(200).json({ startStations, toStations });
  } catch (error) {
    next(error);
  }
};

export const deleteBus = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to delete this bus'));
    }
    await Bus.findByIdAndDelete(req.params.busId);
    res.status(200).json('The bus has been deleted');
  } catch (error) {
    next(error);
  }
};


export const getallBuses = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    const queryOptions = {};

    if (req.query.searchTerm) {
      queryOptions.$or = [
        { company: { $regex: req.query.searchTerm, $options: 'i' } },
        { startStation: { $regex: req.query.searchTerm, $options: 'i' } },
        { toStation: { $regex: req.query.searchTerm, $options: 'i' } }
      ];
    }

    const buses = await Bus.find(queryOptions)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({ buses });
  } catch (error) {
    next(error);
  }
};
export const updatebus = async (req, res, next) => {
  try {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to update this bus'));
    }

    const updatedBus = await Bus.findByIdAndUpdate(
      req.params.busId,
      {
        $set: {
          company: req.body.company,
          type: req.body.type,
          busNumber: req.body.busNumber,
          toStation: req.body.toStation,
          price: req.body.price,
          arrivalTime: req.body.arrivalTime,
          departureTime: req.body.departureTime,
          startStation: req.body.startStation,
          seatLayout: req.body.seatLayout,
          seat: req.body.seat,
          image: req.body.image,
          travelTime: req.body.travelTime,
        },
      },
      { new: true }
    );
    if (!updatedBus) {
      return next(errorHandler(404, 'Bus not found'));
    }
    res.status(200).json(updatedBus);
  } catch (error) {
    next(error);
  }
};

export const getBusById = async (req, res, next) => {
  try {
    const busId = req.params.busId;
    const bus = await Bus.findById(busId);

    if (!bus) {
      return next(errorHandler(404, 'Bus not found'));
    }

    res.status(200).json(bus);
  } catch (error) {
    next(error);
  }
};
