import React from 'react'
import { useSelector } from 'react-redux';
import { useRef ,useState, useEffect } from 'react';

export default function Profile() {
  const fileref = useRef(null);
  const {currentUser} = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [profileImage, setProfileImage] = useState(currentUser.avatar);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [fileUploadError, setfileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

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
  
  return (
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
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
        <input type="text" placeholder='username' id='username'className='border p-3 rounded-lg'/>
        <input type="email" placeholder='email' id='email'className='border p-3 rounded-lg'/>
        <input type="text" placeholder='password' id='password'className='border p-3 rounded-lg'/>
        <button className='bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-500 cursor-pointer hover:text-red-800'>Delete account</span>
        <span className='text-red-500 cursor-pointer hover:text-red-800'>Sign out</span>
      </div>
    </div>
  )
}
