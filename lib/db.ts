import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
    if (dbInstance) {
        return dbInstance;
    }

    const dbPath = path.resolve(process.cwd(), 'project_db.sqlite');

    dbInstance = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await dbInstance.run('PRAGMA foreign_keys = ON');

    await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT UNIQUE,
            password_hash TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            expires_at INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS tn_birth_applications (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            date TEXT,
            number_of_copies INTEGER,
            paternity_copies INTEGER,
            first_name TEXT,
            middle_name TEXT,
            last_name TEXT,
            name_changed BOOLEAN,
            original_name TEXT,
            dob_month TEXT,
            dob_day TEXT,
            dob_year TEXT,
            sex TEXT,
            birth_city TEXT,
            birth_county TEXT,
            birth_state TEXT,
            birth_country TEXT,
            hospital TEXT,
            father_name TEXT,
            mother_maiden_name TEXT,
            mother_last_name_at_birth TEXT,
            older_sibling TEXT,
            younger_sibling TEXT,
            signature TEXT,
            relationship TEXT,
            purpose TEXT,
            phone TEXT,
            email TEXT,
            mail_name TEXT,
            mail_address TEXT,
            mail_city_state TEXT,
            mail_zip TEXT,
            pdf_path TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_tn_birth_user ON tn_birth_applications(user_id);
    `);

    return dbInstance;
}
