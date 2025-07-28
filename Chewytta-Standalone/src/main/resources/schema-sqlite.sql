-- Chewytta SQLite 数据库架构脚本
-- 适配 SQLite 数据库的 Schema 定义

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    nickname TEXT,
    password TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    avatar TEXT,
    balance REAL DEFAULT 0.00,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建盲盒表
CREATE TABLE IF NOT EXISTS blind_boxes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL,
    is_published INTEGER DEFAULT 0 CHECK (is_published IN (0, 1)),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建商品表
CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    box_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (box_id) REFERENCES blind_boxes(id) ON DELETE CASCADE
);

-- 创建抽取记录表
CREATE TABLE IF NOT EXISTS drawn_boxes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    box_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    price REAL NOT NULL,
    draw_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    draw_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (box_id) REFERENCES blind_boxes(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- 创建收藏表
CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    box_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (box_id) REFERENCES blind_boxes(id) ON DELETE CASCADE
);

-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    box_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (box_id) REFERENCES blind_boxes(id) ON DELETE CASCADE
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_items_box_id ON items(box_id);
CREATE INDEX IF NOT EXISTS idx_drawn_boxes_user_id ON drawn_boxes(user_id);
CREATE INDEX IF NOT EXISTS idx_drawn_boxes_box_id ON drawn_boxes(box_id);
CREATE INDEX IF NOT EXISTS idx_drawn_boxes_item_id ON drawn_boxes(item_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_box_id ON favorites(box_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_box_id ON comments(box_id);
