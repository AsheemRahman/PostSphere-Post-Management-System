import React from 'react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firbase';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';

const OAuth = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);

            const res = await fetch('http://localhost:5000/api/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
                credentials: 'include',
            });
            if(res.ok){
                const data = await res.json();
                dispatch(signInSuccess(data.user));
                navigate('/');
                toast.success("Sign in successfull")
            }else{
                toast.error("Sign failed , try again")
            }
        } catch (error) {
            toast.error("could not login with google");
        }
    };

    return (
        <button type='button' onClick={handleGoogleClick} className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95'>
            Continue with google
        </button>
    )
}

export default OAuth