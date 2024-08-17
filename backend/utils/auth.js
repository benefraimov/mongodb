const { sign, verify } = require('jsonwebtoken')
const { compare } = require('bcryptjs');
const { NotAuthError } = require('./error');
const User = require('../models/userModel');

const KEY = process.env.KEY;

// Creating a json web token when login or signing up 
// using the sign method from jsonwebtoken library 
// by transferring a Payload, SecretKey, Options 
// Payload can be an object | string | Buffer
// SecretKey should be a string that holds a SecretKey
// Options can be used to determine when the token will
// be expired, in (1 minute: '1m') | (30 minutes: '30m') | (2 hours: '2h')
// | (7 days: '7d') | (1 week: '1w'). 
function createJSONToken(email) {
    return sign({ email }, KEY, { expiresIn: '1h' })
}

// Token Verification: The method checks whether the provided 
// JWT (token) is valid by using the secret or public key (KEY)
// that was used to sign the token. 
// If the token was tampered with or if it has expired, the 
// verification will fail.
function validateJSONToken(token) {
    // return in this case the mail or not if failed 
    return verify(token, KEY);
}

// The password is the plaintext password that a user provides 
// (e.g., during login).
// The storedPassword is the hashed version of the password that
// was stored in your database when the user registered or set their password.
// bcrypt compares the plaintext password with the storedPassword by hashing 
// the plaintext password and comparing it with the stored hash.
// The storedPassword includes a salt (random data added to the password before hashing) 
// and the hashed password itself, both of which are used in the comparison.
function isValidPassword(password, storedPassword) {
    return compare(password, storedPassword);
}

// The function is designed to check if a request is authenticated by
// verifying a JSON Web Token (JWT) provided in the request headers.
// If the token is valid, the request is allowed to proceed; otherwise,
// an error is raised.
async function checkAuthMiddleware(req, res, next) {
    // If the request method is OPTIONS, the function calls next()
    // immediately and exits. OPTIONS requests are often used in
    // CORS preflight requests, and no authentication is usually required.
    if (req.method === 'OPTIONS') {
        return next()
    }
    // Checks if the Authorization header is present in the request. 
    // If it's missing, the function logs a message and raises a
    // NotAuthError, indicating that the request is not authenticated.
    if (!req.headers.authorization) {
        console.log('NOT AUTH. AUTH HEADER MISSING.');
        return next(new NotAuthError('Not authenticated.'));
    }
    // If the Authorization header exists, the function splits its
    // value into two parts using a space as the delimiter.
    // This assumes the header follows the format: Bearer <token>.
    const authFragments = req.headers.authorization.split(' ');

    // If the header doesn't have exactly two parts
    // (i.e., the word "Bearer" and the token), it logs a message
    // and raises a NotAuthError.
    if (authFragments.length !== 2) {
        console.log('NOT AUTH. AUTH HEADER INVALID.');
        return next(new NotAuthError('Not authenticated.'));
    }
    // The function extracts the token
    // (the second part of the split header)
    const authToken = authFragments[1];
    try {
        // and tries to validate it using the validateJSONToken function.
        const validatedToken = validateJSONToken(authToken);

        // If the token is valid, the function calls next() to
        // allow the request to proceed.
        req.token = validatedToken;

        // Fetch user details from the database using the email in the token
        const user = await User.findOne({ email: validatedToken.email });

        if (!user) {
            console.log('NOT AUTH. USER NOT FOUND.');
            return next(new NotAuthError('Not authenticated.'));
        }

        // Attach the user data to the request object
        req.user = user;

        // Check if the user is an admin or a regular user
        req.isAdmin = user.role === 'admin';

        // console.log(req.user, req.isAdmin)
    } catch (err) {
        // If the token is invalid or has expired, the function 
        // logs a message and raises a NotAuthError.
        console.log('NOT AUTH. TOKEN INVALID.');
        return next(new NotAuthError('Not authenticated.'));
    }
    next();
}



exports.createJSONToken = createJSONToken;
exports.validateJSONToken = validateJSONToken;
exports.isValidPassword = isValidPassword;
exports.checkAuth = checkAuthMiddleware;