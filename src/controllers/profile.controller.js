const { Profile } = require('../Profile/profile.entity');
const bcrypt = require('bcrypt');

// Create a new profile
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if profile already exists
        const existingProfile = await Profile.findOne({ email });
        if (existingProfile) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new profile
        const newProfile = new Profile({ name, email, password: hashedPassword });
        await newProfile.save();

        res.status(201).json({ message: 'Profile registered successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login Profile
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const profile = await Profile.findOne({ email });
        if (!profile) {
            console.log('Profile with given email not found');
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, profile.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', profile: { id: profile._id, name: profile.name, email: profile.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const profile = await Profile.findOne({ email });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        profile.password = hashedPassword;
        await profile.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Profile
const getUserProfile = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json({ profile: { id: profile._id, name: profile.name, email: profile.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update Profile
const updateUserProfile = async (req, res) => {
    const { name, email } = req.body;

    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        profile.name = name || profile.name;
        profile.email = email || profile.email;
        await profile.save();

        res.status(200).json({ message: 'Profile updated successfully', profile: { id: profile._id, name: profile.name, email: profile.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Export functions
module.exports = {
    registerUser,
    loginUser,
    resetPassword,
    getUserProfile,
    updateUserProfile,
};