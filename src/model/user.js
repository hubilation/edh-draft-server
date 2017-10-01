import mongoose from 'mongoose'

var userSchema = new mongoose.Schema({
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    userName: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    avatarUrl: {type: String, required: false},
    role: {type: String, default: 'user'}
}, {
    collection: 'users'
});

export default mongoose.model('User', userSchema);