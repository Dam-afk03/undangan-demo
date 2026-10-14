-- =====================================================================
-- DATABASE SCHEMA & DUMP: wedding_db (Laragon / XAMPP MySQL)
-- Undangan Pernikahan Digital & RSVP System
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `wedding_db` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `wedding_db`;

-- ---------------------------------------------------------------------
-- 1. Tabel Tamu Undangan (guests)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `guests` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(32) NULL,
  `guest_group` ENUM('Keluarga', 'Sahabat', 'Rekan Kerja', 'VIP', 'Umum') DEFAULT 'Umum',
  `is_vip` BOOLEAN DEFAULT FALSE,
  `status` ENUM('pending', 'hadir', 'tidak_hadir', 'ragu') DEFAULT 'pending',
  `pax_count` INT DEFAULT 0,
  `qr_token` VARCHAR(64) UNIQUE NOT NULL,
  `is_checked_in` BOOLEAN DEFAULT FALSE,
  `checked_in_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_guests_group` (`guest_group`),
  INDEX `idx_guests_status` (`status`),
  INDEX `idx_qr_token` (`qr_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. Tabel Doa & Ucapan RSVP (rsvp_wishes)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rsvp_wishes` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `attendance` ENUM('hadir', 'tidak_hadir', 'ragu') NOT NULL DEFAULT 'hadir',
  `pax` INT DEFAULT 1,
  `message` TEXT NOT NULL,
  `likes` INT DEFAULT 0,
  `reply` TEXT NULL,
  `replied_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_rsvp_attendance` (`attendance`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. Tabel Kado Digital & Amplop (digital_gifts)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `digital_gifts` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `sender_name` VARCHAR(255) NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `payment_method` VARCHAR(64) NOT NULL,
  `account_number` VARCHAR(64) NULL,
  `receipt_code` VARCHAR(64) UNIQUE NULL,
  `status` ENUM('pending', 'success', 'failed') DEFAULT 'success',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. Tabel Konfigurasi Mempelai / Client (wedding_config)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `wedding_config` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `client_slug` VARCHAR(64) UNIQUE NOT NULL,
  `couple_title` VARCHAR(150) NOT NULL,
  `wedding_date` DATETIME NOT NULL,
  `display_date` VARCHAR(100) NOT NULL,
  `cover_photo` TEXT NULL,
  `groom_name` VARCHAR(150) NOT NULL,
  `groom_nickname` VARCHAR(50) NOT NULL,
  `groom_parents` VARCHAR(255) NULL,
  `groom_instagram` VARCHAR(100) NULL,
  `groom_photo` TEXT NULL,
  `bride_name` VARCHAR(150) NOT NULL,
  `bride_nickname` VARCHAR(50) NOT NULL,
  `bride_parents` VARCHAR(255) NULL,
  `bride_instagram` VARCHAR(100) NULL,
  `bride_photo` TEXT NULL,
  `akad_location` VARCHAR(255) NULL,
  `akad_address` TEXT NULL,
  `akad_time` VARCHAR(100) NULL,
  `resepsi_location` VARCHAR(255) NULL,
  `resepsi_address` TEXT NULL,
  `resepsi_time` VARCHAR(100) NULL,
  `audio_url` TEXT NULL,
  `config_json` LONGTEXT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- CONTOH DATA DUMMY AWAL (SEED DATA)
-- =====================================================================
INSERT INTO `guests` (`id`, `name`, `phone`, `guest_group`, `is_vip`, `status`, `pax_count`, `qr_token`) VALUES
('gst-1', 'Kak Yulia & Keluarga', '081299887711', 'Sahabat', FALSE, 'pending', 0, 'WED-YUL-001'),
('gst-2', 'Mba Tita', '081388776622', 'Keluarga', FALSE, 'pending', 0, 'WED-TIT-002'),
('gst-3', 'Bpk. H. Abdullah & Ibu', '081299887766', 'VIP', TRUE, 'hadir', 2, 'WED-VIP-006'),
('gst-4', 'Dimas Satria & Partner', '081388776655', 'Sahabat', FALSE, 'hadir', 2, 'WED-REG-007'),
('gst-5', 'Rapli', '085799881122', 'Sahabat', FALSE, 'tidak_hadir', 0, 'WED-REG-008');

INSERT INTO `rsvp_wishes` (`id`, `name`, `attendance`, `pax`, `message`, `likes`) VALUES
('wish-1', 'Dimas Satria & Keluarga', 'hadir', 2, 'Barakallahu lakuma wa baraka alaikuma! Selamat menempuh hidup baru, semoga rukun dan sakinah mawaddah warahmah selamanya.', 12),
('wish-2', 'Nabila Putri', 'hadir', 1, 'MasyaAllah selamat berbahagia! Semoga menjadi keluarga yang sakinah, mawaddah, wa rahmah.', 8),
('wish-3', 'Rapli', 'tidak_hadir', 0, 'Selamat menempuh hidup baru! Semoga samawa selalu 🥰🥰', 3);

-- =====================================================================
-- SELESAI
-- File ini dapat diimpor langsung via HeidiSQL / phpMyAdmin di Laragon
-- =====================================================================
