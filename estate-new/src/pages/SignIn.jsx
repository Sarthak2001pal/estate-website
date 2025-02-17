import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js';
import OAuth from '../components/OAuth.jsx';


export default function SignUp() {
  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatchEvent = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
  });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatchEvent(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();  
      if (data.success === false){
        dispatchEvent(signInFailure(data.message));
        return;
      }
      dispatchEvent(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatchEvent(signInFailure(error.message));
    }
  };
  console.log(formData);
  return (
    <div  className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="email" placeholder='email' className='border p-3 rounded-lg focus:outline-none' id='email' onChange={handleChange} />
        <input type="password" placeholder='password' className='border p-3 rounded-lg ' id='password' onChange={handleChange} />
        <button  disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80'>{
          loading ? 'Loading...' : 'Sign In'}</button>
        <OAuth/>
      </form>
      <div className='flex mt-5 gap-2'>
        <p>Don`t have an account?</p>
        <Link to={'/sign-up'}>
        <span className='text-blue-600 hover:text-blue-950'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 text-center mt-5'>{error}</p>}
    </div>
  )
}
