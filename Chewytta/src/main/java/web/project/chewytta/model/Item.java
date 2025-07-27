package web.project.chewytta.model;

import lombok.Data;

@Data // Lombok 注解，自动生成 getter/setter/toString 等方法
public class Item {

    private Long id;
    private Long boxId; // 对应盲盒ID
    private String name; // 款式名称
    private String image; // 图片链接或路径
}
