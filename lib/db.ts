import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
    if (dbInstance) {
        return dbInstance;
    }

    // Resolve the database path to the project root
    const dbPath = path.resolve(process.cwd(), 'database.sqlite');

    // Open the SQLite database
    dbInstance = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Enable foreign keys
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

        CREATE TABLE IF NOT EXISTS submissions (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            cert_type TEXT,
            event_state TEXT,
            pdf_path TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS certificate_details (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            submission_id TEXT,
            subject_name TEXT,
            event_date TEXT,
            event_city TEXT,
            father_name TEXT,
            mother_name TEXT,
            FOREIGN KEY(submission_id) REFERENCES submissions(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS shipping_details (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            submission_id TEXT,
            applicant_name TEXT,
            applicant_email TEXT,
            applicant_phone TEXT,
            relationship TEXT,
            address TEXT,
            city TEXT,
            state TEXT,
            zipcode TEXT,
            FOREIGN KEY(submission_id) REFERENCES submissions(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS processing_options (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            submission_id TEXT,
            processing_speed TEXT,
            shipping_speed TEXT,
            FOREIGN KEY(submission_id) REFERENCES submissions(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
    `);

    return dbInstance;
}
