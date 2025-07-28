package web.project.chewytta.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import web.project.chewytta.model.Item;
import web.project.chewytta.service.ItemService;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@Tag(name = "款式管理", description = "款式增删改查")
public class ItemController {

    @Autowired
    private ItemService itemService;

    // 获取某个盲盒的所有款式
    @GetMapping("/box/{boxId}")
    @Operation(summary = "获取某个盲盒的所有款式")
    public List<Item> getItemsByBoxId(@PathVariable Long boxId) {
        return itemService.getItemsByBoxId(boxId);
    }

    // 获取单个款式详情
    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取款式详情")
    public Item getItemById(@PathVariable Long id) {
        return itemService.getItemById(id);
    }

    // 新增款式
    @PostMapping
    @Operation(summary = "新增款式")
    public int createItem(@RequestBody Item item) {
        return itemService.addItem(item);
    }

    // 更新款式信息
    @PutMapping("/{id}")
    @Operation(summary = "更新款式信息")
    public int updateItem(@PathVariable Long id, @RequestBody Item item) {
        item.setId(id);
        return itemService.updateItem(item);
    }

    // 删除款式
    @DeleteMapping("/{id}")
    @Operation(summary = "删除款式")
    public int deleteItem(@PathVariable Long id) {
        return itemService.deleteItem(id);
    }
}
