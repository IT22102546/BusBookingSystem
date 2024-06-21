
import { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from "react-router-dom";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";

export default function AddBus() {
  const[file,setFile]=useState(null);
  const[imageUploadProgress,setImageUploadProgress] = useState(null);
  const[imageUploadError,setImageUploadError] = useState(null);
  const [formData , setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  
 
  const handleUploadImage = () =>{
    try {
      if(!file){
        setImageUploadError('please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime()+'-'+file.name;
      const storageRef = ref(storage,fileName);
      const uploadTask = uploadBytesResumable(storageRef,file);
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
          //from the firebase
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({...formData, image: downloadURL});
          }
           
          );
        }
      );

    } catch (error) {
      setImageUploadError('Failed to upload image');
      setImageUploadProgress(null);
      console.log(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/buses/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/dashbus`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">Add Buses</h1>
        <form className="flex flex-col  gap-4" onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
        <TextInput type="text" placeholder="Company" id="company"  onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }/>
          <TextInput type="text" placeholder="Bus Number" id="busNumber"  onChange={(e) =>
              setFormData({ ...formData, busNumber: e.target.value })
            }/>    
           <TextInput type="text" placeholder="Start Station" id="startStation"  onChange={(e) =>
              setFormData({ ...formData, startStation: e.target.value })
            }/>  
             <TextInput type="text" placeholder="To Station" id="toStation"  onChange={(e) =>
              setFormData({ ...formData, toStation: e.target.value })
            }/>  
          
         </div>
         <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
            <FileInput type='file'accept='image/*' onChange={(e)=>setFile(e.target.files[0])}/>
            <Button onClick={handleUploadImage} type='button'className="bg-green-500" size='sm' outline disabled={imageUploadProgress}>
              {
                imageUploadProgress ?(
                <div className="w-16 h-16" >
                  <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}`}/>
                </div>
                ) :('Upload Image')

              }
            </Button>
          </div>
        
        {imageUploadError && (
          <Alert color='failure'>{imageUploadError}</Alert>
        )}
        {formData.image && (
          <img src={formData.image} alt="upload" className="w-full h-82 object-cover"/>
        )}
       
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>

        <Select  onChange={(e) =>setFormData({ ...formData, type: e.target.value })
            }>
            <option value='SuperLuxury'>Super Luxury</option>
            <option value='SemiLuxury'>Semi Luxury</option>
            <option value='AC'>AC</option>
          </Select>
            <TextInput type="text" placeholder="Seat Layout" id="seatLayout"  onChange={(e) =>
              setFormData({ ...formData, seatLayout: e.target.value })
            }/>
            <TextInput type="text" placeholder="Price" id="price"  onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }/>
            <TextInput type="text" placeholder="Number of Seat" id="seat"  onChange={(e) =>
              setFormData({ ...formData, seat: e.target.value })
            }/>
           
        </div>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
            <TextInput type="text" placeholder="Departure Time" id="departureTime"  onChange={(e) =>
              setFormData({ ...formData, departureTime: e.target.value })
            }/>
            <TextInput type="text" placeholder="Arrival Time" id="arrivalTime"  onChange={(e) =>
              setFormData({ ...formData, arrivalTime: e.target.value })
            }/>
             <TextInput type="text" placeholder="Travel Time" id="arrivalTime"  onChange={(e) =>
              setFormData({ ...formData, travelTime: e.target.value })
            }/>
             <TextInput type="text" placeholder="Availability" id="availability"  onChange={(e) =>
              setFormData({ ...formData, availability: e.target.value })
            }/>
            
           
        </div>
        <Button type='submit' className="bg-green-500">Add</Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
        </form>
    </div>
  )
}