import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Select, TextInput } from "flowbite-react";
import PostCard from "../components/PostCard";

export default function SearchBus() {
  const [sideBarData, setSideBarData] = useState({
    startStation: "",
    toStation: "",
  
  });

  const [filters, setFilters] = useState({
    priceRange: [500, 5000],
    busType: "",
    departureTime: "",
  });

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const startStation = urlParams.get("startStation");
    const toStation = urlParams.get("toStation");
   

    setSideBarData({
      startStation: startStation ? decodeURIComponent(startStation) : "",
      toStation: toStation ? decodeURIComponent(toStation) : "",
      
    });

    const fetchBuses = async () => {
      setLoading(true);
      try {
        const searchQuery = urlParams.toString();
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

    fetchBuses();
  }, [location.search]);

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
    urlParams.set("date", sideBarData.date);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const applyBusTypeFilter = (busType) => {
    handleFilterChange("busType", busType);
  };

  const applyDepartureTimeFilter = (departureTime) => {
    handleFilterChange("departureTime", departureTime);
  };

  return (
    <div className="flex flex-col">
      <div className="p-7 border-b border-gray-500 flex justify-center items-center text-center bg-pink-800 h-10">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-cinzel font-semibold">From:</label>
            <Select
              className="w-60"
              id="startStation"
              value={sideBarData.startStation}
              onChange={handleChange}
            >
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Chennai">Chennai</option>
              <option value="Gova">Goa</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-cinzel font-semibold">To:</label>
            <Select
              className="w-60"
              id="toStation"
              value={sideBarData.toStation}
              onChange={handleChange}
            >
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Chennai">Chennai</option>
              <option value="Gova">Goa</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-cinzel font-semibold">Date:</label>
            <TextInput
              className="w-60"
              id="date"
              type="date"
              value={sideBarData.date}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" className="bg-orange-500">
            Search Buses
          </Button>
        </form>
      </div>

      <div className="flex flex-col md:flex-row mt-5">
        <div className="w-96 md:w-1/5 p-4 border-r border-gray-500">
          <h2 className="text-2xl font-semibold mb-4 ">Filters</h2>
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-semibold">Price Range</h3>
              <input
                type="range"
                min="500"
                max="5000"
                value={filters.priceRange}
                onChange={(e) =>
                  handleFilterChange("priceRange", e.target.value)
                }
                className="w-full"
                id="priceRange"
              />
              <div className="flex justify-between text-sm">
                <span>Rs.500</span>
                <span>Rs.5000</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Bus Type</h3>
              <div className="flex gap-2">
                <button
                  className={`flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-2 cursor-pointer ${
                    filters.busType === "AC" ? "bg-blue-200" : ""
                  }`}
                  onClick={() => applyBusTypeFilter("AC")}
                >
                  AC
                </button>
                <button
                  className={`flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-2 cursor-pointer ${
                    filters.busType === "NonAc" ? "bg-blue-200" : ""
                  }`}
                  onClick={() => applyBusTypeFilter("NonAc")}
                >
                  Non AC
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Departure Time</h3>
              <div className="flex gap-2">
                <button
                  className={`flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-2 cursor-pointer ${
                    filters.departureTime === "Before 10 AM" ? "bg-blue-200" : ""
                  }`}
                  onClick={() => applyDepartureTimeFilter("Before 10 AM")}
                >
                  Before 10 AM
                </button>
                <button
                  className={`flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-2 cursor-pointer ${
                    filters.departureTime === "10 AM - 5 PM" ? "bg-blue-200" : ""
                  }`}
                  onClick={() => applyDepartureTimeFilter("10 AM - 5 PM")}
                >
                  10 AM - 5 PM
                </button>
                <button
                  className={`flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-2 cursor-pointer ${
                    filters.departureTime === "After 5 PM" ? "bg-blue-200" : ""
                  }`}
                  onClick={() => applyDepartureTimeFilter("After 5 PM")}
                >
                  After 5 PM
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-4/5">
          <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3">
            Results
          </h1>
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
