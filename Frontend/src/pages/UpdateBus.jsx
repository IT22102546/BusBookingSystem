import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";

export default function UpdateBus() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    busNumber: '',
    startStation: '',
    toStation: '',
    description: '',
    type: '',
    seatLayout: '',
    price: '',
    seat: '',
    departureTime: '',
    arrivalTime: '',
    travelTime: '',
    availability: ''
  });
  const [publishError, setPublishError] = useState(null);
  const { busId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await fetch(`/api/buses/getbus/${busId}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch bus details");
        }
        if (data) {
          setFormData({
            ...formData,
            company: data.company || '',
            busNumber: data.busNumber || '',
            startStation: data.startStation || '',
            toStation: data.toStation || '',
            description: data.description || '',
            type: data.type || '',
            seatLayout: data.seatLayout || '',
            price: data.price || '',
            seat: data.seat || '',
            departureTime: data.departureTime || '',
            arrivalTime: data.arrivalTime || '',
            travelTime: data.travelTime || '',
            availability: data.availability || ''
          });
        } else {
          setPublishError('Bus not found');
        }
      } catch (error) {
        console.error("Error fetching bus:", error);
        setPublishError("Failed to fetch bus details");
      }
    };

    fetchBus(); 
  }, [busId]);

  const handleUploadImage = () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          console.error("Upload error:", error);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Failed to upload image');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/buses/updatebus/${busId}/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update bus");
      }
      setPublishError(null);
      navigate("/dashboard?tab=buses");
    } catch (error) {
      console.error("Error updating bus:", error);
      setPublishError(error.message || "Something went wrong");
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Bus</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Company"
            id="company"
            className="flex-1"
            value={formData.company || ''}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
          <TextInput
            type="text"
            placeholder="Bus Number"
            id="busNumber"
            value={formData.busNumber || ""}
            onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
          />
          <TextInput
            type="text"
            placeholder="Start Station"
            id="startStation"
            value={formData.startStation || ""}
            onChange={(e) => setFormData({ ...formData, startStation: e.target.value })}
          />

          <TextInput
            type="text"
            placeholder="To Station"
            id="toStation"
            value={formData.toStation || ""}
            onChange={(e) => setFormData({ ...formData, toStation: e.target.value })}
          />
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            onClick={handleUploadImage}
            type="button"
            className="bg-green-500"
            size="sm"
            outline
            disabled={imageUploadProgress !== null}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={parseInt(imageUploadProgress)}
                  text={`${imageUploadProgress || 0}`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>

        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-82 object-cover"
          />
        )}

        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <Select
            value={formData.type || ""}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="">Select Type</option>
            <option value="Ac">AC</option>
            <option value="Normal">Non AC</option>
          </Select>
          <TextInput
            type="text"
            placeholder="Seat Layout"
            id="seatLayout"
            value={formData.seatLayout || ""}
            onChange={(e) => setFormData({ ...formData, seatLayout: e.target.value })}
          />
          <TextInput
            type="text"
            placeholder="Price"
            id="price"
            value={formData.price || ""}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <TextInput
            type="text"
            placeholder="Number of Seat"
            id="seat"
            value={formData.seat || ""}
            onChange={(e) => setFormData({ ...formData, seat: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Departure Time"
            id="departureTime"
            value={formData.departureTime || ""}
            onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
          />
          <TextInput
            type="text"
            placeholder="Arrival Time"
            id="arrivalTime"
            value={formData.arrivalTime || ""}
            onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
          />
          <TextInput
            type="text"
            placeholder="Travel Time"
            id="travelTime"
            value={formData.travelTime || ""}
            onChange={(e) => setFormData({ ...formData, travelTime: e.target.value })}
          />
          <TextInput
            type="text"
            placeholder="Availability"
            id="availability"
            value={formData.availability || ""}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          />
        </div>

        <Button type="submit" className="bg-green-500">
          Update
        </Button>

        {publishError && <Alert className="mt-5" color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
