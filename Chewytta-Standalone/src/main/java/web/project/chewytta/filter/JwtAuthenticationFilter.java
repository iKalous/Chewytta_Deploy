package web.project.chewytta.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import web.project.chewytta.service.LogoutService;
import web.project.chewytta.utils.JwtUtil;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    // 需要JWT认证的API路径（其他所有路径都放行给静态资源处理器）
    private static final String[] PROTECTED_API_PATHS = {
            "/api/**"
    };
    
    // 不需要JWT认证的API路径（公开接口）
    private static final String[] PUBLIC_API_PATHS = {
            "/api/users/login",
            "/api/users/register",
            "/api/users/logout",
            "/api/products/**",
            "/api/categories/**", 
            "/api/banners/**",
            "/api/promotions/**",
            "/api/blind-boxes",
            "/api/blind-boxes/search"
    };
    private final PathMatcher pathMatcher = new AntPathMatcher();

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private LogoutService logoutService;

    public JwtAuthenticationFilter() {
        System.err.println(">>> JWT FILTER CONSTRUCTOR CALLED <<<");
        logger.info(">>> JWT FILTER CONSTRUCTOR CALLED <<<");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {
        String requestURI = request.getRequestURI();

        // 使用 System.err 确保在 Docker 日志中可见
        System.err.println(">>> JWT Filter: Processing " + requestURI);

        // 检查是否为需要保护的API路径
        if (!isProtectedApiPath(requestURI)) {
            System.err.println(">>> JWT Filter: Non-API path or static resource, skipping authentication");
            filterChain.doFilter(request, response);
            return;
        }

        // 检查是否为公开的API接口
        if (isPublicApiPath(requestURI)) {
            System.err.println(">>> JWT Filter: Public API path, skipping authentication");
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        System.err.println(">>> JWT Filter: Protected API path, checking authentication");
        System.err.println(">>> JWT Filter: Authorization Header: " + (authHeader != null ? "Present" : "Missing"));

        logger.info("Processing request to: {} with Authorization header: {}",
                requestURI, authHeader != null ? "Present" : "Missing");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("请求缺少有效的Authorization头 - URI: {}, Headers: {}",
                    request.getRequestURI(),
                    request.getHeaderNames() != null ? request.getHeaderNames().toString() : "无");
            logger.warn("Authorization头内容: [{}]", authHeader);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "未提供认证信息");
            return;
        }

        String token = authHeader.substring(7);
        try {
            String username = jwtUtil.extractUsername(token);
            logger.debug("从token中提取的用户名: {}", username);

            if (logoutService.isTokenInvalid(token)) {
                logger.warn("Token已被标记为失效: {}", token);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token 已失效");
                return;
            }

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (jwtUtil.isTokenValid(token, username)) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    System.err.println(">>> JWT Filter: Authentication SUCCESS for user: " + username);
                    System.err.println(">>> JWT Filter: User authorities: " + userDetails.getAuthorities());

                    logger.debug("用户 {} 认证成功，权限: {}", username, userDetails.getAuthorities());
                } else {
                    System.err.println(">>> JWT Filter: Token validation FAILED for user: " + username);
                    logger.warn("Token验证失败，用户名: {}", username);
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token 验证失败");
                    return;
                }
            }
        } catch (ExpiredJwtException e) {
            logger.warn("Token已过期: {}", e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token 已过期");
            return;
        } catch (SignatureException e) {
            logger.warn("Token签名无效: {}", e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "无效的 Token 签名");
            return;
        } catch (MalformedJwtException e) {
            logger.warn("Token格式错误: {}", e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "无效的 Token 格式");
            return;
        } catch (UnsupportedJwtException e) {
            logger.warn("不支持的Token类型: {}", e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "不支持的 Token 类型");
            return;
        } catch (JwtException e) {
            logger.warn("Token无效: {}", e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "无效的 Token");
            return;
        }

        filterChain.doFilter(request, response);
    }

    // 检查是否为需要保护的API路径
    private boolean isProtectedApiPath(String requestPath) {
        for (String protectedPath : PROTECTED_API_PATHS) {
            if (pathMatcher.match(protectedPath, requestPath)) {
                return true;
            }
        }
        return false;
    }

    // 检查是否为公开的API路径
    private boolean isPublicApiPath(String requestPath) {
        for (String publicPath : PUBLIC_API_PATHS) {
            if (pathMatcher.match(publicPath, requestPath)) {
                return true;
            }
        }
        return false;
    }
}
