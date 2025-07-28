package web.project.chewytta.dto;

import lombok.Data;

@Data
public class FavoriteRequest {
    private Long userId;
    private Long boxId;
}
