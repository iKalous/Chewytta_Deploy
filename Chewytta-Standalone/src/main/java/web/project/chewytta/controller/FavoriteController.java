package web.project.chewytta.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.project.chewytta.model.Favorite;
import web.project.chewytta.service.FavoriteService;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@Tag(name = "收藏管理", description = "收藏、取消收藏、查看收藏列表")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    // 获取当前用户的收藏列表
    @GetMapping
    @Operation(summary = "获取当前用户的收藏列表")
    public ResponseEntity<List<Favorite>> getFavoritesByCurrentUser(@RequestParam Long userId) {
        return ResponseEntity.ok(favoriteService.getFavoritesByUserId(userId));
    }

    // 添加收藏
    @PostMapping
    @Operation(summary = "添加收藏")
    public ResponseEntity<Integer> addFavorite(@RequestBody Favorite favorite) {
        int result = favoriteService.addFavorite(favorite);
        return ResponseEntity.ok(result);
    }

    // 取消收藏
    @DeleteMapping("/{id}")
    @Operation(summary = "取消收藏")
    public ResponseEntity<Integer> removeFavorite(@PathVariable Long id) {
        int result = favoriteService.removeFavorite(id);
        return ResponseEntity.ok(result);
    }

    // 判断是否已收藏
    @GetMapping("/check")
    @Operation(summary = "判断是否已收藏")
    public ResponseEntity<Boolean> checkIfFavorited(@RequestParam Long userId, @RequestParam Long boxId) {
        boolean isFavorited = favoriteService.isFavorited(userId, boxId);
        return ResponseEntity.ok(isFavorited);
    }
}
