import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Fadlan soo gal' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Session-ku wuu dhacay, mar kale soo gal' });
  }
};

export const allow = (...roles) => (req, res, next) =>
  roles.includes(req.user.role)
    ? next()
    : res.status(403).json({ message: 'Ogolaansho ma lihid' });

export const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

