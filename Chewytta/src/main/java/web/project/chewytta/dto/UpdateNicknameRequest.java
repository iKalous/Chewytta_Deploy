package web.project.chewytta.dto;

import lombok.Data;

@Data
public class UpdateNicknameRequest {
    private Long id;
    private String nickname;
}
