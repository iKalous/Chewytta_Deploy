package web.project.chewytta.model;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class DrawnBox {
    private Long id;
    private Long userId;
    private Long boxId;
    private Long itemId; // 抽中的款式 ID
    private BigDecimal price;
    private LocalDateTime drawDate;
    private LocalDateTime drawTime;
}
