package web.project.chewytta.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.project.chewytta.dto.ApiResponse;

import java.io.File;

@RestController
@RequestMapping("/api/test")
public class StaticResourceTestController {

    @GetMapping("/avatar-debug")
    public ResponseEntity<ApiResponse<String>> debugAvatarPath() {
        try {
            StringBuilder result = new StringBuilder();

            // 检查工作目录
            String userDir = System.getProperty("user.dir");
            result.append("当前工作目录: ").append(userDir).append("\n");

            // 检查相对路径
            String relativePath = "../ChewyApp/userdata/avatars/2025/07/26/";
            File relativeDir = new File(userDir, relativePath);
            result.append("相对路径: ").append(relativePath).append("\n");
            result.append("完整路径: ").append(relativeDir.getAbsolutePath()).append("\n");
            result.append("目录是否存在: ").append(relativeDir.exists()).append("\n");

            // 检查具体文件
            String fileName = "3ae8b267-1fbf-494e-97b1-5e0f57d9c853.jpg";
            File avatarFile = new File(relativeDir, fileName);
            result.append("头像文件路径: ").append(avatarFile.getAbsolutePath()).append("\n");
            result.append("头像文件是否存在: ").append(avatarFile.exists()).append("\n");
            if (avatarFile.exists()) {
                result.append("文件大小: ").append(avatarFile.length()).append(" bytes\n");
            }

            // 生成的URL
            String expectedUrl = "/uploads/userdata/avatars/2025/07/26/" + fileName;
            result.append("期望的URL: ").append(expectedUrl).append("\n");

            return ResponseEntity.ok(ApiResponse.success(result.toString()));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("调试失败: " + e.getMessage()));
        }
    }
}
