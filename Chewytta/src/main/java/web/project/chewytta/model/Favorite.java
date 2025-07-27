package web.project.chewytta.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Favorite {
    private Long id;
    private Long userId;
    private Long boxId;
    private LocalDateTime createdAt;
}
