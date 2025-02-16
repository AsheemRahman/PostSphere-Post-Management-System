import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Home = () => {
    const [posts, setPosts] = useState([]);

    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/posts', { withCredentials: true });
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);
    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
            <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-8">Home</h1>
            <div className="text-center text-3xl font-semibold text-gray-700 mb-8">Welcome, {currentUser?.name}!</div>

            {posts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
                    {posts.map(post => (
                        <div key={post.id}className="bg-white p-6 rounded-3xl shadow-xl transition-all duration-300 transform hover:scale-[1.05] hover:shadow-2xl border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                                {post.title}
                            </h3>
                            <p className="text-gray-600 line-clamp-3 mb-4">
                                {post.description}
                            </p>
                            <div className="flex items-center justify-between text-gray-500 text-sm">
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                <button className="text-blue-600 hover:text-blue-800 transition-colors">Read More</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 text-xl font-medium">
                    <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    No posts are published
                </div>
            )}
        </div>
    );
};

export default Home;