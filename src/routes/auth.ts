import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// Hemlig nyckel från .env
const JWT_SECRET = process.env.JWT_SECRET as string;

// ✅ [POST] /auth/register
router.post('/register', (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Enkel validering
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Användarnamn och lösenord krävs' });
  }

  // Här skulle man spara användaren i DB – vi hoppar över det nu
  res.json({ success: true, message: 'User registered', user: { username } });
});

// ✅ [POST] /auth/login
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Enkel kontroll – normalt kollar man mot databasen
  if (username === 'Admin' && password === '123') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '15m' });

    return res.json({
      user: { username },
      expires_in: 900,
      token,
    });
  }

  res.status(401).json({ error: 'Ogiltiga inloggningsuppgifter' });
});

// ✅ [POST] /auth/refresh-token
router.post('/refresh-token', (req: Request, res: Response) => {
  // OBS: Inget krav på token från klient – skapar bara en ny
  const token = jwt.sign({ username: 'Admin' }, JWT_SECRET, { expiresIn: '15m' });

  res.json({
    user: { username: 'Admin' },
    expires_in: 900,
    token,
  });
});

// ✅ [POST] /auth/clear-token
router.post('/clear-token', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Token cleared' });
});

export default router;
