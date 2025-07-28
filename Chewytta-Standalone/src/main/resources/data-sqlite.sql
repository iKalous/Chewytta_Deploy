-- Chewytta SQLite 初始数据脚本
-- 插入一些示例数据供测试使用

-- 插入示例盲盒数据
INSERT OR IGNORE INTO blind_boxes (id, name, image, price, stock, is_published, description) VALUES
(1, '神秘宝盒系列一', '/images/boxes/mystery-box-1.jpg', 29.99, 100, 1, '包含各种神秘小物件的宝盒，每个都有惊喜！'),
(2, '动漫手办盲盒', '/images/boxes/anime-figures.jpg', 39.99, 50, 1, '精美动漫手办，收集你喜爱的角色！'),
(3, '文具盲盒', '/images/boxes/stationery.jpg', 19.99, 200, 1, '可爱文具用品，让学习更有趣！'),
(4, '零食盲盒', '/images/boxes/snacks.jpg', 24.99, 150, 1, '来自世界各地的美味零食！'),
(5, '数码配件盲盒', '/images/boxes/digital.jpg', 49.99, 75, 1, '实用数码配件，提升你的科技生活！');

-- 插入示例商品数据
INSERT OR IGNORE INTO items (id, box_id, name, image) VALUES
-- 神秘宝盒系列一的商品
(1, 1, '幸运硬币', '/images/items/lucky-coin.jpg'),
(2, 1, '神秘钥匙扣', '/images/items/mystery-keychain.jpg'),
(3, 1, '迷你水晶球', '/images/items/crystal-ball.jpg'),
(4, 1, '魔法小瓶', '/images/items/magic-bottle.jpg'),
(5, 1, '星空贴纸', '/images/items/star-stickers.jpg'),

-- 动漫手办盲盒的商品
(6, 2, '小樱手办', '/images/items/sakura-figure.jpg'),
(7, 2, '鸣人手办', '/images/items/naruto-figure.jpg'),
(8, 2, '路飞手办', '/images/items/luffy-figure.jpg'),
(9, 2, '初音未来手办', '/images/items/miku-figure.jpg'),
(10, 2, '皮卡丘手办', '/images/items/pikachu-figure.jpg'),

-- 文具盲盒的商品
(11, 3, '可爱圆珠笔', '/images/items/cute-pen.jpg'),
(12, 3, '卡通橡皮擦', '/images/items/cartoon-eraser.jpg'),
(13, 3, '彩色便签纸', '/images/items/colorful-notes.jpg'),
(14, 3, '小熊胶带', '/images/items/bear-tape.jpg'),
(15, 3, '星星书签', '/images/items/star-bookmark.jpg'),

-- 零食盲盒的商品
(16, 4, '日本抹茶巧克力', '/images/items/matcha-chocolate.jpg'),
(17, 4, '韩式海苔', '/images/items/korean-seaweed.jpg'),
(18, 4, '泰式芒果干', '/images/items/thai-mango.jpg'),
(19, 4, '法式马卡龙', '/images/items/french-macaron.jpg'),
(20, 4, '意式咖啡豆', '/images/items/italian-coffee.jpg'),

-- 数码配件盲盒的商品
(21, 5, 'USB-C数据线', '/images/items/usbc-cable.jpg'),
(22, 5, '无线充电器', '/images/items/wireless-charger.jpg'),
(23, 5, '蓝牙耳机', '/images/items/bluetooth-earphones.jpg'),
(24, 5, '手机支架', '/images/items/phone-stand.jpg'),
(25, 5, '移动电源', '/images/items/power-bank.jpg');

-- 注意：不插入用户数据，因为DefaultUserInitService会在启动时创建管理员用户
