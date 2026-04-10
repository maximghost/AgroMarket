import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password_hash')
      next()
    } catch (error) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Token invalide ou expiré'
        }
      })
    }
  } else {
    res.status(401).json({
      success: false,
      error: {
        code: 'NO_TOKEN',
        message: 'Token non fourni. Utilisez: Authorization: Bearer <token>'
      }
    })
  }
}

export default protect

