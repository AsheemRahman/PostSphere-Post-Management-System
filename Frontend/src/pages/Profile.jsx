import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOut, } from '../redux/user/userSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);
  const cloudName = import.meta.env.VITE_CLOUD_NAME;
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'Mern-Auth');
    formData.append('cloud_name', 'cloudName');
    try {
      setImageUploading(true);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, profilePicture: data.secure_url }));
        setImageUploading(false);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      setImageError(true);
      setImageUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`http://localhost:5000/api/user/update/${currentUser.uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data.fullUserData));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`http://localhost:5000/api/user/delete/${currentUser.uid}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        toast.error("Account cant Delete now, Try again")
        return;
      }
      toast.success("Account Delete Successfully")
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/signout');

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || "Logout failed");
        return;
      }

      dispatch(signOut());
      navigate('/login');
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error while signing out");
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='file' ref={fileRef} hidden accept='image/*' onChange={(e) => setImage(e.target.files[0])} />
        <img src={formData.profilePicture || currentUser.photoURL} alt='profile' className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
          onClick={() => fileRef.current.click()} />
        <p className='text-sm self-center'>
          {imageError ? (
            <span className='text-red-700'>Error uploading image</span>
          ) : imageUploading ? (
            <span className='text-slate-700'>Uploading...</span>
          ) : (
            ''
          )}
        </p>
        <input defaultValue={currentUser.name} type='text' id='name' placeholder='Username' className='bg-slate-100 rounded-lg p-3' onChange={handleChange} />
        <input defaultValue={currentUser.email} type='email' id='email' placeholder='Email' className='bg-slate-100 rounded-lg p-3' readOnly />
        <input type='password' id='password' placeholder='Password' className='bg-slate-100 rounded-lg p-3' onChange={handleChange} />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteAccount} className='text-red-700 cursor-pointer'>
          Delete Account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>
      <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess && 'User is updated successfully!'}
      </p>
    </div>
  );
}

export default Profile