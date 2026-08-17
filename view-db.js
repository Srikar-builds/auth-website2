const sqlite3 = require('sqlite3'); 
const { open } = require('sqlite'); 
(async () => { 
const db = await open({ filename: './database.db', driver: sqlite3.Database }); 
const rows = await db.all('SELECT u.name, u.email, p.* FROM users u LEFT JOIN profiles p ON u.id = p.user_id'); 
console.log(JSON.stringify(rows, null, 2)); 
})();
