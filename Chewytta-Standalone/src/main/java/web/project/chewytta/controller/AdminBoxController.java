package web.project.chewytta.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import web.project.chewytta.model.BlindBox;
import web.project.chewytta.model.Item;
import web.project.chewytta.service.AdminBoxService;

import java.util.List;

/**
 * 管理员盲盒管理接口
 */
@RestController
@RequestMapping("/api/admin/boxes")
@Tag(name = "管理员 - 盲盒管理", description = "管理员对盲盒进行增删改查操作")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')") // 整个控制器都需要管理员权限
public class AdminBoxController {

    private final AdminBoxService adminBoxService;

    /**
     * 获取所有盲盒（含款式）
     */
    /**
     * 获取所有盲盒（含款式）
     */
    @GetMapping
    @Operation(summary = "获取所有盲盒（包含款式）")
    public List<BlindBox> getAllBoxesWithItems() {
        System.out.println("AdminBoxController.getAllBoxesWithItems() called");

        // 打印当前认证信息
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        if (auth != null) {
            System.out.println("Current user: " + auth.getName());
            System.out.println("Authorities: " + auth.getAuthorities());
            System.out.println("Principal: " + auth.getPrincipal());
        } else {
            System.out.println("No authentication found in SecurityContext");
        }

        return adminBoxService.getAllBlindBoxWithItems();
    }

    /**
     * 根据ID获取盲盒详情（含款式）
     */
    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取盲盒详情（包含款式）")
    public BlindBox getBoxWithItemsById(@PathVariable Long id) {
        return adminBoxService.getBlindBoxWithItemsById(id);
    }

    /**
     * 添加盲盒及其款式
     */
    @PostMapping
    @Operation(summary = "添加盲盒及其包含的款式")
    public ResponseEntity<Integer> createBoxWithItems(@RequestBody BlindBox blindBox) {
        List<Item> items = blindBox.getItems();
        int result = adminBoxService.addBlindBoxWithItems(blindBox, items);
        return ResponseEntity.ok(result);
    }

    /**
     * 更新盲盒信息及其款式
     */
    @PutMapping("/{id}")
    @Operation(summary = "更新盲盒信息及其款式")
    public ResponseEntity<?> updateBoxWithItems(@PathVariable Long id,
            @RequestBody BlindBox blindBox) {
        try {
            blindBox.setId(id);
            List<Item> items = blindBox.getItems();
            int result = adminBoxService.updateBlindBoxWithItems(blindBox, items);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("更新失败: " + e.getMessage());
        }
    }

    /**
     * 删除盲盒及其所有款式
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除盲盒及其所有关联款式")
    public ResponseEntity<?> deleteBoxWithItems(@PathVariable Long id) {
        try {
            int result = adminBoxService.deleteBlindBoxWithItems(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("删除失败: " + e.getMessage());
        }
    }
}
