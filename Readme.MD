Proyek API Top Up Balance
API untuk melakukan Top Up Balance sederhana pada pengguna menggunakan JWT untuk autentikasi. Proyek ini dibangun dengan Node.js menggunakan Express, dan menggunakan Sequelize untuk ORM.

⚙️ Teknologi yang Digunakan
Node.js - Runtime environment JavaScript

Express.js - Framework web untuk Node.js

Sequelize - ORM untuk bekerja dengan database

JWT (JSON Web Token) - Untuk autentikasi pengguna

MySQL atau PostgreSQL - Database untuk menyimpan data pengguna dan transaksi

Multer - Untuk meng-handle file upload (misalnya untuk profile image)

📥 Cara Install & Jalankan
1. Clone Repository
Clone repository ini ke komputer lokal Anda dengan menggunakan perintah berikut:


git clone 
cd nama-project
2. Install Dependencies
npm install
Setelah berhasil meng-clone project, install semua dependency yang dibutuhkan menggunakan npm:

3. Setup Environment File (.env)
Buat file .env di root folder proyek Anda dan isi dengan konfigurasi berikut:


PORT=3000
JWT_SECRETjwt_secret
DB_USERNAME=root
DB_PASSWORD=password_anda
DB_NAME=nama_database
DB_HOST=localhost
DB_PORT=port anda
DB_DIALECT=database
RAILWAY_PUBLIC_DOMAIN

4. Jalankan Database

Jika Anda belum membuat tabel-tabel di database,
npx sequelize-cli db:create atau npm run create
npx sequelize-cli db:migrate atau npm run migrate
npx sequelize: db:seed:all atau npm run seed

5. Jalankan Proyek
Jalankan aplikasi menggunakan perintah berikut:
pasang nodemon script start di package.json

npm start