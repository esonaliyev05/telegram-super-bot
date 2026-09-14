# Telegram Super Bot Pro

Node.js + Telegram Bot API + HTML/CSS/JavaScript admin panel. Foydalanuvchi `/start` bosadi, admin esa web paneldan user bilan real-time aloqa qiladi.

## 1. O‘rnatish

```bash
npm install
```

`.env.example` ni `.env` ga nusxalang va qiymatlarni kiriting:

```env
BOT_TOKEN=YANGI_BOTFATHER_TOKEN
ADMIN_ID=YOUR_TELEGRAM_ID
ADMIN_PASSWORD=KUChLI_PAROL
PORT=3000
YOUTUBE_API_KEY=
```

Ishga tushirish:

```bash
npm start
```

Panel: `http://localhost:3000/admin`

## 2. Asosiy imkoniyatlar

- `/start` qilgan userlarni SQLite bazaga saqlash
- Admin login
- User qidirish, block/unblock
- Real-time user ↔ admin chat
- Text, photo, video, voice, audio, document yuborish
- Broadcast
- Dashboard statistika
- Musiqa qidirish: iTunes Search API orqali natija va 30 soniyagacha preview mavjud bo‘lsa player
- Video qidirish: YouTube Data API key bo‘lsa real natijalar; key bo‘lmasa YouTube qidiruv havolasi
- Socket.IO real-time yangilanish
- 50 MB gacha admin media upload

## 3. Internetga chiqarish

Bot polling rejimida doimiy ishlaydigan Node hosting/VPS talab qiladi. Render, Railway, VPS kabi persistent Node servisda ishlatish mumkin. `PORT` hosting bergan portdan olinadi.

HTTPS domen bo‘lsa, admin panelni reverse proxy/hosting orqali himoyalang. `ADMIN_PASSWORD` kuchli bo‘lsin.

## 4. YouTube qidiruvi

Aniq video natijalarini web panelda olish uchun Google Cloud'da YouTube Data API v3 yoqib, API keyni `.env` dagi `YOUTUBE_API_KEY` ga yozing. Key bo‘lmasa ham qidiruv tugmasi ishlaydi va YouTube qidiruv sahifasini ochadi.

## 5. Xavfsizlik

- Bot tokenni GitHub/chatga joylamang.
- Eski token oshkor bo‘lgan bo‘lsa BotFather'da revoke qiling.
- `.env` ni GitHub'ga yubormang.
- Productionda kuchli `ADMIN_PASSWORD` ishlating.
- Public serverda HTTPS ishlating.
