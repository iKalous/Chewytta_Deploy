// web/project/chewytta/dto/RechargeRequest.java

package web.project.chewytta.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RechargeRequest {
    @NotNull(message = "用户ID不能为空")
    private Long userId;

    @DecimalMin(value = "0.01", message = "充值金额必须大于0")
    private BigDecimal amount;
}
