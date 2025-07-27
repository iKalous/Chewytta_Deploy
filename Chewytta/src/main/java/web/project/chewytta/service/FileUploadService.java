package web.project.chewytta.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import web.project.chewytta.config.FileUploadConfig;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.UUID;

@Service
public class FileUploadService {

    @Autowired
    private FileUploadConfig fileUploadConfig;

    /**
     * 上传文件
     * 
     * @param file     上传的文件
     * @param category 文件分类（如：avatar、item、box）
     * @return 文件访问URL
     */
    public String uploadFile(MultipartFile file, String category) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("文件不能为空");
        }

        // 验证文件大小
        if (file.getSize() > fileUploadConfig.getMaxFileSize()) {
            throw new IllegalArgumentException("文件大小不能超过 " + (fileUploadConfig.getMaxFileSize() / 1024 / 1024) + "MB");
        }

        // 验证文件格式
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !isValidImageFile(originalFilename)) {
            throw new IllegalArgumentException(
                    "不支持的文件格式，仅支持：" + Arrays.toString(fileUploadConfig.getAllowedExtensions()));
        }

        try {
            // 生成文件保存路径
            String relativePath = generateFilePath(originalFilename, category);
            String categoryBasePath = fileUploadConfig.getFullPath(category);
            Path fullPath = Paths.get(System.getProperty("user.dir"), categoryBasePath, relativePath);

            System.out.println("Debug - 文件上传信息:");
            System.out.println("  原始文件名: " + originalFilename);
            System.out.println("  文件大小: " + file.getSize() + " bytes");
            System.out.println("  分类: " + category);
            System.out.println("  相对路径: " + relativePath);
            System.out.println("  分类基础路径: " + categoryBasePath);
            System.out.println("  完整保存路径: " + fullPath.toString());

            // 创建目录
            Path directoryPath = fullPath.getParent();
            if (!Files.exists(directoryPath)) {
                Files.createDirectories(directoryPath);
                System.out.println("  创建目录: " + directoryPath.toString());
            }

            // 保存文件
            file.transferTo(fullPath.toFile());
            System.out.println("  文件保存成功: " + fullPath.toString());

            // 返回访问URL（根据分类返回不同的URL前缀）
            return getAccessUrl(relativePath, category);

        } catch (IOException e) {
            throw new RuntimeException("文件保存失败：" + e.getMessage(), e);
        }
    }

    /**
     * 删除文件
     * 
     * @param fileUrl 文件URL
     * @return 是否删除成功
     */
    public boolean deleteFile(String fileUrl) {
        if (fileUrl == null) {
            return false;
        }

        try {
            String fullPath = getFilePathFromUrl(fileUrl);
            Path filePath = Paths.get(fullPath);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                return true;
            }
        } catch (IOException e) {
            System.err.println("删除文件失败：" + e.getMessage());
        }

        return false;
    }

    /**
     * 验证是否为有效的图片文件
     */
    private boolean isValidImageFile(String filename) {
        String extension = getFileExtension(filename).toLowerCase();
        return Arrays.asList(fileUploadConfig.getAllowedExtensions()).contains(extension);
    }

    /**
     * 获取文件扩展名
     */
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex > 0 ? filename.substring(lastDotIndex + 1) : "";
    }

    /**
     * 生成文件保存路径
     * 格式：yyyy/MM/dd/uuid.extension
     */
    private String generateFilePath(String originalFilename, String category) {
        String extension = getFileExtension(originalFilename);
        String uuid = UUID.randomUUID().toString();
        // 使用正斜杠构建URL友好的路径，不使用系统分隔符
        String dateDir = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));

        return dateDir + "/" + uuid + "." + extension;
    }

    /**
     * 根据分类生成访问URL
     */
    private String getAccessUrl(String relativePath, String category) {
        // 将Windows风格的路径分隔符转换为URL风格的正斜杠
        String urlPath = relativePath.replace("\\", "/");

        switch (category.toLowerCase()) {
            case "box":
            case "item":
            case "system":
                return "/admin-content/boxes/"
                        + (category.equals("box") ? "covers/" : category.equals("item") ? "items/" : "") + urlPath;
            case "avatar":
                return "/uploads/userdata/avatars/" + urlPath;
            default:
                return "/uploads/" + urlPath;
        }
    }

    /**
     * 从URL获取文件系统路径
     */
    private String getFilePathFromUrl(String fileUrl) {
        if (fileUrl.startsWith("/admin-content/")) {
            String relativePath = fileUrl.replace("/admin-content/", "");
            return System.getProperty("user.dir") + "/" + fileUploadConfig.getAdminContentPath() + relativePath;
        } else if (fileUrl.startsWith("/uploads/")) {
            String relativePath = fileUrl.replace("/uploads/", "");
            return System.getProperty("user.dir") + "/" + fileUploadConfig.getBasePath() + relativePath;
        }
        return "";
    }
}