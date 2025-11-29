import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDB() {
    return open({
        filename: './database.db',
        driver: sqlite3.Database
    });
}

export async function createTables() {

    openDB().then(async (db) => {

        await db.exec(` CREATE TABLE IF NOT EXISTS orders (
            orderId TEXT PRIMARY KEY,
            value REAL NOT NULL,
            creationDate TEXT NOT NULL
            )
        `)

        await db.exec(`  CREATE TABLE IF NOT EXISTS items (
            orderId TEXT,
            productId INTEGER PRIMARY KEY,
            quantity INTEGER,
            price REAL,
            FOREIGN KEY(orderId) REFERENCES orders(orderId)
            );
        `)

        console.log("Tabelas criadas com sucesso.");

    }).catch((error) => {
        console.error("Erro ao criar as tabelas:", error);
    });

}