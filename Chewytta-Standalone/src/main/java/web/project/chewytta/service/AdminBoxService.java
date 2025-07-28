package web.project.chewytta.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.project.chewytta.mapper.BlindBoxMapper;
import web.project.chewytta.mapper.ItemMapper;
import web.project.chewytta.model.BlindBox;
import web.project.chewytta.model.Item;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminBoxService {

    @Autowired
    private BlindBoxMapper blindBoxMapper;

    @Autowired
    private ItemMapper itemMapper;

    /**
     * 获取所有盲盒及其款式
     */
    public List<BlindBox> getAllBlindBoxWithItems() {
        List<BlindBox> boxes = blindBoxMapper.selectAllBoxes();
        for (BlindBox box : boxes) {
            box.setItems(itemMapper.selectByBoxId(box.getId()));
        }
        return boxes;
    }

    /**
     * 添加盲盒及其包含的款式（事务控制）
     */

    @Transactional(rollbackFor = Exception.class)
    public int addBlindBoxWithItems(BlindBox blindBox, List<Item> items) {
        // 插入盲盒
        int boxResult = blindBoxMapper.insertBox(blindBox);

        // 设置每个款式的 boxId 为刚刚插入的盲盒 ID
        for (Item item : items) {
            item.setBoxId(blindBox.getId());
        }

        // 批量插入款式
        int itemResult = itemMapper.insertItems(items); // 需要批量插入方法支持

        return boxResult + itemResult;
    }

    /**
     * 更新盲盒信息及其款式
     */
    @Transactional(rollbackFor = Exception.class)
    public int updateBlindBoxWithItems(BlindBox blindBox, List<Item> items) {
        int boxResult = blindBoxMapper.updateBox(blindBox);

        // 获取原有款式
        List<Item> existingItems = itemMapper.selectByBoxId(blindBox.getId());

        // 分离新款式和已有款式
        List<Item> newItems = new ArrayList<>();
        List<Item> updateItems = new ArrayList<>();
        List<Long> existingItemIds = existingItems.stream().map(Item::getId).collect(Collectors.toList());

        for (Item item : items) {
            item.setBoxId(blindBox.getId());
            if (item.getId() != null && item.getId() > 0 && existingItemIds.contains(item.getId())) {
                // 已有款式，需要更新
                updateItems.add(item);
            } else {
                // 新款式，需要插入
                item.setId(null); // 确保新款式的ID为null，让数据库自动生成
                newItems.add(item);
            }
        }

        // 找出需要删除的款式（原有但不在当前列表中的）
        List<Long> currentItemIds = items.stream()
                .filter(item -> item.getId() != null && item.getId() > 0)
                .map(Item::getId)
                .collect(Collectors.toList());
        List<Long> itemsToDelete = existingItemIds.stream()
                .filter(id -> !currentItemIds.contains(id))
                .collect(Collectors.toList());

        int itemResult = 0;

        // 删除不再需要的款式，但只删除那些没有被抽中过的款式
        for (Long itemId : itemsToDelete) {
            // 检查该款式是否被用户抽中过
            if (!itemMapper.isItemReferenced(itemId)) {
                itemResult += itemMapper.deleteItemById(itemId);
            } else {
                // 如果款式已被抽中，记录日志但不删除
                System.out.println("款式 ID " + itemId + " 已被用户抽中，无法删除");
            }
        }

        // 更新已有款式
        for (Item item : updateItems) {
            itemResult += itemMapper.updateItem(item);
        }

        // 插入新款式
        if (!newItems.isEmpty()) {
            itemResult += itemMapper.insertItems(newItems);
        }

        return boxResult + itemResult;
    }

    /**
     * 删除盲盒及其所有关联款式
     */
    @Transactional(rollbackFor = Exception.class)
    public int deleteBlindBoxWithItems(Long id) {
        // 先检查该盲盒下是否有被抽中过的款式
        List<Item> boxItems = itemMapper.selectByBoxId(id);
        for (Item item : boxItems) {
            if (itemMapper.isItemReferenced(item.getId())) {
                throw new RuntimeException("无法删除盲盒：盒子中的款式 '" + item.getName() + "' 已被用户抽中");
            }
        }

        // 如果没有被引用的款式，则可以安全删除
        itemMapper.deleteByBoxId(id);
        return blindBoxMapper.deleteBox(id);
    }

    /**
     * 获取盲盒详情（包括其款式）
     */
    public BlindBox getBlindBoxWithItemsById(Long id) {
        BlindBox box = blindBoxMapper.selectBoxById(id);
        if (box != null) {
            box.setItems(itemMapper.selectByBoxId(id));
        }
        return box;
    }
}
