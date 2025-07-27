package web.project.chewytta.mapper;

import org.apache.ibatis.annotations.Mapper;
import web.project.chewytta.model.DrawnBox;

import java.util.List;

@Mapper
public interface DrawnBoxMapper {
    int insertDrawnBox(DrawnBox drawnBox);
    List<DrawnBox> selectByUserId(Long userId);
    // 获取用户的所有订单（包含款式和盲盒信息）
    List<DrawnBox> selectByUserIdWithDetails(Long userId);
    
    // 检查用户是否已抽取过某个物品
    boolean hasUserDrawnItem(Long userId, Long itemId);

}
