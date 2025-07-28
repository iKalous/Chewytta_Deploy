package web.project.chewytta.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import web.project.chewytta.filter.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthFilter;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                return http
                                .authorizeHttpRequests(auth -> auth
                                                // 公开API端点
                                                .requestMatchers("/api/users/login", "/api/users/register",
                                                                "/api/users/logout", "/users/login",
                                                                "/users/register")
                                                .permitAll()
                                                .requestMatchers("/api/blind-boxes", "/api/blind-boxes/search")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/blind-boxes/**").permitAll()
                                                // 需要认证的API端点
                                                .requestMatchers("/api/**").authenticated()
                                                // 静态资源和文件上传
                                                .requestMatchers("/uploads/**", "/admin-content/**", "/debug_auth.html")
                                                .permitAll()
                                                // 所有页面路由放行（由SPA处理认证）
                                                .anyRequest().permitAll())
                                .sessionManagement(sess -> sess
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                                .csrf(csrf -> csrf.disable())
                                .build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }
}
