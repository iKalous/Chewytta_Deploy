package web.project.chewytta.model;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class User {
    private Long id;
    private String username;
    private String nickname;
    private String password;
    private String phone;
    private String email; // 新增字段
    private String avatar;
    private BigDecimal balance;
    private String role;
    private LocalDateTime createdAt;
}
