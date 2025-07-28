package web.project.chewytta.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Comment {
    private Long id;
    private Long userId;
    private Long boxId;
    private String content;
    private LocalDateTime createdAt;
}
