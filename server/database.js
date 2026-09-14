const Database=require('better-sqlite3');
const path=require('path');
const db=new Database(path.join(__dirname,'bot.db'));
db.pragma('journal_mode=WAL');
db.exec(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,first_name TEXT,last_name TEXT,username TEXT,language_code TEXT,joined_at TEXT,last_seen TEXT,blocked INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL,from_type TEXT NOT NULL,kind TEXT NOT NULL,text TEXT DEFAULT '',file_id TEXT DEFAULT '',file_name TEXT DEFAULT '',mime_type TEXT DEFAULT '',created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id);`);
const now=()=>new Date().toISOString();
function upsertUser(u){const old=db.prepare('SELECT id FROM users WHERE id=?').get(u.id);if(old)db.prepare('UPDATE users SET first_name=?,last_name=?,username=?,language_code=?,last_seen=? WHERE id=?').run(u.first_name||'',u.last_name||'',u.username||'',u.language_code||'',now(),u.id);else db.prepare('INSERT INTO users VALUES(?,?,?,?,?,?,?,0)').run(u.id,u.first_name||'',u.last_name||'',u.username||'',u.language_code||'',now(),now());return getUser(u.id)}
const getUser=id=>db.prepare('SELECT * FROM users WHERE id=?').get(id);
const users=()=>db.prepare('SELECT * FROM users ORDER BY last_seen DESC').all();
const addMessage=m=>db.prepare('INSERT INTO messages(user_id,from_type,kind,text,file_id,file_name,mime_type,created_at) VALUES(?,?,?,?,?,?,?,?)').run(m.user_id,m.from_type,m.kind,m.text||'',m.file_id||'',m.file_name||'',m.mime_type||'',now());
const messages=id=>db.prepare('SELECT * FROM messages WHERE user_id=? ORDER BY id ASC').all(id);
const stats=()=>({total:db.prepare('SELECT COUNT(*) c FROM users').get().c,blocked:db.prepare('SELECT COUNT(*) c FROM users WHERE blocked=1').get().c,today:db.prepare("SELECT COUNT(*) c FROM users WHERE date(joined_at,'localtime')=date('now','localtime')").get().c,messages:db.prepare('SELECT COUNT(*) c FROM messages').get().c});
const setBlocked=(id,v)=>db.prepare('UPDATE users SET blocked=? WHERE id=?').run(v?1:0,id);
module.exports={upsertUser,getUser,users,addMessage,messages,stats,setBlocked};
