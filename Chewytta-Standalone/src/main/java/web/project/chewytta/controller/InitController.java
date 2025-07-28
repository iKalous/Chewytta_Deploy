package web.project.chewytta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import web.project.chewytta.mapper.UserMapper;
import web.project.chewytta.model.User;
import web.project.chewytta.dto.ApiResponse;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 系统初始化控制器
 * 提供手动初始化系统的API
 */
@RestController
@RequestMapping("/api/init")
@CrossOrigin(origins = "*")
public class InitController {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * 检查系统是否已初始化（是否存在管理员用户）
     */
    @GetMapping("/check")
    public ResponseEntity<ApiResponse<Boolean>> checkInitStatus() {
        try {
            User admin = userMapper.selectByUsername("root");
            boolean isInitialized = (admin != null);
            
            ApiResponse<Boolean> response = ApiResponse.success(isInitialized);
            response.setMessage(isInitialized ? "系统已初始化" : "系统未初始化，需要创建管理员用户");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("检查初始化状态失败: " + e.getMessage()));
        }
    }

    /**
     * 手动初始化系统管理员用户
     */
    @PostMapping("/admin")
    public ResponseEntity<ApiResponse<String>> initializeAdmin() {
        try {
            // 检查是否已存在 root 用户
            User existingRoot = userMapper.selectByUsername("root");
            
            if (existingRoot != null) {
                return ResponseEntity.ok(ApiResponse.error("管理员用户已存在，无需重复创建"));
            }

            // 创建默认 root 用户
            User rootUser = new User();
            rootUser.setUsername("root");
            rootUser.setNickname("系统管理员");
            rootUser.setPassword(passwordEncoder.encode("123456"));
            rootUser.setPhone("13800000000");
            rootUser.setEmail("admin@chewytta.com");
            rootUser.setAvatar("/admin-content/system/defaults/admin_avatar.png");
            rootUser.setBalance(BigDecimal.ZERO);
            rootUser.setRole("admin");
            rootUser.setCreatedAt(LocalDateTime.now());

            // 插入数据库
            userMapper.insert(rootUser);

            ApiResponse<String> response = ApiResponse.success("管理员用户创建成功！用户名: root, 密码: 123456");
            return ResponseEntity.ok(response);
                
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("创建管理员用户失败: " + e.getMessage()));
        }
    }

    /**
     * 重置管理员密码为默认密码
     */
    @PostMapping("/reset-admin-password")
    public ResponseEntity<ApiResponse<String>> resetAdminPassword() {
        try {
            User existingRoot = userMapper.selectByUsername("root");
            
            if (existingRoot == null) {
                return ResponseEntity.ok(ApiResponse.error("管理员用户不存在"));
            }

            // 重新加密密码
            existingRoot.setPassword(passwordEncoder.encode("123456"));
            // 更新数据库
            userMapper.update(existingRoot);

            ApiResponse<String> response = ApiResponse.success("管理员密码已重置为默认密码: 123456");
            return ResponseEntity.ok(response);
                
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("重置密码失败: " + e.getMessage()));
        }
    }
}
