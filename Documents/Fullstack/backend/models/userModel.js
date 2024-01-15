const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jobsHistorySchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        maxlength: 70,
    },
    description: {
        type: String,
        trim: true,
    },
    salary: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
    },
    interviewDate: {
        type: Date,
    },
    applicationStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    user: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    fcmToken: String,

    firstName: {
        type: String,
        trim: true,
        required: [true, 'First name is required'],
        maxlength: 32,
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Last name is required'],
        maxlength: 32,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: [true, 'Gender is required'],
    },
    companyName: {
        type: String,
        trim: true,
    },
    companyAddress: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'E-mail is required'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
  phoneNumber: {
    type: String,
    trim: true,
    validate: {
        validator: function (v) {
            return /^(251)?(09|07)\d{8}$/.test(v);  
        },
        message: (props) => `${props.value} is not a valid phone number!`,
    },
},

    password: {
        type: String,
        trim: true,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must have at least (8) characters'],
    },
    highestEducationLevel: {
        type: String,
        trim: true,
    },
    fieldOfStudy: {
        type: String,
        trim: true,
    },
    approved: {
        type: Boolean,
        default: false,
    },
    jobsHistory: [jobsHistorySchema],
    role: {
        type: Number,
        default: 0,
    },
    approver: {
        type: ObjectId,
        ref: 'User',
      },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        this.password = await bcrypt.hash(this.password, 10);
        return next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: 3600,
    });
};
userSchema.methods.approveUser = async function () {
    try {
        this.approved = true;
        await this.save();
        return { success: true, message: 'User approved successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Internal server error' };
    }
};

module.exports = mongoose.model('User', userSchema);
