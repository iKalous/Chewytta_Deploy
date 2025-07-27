-- Chewytta H2 数据库初始化脚本

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    nickname VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    avatar VARCHAR(500),
    balance DECIMAL(10,2) DEFAULT 0.00,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);

-- 盲盒表
CREATE TABLE IF NOT EXISTS blind_boxes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image VARCHAR(500),
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);

-- 物品表
CREATE TABLE IF NOT EXISTS items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image VARCHAR(500),
    rarity VARCHAR(20) DEFAULT 'common',
    box_id BIGINT,
    FOREIGN KEY (box_id) REFERENCES blind_boxes(id) ON DELETE CASCADE
);

-- 用户抽取记录表
CREATE TABLE IF NOT EXISTS drawn_boxes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    box_id BIGINT NOT NULL,
    item_id BIGINT,
    price DECIMAL(10,2),
    quantity INT DEFAULT 1,
    drawn_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    status VARCHAR(20) DEFAULT 'completed',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (box_id) REFERENCES blind_boxes(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL
);

-- 用户收藏表
CREATE TABLE IF NOT EXISTS favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    box_id BIGINT NOT NULL,
    favorited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (box_id) REFERENCES blind_boxes(id) ON DELETE CASCADE,
    UNIQUE (user_id, box_id)
);

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    box_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    rating INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (box_id) REFERENCES blind_boxes(id) ON DELETE CASCADE
);

-- 注意：默认管理员用户 (用户名: root, 密码: 123456) 
-- 将由 DefaultUserInitService 在应用启动时自动创建
-- 这确保了在任何环境下密码都能正确初始化
