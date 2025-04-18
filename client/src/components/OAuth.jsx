import React from 'react'
import { GoogleAuthProvider } from 'firebase/auth'
import  {getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch,  } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';

function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async() => {
       
        
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            const res= await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    
                })
            });
            const data = await res.json();
            console.log('data:', data);
            if (!res.ok || data.success === false) {
                console.log(data.message || 'Something went wrong');
                return;
            }
            // Assuming the response contains user data 
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            console.log("could not sign in with google",error);  
        }
    }
  return (
    
     <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover: opacity-95'>continue with google</button> 
    
  )
}

export default OAuth
