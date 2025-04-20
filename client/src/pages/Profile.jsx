import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice.js';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { currentUser, isLoading,  error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });

  }
  const handleSubmit = async (e) => {

    e.preventDefault();
    
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setMessage({ text: error.message || 'An error occurred', type: 'error' });
        return;
      }
      dispatch(updateUserSuccess(data));
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      console.log(data);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setMessage({ text: error.message || 'An error occurred', type: 'error' });
    }
  }

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        setMessage({ text: data.message, type: 'error' });
        return;
      }
      dispatch(deleteUserSuccess(data));
      setMessage({ text: 'Account deleted successfully!', type: 'success' });
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      setMessage({ text: error.message || 'An error occurred', type: 'error' });
    }
  }

  const handlleSignout = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        
        return;
      }
      dispatch(signOutUserSuccess(data));
      setMessage({ text: 'Signed out successfully!', type: 'success' });
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      ;
    }
  }
  
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={handleChange} type="text" placeholder='Username' className='border p-3 rounded-lg' id='username' defaultValue={currentUser.username}  />
        <input onChange={handleChange} type="email" placeholder='Email' className='border p-3 rounded-lg' id='email' defaultValue={currentUser.email}/>
        <input onChange={handleChange} type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' />
        <button disabled={isLoading}  className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {isLoading ? 'Loading...' : 'Update'} 
          </button>
          <Link to={"/create-listing"} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'> Create Listing</Link>
      </form>
      {message.text && (
        <div 
          className={`mt-4 p-2 text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </div>
      )}
      <div className='flex justify-between gap-4 mt-5'>
        <span onClick={handleDelete} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handlleSignout} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}

export default Profile
