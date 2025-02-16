import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [editingPost, setEditingPost] = useState(null);
    const [userId, setUserId] = useState(null);

    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        if (currentUser) {
            setUserId(currentUser.uid);
        }
    }, [currentUser]);

    useEffect(() => {
        if (userId) {
            fetchPosts(userId);
        }
    }, [userId]);

    const fetchPosts = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/user/posts/${userId}`, { withCredentials: true });
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!userId) {
            toast.error("User not authenticated");
            return;
        }
        try {
            let newPost = { title, description, userId }
            await axios.post('http://localhost:5000/api/addPost', newPost, { withCredentials: true });
            toast.success('Post created!');
            setTitle('');
            setDescription('');
            setPosts([...posts, { id: Date.now(), ...newPost }]);
        } catch (error) {
            toast.error("Error Creating Post, Try again");
            console.error('Error creating post:', error);
        }
    };

    const handleEditPost = (post) => {
        setEditingPost(post);
        setTitle(post.title);
        setDescription(post.description);
    };

    const handleUpdatePost = async (e) => {
        e.preventDefault();
        if (!editingPost) return;
        try {
            await axios.put(`http://localhost:5000/api/updatePost/${editingPost.id}`, { title, description }, { withCredentials: true });
            toast.success('Post updated!');
            setPosts(posts.map((post) => (post.id === editingPost.id ? { ...post, title, description } : post)));
            setEditingPost(null);
            setTitle('');
            setDescription('');
        } catch (error) {
            toast.error("Error updating post");
            console.error('Error updating post:', error);
        }
    };

    const handleDeletePost = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/deletePost/${id}`, { withCredentials: true });
            toast.success('Post deleted!');
            setPosts(posts.filter((post) => post.id !== id));
        } catch (error) {
            toast.error("Error deleting post");
            console.error('Error deleting post:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">{editingPost ? 'Edit Post' : 'Create a Post'}</h2>
                <form onSubmit={editingPost ? handleUpdatePost : handleCreatePost} className="space-y-4">
                    <input
                        type="text"
                        value={title}
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <textarea
                        value={description}
                        placeholder="Description"
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                        {editingPost ? 'Update Post' : 'Create Post'}
                    </button>
                    {editingPost && (
                        <button onClick={() => { setEditingPost(null); setTitle(''); setDescription(''); }}
                            className="w-full bg-gray-400 text-white p-2 rounded hover:bg-gray-500 transition mt-2">
                            Cancel
                        </button>
                    )}
                </form>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mt-8">Your Posts</h2>
            <div className="mt-4 w-full max-w-2xl space-y-4">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white shadow-md rounded-lg p-4">
                        <h3 className="text-xl font-semibold text-gray-700">{post.title}</h3>
                        <p className="text-gray-600 mt-2">{post.description}</p>
                        <div className="flex space-x-2 mt-4">
                            <button onClick={() => handleEditPost(post)}
                                className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">Edit</button>
                            <button onClick={() => handleDeletePost(post.id)}
                                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;