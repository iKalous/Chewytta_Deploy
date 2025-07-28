package web.project.chewytta.dto;

import lombok.Data;
import web.project.chewytta.model.User;

@Data
public class LoginResponse {
    private String token;
    private User user;
}
