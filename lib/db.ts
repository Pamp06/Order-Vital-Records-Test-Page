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

    // Create the submissions table if it doesn't exist
    await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS submissions (
            id TEXT PRIMARY KEY,
            user_info TEXT,
            certificate_type TEXT,
            shipping_details TEXT,
            additional_details TEXT,
            pdf_path TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
        CREATE INDEX IF NOT EXISTS idx_submissions_cert_type ON submissions(certificate_type);
    `);

    return dbInstance;
}
