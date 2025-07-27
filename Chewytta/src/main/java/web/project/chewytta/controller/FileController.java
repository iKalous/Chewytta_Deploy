package web.project.chewytta.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import web.project.chewytta.dto.ApiResponse;
import web.project.chewytta.service.FileUploadService;

@RestController
@RequestMapping("/api/files")
@Tag(name = "文件管理", description = "文件上传、删除等操作")
public class FileController {

    @Autowired
    private FileUploadService fileUploadService;

    /**
     * 上传图片文件
     * 
     * @param file     图片文件
     * @param category 图片分类（avatar、box、item）
     * @return 文件访问URL
     */
    @PostMapping("/upload")
    @Operation(summary = "上传图片文件")
    public ResponseEntity<ApiResponse<String>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", defaultValue = "general") String category) {
        try {
            String fileUrl = fileUploadService.uploadFile(file, category);
            return ResponseEntity.ok(ApiResponse.success(fileUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("上传失败: " + e.getMessage()));
        }
    }

    /**
     * 删除文件
     * 
     * @param fileUrl 文件URL
     * @return 删除结果
     */
    @DeleteMapping
    @Operation(summary = "删除文件")
    public ResponseEntity<ApiResponse<Boolean>> deleteFile(@RequestParam("url") String fileUrl) {
        try {
            boolean success = fileUploadService.deleteFile(fileUrl);
            if (success) {
                return ResponseEntity.ok(ApiResponse.success(true));
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.error("文件删除失败"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("删除失败: " + e.getMessage()));
        }
    }
}
