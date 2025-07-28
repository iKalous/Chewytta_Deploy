package web.project.chewytta.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import web.project.chewytta.mapper.ItemMapper;
import web.project.chewytta.model.Item;

import java.util.List;

@Service
public class ItemService {

    @Autowired
    private ItemMapper itemMapper;

    // 获取某个盲盒的所有款式
    public List<Item> getItemsByBoxId(Long boxId) {
        return itemMapper.selectByBoxId(boxId);
    }

    // 获取单个款式详情
    public Item getItemById(Long id) {
        return itemMapper.selectItemById(id);
    }

    // 新增款式
    public int addItem(Item item) {
        return itemMapper.insertItem(item);
    }

    // 更新款式信息
    public int updateItem(Item item) {
        return itemMapper.updateItem(item);
    }

    // 删除款式
    public int deleteItem(Long id) {
        return itemMapper.deleteItemById(id);
    }
}
