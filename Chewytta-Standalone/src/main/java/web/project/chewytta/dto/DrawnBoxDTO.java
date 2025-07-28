package web.project.chewytta.dto;

import lombok.Data;
import web.project.chewytta.model.BlindBox;
import web.project.chewytta.model.Item;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Data
public class DrawnBoxDTO {
    private Long id;
    private BlindBox blindBox;
    private Item item;
    private BigDecimal price;
    private String drawnAt;
    
    public void setDrawnAtFromLocalDateTime(java.time.LocalDateTime dateTime) {
        if (dateTime != null) {
            this.drawnAt = dateTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } else {
            this.drawnAt = java.time.LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        }
    }
}