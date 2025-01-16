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
} from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux'; 
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
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-500 cursor-pointer hover:text-red-800'>Delete account</span>
        <span className='text-red-500 cursor-pointer hover:text-red-800'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
    </div>
  )
}
