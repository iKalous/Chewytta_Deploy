package web.project.chewytta.dto;

import lombok.Data;

@Data
public class UpdatePasswordRequest {
    private Long id;
    private String newPassword;
    private String oldPassword;

}
