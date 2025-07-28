package web.project.chewytta.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import web.project.chewytta.mapper.UserMapper;
import web.project.chewytta.model.Comment;
import web.project.chewytta.model.User;
import web.project.chewytta.service.CommentService;
import web.project.chewytta.dto.ApiResponse;
import web.project.chewytta.dto.CommentDTO;
import java.time.format.DateTimeFormatter;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@Tag(name = "评论管理", description = "查看、添加、删除评论")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final UserMapper userMapper;

    // 获取某个盲盒下的所有评论
    @GetMapping("/box/{boxId}")
    @Operation(summary = "获取某个盲盒的评论列表")
    public ResponseEntity<ApiResponse<List<CommentDTO>>> getCommentsByBoxId(@PathVariable Long boxId) {
        List<CommentDTO> comments = commentService.getCommentsByBoxId(boxId);
        return ResponseEntity.ok(ApiResponse.success(comments));
    }

    // 新增评论（需要登录）
    @PostMapping
    @Operation(summary = "新增评论")
    public ResponseEntity<ApiResponse<CommentDTO>> createComment(@RequestBody Comment comment) {
        // 获取当前登录用户名
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // 从数据库查询用户信息
        User currentUser = userMapper.selectByUsername(username);
        if (currentUser == null) {
            return ResponseEntity.ok(ApiResponse.error("用户不存在"));
        }
        
        comment.setUserId(currentUser.getId());
        int result = commentService.addComment(comment);
        if (result > 0) {
            Comment createdComment = commentService.getCommentById(comment.getId());
            
            // 转换为DTO格式
            CommentDTO dto = new CommentDTO();
            dto.setId(createdComment.getId());
            dto.setContent(createdComment.getContent());
            dto.setBoxId(createdComment.getBoxId());
            dto.setUser(currentUser.getUsername());
            
            if (createdComment.getCreatedAt() != null) {
                dto.setDate(createdComment.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            } else {
                dto.setDate("未知时间");
            }
            
            return ResponseEntity.ok(ApiResponse.success(dto));
        }
        return ResponseEntity.ok(ApiResponse.error("评论创建失败"));
    }

    // 删除评论（仅限本人或管理员）
    @DeleteMapping("/{id}")
    @Operation(summary = "删除评论")
    public ResponseEntity<ApiResponse<Boolean>> deleteComment(@PathVariable Long id) {
        int result = commentService.removeComment(id);
        if (result > 0) {
            return ResponseEntity.ok(ApiResponse.success(true));
        }
        return ResponseEntity.ok(ApiResponse.error("评论删除失败"));
    }
}
