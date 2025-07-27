package web.project.chewytta.model;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data // Lombok 注解，自动生成 getter/setter/toString 等方法
public class BlindBox {

    private Long id;
    private String name;
    private String image; // 盲盒封面图片
    private BigDecimal price; // 使用 BigDecimal 表示精确金额
    private Integer stock; // 库存数量
    private Boolean isPublished; // 是否上架
    private String description; // 描述信息
    private LocalDateTime createdAt; // 创建时间

    private List<Item> items;
}
