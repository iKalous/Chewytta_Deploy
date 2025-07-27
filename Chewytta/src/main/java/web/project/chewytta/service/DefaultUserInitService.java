package web.project.chewytta.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import web.project.chewytta.mapper.UserMapper;
import web.project.chewytta.model.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 默认管理员用户初始化服务
 * 确保系统启动时创建默认的 root 管理员账户
 */
@Service
@Order(100) // 确保在其他初始化服务之后执行
public class DefaultUserInitService implements CommandLineRunner {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 添加延迟和重试机制，确保数据库完全就绪
        int maxRetries = 5;
        int retryDelay = 2000; // 2秒

        for (int i = 0; i < maxRetries; i++) {
            try {
                System.out.println("=== 尝试检查/初始化默认管理员用户 (第" + (i + 1) + "次) ===");
                initializeDefaultAdmin();
                return; // 成功后退出
            } catch (Exception e) {
                System.err.println("❌ 第" + (i + 1) + "次初始化失败: " + e.getMessage());
                if (i == maxRetries - 1) {
                    System.err.println("❌ 达到最大重试次数，用户初始化失败。");
                    System.err.println("💡 建议：如果是数据库连接问题，请检查MySQL容器是否正常启动");
                    // 不抛出异常，让应用继续启动，因为init.sql可能已经创建了用户
                    System.err.println("⚠️  应用将继续启动，如果init.sql已创建用户，系统仍可正常使用");
                } else {
                    System.out.println("⏳ " + retryDelay / 1000 + "秒后重试...");
                    Thread.sleep(retryDelay);
                }
            }
        }
    }

    /**
     * 初始化默认管理员用户
     */
    private void initializeDefaultAdmin() {
        try {
            System.out.println("=== 检查默认管理员用户 ===");

            // 检查是否已存在 root 用户
            User existingRoot = userMapper.selectByUsername("root");

            if (existingRoot == null) {
                // 创建默认 root 用户
                createDefaultRootUser();
                System.out.println("✅ 默认管理员用户 'root' 创建成功（通过应用初始化）");
                System.out.println("🔑 默认密码: 123456");
                System.out.println("⚠️  请在首次登录后修改密码");
            } else {
                System.out.println("✅ 默认管理员用户 'root' 已存在");
                System.out.println("💡 可能是通过init.sql或之前的初始化创建的");

                // 检查密码是否是BCrypt格式，如果不是则重置
                String currentPassword = existingRoot.getPassword();
                boolean isBCryptFormat = currentPassword.startsWith("$2a$") || currentPassword.startsWith("$2b$")
                        || currentPassword.startsWith("$2y$");

                if (!isBCryptFormat) {
                    System.out.println("⚠️  检测到 root 用户密码不是BCrypt格式，正在重置为默认密码...");
                    resetRootPassword(existingRoot);
                    System.out.println("✅ root 用户密码已重置为默认密码: 123456");
                } else {
                    // 验证密码是否正确
                    if (!passwordEncoder.matches("123456", existingRoot.getPassword())) {
                        System.out.println("⚠️  检测到 root 用户密码不是默认密码");
                        System.out.println("💡 如需重置为默认密码 '123456'，请联系开发者");
                    } else {
                        System.out.println("✅ 默认密码验证正确，用户可以使用 root/123456 登录");
                    }
                }
            }

            System.out.println("======================");

        } catch (Exception e) {
            System.err.println("❌ 检查默认管理员用户时发生错误: " + e.getMessage());
            // 重新抛出异常，触发重试机制
            throw new RuntimeException("用户初始化检查失败", e);
        }
    }

    /**
     * 创建默认 root 用户
     */
    private void createDefaultRootUser() {
        User rootUser = new User();
        rootUser.setUsername("root");
        rootUser.setNickname("系统管理员");
        // 使用 PasswordEncoder 确保密码在当前环境下正确加密
        rootUser.setPassword(passwordEncoder.encode("123456"));
        rootUser.setPhone("13800000000");
        rootUser.setEmail("admin@chewytta.com");
        rootUser.setAvatar("/admin-content/system/defaults/admin_avatar.png");
        rootUser.setBalance(BigDecimal.ZERO);
        rootUser.setRole("admin");
        rootUser.setCreatedAt(LocalDateTime.now());

        // 插入数据库
        userMapper.insert(rootUser);

        System.out.println("🎯 用户名: root");
        System.out.println("🎯 密码: 123456");
        System.out.println("🎯 角色: admin");
        System.out.println("🎯 昵称: 系统管理员");
    }

    /**
     * 重置root用户密码为默认密码
     */
    private void resetRootPassword(User existingRoot) {
        // 重新加密密码
        existingRoot.setPassword(passwordEncoder.encode("123456"));
        // 更新数据库
        userMapper.update(existingRoot);

        System.out.println("🔄 root 用户密码已重置");
        System.out.println("🎯 新密码: 123456");
    }
}
