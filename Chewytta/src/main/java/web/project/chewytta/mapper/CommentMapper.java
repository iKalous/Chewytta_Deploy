package web.project.chewytta.mapper;

import org.apache.ibatis.annotations.Mapper;
import web.project.chewytta.model.Comment;

import java.util.List;

@Mapper
public interface CommentMapper {
    List<Comment> selectByBoxId(Long boxId);
    int insertComment(Comment comment);
    int deleteById(Long id);
    Comment selectById(Long id);
}
