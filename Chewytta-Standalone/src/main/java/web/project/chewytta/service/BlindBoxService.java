package web.project.chewytta.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import web.project.chewytta.mapper.BlindBoxMapper;
import web.project.chewytta.model.BlindBox;
import web.project.chewytta.model.Item;
import web.project.chewytta.dto.BuyResultDTO;
import web.project.chewytta.mapper.FavoriteMapper;
import web.project.chewytta.mapper.ItemMapper;
import web.project.chewytta.model.User;
import web.project.chewytta.model.Favorite;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.ArrayList;
import java.math.BigDecimal;

@Service
public class BlindBoxService {

    @Autowired
    private BlindBoxMapper blindBoxMapper;

    @Autowired
    private FavoriteMapper favoriteMapper;

    // 获取所有盲盒
    public List<BlindBox> getAllBoxes() {
        return blindBoxMapper.selectAllBoxes();
    }

    @Autowired
    private ItemMapper itemMapper;

    // 根据ID获取盲盒详情
    public BlindBox getBoxById(Long id) {
        BlindBox box = blindBoxMapper.selectBoxById(id);
        if (box != null) {
            box.setItems(itemMapper.selectByBoxId(id));
        }
        return box;
    }

    // 添加新盲盒
    public int addBlindBox(BlindBox blindBox) {
        return blindBoxMapper.insertBox(blindBox);
    }

    // 更新盲盒信息
    public int updateBlindBox(BlindBox blindBox) {
        return blindBoxMapper.updateBox(blindBox); // 明确调用 updateBox
    }

    // 删除盲盒
    public int deleteBlindBox(Long id) {
        return blindBoxMapper.deleteBox(id);
    }

    public List<BlindBox> searchBoxesByName(String keyword) {
        List<BlindBox> boxes = blindBoxMapper.searchBoxesByName(keyword);
        // 为每个搜索结果添加款式信息
        for (BlindBox box : boxes) {
            if (box != null) {
                List<Item> items = itemMapper.selectByBoxId(box.getId());
                box.setItems(items);
            }
        }
        return boxes;
    }

    @Autowired
    private DrawnBoxService drawnBoxService;

    @Autowired
    private UserService userService;

    // 购买盲盒
    public BuyResultDTO buyBlindBox(Long boxId) {
        // 获取当前登录用户名
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userService.getUserByUsername(username);
        Long userId = currentUser.getId();

        // 1. 检查盲盒是否存在且有库存
        BlindBox box = blindBoxMapper.selectBoxById(boxId);
        if (box == null || !box.getIsPublished() || box.getStock() <= 0) {
            throw new RuntimeException("盲盒不存在或已售罄");
        }

        // 2. 检查用户余额是否充足
        BigDecimal userBalance = userService.getUserBalance(userId);
        if (userBalance.compareTo(box.getPrice()) < 0) {
            throw new RuntimeException("余额不足");
        }

        // 3. 扣减库存
        box.setStock(box.getStock() - 1);
        blindBoxMapper.updateBox(box);

        // 4. 扣除用户余额并保存购买记录
        Item selectedItem = drawnBoxService.drawItemFromBoxWithDeduction(userId, boxId, box.getPrice());

        // 5. 获取最新余额
        BigDecimal newBalance = userService.getUserBalance(userId);

        // 6. 检查是否为首次获得该物品
        boolean isNew = !drawnBoxService.hasUserDrawnItem(userId, selectedItem.getId());

        return new BuyResultDTO(selectedItem, isNew, newBalance);
    }

    // 收藏盲盒
    public boolean favoriteBlindBox(Long boxId) {
        // 获取当前登录用户名
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userService.getUserByUsername(username);
        Long userId = currentUser.getId();

        // 检查是否已收藏
        if (favoriteMapper.isFavorited(userId, boxId)) {
            return true; // 已经收藏，直接返回成功
        }

        // 添加收藏记录
        return favoriteMapper.addFavorite(userId, boxId) > 0;
    }

    // 取消收藏盲盒
    public boolean unfavoriteBlindBox(Long boxId) {
        // 获取当前登录用户名
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userService.getUserByUsername(username);
        Long userId = currentUser.getId();

        // 删除收藏记录
        return favoriteMapper.removeFavorite(userId, boxId) > 0;
    }

    // 检查盲盒是否已收藏
    public boolean isBlindBoxFavorited(Long boxId) {
        // 获取当前登录用户名
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userService.getUserByUsername(username);
        Long userId = currentUser.getId();

        // 检查是否已收藏
        return favoriteMapper.isFavorited(userId, boxId);
    }

    // 获取用户收藏的盲盒列表（包含完整盲盒信息）
    public List<BlindBox> getUserFavoriteBlindBoxes() {
        // 获取当前登录用户名
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userService.getUserByUsername(username);
        Long userId = currentUser.getId();

        // 获取用户收藏列表
        List<Favorite> favorites = favoriteMapper.selectByUserId(userId);
        List<BlindBox> favoriteBoxes = new ArrayList<>();

        for (Favorite favorite : favorites) {
            BlindBox box = blindBoxMapper.selectBoxById(favorite.getBoxId());
            if (box != null) {
                // 获取盲盒的所有款式
                List<Item> items = itemMapper.selectByBoxId(box.getId());
                box.setItems(items);
                favoriteBoxes.add(box);
            }
        }

        return favoriteBoxes;
    }

}
