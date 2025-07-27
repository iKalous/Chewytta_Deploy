package web.project.chewytta.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import web.project.chewytta.model.BlindBox;
import web.project.chewytta.model.Item;
import web.project.chewytta.dto.ApiResponse;
import web.project.chewytta.dto.BuyResultDTO;
import web.project.chewytta.service.BlindBoxService;

import java.util.List;

@RestController
@RequestMapping("/api/blind-boxes")
@Tag(name = "盲盒管理", description = "获取盲盒列表、详情、增删改查等操作")
@RequiredArgsConstructor
public class BlindBoxController {

    private final BlindBoxService blindBoxService;

    // 获取所有盲盒
    @GetMapping
    @Operation(summary = "获取所有盲盒")
    public List<BlindBox> getAllBoxes() {
        return blindBoxService.getAllBoxes();
    }

    // 获取单个盲盒详情
    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取盲盒详情")
    public BlindBox getBoxById(@PathVariable Long id) {
        return blindBoxService.getBoxById(id);
    }

    // 创建新盲盒（仅管理员）
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "创建新盲盒（需要管理员权限）")
    public ResponseEntity<Integer> createBlindBox(@RequestBody BlindBox blindBox) {
        int result = blindBoxService.addBlindBox(blindBox);
        return ResponseEntity.ok(result);
    }

    // 更新盲盒信息（仅管理员）
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "更新盲盒信息（需要管理员权限）")
    public ResponseEntity<Integer> updateBlindBox(@PathVariable Long id, @RequestBody BlindBox blindBox) {
        blindBox.setId(id);
        int result = blindBoxService.updateBlindBox(blindBox);
        return ResponseEntity.ok(result);
    }

    // 删除盲盒（仅管理员）
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "删除盲盒（需要管理员权限）")
    public ResponseEntity<Integer> deleteBlindBox(@PathVariable Long id) {
        int result = blindBoxService.deleteBlindBox(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/search")
    @Operation(summary = "根据名称搜索盲盒")
    public ResponseEntity<ApiResponse<List<BlindBox>>> searchBoxes(@RequestParam String keyword) {
        List<BlindBox> boxes = blindBoxService.searchBoxesByName(keyword);
        return ResponseEntity.ok(ApiResponse.success(boxes));
    }

    // 购买盲盒
    @PostMapping("/{id}/buy")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    @Operation(summary = "购买盲盒")
    public ResponseEntity<ApiResponse<BuyResultDTO>> buyBlindBox(@PathVariable Long id) {
        BuyResultDTO result = blindBoxService.buyBlindBox(id);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // 收藏盲盒
    @PostMapping("/{id}/favorite")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    @Operation(summary = "收藏盲盒")
    public ResponseEntity<ApiResponse<Boolean>> favoriteBlindBox(@PathVariable Long id) {
        boolean result = blindBoxService.favoriteBlindBox(id);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // 取消收藏盲盒
    @DeleteMapping("/{id}/favorite")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    @Operation(summary = "取消收藏盲盒")
    public ResponseEntity<ApiResponse<Boolean>> unfavoriteBlindBox(@PathVariable Long id) {
        boolean result = blindBoxService.unfavoriteBlindBox(id);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // 检查盲盒是否已收藏
    @GetMapping("/{id}/favorite")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    @Operation(summary = "检查盲盒是否已收藏")
    public ResponseEntity<ApiResponse<Boolean>> isBlindBoxFavorited(@PathVariable Long id) {
        boolean isFavorited = blindBoxService.isBlindBoxFavorited(id);
        return ResponseEntity.ok(ApiResponse.success(isFavorited));
    }

    // 获取用户收藏的盲盒列表
    @GetMapping("/favorites")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    @Operation(summary = "获取当前用户收藏的盲盒列表")
    public ResponseEntity<ApiResponse<List<BlindBox>>> getUserFavoriteBoxes() {
        List<BlindBox> favoriteBoxes = blindBoxService.getUserFavoriteBlindBoxes();
        return ResponseEntity.ok(ApiResponse.success(favoriteBoxes));
    }

}
