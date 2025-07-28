package web.project.chewytta.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "用户名不能为空")
    private String username;

    @Size(min = 6, message = "密码至少为6位")
    private String password;

    private String confirmPassword;

    private String phone;

    @Email(message = "邮箱格式不正确")
    private String email;
}
