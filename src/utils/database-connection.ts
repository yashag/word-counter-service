import path from 'path';
import fs from 'fs';
import { verbose, Database } from 'sqlite3';
const sqlite3 = verbose();
import config from 'config';

const dbPath = path.join(process.cwd(), config.get('db.path'));
let db: Database;

if (!fs.existsSync(dbPath)) {
    setupDatabaseDirectory();

    db = new sqlite3.Database(dbPath, (err: Error | null) => {
        if (err) {
            throw new Error("Failed to create a database connection");
        }
        console.log('Connected to the words count database.');

        db.run(`CREATE TABLE IF NOT EXISTS words_statistics (
            word VARCHAR(50) PRIMARY KEY,
            counter INTEGER DEFAULT 0 NOT NULL
        ) WITHOUT ROWID;`)
    });
} else {
    db = sqlite3.cached.Database(dbPath);
}

function setupDatabaseDirectory() {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

export default db;