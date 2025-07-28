package web.project.chewytta.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.project.chewytta.dto.DrawnBoxDTO;
import web.project.chewytta.mapper.BlindBoxMapper;
import web.project.chewytta.mapper.DrawnBoxMapper;
import web.project.chewytta.mapper.ItemMapper;
import web.project.chewytta.model.BlindBox;
import web.project.chewytta.model.DrawnBox;
import web.project.chewytta.model.Item;
import web.project.chewytta.service.UserService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class DrawnBoxService {

    @Autowired
    private ItemMapper itemMapper;
    
    @Autowired
    private BlindBoxMapper blindBoxMapper;

    @Autowired
    private DrawnBoxMapper drawnBoxMapper;

    @Autowired
    private UserService userService;

    public Item drawItemFromBox(Long userId, Long boxId, BigDecimal price) {
        List<Item> items = itemMapper.selectByBoxId(boxId);
        if (items.isEmpty()) return null;

        Random random = new Random();
        Item selectedItem = items.get(random.nextInt(items.size()));

        DrawnBox drawnBox = new DrawnBox();
        drawnBox.setUserId(userId);
        drawnBox.setBoxId(boxId);
        drawnBox.setItemId(selectedItem.getId());
        drawnBox.setPrice(price);
        drawnBoxMapper.insertDrawnBox(drawnBox);

        return selectedItem;
    }

    /**
     * 抽取盲盒并扣除余额
     */
    @Transactional(rollbackFor = Exception.class)
    public Item drawItemFromBoxWithDeduction(Long userId, Long boxId, BigDecimal price) {
        // 先扣除余额
        userService.deductBalance(userId, price);

        // 再执行抽取逻辑
        return drawItemFromBox(userId, boxId, price);
    }


    public List<DrawnBox> getDrawnBoxesByUserId(Long userId) {
        return drawnBoxMapper.selectByUserId(userId);
    }

    /**
     * 获取用户的所有订单（带盲盒和款式详情）
     */
    public List<DrawnBox> getOrdersByUserId(Long userId) {
        return drawnBoxMapper.selectByUserIdWithDetails(userId);
    }

    /**
     * 获取用户抽中记录，包含盲盒和款式详细信息
     */
    public List<DrawnBoxDTO> getUserDrawnBoxesWithDetails(Long userId) {
        try {
            System.out.println("开始获取用户抽中记录，用户ID: " + userId);
            
            List<DrawnBox> drawnBoxes = drawnBoxMapper.selectByUserId(userId);
            System.out.println("从数据库获取到 " + drawnBoxes.size() + " 条抽中记录");
            
            return drawnBoxes.stream().map(drawnBox -> {
                try {
                    DrawnBoxDTO dto = new DrawnBoxDTO();
                    dto.setId(drawnBox.getId());
                    dto.setPrice(drawnBox.getPrice());
                    
                    // 处理时间字段，优先使用draw_time，fallback到draw_date
                    LocalDateTime drawTime = drawnBox.getDrawTime();
                    if (drawTime == null) {
                        drawTime = drawnBox.getDrawDate();
                    }
                    dto.setDrawnAtFromLocalDateTime(drawTime);
                    
                    // 获取盲盒信息
                    BlindBox blindBox = blindBoxMapper.selectBoxById(drawnBox.getBoxId());
                    if (blindBox == null) {
                        System.err.println("警告：找不到ID为 " + drawnBox.getBoxId() + " 的盲盒");
                    }
                    dto.setBlindBox(blindBox);
                    
                    // 获取款式信息
                    Item item = itemMapper.selectItemById(drawnBox.getItemId());
                    if (item == null) {
                        System.err.println("警告：找不到ID为 " + drawnBox.getItemId() + " 的款式");
                    }
                    dto.setItem(item);
                    
                    return dto;
                } catch (Exception e) {
                    System.err.println("处理抽中记录时出错，记录ID: " + drawnBox.getId());
                    e.printStackTrace();
                    throw new RuntimeException("处理抽中记录失败", e);
                }
            }).collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("获取用户抽中记录失败，用户ID: " + userId);
            e.printStackTrace();
            throw new RuntimeException("获取抽中记录失败: " + e.getMessage(), e);
        }
    }

    /**
     * 检查用户是否已抽取过某个物品
     */
    public boolean hasUserDrawnItem(Long userId, Long itemId) {
        return drawnBoxMapper.hasUserDrawnItem(userId, itemId);
    }

}
