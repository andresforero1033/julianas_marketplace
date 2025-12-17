import { verifyAccessToken } from '../utils/index.js';
import { findUserById, sanitizeUser } from '../services/index.js';

const extractTokenFromHeader = (authHeader = '') => {
  if (!authHeader.startsWith('Bearer ')) return null;
  return authHeader.replace('Bearer ', '').trim();
};

export const requireAuth = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado.' });
    }

    const payload = verifyAccessToken(token);
    const userDoc = await findUserById(payload.sub);

    if (!userDoc || !userDoc.isActive) {
      return res.status(401).json({ message: 'Usuario no autorizado.' });
    }

    req.user = sanitizeUser(userDoc);
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Autenticación requerida.' });
  }

  if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'No tienes permisos para esta acción.' });
  }

  return next();
};
*** End of File