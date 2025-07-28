package web.project.chewytta.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import web.project.chewytta.mapper.FavoriteMapper;
import web.project.chewytta.model.Favorite;

import java.util.List;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteMapper favoriteMapper;

    // 获取用户的收藏列表
    public List<Favorite> getFavoritesByUserId(Long userId) {
        return favoriteMapper.selectByUserId(userId);
    }

    // 判断用户是否已收藏该盲盒
    public boolean isFavorited(Long userId, Long boxId) {
        return favoriteMapper.selectByUserAndBoxId(userId, boxId) != null;
    }

    // 添加收藏
    public int addFavorite(Favorite favorite) {
        return favoriteMapper.insertFavorite(favorite);
    }

    // 取消收藏
    public int removeFavorite(Long id) {
        return favoriteMapper.deleteById(id);
    }
}
