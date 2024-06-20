import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Select, TextInput } from "flowbite-react";
import PostCard from "../components/PostCard";

export default function SearchBus() {
  const [sideBarData, setSideBarData] = useState({
    startStation: "",
    toStation: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [filters, setFilters] = useState({
    priceRange: [500, 5000],
    type: "",
    departureTime: "",
    company: "",
  });

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("departureTime");
  const [sortOrder, setSortOrder] = useState("asc");
  const [startStations, setStartStations] = useState([]);
  const [toStations, setToStations] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch("/api/buses/stations");
        if (!res.ok) {
          throw new Error("Failed to fetch stations");
        }
        const data = await res.json();
        setStartStations(data.startStations || []);
        setToStations(data.toStations || []);
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };

    fetchStations();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const startStation = urlParams.get("startStation") || "";
    const toStation = urlParams.get("toStation") || "";
    const type = urlParams.get("type") || "";
    const departureTime = urlParams.get("departureTime") || "";
    const company = urlParams.get("company") || "";

    setSideBarData({
      startStation: decodeURIComponent(startStation),
      toStation: decodeURIComponent(toStation),
      date: new Date().toISOString().split("T")[0],
    });

    setFilters({
      ...filters,
      type,
      departureTime,
      company,
    });

    fetchBuses(startStation, toStation, type, departureTime, company);


  }, [location.search]);

  useEffect(() => {
    const sortedBuses = sortBuses(buses);
    setBuses(sortedBuses);
  }, [buses, sortBy, sortOrder]);
  

  const fetchBuses = async (start, to, type, depTime, company) => {
    setLoading(true);
    try {
      const searchQuery = new URLSearchParams({
        startStation: start,
        toStation: to,
        type,
        departureTime: depTime,
        company,
        minPrice: filters.priceRange[0], 
        maxPrice: filters.priceRange[1], 
      }).toString();

      const res = await fetch(`/api/buses/getbuses?${searchQuery}`);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setBuses(data.buses || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching buses:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSideBarData({ ...sideBarData, [id]: value });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({ ...filters, [filterType]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("startStation", encodeURIComponent(sideBarData.startStation));
    urlParams.set("toStation", encodeURIComponent(sideBarData.toStation));

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const applyPriceRangeFilter = (event) => {
    const newMaxPrice = parseInt(event.target.value);
    setFilters({ ...filters, priceRange: [500, newMaxPrice] });
    fetchBuses(
      sideBarData.startStation,
      sideBarData.toStation,
      filters.type,
      filters.departureTime,
      filters.company
    );
  };

  const applyBusTypeFilter = (type) => {
    handleFilterChange("type", type);
    fetchBuses(
      sideBarData.startStation,
      sideBarData.toStation,
      type,
      filters.departureTime,
      filters.company
    );
  };

  const applyDepartureTimeFilter = (departureTime) => {
    let depTime = "";
    switch (departureTime) {
      case "Before 10 AM":
        depTime = "0:00-10:00";
        break;
      case "10 AM - 5 PM":
        depTime = "10:01-17:00";
        break;
      case "After 5 PM":
        depTime = "17:01-24:00";
        break;
      default:
        depTime = "";
        break;
    }
    handleFilterChange("departureTime", depTime);
    fetchBuses(
      sideBarData.startStation,
      sideBarData.toStation,
      filters.type,
      depTime,
      filters.company
    );
  };

  const applyCompanyFilter = (company) => {
    handleFilterChange("company", company);
    fetchBuses(
      sideBarData.startStation,
      sideBarData.toStation,
      filters.type,
      filters.departureTime,
      company
    );
  };

  const handleSortChange = (criteria) => {
    if (criteria === sortBy) {
      setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(criteria);
      setSortOrder("asc");
    }
  };
  

  const sortBuses = (buses) => {
    return buses.sort((a, b) => {
      if (sortBy === "departureTime") {
        const timeA = a.departureTime.split(":");
        const timeB = b.departureTime.split(":");
        return sortOrder === "asc"
          ? timeA[0] - timeB[0] || timeA[1] - timeB[1]
          : timeB[0] - timeA[0] || timeB[1] - timeA[1];
      } else if (sortBy === "arrivalTime") {
        const timeA = a.arrivalTime.split(":");
        const timeB = b.arrivalTime.split(":");
        return sortOrder === "asc"
          ? timeA[0] - timeB[0] || timeA[1] - timeB[1]
          : timeB[0] - timeA[0] || timeB[1] - timeA[1];
      } else if (sortBy === "rating") {
        return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
      } else if (sortBy === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      }
      return 0; 
    });
  };
  

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b border-gray-500 flex flex-col md:flex-row justify-center items-center text-center bg-green-300">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 md:gap-8 w-full max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-2 w-full">
            <label className="whitespace-nowrap font-cinzel font-semibold">From:</label>
            <Select
              className="w-full md:w-60"
              id="startStation"
              value={sideBarData.startStation}
              onChange={handleChange}
            >
              {startStations.map((station, index) => (
                <option key={index} value={station}>
                  {station}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2 w-full">
            <label className="whitespace-nowrap font-cinzel font-semibold">To:</label>
            <Select
              className="w-full md:w-60"
              id="toStation"
              value={sideBarData.toStation}
              onChange={handleChange}
            >
              {toStations.map((station, index) => (
                <option key={index} value={station}>
                  {station}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2 w-full">
            <label className="whitespace-nowrap font-cinzel font-semibold">Date:</label>
            <TextInput
              className="w-full md:w-60"
              id="date"
              type="date"
              value={sideBarData.date}
              onChange={handleChange}
            />
          </div>
          <div className="p-2 w-full md:w-auto">
            <Button type="submit" className="bg-green-500 w-full">
              Search
            </Button>
          </div>
        </form>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center bg-blue-100 p-4 font-cinzel ">
  <div className="flex items-center mb-2 sm:mb-0">
    <div className="text-lg font-bold mr-5">Sorting By:</div>
    <div className="flex gap-4">
      <button
        className={`px-4 py-2 border border-gray-300 rounded-lg ${sortBy === "departureTime" ? "bg-blue-200" : ""}`}
        onClick={() => handleSortChange("departureTime")}
      >
        Departure Time
        {sortBy === "departureTime" && (
          <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
        )}
      </button>
      <button
        className={`px-4 py-2 border border-gray-300 rounded-lg ${sortBy === "arrivalTime" ? "bg-blue-200" : ""}`}
        onClick={() => handleSortChange("arrivalTime")}
      >
        Arriving Time
        {sortBy === "arrivalTime" && (
          <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
        )}
      </button>
      <button
        className={`px-4 py-2 border border-gray-300 rounded-lg ${sortBy === "price" ? "bg-blue-200" : ""}`}
        onClick={() => handleSortChange("price")}
      >
        Price
        {sortBy === "price" && (
          <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
        )}
      </button>
    </div>
  </div>
  <div className="flex items-center text-green-600">
    <img src="/img/bus.png" className="w-5 h-6 mr-2" alt="Bus icon" />
    <span className="text-lg font-semibold"> Showing {buses.length} Buses on this Route </span>
  </div>
</div>


      <div className="flex flex-col md:flex-row mt-5">
        <div className="w-full md:w-1/5 p-4 border-r border-gray-500 bg-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Filters</h2>
          <div className="flex flex-col gap-4">
            <div className="bg-gray-300 rounded-md mb-2 p-3">
              <h3 className="font-semibold mb-2">Price Range</h3>
              <input
                type="range"
                min="500"
                max="5000"
                value={filters.priceRange[1]}
                onChange={applyPriceRangeFilter}
                className="w-full"
                id="priceRange"
              />
              <div className="flex justify-between text-sm">
                <span>Rs.500</span>
                <span>Rs.5000</span>
              </div>
            </div>
            <div className="bg-gray-300 rounded-md mb-2 p-3">
              <h3 className="font-semibold mb-2">Bus Type</h3>
              <div className="flex gap-2">
                <button 
                  className={`flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-2 cursor-pointer ${filters.type === "SuperLuxury" ? "bg-blue-200" : ""}`}
                  onClick={() => applyBusTypeFilter("SuperLuxury")}
                >
                  Super Luxury
                </button>
                <button
                  className={`flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-2 cursor-pointer ${filters.type === "SemiLuxury" ? "bg-blue-200" : ""}`}
                  onClick={() => applyBusTypeFilter("SemiLuxury")}
                >
                  Semi Luxury
                </button>
                <button
                  className={`flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-2 cursor-pointer ${filters.type === "Ac" ? "bg-blue-200" : ""}`}
                  onClick={() => applyBusTypeFilter("Ac")}
                >
                  AC
                </button>
              </div>
            </div>
            <div className="bg-gray-300 rounded-md mb-2 p-3">
              <h3 className="font-semibold mb-2">Departure Time</h3>
              <div className="flex gap-2">
                <button
                  className={`flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-2 cursor-pointer ${filters.departureTime === "0:00-10:00" ? "bg-blue-200" : ""}`}
                  onClick={() => applyDepartureTimeFilter("Before 10 AM")}
                >
                  Before 10 AM
                </button>
                <button
                  className={`flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-2 cursor-pointer ${filters.departureTime === "10:01-17:00" ? "bg-blue-200" : ""}`}
                  onClick={() => applyDepartureTimeFilter("10 AM - 5 PM")}
                >
                  10 AM - 5 PM
                </button>
                <button
                  className={`flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-2 cursor-pointer ${filters.departureTime === "17:01-24:00" ? "bg-blue-200" : ""}`}
                  onClick={() => applyDepartureTimeFilter("After 5 PM")}
                >
                  After 5 PM
                </button>
              </div>
            </div>
            <div className="bg-gray-300 rounded-md mb-2 p-3">
              <h3 className="font-semibold mb-2">Bus Company</h3>
              <div className="flex gap-2">
                <button 
                  className={`flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-2 cursor-pointer ${filters.company === "Bharathi_Travels" ? "bg-blue-200" : ""}`}
                  onClick={() => applyCompanyFilter("Bharathi_Travels")}
                >
                  Bharathi Travels
                </button>
                <button
                  className={`flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-2 cursor-pointer ${filters.company === "VKV_Travels" ? "bg-blue-200" : ""}`}
                  onClick={() => applyCompanyFilter("VKV_Travels")}
                >
                  VKV Travels
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-4/5">
          <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3">Results</h1>
          <div className="p-7 flex flex-wrap gap-4">
            {loading ? (
              <p className="text-xl text-gray-500">Loading...</p>
            ) : buses.length === 0 ? (
              <p className="text-xl text-gray-500">No Buses Found.</p>
            ) : (
              buses.map((bus) => <PostCard key={bus._id} bus={bus} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
