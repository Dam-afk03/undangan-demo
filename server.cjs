const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. SETUP PENYIMPANAN FOTO (MULTER)
// ==========================================
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir); // Buat folder otomatis jika belum ada
}
app.use('/uploads', express.static(uploadDir)); // Agar foto bisa diakses web

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        // Nama foto otomatis diubah agar tidak bentrok
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage });

// ==========================================
// 2. KONEKSI DATABASE LARAGON
// ==========================================
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'adam',
    password: process.env.DB_PASS || 'aicaa03',
    database: process.env.DB_NAME || 'wedding_db',
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error('Gagal konek ke Laragon:', err.message);
        return;
    }
    console.log('✅ Berhasil terhubung ke database wedding_db di Laragon!');
});

// ==========================================
// 3. JALUR (ENDPOINT) UNTUK RSVP
// ==========================================
app.post('/api/rsvp', (req, res) => {
    const { name, attendance, message } = req.body;
    // Pastikan nama tabelnya rsvp_wishes sesuai gambar HeidiSQL Anda
    const sql = 'INSERT INTO rsvp_wishes (name, attendance, message) VALUES (?, ?, ?)';
    
    db.query(sql, [name, attendance, message], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Gagal' });
        }
        res.status(200).json({ message: 'RSVP sukses!' });
    });
});

// ==========================================
// 4. JALUR (ENDPOINT) UNTUK PENGATURAN & FOTO KLIEN
// ==========================================
// A. Mengambil data untuk ditampilkan di web
app.get('/api/config', (req, res) => {
    db.query('SELECT * FROM wedding_config LIMIT 1', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0] || {});
    });
});

// B. Menyimpan (Update) data & foto dari form Halaman Admin Klien
app.post('/api/config', upload.fields([
    { name: 'cover_photo', maxCount: 1 },
    { name: 'groom_photo', maxCount: 1 },
    { name: 'bride_photo', maxCount: 1 }
]), (req, res) => {
    const { groom_name, bride_name, wedding_date } = req.body;
    
    // Ambil nama file foto jika klien mengunggah foto baru
    const cover_photo = req.files['cover_photo'] ? req.files['cover_photo'][0].filename : req.body.existing_cover;
    const groom_photo = req.files['groom_photo'] ? req.files['groom_photo'][0].filename : req.body.existing_groom;
    const bride_photo = req.files['bride_photo'] ? req.files['bride_photo'][0].filename : req.body.existing_bride;

    // KITA UPDATE BARIS ID = 1
    const sql = `
        UPDATE wedding_config 
        SET groom_name=?, bride_name=?, wedding_date=?, cover_photo=?, groom_photo=?, bride_photo=? 
        WHERE id = 1
    `;
    const values = [groom_name, bride_name, wedding_date, cover_photo, groom_photo, bride_photo];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Pengaturan dan Foto berhasil diperbarui!' });
    });
});

// ==========================================
// 5. NYALAKAN SERVER
// ==========================================
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server Backend jalan di http://localhost:${PORT}`);
});