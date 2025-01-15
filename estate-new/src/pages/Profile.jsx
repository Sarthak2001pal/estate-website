import React from 'react'
import { useSelector } from 'react-redux';

export default function Profile() {
  const {currentUser} = useSelector(state => state.user);
  return (
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <img src={currentUser.avatar} alt="Profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center' />
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
