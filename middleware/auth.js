import jwt from 'jsonwebtoken';

/**
 * Middleware function to verify the JWT from the request header.
 * Attaches the user ID to the request object if verification is successful.
 */
const protect = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    // Decode the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user ID from the payload to the request
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default protect;