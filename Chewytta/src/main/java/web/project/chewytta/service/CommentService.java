package web.project.chewytta.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import web.project.chewytta.dto.CommentDTO;
import web.project.chewytta.mapper.CommentMapper;
import web.project.chewytta.mapper.UserMapper;
import web.project.chewytta.model.Comment;
import web.project.chewytta.model.User;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentMapper commentMapper;
    
    @Autowired
    private UserMapper userMapper;

    public List<CommentDTO> getCommentsByBoxId(Long boxId) {
        List<Comment> comments = commentMapper.selectByBoxId(boxId);
        return comments.stream()
                .map(comment -> {
                    CommentDTO dto = new CommentDTO();
                    dto.setId(comment.getId());
                    dto.setContent(comment.getContent());
                    dto.setBoxId(comment.getBoxId());
                    
                    // 获取用户名
                    User user = userMapper.selectById(comment.getUserId());
                    dto.setUser(user != null ? user.getUsername() : "匿名用户");
                    
                    // 格式化日期
                    if (comment.getCreatedAt() != null) {
                        dto.setDate(comment.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                    } else {
                        dto.setDate("未知时间");
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public int addComment(Comment comment) {
        return commentMapper.insertComment(comment);
    }

    public int removeComment(Long id) {
        return commentMapper.deleteById(id);
    }

    public Comment getCommentById(Long id) {
        return commentMapper.selectById(id);
    }
}
