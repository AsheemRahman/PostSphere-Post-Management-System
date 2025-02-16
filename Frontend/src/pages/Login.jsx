import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess, signInFailure, } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';

const Login = () => {
    const [formData, setFormData] = useState({});
    const { loading, error } = useSelector((state) => state.user);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            dispatch(signInStart());

            const res = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials:'include',
            });

            if (!res.ok) {
                const errorData = await res.json();
                dispatch(signInFailure(errorData));
                toast.error(errorData.error || "Login failed");
                return;
            }

            const data = await res.json();
            dispatch(signInSuccess(data.user));
            navigate('/');
        } catch (error) {
            dispatch(signInFailure(error));
            console.error("Error while logging in:", error);
            toast.error("Error while logging in");
        }
    };

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Login</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type='email' placeholder='Email' id='email' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
                <input type='password' placeholder='Password' id='password' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
                <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                    {loading ? 'Loading...' : 'Login'}
                </button>
                <OAuth />
            </form>
            <div className='flex gap-2 mt-5'>
                <p>Dont Have an account?</p>
                <Link to='/signup'>
                    <span className='text-blue-500'>Sign up</span>
                </Link>
            </div>
            <p className='text-red-700 mt-5'>
                {error ? error.message || 'Something went wrong!' : ''}
            </p>
        </div>
    );
}

export default Login