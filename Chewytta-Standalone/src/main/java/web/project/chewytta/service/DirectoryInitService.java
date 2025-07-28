package web.project.chewytta.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import web.project.chewytta.config.FileUploadConfig;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class DirectoryInitService implements CommandLineRunner {

    @Autowired
    private FileUploadConfig fileUploadConfig;

    @Override
    public void run(String... args) throws Exception {
        initializeDirectories();
    }

    /**
     * 初始化目录结构
     */
    private void initializeDirectories() {
        try {
            String userDir = System.getProperty("user.dir");

            // 创建基础目录结构
            String[] directories = {
                    // 应用主目录
                    fileUploadConfig.getBasePath() + "cache/images/",
                    fileUploadConfig.getBasePath() + "cache/data/",
                    fileUploadConfig.getBasePath() + "config/",
                    fileUploadConfig.getBasePath() + "logs/",
                    fileUploadConfig.getUserDataPath() + "avatars/",
                    fileUploadConfig.getUserDataPath() + "uploads/",
                    fileUploadConfig.getUserDataPath() + "favorites/",

                    // 管理员内容目录
                    fileUploadConfig.getAdminContentPath() + "boxes/covers/",
                    fileUploadConfig.getAdminContentPath() + "boxes/items/",
                    fileUploadConfig.getAdminContentPath() + "system/defaults/",
                    fileUploadConfig.getAdminContentPath() + "system/icons/",
                    fileUploadConfig.getAdminContentPath() + "system/backgrounds/",
                    fileUploadConfig.getAdminContentPath() + "temp/"
            };

            System.out.println("=== 初始化目录结构 ===");
            System.out.println("工作目录: " + userDir);
            System.out.println("基础路径: " + fileUploadConfig.getBasePath());
            System.out.println("管理员内容路径: " + fileUploadConfig.getAdminContentPath());
            System.out.println("用户数据路径: " + fileUploadConfig.getUserDataPath());
            System.out.println("==================");

            for (String dir : directories) {
                Path path = Paths.get(dir).isAbsolute() ? Paths.get(dir) : Paths.get(userDir).resolve(dir);
                if (!Files.exists(path)) {
                    Files.createDirectories(path);
                    System.out.println("Created directory: " + path.toAbsolutePath());
                } else {
                    System.out.println("Directory already exists: " + path.toAbsolutePath());
                }
            }

            // 创建默认图片的说明文件
            createReadmeFiles();

        } catch (IOException e) {
            System.err.println("Failed to initialize directories: " + e.getMessage());
        }
    }

    /**
     * 创建说明文件
     */
    private void createReadmeFiles() throws IOException {
        String userDir = System.getProperty("user.dir");

        // 管理员内容说明
        String adminContentReadme = """
                # AdminContent 目录说明

                这个目录用于存储管理员相关的内容文件：

                ## 目录结构
                - boxes/covers/: 盲盒封面图片
                - boxes/items/: 盲盒款式图片
                - system/defaults/: 系统默认图片
                - system/icons/: 系统图标
                - system/backgrounds/: 背景图片
                - temp/: 临时文件

                ## 注意事项
                - 图片格式支持：jpg, jpeg, png, gif, bmp, webp
                - 单个文件大小限制：5MB
                - 文件会按日期自动分类存储
                """;

        // 用户数据说明
        String userDataReadme = """
                # ChewyApp/userdata 目录说明

                这个目录用于存储用户相关的数据文件：

                ## 目录结构
                - avatars/: 用户头像
                - uploads/: 用户上传的文件
                - favorites/: 用户收藏的图片

                ## 隐私说明
                - 用户数据受到隐私保护
                - 仅用户本人和授权管理员可以访问
                """;

        writeReadmeFile(
                Paths.get(userDir).resolve(fileUploadConfig.getAdminContentPath()).resolve("README.md").toString(),
                adminContentReadme);
        writeReadmeFile(Paths.get(userDir).resolve(fileUploadConfig.getUserDataPath()).resolve("README.md").toString(),
                userDataReadme);
    }

    private void writeReadmeFile(String filePath, String content) throws IOException {
        Path path = Paths.get(filePath);
        if (!Files.exists(path)) {
            Files.writeString(path, content);
            System.out.println("Created README: " + path.toAbsolutePath());
        }
    }
}
