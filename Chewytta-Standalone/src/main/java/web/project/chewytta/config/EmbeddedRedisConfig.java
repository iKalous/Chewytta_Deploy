package web.project.chewytta.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import redis.embedded.RedisServer;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.IOException;

/**
 * 嵌入式 Redis 配置
 * 仅在 standalone 配置文件激活时启用
 */
@Configuration
@Profile("standalone")
@ConditionalOnProperty(name = "app.embedded.redis.enabled", havingValue = "true", matchIfMissing = true)
public class EmbeddedRedisConfig {

    private RedisServer redisServer;

    /**
     * 创建并启动嵌入式 Redis 服务器
     */
    @PostConstruct
    public void startRedis() throws IOException {
        try {
            // 创建 Redis 服务器实例，使用默认端口 6379
            redisServer = new RedisServer(6379);

            // 启动 Redis 服务器
            redisServer.start();

            System.out.println("✅ 嵌入式 Redis 服务器已启动在端口 6379");
        } catch (Exception e) {
            System.err.println("❌ 启动嵌入式 Redis 服务器失败: " + e.getMessage());
            // 如果启动失败，不抛出异常，让应用继续运行
            // 应用会回退到不使用 Redis 的模式
        }
    }

    /**
     * 停止嵌入式 Redis 服务器
     */
    @PreDestroy
    public void stopRedis() {
        if (redisServer != null && redisServer.isActive()) {
            try {
                redisServer.stop();
                System.out.println("✅ 嵌入式 Redis 服务器已停止");
            } catch (Exception e) {
                System.err.println("⚠️ 停止嵌入式 Redis 服务器时出现错误: " + e.getMessage());
            }
        }
    }

    /**
     * Redis 服务器 Bean
     * 供其他组件注入使用
     */
    @Bean
    public RedisServer redisServer() {
        return redisServer;
    }
}
