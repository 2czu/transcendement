import { verifyGoogleToken, signToken } from '../jwt.js';
import { createUser } from './usersController.js';
export const googleOAuth = async (db, code) => {
    const client_id = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;
    const client_url = process.env.GOOGLE_REDIRECT_URL;
    if (!client_id || !client_secret || !client_url) {
        throw new Error('Missing Google OAuth env variables');
    }
    const decoded = await verifyGoogleToken(code);
    if (!decoded)
        throw new Error('error: Invalid google token bruh');
    var user = await db.get("SELECT id, email, isOAuth FROM users WHERE email = ?", [decoded.email]);
    if (!user) {
        user = await createUser(db, decoded.name, decoded.email, null, 0, 'placeholder.jpg', 'offline', 1);
        if (!user || user.error) {
            throw new Error('Error creating google user');
        }
    }
    const token = signToken({ userId: user.id });
    return token;
};
