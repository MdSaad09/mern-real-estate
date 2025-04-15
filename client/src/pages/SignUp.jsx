import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    // Basic validation
    if (!formData.username || !formData.email || !formData.password) {
      setErrors('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setErrors(data.message || 'Something went wrong');
        setLoading(false);
        return;
      }

      alert('Account created successfully');
      navigate('/signin');
    } catch (error) {
      console.error('Error:', error);
      setErrors(error.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <label htmlFor='username' className='sr-only'>Username</label>
        <input
          type='text'
          placeholder='Username'
          className='border p-3 rounded-lg'
          id='username'
          onChange={handleChange}
          value={formData.username}
        />

        <label htmlFor='email' className='sr-only'>Email</label>
        <input
          type='email'
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
          value={formData.email}
        />

        <label htmlFor='password' className='sr-only'>Password</label>
        <input
          type='password'
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
          value={formData.password}
        />

        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign up'}
        </button>
        <OAuth />
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/signin'>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>

      {errors && <p className='text-red-500 mt-5'>{errors}</p>}
    </div>
  );
};

export default SignUp;
