package web.project.chewytta.mapper;

import org.apache.ibatis.annotations.Mapper;
import web.project.chewytta.model.Item;

import java.util.List;

@Mapper
public interface ItemMapper {

    // 根据盲盒ID获取所有款式
    List<Item> selectByBoxId(Long boxId);

    // 根据ID查询款式
    Item selectItemById(Long id);

    // 插入新款式
    int insertItem(Item item);

    // 批量插入款式
    int insertItems(List<Item> items);

    // 更新款式信息
    int updateItem(Item item);

    // 删除款式
    int deleteItemById(Long id);

    // 按盲盒ID删除所有款式
    int deleteByBoxId(Long boxId);

    // 检查某个款式是否被抽中过（是否在 drawn_boxes 中有引用）
    boolean isItemReferenced(Long itemId);
}
