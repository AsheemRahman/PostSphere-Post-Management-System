import React,{ useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { toast } from 'react-toastify';

const Signup = () => {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(false);
            const res = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            setLoading(false);
            if (!res.ok) {
                setError(true);
                toast.error(data.error || "Something went wrong!");
                return;
            }
            toast.success("Signup successful!");
            navigate('/login');
        } catch (error) {
            setLoading(false);
            setError(true);
            toast.error("Network error! Please try again.");
        }
    };
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type='text' placeholder='Name' id='name' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
                <input type='email' placeholder='Email' id='email' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
                <input type='password' placeholder='Password' id='password' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
                <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>
                <OAuth />
            </form>
            <div className='flex gap-2 mt-5'>
                <p>Have an account?</p>
                <Link to='/login'>
                    <span className='text-blue-500'>Login</span>
                </Link>
            </div>
            <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
        </div>
    );
}

export default Signup