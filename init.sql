-- Chewytta 数据库初始化脚本
-- 该脚本会在MySQL容器首次启动时自动执行

-- 设置字符集
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 创建用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `nickname` varchar(50) DEFAULT NULL,
  `password` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT '0.00',
  `role` enum('user', 'admin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建盲盒表
CREATE TABLE IF NOT EXISTS `blind_boxes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `image` varchar(500) DEFAULT NULL COMMENT '盲盒封面图片URL',
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `is_published` boolean DEFAULT FALSE,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建商品表
CREATE TABLE IF NOT EXISTS `items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `box_id` bigint NOT NULL,
  `name` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_box_id` (`box_id`),
  FOREIGN KEY (`box_id`) REFERENCES `blind_boxes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建抽取记录表
CREATE TABLE IF NOT EXISTS `drawn_boxes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `box_id` bigint NOT NULL,
  `item_id` bigint NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `draw_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `draw_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_box_id` (`box_id`),
  KEY `idx_item_id` (`item_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`box_id`) REFERENCES `blind_boxes` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建收藏表
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `box_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_box_id` (`box_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`box_id`) REFERENCES `blind_boxes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建评论表
CREATE TABLE IF NOT EXISTS `comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `box_id` bigint NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_box_id` (`box_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`box_id`) REFERENCES `blind_boxes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建默认管理员用户
-- 密码 '123456' 的BCrypt加密结果（兼容Spring Boot）
INSERT IGNORE INTO `users` (
    `username`, 
    `nickname`, 
    `password`, 
    `phone`, 
    `email`, 
    `avatar`, 
    `balance`, 
    `role`, 
    `created_at`
) VALUES (
    'root',
    '系统管理员',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    '13800000000',
    'admin@chewytta.com',
    '/admin-content/system/defaults/admin_avatar.png',
    0.00,
    'admin',
    NOW()
);

-- 确保有至少一个管理员用户，方便系统使用
-- 用户名: root
-- 密码: 123456

SET FOREIGN_KEY_CHECKS = 1;
