import { db } from '../config/firebaseConfig.js'
import admin from 'firebase-admin'
import { getAuth } from "firebase-admin/auth";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const userRecord = await admin.auth().createUser({
            email,
            password,
            photoURL: 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
        });

        const userData = {
            uid: userRecord.uid,
            name,
            email,
            password: hashedPassword,
            photoURL: 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
            createdAt: new Date().toISOString(),
        };

        await db.collection('users').doc(userRecord.uid).set(userData);

        res.status(201).json(userData);
    } catch (error) {
        console.error("error while signup", error)
        res.status(500).json({ error: error.message });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const userDoc = await db.collection('users').where('email', '==', email).get();
        if (userDoc.empty) {
            return res.status(404).json({ error: "User not found" });
        }

        const userData = userDoc.docs[0].data();
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        let SECRET_KEY = process.env.JWT_SECRET
        const token = jwt.sign({ uid: userData.id }, SECRET_KEY, { expiresIn: '1h' });
        const expiryDate = new Date(Date.now() + 3600000);

        res.cookie('access_token', token, { httpOnly: true, expires: expiryDate }).status(200).json({
            message: 'Login successful', token,
            user: {
                uid: userData.uid,
                name: userData.name,
                email: userData.email,
                photoURL: userData.photoURL,
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const google = async (req, res) => {
    try {
        const { name, email, photo } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        let userRecord;
        try {
            userRecord = await admin.auth().getUserByEmail(email);
        } catch (error) {
            if (error.code === "auth/user-not-found") {

                const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

                userRecord = await admin.auth().createUser({
                    email,
                    password: generatedPassword,
                    displayName: name || "No Name",
                    photoURL: photo || 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
                });

            } else {
                console.error("Error fetching user from Firebase Auth:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }

        const userSnapshot = await db.collection("users").doc(userRecord.uid).get();

        let userDetails;
        if (!userSnapshot.exists) {
            userDetails = {
                uid: userRecord.uid,
                name: userRecord.displayName || name || "No Name",
                email: userRecord.email,
                photoURL: userRecord.photoURL || 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
                createdAt: new Date().toISOString(),
            };
            await db.collection("users").doc(userRecord.uid).set(userDetails);
        } else {
            userDetails = userSnapshot.data();
        }

        const token = jwt.sign({ uid: userRecord.uid }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.cookie("access_token", token, { httpOnly: true, expires: new Date(Date.now() + 3600000) }).status(200).json({ message: "Google Login successful", token, user: userDetails });
    } catch (error) {
        console.error("Error while logging in with Google:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


export const signout = async (req, res) => {
    try {
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ error: 'Logout failed' });
    }
};


export const updateUser = async (req, res, next) => {
    try {
        let userId = req.params.id;
        const { name, password, profilePicture } = req.body;
        const userRef = db.collection('users').doc(userId);
        const userSnapshot = await userRef.get();

        if (!userSnapshot.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userSnapshot.data();
        let updateData = {};

        updateData.name = name || user.name;
        updateData.photoURL = profilePicture || user.photoURL;
        updateData.password = password ? bcrypt.hashSync(password, 10) : user.password;
        updateData.updatedAt = new Date();

        await userRef.update(updateData);

        const updatedUserSnapshot = await userRef.get();
        const updatedUser = updatedUserSnapshot.data();

        res.status(200).json({
            message: 'User updated successfully',
            fullUserData: updatedUser
        });

    } catch (error) {
        console.error("Error while updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const deleteUser = async (req, res, next) => {
    try {
        let userId = req.params.id;
        
        const userQuery = await db.collection('users').where('uid', '==', userId).get();
        if (userQuery.empty) {
            return res.status(404).json({ message: "User not found" });
        }

        const batch = db.batch();
        userQuery.forEach(doc => batch.delete(doc.ref));

        const postsQuery = await db.collection('posts').where('userId', '==', userId).get();
        postsQuery.forEach(doc => batch.delete(doc.ref));

        await batch.commit();
        await getAuth().deleteUser(userId);

        return res.status(200).json({ message: "User and their posts have been deleted successfully" });
    } catch (error) {
        console.error("Error while deleting user and posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}