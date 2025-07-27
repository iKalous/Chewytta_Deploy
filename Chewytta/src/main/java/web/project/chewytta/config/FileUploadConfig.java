package web.project.chewytta.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@ConfigurationProperties(prefix = "file.upload")
public class FileUploadConfig implements WebMvcConfigurer {

    // 文件上传基础路径（可在application.yml中配置）
    private String basePath = "../ChewyApp/";

    // 管理员内容目录
    private String adminContentPath = "../AdminContent/";

    // 用户数据目录
    private String userDataPath = "../ChewyApp/userdata/";

    // 访问URL前缀
    private String urlPrefix = "/uploads/**";

    // 允许的图片格式
    private String[] allowedExtensions = { "jpg", "jpeg", "png", "gif", "bmp", "webp" };

    // 最大文件大小（字节）
    private long maxFileSize = 5 * 1024 * 1024; // 5MB

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        String userDir = System.getProperty("user.dir");
        String userDataLocation = "file:" + userDir + "/" + userDataPath;
        String adminContentLocation = "file:" + userDir + "/" + adminContentPath;
        String generalLocation = "file:" + userDir + "/" + basePath + "general/";

        // 打印调试信息
        System.out.println("=== 静态资源映射配置 ===");
        System.out.println("用户目录: " + userDir);
        System.out.println("用户数据路径: " + userDataPath);
        System.out.println("用户数据映射: /uploads/userdata/** -> " + userDataLocation);
        System.out.println("管理员内容映射: /admin-content/** -> " + adminContentLocation);
        System.out.println("通用文件映射: /uploads/general/** -> " + generalLocation);
        System.out.println("========================");

        // 配置管理员内容访问路径
        registry.addResourceHandler("/admin-content/**")
                .addResourceLocations(adminContentLocation);

        // 配置用户数据访问路径（用于头像等）- 必须在更宽泛的映射之前
        registry.addResourceHandler("/uploads/userdata/**")
                .addResourceLocations(userDataLocation);

        // 配置其他上传文件的访问路径
        registry.addResourceHandler("/uploads/general/**")
                .addResourceLocations(generalLocation);
    }

    /**
     * 获取完整的文件存储路径
     */
    public String getFullPath(String category) {
        switch (category.toLowerCase()) {
            case "avatar":
                return userDataPath + "avatars/";
            case "box":
                return adminContentPath + "boxes/covers/";
            case "item":
                return adminContentPath + "boxes/items/";
            case "system":
                return adminContentPath + "system/";
            default:
                return basePath + "general/";
        }
    }

    // Getters and Setters
    public String getBasePath() {
        return basePath;
    }

    public void setBasePath(String basePath) {
        this.basePath = basePath;
    }

    public String getUrlPrefix() {
        return urlPrefix;
    }

    public void setUrlPrefix(String urlPrefix) {
        this.urlPrefix = urlPrefix;
    }

    public String[] getAllowedExtensions() {
        return allowedExtensions;
    }

    public void setAllowedExtensions(String[] allowedExtensions) {
        this.allowedExtensions = allowedExtensions;
    }

    public long getMaxFileSize() {
        return maxFileSize;
    }

    public void setMaxFileSize(long maxFileSize) {
        this.maxFileSize = maxFileSize;
    }

    public String getAdminContentPath() {
        return adminContentPath;
    }

    public void setAdminContentPath(String adminContentPath) {
        this.adminContentPath = adminContentPath;
    }

    public String getUserDataPath() {
        return userDataPath;
    }

    public void setUserDataPath(String userDataPath) {
        this.userDataPath = userDataPath;
    }
}
