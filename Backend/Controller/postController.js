import { db } from '../config/firebaseConfig.js'

// Create Post
export const createPost = async (req, res) => {
    try {
        const { title, description, userId } = req.body;
        const newPost = {
            title,
            description,
            userId: userId,
            createdAt: new Date().toISOString(),
        };
        const docRef = await db.collection('posts').add(newPost);
        res.status(201).json({ id: docRef.id, ...newPost });
    } catch (error) {
        console.error("while creating post ", error)
        res.status(500).json({ error: error.message });
    }
};

// Get Posts
export const getPosts = async (req, res) => {
    try {
        const snapshot = await db.collection('posts').orderBy('createdAt', 'desc').get();
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(posts);
    } catch (error) {
        console.error("error while getting post", error)
        res.status(500).json({ error: error.message });
    }
};


//get user by post
export const getUserPosts = async (req, res) => {
    try {
        const userId = req.params.id;
        const postRef = db.collection('posts');

        const querySnapshot = await postRef.where('userId', '==', userId).get();

        if (querySnapshot.empty) {
            return res.status(404).json({ message: 'No posts found for this user' });
        }

        const posts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(posts);
    } catch (error) {
        console.error("Error while getting user posts:", error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
};

// Update Post
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const postRef = db.collection('posts').doc(id);
        const post = await postRef.get();

        if (!post.exists) {
            return res.status(404).json({ error: 'Post not found' });
        }

        await postRef.update({ title, description, updatedAt: new Date() });
        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete Post
export const deletePost = async (req, res) => {
    try {
        const postRef = db.collection('posts').doc(req.params.id);
        const post = await postRef.get();
        if (!post.exists) return res.status(404).json({ error: 'Post not found' });

        await postRef.delete();
        res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
        console.log("while delete post", error)
        res.status(500).json({ error: error.message });
    }
};
