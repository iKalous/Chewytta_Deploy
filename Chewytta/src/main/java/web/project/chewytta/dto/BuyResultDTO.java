package web.project.chewytta.dto;

import web.project.chewytta.model.Item;
import java.math.BigDecimal;

public class BuyResultDTO {
    private Item item;
    private boolean isNew;
    private BigDecimal balance;

    public BuyResultDTO(Item item, boolean isNew, BigDecimal balance) {
        this.item = item;
        this.isNew = isNew;
        this.balance = balance;
    }

    // Getters and Setters
    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public boolean getIsNew() {
        return isNew;
    }

    public void setIsNew(boolean isNew) {
        this.isNew = isNew;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
}