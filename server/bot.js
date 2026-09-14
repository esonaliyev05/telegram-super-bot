const TelegramBot=require('node-telegram-bot-api');
const db=require('./database');
let bot,adminId,io;
const menu={reply_markup:{keyboard:[['👤 Profilim','🆔 ID'],['💬 Admin bilan aloqa','🎵 Musiqa'],['🎬 Video','🤖 AI yordam']],resize_keyboard:true}};
const mediaInfo=msg=>{if(msg.photo){return {kind:'photo',file_id:msg.photo.at(-1).file_id,file_name:'photo.jpg',mime_type:'image/jpeg'}}if(msg.video)return {kind:'video',file_id:msg.video.file_id,file_name:'video.mp4',mime_type:msg.video.mime_type||'video/mp4'};if(msg.voice)return {kind:'voice',file_id:msg.voice.file_id,file_name:'voice.ogg',mime_type:msg.voice.mime_type||'audio/ogg'};if(msg.audio)return {kind:'audio',file_id:msg.audio.file_id,file_name:msg.audio.file_name||'audio.mp3',mime_type:msg.audio.mime_type||'audio/mpeg'};if(msg.document)return {kind:'document',file_id:msg.document.file_id,file_name:msg.document.file_name||'file',mime_type:msg.document.mime_type||'application/octet-stream'};return {kind:'text',file_id:'',file_name:'',mime_type:'text/plain'}};
async function setup(token,admin,ioInstance){adminId=Number(admin);io=ioInstance;bot=new TelegramBot(token,{polling:true});
 bot.on('polling_error',e=>console.error('Telegram polling:',e.message));
 bot.on('message',async msg=>{try{if(!msg.from)return;const u=db.upsertUser(msg.from);if(u.blocked&&!isAdmin(msg.from.id))return;const media=mediaInfo(msg),text=msg.text||msg.caption||'';db.addMessage({user_id:msg.from.id,from_type:'user',kind:media.kind,text,file_id:media.file_id,file_name:media.file_name,mime_type:media.mime_type});io.emit('message:new',{userId:msg.from.id});
 if(msg.text==='/start'){await bot.sendMessage(msg.chat.id,`Salom, ${msg.from.first_name||'foydalanuvchi'}! 👋\n\nBotga xush kelibsiz. Pastdagi menyudan foydalaning.`,menu);if(!isAdmin(msg.from.id))notifyAdmin(msg);return}
 if(msg.text==='/id'||msg.text==='🆔 ID')return bot.sendMessage(msg.chat.id,`🆔 Telegram ID: ${msg.from.id}`);
 if(msg.text==='👤 Profilim')return bot.sendMessage(msg.chat.id,`👤 ${msg.from.first_name||''} ${msg.from.last_name||''}\n🔗 @${msg.from.username||'username yo‘q'}\n🆔 ${msg.from.id}`);
 if(msg.text==='💬 Admin bilan aloqa')return bot.sendMessage(msg.chat.id,'💬 Xabaringizni yuboring. Matn, rasm, video, ovoz va fayl qabul qilinadi. Admin sizga bot orqali javob beradi.');
 if(msg.text==='🎵 Musiqa')return bot.sendMessage(msg.chat.id,'🎵 Musiqa nomini yozing. Masalan: Imagine Dragons Believer');
 if(msg.text==='🎬 Video')return bot.sendMessage(msg.chat.id,'🎬 Video nomini yozing. Masalan: JavaScript tutorial');
 if(msg.text==='🤖 AI yordam')return bot.sendMessage(msg.chat.id,'🤖 AI modulini ulash uchun AI_API_KEY sozlang.');
 if(msg.text&&!msg.text.startsWith('/')&&!isAdmin(msg.from.id)){await notifyAdmin(msg);}
 }catch(e){console.error('message handler:',e)}});
 bot.on('callback_query',async q=>{if(!isAdmin(q.from.id))return;try{if(q.data?.startsWith('reply:')){io.emit('admin:reply-request',{userId:Number(q.data.split(':')[1])});await bot.answerCallbackQuery(q.id,{text:'Web panelda javob yozing.'})}}catch(e){console.error(e)}});
 return bot;}
function isAdmin(id){return Number(id)===adminId}
async function notifyAdmin(msg){const name=[msg.from.first_name,msg.from.last_name].filter(Boolean).join(' ')||'User';const kind=mediaInfo(msg).kind;const preview=msg.text||msg.caption||`[${kind}]`;await bot.sendMessage(adminId,`📩 Yangi xabar\n👤 ${name}${msg.from.username?' @'+msg.from.username:''}\n🆔 ${msg.from.id}\n\n${preview}`,{reply_markup:{inline_keyboard:[[{text:'💬 Web panelda javob',callback_data:`reply:${msg.from.id}`}]]}})}
function sendToUser(id,text){return bot.sendMessage(Number(id),text)}
function sendMedia(id,kind,filePath,caption=''){const n=Number(id);if(kind==='photo')return bot.sendPhoto(n,filePath,{caption});if(kind==='video')return bot.sendVideo(n,filePath,{caption});if(kind==='voice')return bot.sendVoice(n,filePath,{caption});if(kind==='audio')return bot.sendAudio(n,filePath,{caption});return bot.sendDocument(n,filePath,{caption})}
function sendTelegramFile(id,kind,fileId,caption=''){const n=Number(id);if(kind==='photo')return bot.sendPhoto(n,fileId,{caption});if(kind==='video')return bot.sendVideo(n,fileId,{caption});if(kind==='voice')return bot.sendVoice(n,fileId,{caption});if(kind==='audio')return bot.sendAudio(n,fileId,{caption});return bot.sendDocument(n,fileId,{caption})}
module.exports={setup,sendToUser,sendMedia,sendTelegramFile};
