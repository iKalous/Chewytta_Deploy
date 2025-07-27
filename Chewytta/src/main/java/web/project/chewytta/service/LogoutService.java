package web.project.chewytta.service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class LogoutService {

    private final StringRedisTemplate redisTemplate;

    public LogoutService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void logout(String token) {
        String key = "logout::" + token;
        redisTemplate.opsForValue().set(key, "logged_out", 30, TimeUnit.DAYS); // 设置 Token 失效时间
    }
    public boolean isTokenInvalid(String token) {
        String key = "logout::" + token;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

}
