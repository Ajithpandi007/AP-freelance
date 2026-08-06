-- MySQL Database Schema for Freelance Service & Order Management Platform
-- Engine: InnoDB | Charset: utf8mb4

CREATE DATABASE IF NOT EXISTS `freelance_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `freelance_db`;

-- 1. Services Table
CREATE TABLE IF NOT EXISTS `services` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `shortDescription` TEXT NOT NULL,
  `fullDescription` TEXT NOT NULL,
  `basePrice` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `turnaroundDays` INT NOT NULL DEFAULT 7,
  `features` JSON NOT NULL,
  `threeGeometry` VARCHAR(50) NOT NULL DEFAULT 'icosahedron',
  `color` VARCHAR(20) NOT NULL DEFAULT '#6366f1',
  `popular` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(32) NOT NULL PRIMARY KEY,
  `clientName` VARCHAR(255) NOT NULL,
  `clientEmail` VARCHAR(255) NOT NULL,
  `companyName` VARCHAR(255) NULL,
  `serviceId` VARCHAR(64) NOT NULL,
  `serviceTitle` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `budget` DECIMAL(10, 2) NOT NULL,
  `deadline` VARCHAR(50) NOT NULL,
  `requirements` TEXT NOT NULL,
  `status` ENUM('pending', 'accepted', 'in_progress', 'review', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  `progressPercent` INT NOT NULL DEFAULT 0,
  `deliverableUrl` TEXT NULL,
  `privateNotes` TEXT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Order Messages Table
CREATE TABLE IF NOT EXISTS `order_messages` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `orderId` VARCHAR(32) NOT NULL,
  `sender` ENUM('client', 'freelancer', 'system') NOT NULL,
  `senderName` VARCHAR(255) NOT NULL,
  `text` TEXT NOT NULL,
  `attachments` JSON NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Sample Seed Data Insertion
INSERT INTO `services` (`id`, `title`, `category`, `shortDescription`, `fullDescription`, `basePrice`, `turnaroundDays`, `features`, `threeGeometry`, `color`, `popular`)
VALUES 
('srv-web3d', 'Interactive 3D Web Application', '3D', 'High-performance WebGL & Three.js visual web apps with fluid animations.', 'Full design & development of custom 3D web experiences using Three.js, React, WebGL shaders, responsive canvas, and Tailwind CSS.', 1450.00, 10, '["Interactive 3D WebGL Scene", "Custom Shaders & Lighting", "Full React & Tailwind Frontend", "Mobile Touch Optimization", "3 Revision Rounds"]', 'icosahedron', '#6366f1', 1),
('srv-fullstack', 'Full-Stack Web App & Express API', 'fullstack', 'Scalable Node.js & React full-stack application with database integration.', 'End-to-end full stack software with Express.js REST API, authentication, database CRUD operations, and responsive modern dashboard UI.', 1890.00, 14, '["Express.js Server & REST API", "React 19 + TypeScript Frontend", "MySQL / SQL Database Setup", "Authentication & Security", "Deployment Setup"]', 'dodecahedron', '#06b6d4', 1),
('srv-mobile', 'Cross-Platform Mobile App', 'mobile', 'Seamless React Native / PWA mobile app for iOS and Android.', 'Mobile app engineering with slick gesture navigation, offline caching, push notifications, and API sync.', 1600.00, 12, '["iOS & Android Support", "Native Gestures & Smooth UI", "Backend API Integration", "App Store Prep Checklist", "Analytics & Offline Sync"]', 'torusKnot', '#ec4899', 0),
('srv-ai', 'AI Engine & Gemini API Solution', 'ai', 'Custom AI agent, recommendation, or LLM pipeline integrated into your app.', 'Smart AI automation using Gemini API, custom prompts, document parsing, automated workflows, and streaming UI.', 1250.00, 7, '["Gemini API Integration", "Custom Agent & Workflows", "Streaming AI Responses", "Error Recovery & Safeguards", "Admin AI Controls"]', 'octahedron', '#10b981', 0)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

INSERT INTO `orders` (`id`, `clientName`, `clientEmail`, `companyName`, `serviceId`, `serviceTitle`, `category`, `budget`, `deadline`, `requirements`, `status`, `progressPercent`, `deliverableUrl`, `privateNotes`, `createdAt`, `updatedAt`)
VALUES 
('ORD-7412', 'Sarah Jenkins', 'sarah@vertexmedia.com', 'Vertex Media Group', 'srv-web3d', 'Interactive 3D Web Application', '3D', 1800.00, '2026-08-25', 'Need a 3D interactive hero section for our luxury architectural firm showcasing 3D building models.', 'in_progress', 65, 'https://github.com/freelancer/vertex-3d-demo', 'Initial 3D mesh loads fast. Working on lighting shaders.', '2026-08-01 10:15:00', '2026-08-05 14:20:00'),
('ORD-8930', 'David Chen', 'david@nextech.io', 'NexTech Solutions', 'srv-fullstack', 'Full-Stack Web App & Express API', 'fullstack', 2200.00, '2026-09-01', 'Build a real-time order dashboard with Express backend and MySQL persistent storage.', 'review', 90, 'https://nextech-demo.run.app', 'Waiting for client review on final API endpoints.', '2026-07-28 09:00:00', '2026-08-05 11:30:00'),
('ORD-9104', 'Elena Rostova', 'elena@designcraft.co', 'DesignCraft Studio', 'srv-ai', 'AI Engine & Gemini API Solution', 'ai', 1350.00, '2026-08-18', 'Integrate Gemini API for auto-generating project proposals and design descriptions.', 'completed', 100, 'https://github.com/freelancer/gemini-proposal-engine', 'Delivered fully tested API endpoints and React components.', '2026-07-20 16:40:00', '2026-08-02 18:10:00')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

INSERT INTO `order_messages` (`id`, `orderId`, `sender`, `senderName`, `text`, `attachments`, `createdAt`)
VALUES 
('msg-101', 'ORD-7412', 'client', 'Sarah Jenkins', 'Hi! Super excited to get started. I uploaded our brand guidelines and sample 3D CAD files.', '["https://example.com/assets/brand-guide.pdf"]', '2026-08-01 10:20:00'),
('msg-102', 'ORD-7412', 'freelancer', 'Freelance Studio', 'Thanks Sarah! I have set up the 3D scene architecture. You can review the initial draft link above.', '[]', '2026-08-02 11:00:00'),
('msg-103', 'ORD-8930', 'freelancer', 'Freelance Studio', 'David, the Express REST backend and MySQL database structure are complete! Ready for final staging test.', '[]', '2026-08-04 15:30:00')
ON DUPLICATE KEY UPDATE `text` = VALUES(`text`);
