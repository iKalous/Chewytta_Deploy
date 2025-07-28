package web.project.chewytta.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    // 密钥（建议使用更安全的方式存储，例如配置文件或环境变量）
    @Value("${jwt.secret-key}")
    private String SECRET_KEY;

    @PostConstruct
    public void init() {
        System.out.println("JWT Secret Key: " + SECRET_KEY); // 添加这行日志
    }

    // 有效时间（例如 24 小时）
    @Value("${jwt.expiration-time}")
    private long EXPIRATION; // milliseconds

    // 从 token 中提取用户名
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // 提取特定的声明
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // 生成 token
    public String generateToken(String username) {
        return generateToken(new HashMap<>(), username);
    }

    // 带额外声明的生成 token 方法
    public String generateToken(Map<String, Object> extraClaims, String username) {
        return buildToken(extraClaims, username, EXPIRATION);
    }

    // 验证 token 是否有效
    public boolean isTokenValid(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    // 检查 token 是否过期
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // 从 token 中提取过期时间
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // 解析所有的声明
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // 获取签名密钥
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // 构建 token
    private String buildToken(
            Map<String, Object> extraClaims,
            String username,
            long expiration
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    // 获取 token 过期时间（新增）
    public Date getExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

}
