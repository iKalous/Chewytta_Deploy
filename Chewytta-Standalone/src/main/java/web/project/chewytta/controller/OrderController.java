package web.project.chewytta.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.project.chewytta.model.DrawnBox;
import web.project.chewytta.service.DrawnBoxService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "订单管理", description = "用户盲盒订单查看")
@RequiredArgsConstructor
public class OrderController {

    private final DrawnBoxService drawnBoxService;

    // 获取用户的所有订单（带盲盒和款式详情）
    @GetMapping("/{userId}")
    @Operation(summary = "获取用户的订单列表")
    public ResponseEntity<List<DrawnBox>> getUserOrders(@PathVariable Long userId) {
        List<DrawnBox> orders = drawnBoxService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }
}