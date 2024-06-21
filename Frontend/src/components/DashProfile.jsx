import { Alert, Button,  Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOut, updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice";
import  { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

export default function DashProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser , loading } = useSelector(state => state.user);
  const [image, setImage] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess , setUpdateSuccess] = useState(null);
  const [updateUserError , setUpdateUserError]=useState(null);
  const [showModel , setShowModel] = useState(false);
  const filePickerRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false); 
 


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (image) {
      uploadImage();
    }
  }, [image])

  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(progress.toFixed(0));
      },
      (error) => {
        setImageError("Image size should be less than 5mb");
        console.error("Upload error:", error);
        setImagePercent(null);
        setImage(null);
        setImageFileUrl(null);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
        } catch (error) {
          console.error("Error getting download URL:", error);
          setImageError("Error uploading image");
          setImagePercent(null);
          setImage(null);
          setImageFileUrl(null);
        }
      }
    );
  };
  
  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  };
  const handleSubmit = async(e)=>{
    e.preventDefault();
   
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'PUT',
        headers: {
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        setUpdateUserError(data.message);
        setUpdateSuccess(null);
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess("User profile updated successfully");
      setUpdateUserError(null);
    } catch (error) {
      dispatch(updateUserFailure(error));
      setUpdateUserError(error.message);
      setUpdateSuccess(null);
      
    }

  }
  const handleDeleteUser = async ()=>{
    try {
      dispatch (deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method : "DELETE"
      });
      const data  = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure());
        return;
      }
      dispatch(deleteUserSuccess());
      navigate('/sign-in');
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  }
  const handleSignOut = async () => {
    try {
      await fetch('/api/user/signout');
      dispatch(signOut());
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
};
return (
  <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              ref={filePickerRef}
              hidden
          />
          <div
              className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
              onClick={() => filePickerRef.current.click()}
          >
              {imagePercent > 0 && imagePercent < 100 && (
                  <CircularProgressbar
                      value={imagePercent}
                      text={`${imagePercent}%`}
                      strokeWidth={5}
                      styles={{
                          root: {
                              width: '100%',
                              height: '100%',
                              position: 'absolute',
                          },
                          path: {
                              stroke: `rgba(62, 152, 199, ${imagePercent / 100})`,
                          },
                      }}
                      aria-label='Uploading Image'
                  />
              )}
              <img
                  src={imageFileUrl || currentUser.profilePicture}
                  alt='user'
                  className={`rounded-full w-full h-full border-8 border-[lightgray] ${imagePercent && imagePercent < 100 ? 'opacity-60' : ''}`}
                  aria-label='User Profile Image'
              />
          </div>
          {imageError && <Alert color='failure'>{imageError}</Alert>}

          <TextInput
              type='text'
              id='username'
              placeholder='username'
              defaultValue={currentUser.username}
              onChange={handleChange}
          />
          <TextInput
              type='text'
              id='firstname'
              placeholder='firstname'
              defaultValue={currentUser.firstname}
              onChange={handleChange}
          />
          <TextInput
              type='text'
              id='lastname'
              placeholder='lastname'
              defaultValue={currentUser.lastname}
              onChange={handleChange}
          />
          <TextInput
              type='email'
              id='email'
              placeholder='email'
              defaultValue={currentUser.email}
              onChange={handleChange}
          />
          <TextInput
              type='text'
              id='mobile'
              placeholder='mobile'
              defaultValue={currentUser.mobile}
              onChange={handleChange}
          />
          <div className='relative'>
              <TextInput type={showPassword ? 'text' : 'password'} placeholder='Password' id='password' onChange={handleChange} />
              <button type='button' className='absolute top-2 right-3 focus:outline-none' onClick={togglePasswordVisibility}>
                  {showPassword ? (
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-gray-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15.818 8.818a4 4 0 0 1 0 6.364M5.636 8.818a4 4 0 0 1 0 6.364M11.998 5.996v.01' />
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 18.1V12a3.999 3.999 0 0 1 3.999-4 3.999 3.999 0 0 1 3.999 4v6.1c0 2.21-1.791 4-3.999 4a3.999 3.999 0 0 1-3.999-4z' />
                      </svg>
                  ) : (
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-gray-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 15a7 7 0 01-7-7M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                  )}
              </button>
          </div>

          <Button type='submit' className='bg-green-500' disabled={loading}>
              {loading ? 'Loading..' : 'Update Account'}
          </Button>
          {currentUser.isAdmin && (
          <Link to='/addbus'>
            <Button
              type='button'
              className='bg-green-500 w-full'
              outline
            >
              Add Buses
            </Button>
          </Link>
        )}   
      </form>

      <div className='text-red-500 flex justify-between mt-5'>
          <span onClick={() => setShowModel(true)} className='cursor-pointer'>
              Delete Account
          </span>
          <span onClick={handleSignOut} className='cursor-pointer'>
              Sign Out
          </span>
      </div>

      {updateSuccess && (
        <Alert color='success' className='mt-5'>
          {updateSuccess}
        </Alert>
      )}
       {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
      <Modal show={showModel} onClose={()=>setShowModel(false)} popup size='md' className="items-center py-60 pl-52">
          <Modal.Header/>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto"/>
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">Are you sure you want to Delete your Account</h3>
            </div>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I am sure
              </Button>
              <Button color='gray' onClick={() => setShowModel(false)}>
                No, cancel
              </Button>
            </div>
          </Modal.Body>
      </Modal>

  </div>
);

}