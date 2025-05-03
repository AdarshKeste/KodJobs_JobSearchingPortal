const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    education: {
        degree: {
            type: String,
            required: true
        },
        institution: {
            type: String,
            required: true
        },
        graduationYear: {
            type: String,
            required: true
        }
    },
    skills: [{
        type: String
    }],
    applications: [{
        jobId: String,
        jobTitle: String,
        companyName: String,
        companyLogo: String,
        location: String,
        salary: String,
        skills: [String],
        appliedDate: Date,
        status: {
            type: String,
            default: 'Applied'
        }
    }]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 