package web.project.chewytta.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateAvatarRequest {

    @NotBlank(message = "头像URL不能为空")
    private String avatarUrl;

    public UpdateAvatarRequest() {
    }

    public UpdateAvatarRequest(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
