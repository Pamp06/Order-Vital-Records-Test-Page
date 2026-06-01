import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDb } from '../../../../lib/db';
import { hashPassword, createSession } from '../../../../lib/auth';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await getDb();
        
        // Check if user already exists
        const existing = await db.get('SELECT id FROM users WHERE email = ?', [email]);
        if (existing) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
        }

        const userId = crypto.randomUUID();
        const hashed = hashPassword(password);

        await db.run(
            'INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)',
            [userId, name, email, hashed]
        );

        await createSession(userId);

        return NextResponse.json({ success: true, user: { id: userId, name, email } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
