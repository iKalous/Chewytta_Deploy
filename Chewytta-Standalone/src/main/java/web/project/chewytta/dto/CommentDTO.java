package web.project.chewytta.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private Long id;
    private String user;
    private String content;
    private String date;
    private Long boxId;
}