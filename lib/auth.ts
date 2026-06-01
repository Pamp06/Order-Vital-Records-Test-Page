import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getDb } from './db';

// Hashing Utilities
export function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) return false;
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
}

// Session Utilities
export async function createSession(userId: string): Promise<string> {
    const db = await getDb();
    const sessionId = crypto.randomBytes(32).toString('hex');
    // Session expires in 7 days
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

    await db.run(
        'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
        [sessionId, userId, expiresAt]
    );

    const cookieStore = await cookies();
    cookieStore.set('session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(expiresAt)
    });

    return sessionId;
}

export async function destroySession() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;
    
    if (sessionId) {
        const db = await getDb();
        await db.run('DELETE FROM sessions WHERE id = ?', [sessionId]);
    }
    
    cookieStore.delete('session');
}

export async function getSessionUser() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;
    if (!sessionId) return null;

    const db = await getDb();
    const session = await db.get('SELECT user_id, expires_at FROM sessions WHERE id = ?', [sessionId]);

    if (!session || session.expires_at < Date.now()) {
        // Invalid or expired session
        if (session) {
            await db.run('DELETE FROM sessions WHERE id = ?', [sessionId]);
        }
        return null;
    }

    const user = await db.get('SELECT id, name, email FROM users WHERE id = ?', [session.user_id]);
    return user || null;
}
