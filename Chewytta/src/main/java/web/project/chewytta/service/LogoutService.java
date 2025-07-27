package web.project.chewytta.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class LogoutService {

    private static final Logger logger = LoggerFactory.getLogger(LogoutService.class);
    private final StringRedisTemplate redisTemplate;

    public LogoutService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void logout(String token) {
        try {
            String key = "logout::" + token;
            redisTemplate.opsForValue().set(key, "logged_out", 30, TimeUnit.DAYS);
            logger.debug("Token added to logout blacklist: {}", token);
        } catch (Exception e) {
            logger.warn("Failed to add token to Redis blacklist (Redis unavailable): {}", e.getMessage());
            // 当 Redis 不可用时，我们只记录日志，不中断业务流程
        }
    }

    public boolean isTokenInvalid(String token) {
        try {
            String key = "logout::" + token;
            Boolean result = redisTemplate.hasKey(key);
            return Boolean.TRUE.equals(result);
        } catch (Exception e) {
            logger.warn("Failed to check token blacklist in Redis (Redis unavailable): {}", e.getMessage());
            // 当 Redis 不可用时，默认认为 token 是有效的（降级处理）
            // 这样可以保证在 Redis 故障时，用户仍然可以正常访问系统
            return false;
        }
    }
}
