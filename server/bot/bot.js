const TelegramBot=require('node-telegram-bot-api');
const db=require('../database/database');
let bot;
function setup(token,adminId,io){
 bot=new TelegramBot(token,{polling:true});
 const isAdmin=id=>Number(id)===Number(adminId);
 const menu={reply_markup:{keyboard:[['👤 Profilim','🆔 ID'],['💬 Admin bilan aloqa','🎵 Musiqa qidirish'],['🎬 Video qidirish','🤖 AI yordam']],resize_keyboard:true}};
 bot.on('message',async msg=>{
   if(!msg.from)return; const u=db.upsertUser(msg.from); if(u.blocked&&!isAdmin(msg.from.id)) return;
   let kind='text',text=msg.text||msg.caption||'';
   if(msg.photo)kind='photo'; else if(msg.video)kind='video'; else if(msg.voice)kind='voice'; else if(msg.audio)kind='audio'; else if(msg.document)kind='document';
   db.addMessage({user_id:msg.from.id,from_type:'user',kind,text,file_id:msg.photo?msg.photo.at(-1).file_id:msg.video?.file_id||msg.voice?.file_id||msg.audio?.file_id||msg.document?.file_id||'',file_name:msg.document?.file_name||''});
   io.emit('message:new',{userId:msg.from.id,message:{from_type:'user',kind,text,created_at:new Date().toISOString()}});
   if(msg.text==='/start'){return bot.sendMessage(msg.chat.id,`Salom, ${msg.from.first_name||'foydalanuvchi'}! 👋\n\nBotimizga xush kelibsiz.`,menu)}
   if(msg.text==='/id'||msg.text==='🆔 ID')return bot.sendMessage(msg.chat.id,`🆔 Telegram ID: ${msg.from.id}`);
   if(msg.text==='👤 Profilim')return bot.sendMessage(msg.chat.id,`👤 ${msg.from.first_name||''} ${msg.from.last_name||''}\n🔗 @${msg.from.username||'username yo‘q'}\n🆔 ${msg.from.id}`);
   if(msg.text==='💬 Admin bilan aloqa')return bot.sendMessage(msg.chat.id,'💬 Xabaringizni yozing. Admin ko‘rib chiqadi. Matn, rasm, video, ovoz yoki fayl yuborishingiz mumkin.');
   if(msg.text==='🎵 Musiqa qidirish')return bot.sendMessage(msg.chat.id,'🎵 Musiqa nomini yozing. Men qidiruv havolalarini tayyorlayman.');
   if(msg.text==='🎬 Video qidirish')return bot.sendMessage(msg.chat.id,'🎬 Video nomini yozing. Men qidiruv havolalarini tayyorlayman.');
   if(msg.text==='🤖 AI yordam')return bot.sendMessage(msg.chat.id,'🤖 AI modulini API kaliti bilan ulash mumkin. Hozircha savolingizni yozing.');
   if(msg.text && !msg.text.startsWith('/')){
     if(isAdmin(msg.from.id)) return;
     await bot.sendMessage(adminId,`📩 Yangi xabar\n👤 ${msg.from.first_name||''} @${msg.from.username||''}\n🆔 ${msg.from.id}\n\n${msg.text}`,{reply_markup:{inline_keyboard:[[{text:'💬 Javob berish',callback_data:`reply:${msg.from.id}`}]]}});
   }
 });
 bot.on('callback_query',q=>{if(isAdmin(q.from.id)&&q.data?.startsWith('reply:')){io.emit('admin:reply-request',{userId:Number(q.data.split(':')[1])});bot.answerCallbackQuery(q.id,{text:'Web paneldan javob yozing.'})}});
 return bot;
}
function sendToUser(userId,payload){return bot.sendMessage(userId,payload)}
async function sendMedia(userId,kind,filePath,caption){if(kind==='photo')return bot.sendPhoto(userId,filePath,{caption});if(kind==='video')return bot.sendVideo(userId,filePath,{caption});if(kind==='voice')return bot.sendVoice(userId,filePath,{caption});if(kind==='audio')return bot.sendAudio(userId,filePath,{caption});return bot.sendDocument(userId,filePath,{caption})}
module.exports={setup,sendToUser,sendMedia};
