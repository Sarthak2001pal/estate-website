import React from 'react'
import { useSelector } from 'react-redux';
import { useRef ,useState, useEffect } from 'react';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux'; 
import { data, Link } from 'react-router-dom';
export default function Profile() {
  const fileref = useRef(null);
  const {currentUser,  loading, error} = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [profileImage, setProfileImage] = useState(currentUser.avatar);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [fileUploadError, setfileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  }, [file]);

  function handleFileUpload(file) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "mern-estate");
    data.append("cloud_name", "dtfxu8ofx");
  
    // Create an instance of XMLHttpRequest
    const xhr = new XMLHttpRequest();
  
    xhr.open("POST", "https://api.cloudinary.com/v1_1/dtfxu8ofx/image/upload");
  
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete); // Ensure setProgress is defined
      }
    });
  
    // Add an onload handler to handle the response
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setProfileImage(response.url);
        setFormData({...formData, avatar: response.url});
        setUploadError(null);
      } else {
        setUploadError("Upload failed with status: " + xhr.status);
      }
      setProgress(0);
    };
  
    // Add an error handler
    xhr.onerror = () => {
      console.error("An error occurred during the upload");
    };
  
    // Send the request with the FormData
    xhr.send(data);
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(currentUser._id);
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess());
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data.message));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };
  return (
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input  onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileref} hidden/>
        <img onClick={()=>fileref.current.click()} src={ profileImage} alt="Profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center' />
        <p className="text-sm self-center">
          {
            fileUploadError ? (
              <span className="text-red-700">Error Image Upload</span>
            ) : progress > 0 && progress < 100 ? (
              <span className="text-slate-700">{`Uploading ${progress}%`}</span>
            ) : progress === 100 ? (
              <span className="text-green-700">Image Successfully uploaded!</span>
            ) : ''
          }
        </p>
        <input onChange={handleChange} type="text" placeholder='username' id='username'className='border p-3 rounded-lg' defaultValue={currentUser.username}/>
        <input onChange={handleChange} type="email" placeholder='email' id='email'className='border p-3 rounded-lg' defaultValue={currentUser.email}/>
        <input onChange={handleChange} type="text" placeholder='password' id='password'className='border p-3 rounded-lg'/>
        <button
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
          </button>
          <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-500 cursor-pointer hover:text-red-800'>Delete account</span>
        <span onClick={handleSignOut} className='text-red-500 cursor-pointer hover:text-red-800'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>
        Show Listings
      </button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>
      {userListings &&
        userListings.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
  
              <div className='flex flex-col item-center'>
                <button className='text-red-700 uppercase'>Delete</button>
                <button className='text-green-700 uppercase'>Edit</button>
              </div>
            </div>
          ))}
        </div>}
    </div>
  )
}
