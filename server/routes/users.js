const router = require('express').Router();
const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const usersModel = require('../models/User');
const Cart = require('../models/Cart');
const { validateRegistration, validateLogin } = require('../middleware/validation');

console.log('Loading JWT private key from:', process.env.JWT_PRIVATE_KEY_FILENAME);
console.log('Current directory:', __dirname);
console.log('Full path:', path.resolve(process.env.JWT_PRIVATE_KEY_FILENAME));

let JWT_PRIVATE_KEY;

try {

    JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8');
    console.log('PEM file loaded successfully. Key length:', JWT_PRIVATE_KEY.length);
    console.log('Key starts with:', JWT_PRIVATE_KEY.substring(0, 30) + '...');
}

catch (error) {
    console.error('ERROR loading PEM file:', error.message);
    console.warn('Using fallback secret key for development');
    JWT_PRIVATE_KEY = 'development-fallback-secret-key-for-testing-only-2024';
}

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        req.userId = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_PRIVATE_KEY, { algorithm: 'RS256' });
        req.userId = decoded.userId;
        next();
    }

    catch (err) {
        console.error('Token verification error:', err);
        req.userId = null;
        next();
    }
};

router.post('/users/register/:name/:email/:password', validateRegistration, (req, res, next) => {
    usersModel.findOne({ email: req.params.email })
        .then(existingUser => {
            if (existingUser) {
                return next(createError(409, 'User with this email already exists'));
            }

            bcrypt.hash(req.params.password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) => {

                if (err) {
                    return next(createError(500, 'Error encrypting password'));
                }

                usersModel.create({
                    name: req.params.name,
                    email: req.params.email,
                    password: hash,
                    accessLevel: parseInt(process.env.ACCESS_LEVEL_NORMAL_USER)
                })
                    .then(newUser => {
                        try {
                            const token = jwt.sign(
                                {
                                    email: newUser.email,
                                    accessLevel: newUser.accessLevel,
                                    userId: newUser._id
                                },
                                JWT_PRIVATE_KEY,
                                { algorithm: 'RS256', expiresIn: process.env.JWT_EXPIRY || '7d' }
                            );

                            console.log('User registered successfully:', newUser.email);

                            return res.json({
                                name: newUser.name,
                                email: newUser.email,
                                accessLevel: newUser.accessLevel,
                                token: token
                            });
                        }

                        catch (jwtError) {
                            console.error('JWT Error:', jwtError);
                            return next(createError(500, 'Error creating session token'));
                        }
                    })

                    .catch(err => {
                        console.error('Create user error:', err);
                        next(createError(500, 'Error creating user'));
                    });
            });
        })

        .catch(err => {
            console.error('Find user error:', err);
            next(createError(500, 'Database error'));
        });
});

router.post('/users/login/:email/:password', validateLogin, (req, res, next) => {
    usersModel.findOne({ email: req.params.email })
        .then(user => {
            if (!user) {
                return next(createError(401, 'Invalid email or password'));
            }

            bcrypt.compare(req.params.password, user.password, (err, result) => {

                if (err) {
                    return next(createError(500, 'Error comparing passwords'));
                }

                if (!result) {
                    return next(createError(401, 'Invalid email or password'));
                }

                try {
                    const token = jwt.sign(
                        {
                            email: user.email,
                            accessLevel: user.accessLevel,
                            userId: user._id
                        },
                        JWT_PRIVATE_KEY,
                        { algorithm: 'RS256', expiresIn: process.env.JWT_EXPIRY || '7d' }
                    );

                    console.log('User logged in successfully:', user.email);

                    res.json({
                        name: user.name,
                        email: user.email,
                        accessLevel: user.accessLevel,
                        token: token
                    });
                }

                catch (jwtError) {
                    console.error('JWT Error during login:', jwtError);
                    return next(createError(500, 'Error creating session token'));
                }
            });
        })

        .catch(err => {
            console.error('Login error:', err);
            next(createError(500, 'Database error'));
        });
});

router.post('/users/logout', (req, res, next) => {
    res.json({ message: 'Logged out successfully' });
});

// Purchase
router.post('/users/purchase', verifyToken, (req, res, next) => {
    if (!req.userId) {
        return next(createError(401, 'Please log in to make a purchase'));
    }

    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return next(createError(400, 'No products to purchase'));
    }

    usersModel.findByIdAndUpdate(
        req.userId,
        { $push: { purchases: { $each: productIds } } },
        { new: true }
    )
        .then(user => {
            if (!user) {
                return next(createError(404, 'User not found'));
            }

            // Clear the user's active cart after purchase
            return Cart.findOneAndUpdate(
                { userId: req.userId, isActive: true },
                { items: [], subtotal: 0, tax: 0, total: 0 },
                { new: true }
            )
                .then(() => {
                    res.json({ message: 'Purchase successful', purchases: user.purchases });
                });
        })
        .catch(err => {
            console.error('Purchase error:', err);
            next(createError(500, 'Error processing purchase'));
        });
});

// Get users purchased products
router.get('/users/purchases', verifyToken, (req, res, next) => {
    if (!req.userId) {
        return next(createError(401, 'Please log in to view purchases'));
    }

    usersModel.findById(req.userId)
        .populate('purchases', 'name price photos category')
        .then(user => {
            if (!user) {
                return next(createError(404, 'User not found'));
            }

            res.json(user.purchases);
        })
        .catch(err => {
            console.error('Get purchases error:', err);
            next(createError(500, 'Error fetching purchases'));
        });
});

// Get user profile data
router.get('/users/profile', verifyToken, (req, res, next) => {
    if (!req.userId) {
        return next(createError(401, 'Please log in to view profile'));
    }

    usersModel.findById(req.userId)
        .select('name email accessLevel profilePhotoFilename')
        .then(user => {
            if (!user) {
                return next(createError(404, 'User not found'));
            }
            res.json(user);
        })
        .catch(err => {
            console.error('Get profile error:', err);
            next(createError(500, 'Error fetching profile'));
        });
});

// Upload profile photo
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

router.post('/users/profile/photo', verifyToken, upload.single('profilePhoto'), (req, res, next) => {
    if (!req.userId) {
        return next(createError(401, 'Please log in to upload a photo'));
    }

    if (!req.file) {
        return next(createError(400, 'No file uploaded'));
    }

    const filename = req.file.filename;

    usersModel.findByIdAndUpdate(
        req.userId,
        { profilePhotoFilename: filename },
        { new: true }
    )
        .select('profilePhotoFilename')
        .then(user => {
            if (!user) {
                return next(createError(404, 'User not found'));
            }
            res.json({ profilePhotoFilename: user.profilePhotoFilename });
        })
        .catch(err => {
            console.error('Upload profile photo error:', err);
            next(createError(500, 'Error updating profile photo'));
        });
});

router.get('/users/profile/photo/:filename', (req, res, next) => {
    const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            next(createError(404, 'Image not found'));
        }
    });
});

// Get all users
router.get('/users/all', verifyToken, (req, res, next) => {
    if (!req.userId) {
        return next(createError(401, 'Please log in'));
    }

    usersModel.findById(req.userId)
        .then(requestingUser => {
            if (!requestingUser || requestingUser.accessLevel < parseInt(process.env.ACCESS_LEVEL_ADMIN)) {
                return next(createError(403, 'Administrator access required'));
            }

            const { search, level, sort } = req.query;

            let query = {};

            if (search) {
                query.name = { $regex: search, $options: 'i' };
            }

            if (level) {
                query.accessLevel = parseInt(level);
            }

            let sortOption = {};
            if (sort === 'name_asc') sortOption.name = 1;
            else if (sort === 'name_desc') sortOption.name = -1;

            usersModel.find(query)
                .select('name email accessLevel profilePhotoFilename')
                .sort(sortOption)
                .then(users => {
                    res.json(users);
                })
                .catch(err => next(createError(500, 'Error fetching users')));
        })
        .catch(err => next(createError(500, 'Error verifying admin')));
});

// Delete user
router.delete('/users/:id', verifyToken, (req, res, next) => {
    if (!req.userId) {
        return next(createError(401, 'Please log in'));
    }

    usersModel.findById(req.userId)
        .then(requestingUser => {
            if (!requestingUser || requestingUser.accessLevel < parseInt(process.env.ACCESS_LEVEL_ADMIN)) {
                return next(createError(403, 'Administrator access required'));
            }

            usersModel.findByIdAndDelete(req.params.id)
                .then(user => {
                    if (!user) {
                        return next(createError(404, 'User not found'));
                    }
                    res.json({ message: 'User deleted successfully' });
                })
                .catch(err => next(createError(500, 'Error deleting user')));
        })
        .catch(err => next(createError(500, 'Error verifying admin')));
});

module.exports = router;