package web.project.chewytta.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import web.project.chewytta.model.Favorite;

import java.util.List;

@Mapper
public interface FavoriteMapper {

    // 获取用户的收藏列表
    List<Favorite> selectByUserId(Long userId);

    // 根据用户ID和盲盒ID查询收藏记录
    Favorite selectByUserAndBoxId(@Param("userId") Long userId, @Param("boxId") Long boxId);

    // 新增收藏
    int insertFavorite(Favorite favorite);

    // 删除收藏
    int deleteById(Long id);

    // 检查用户是否已收藏盲盒
    boolean isFavorited(@Param("userId") Long userId, @Param("boxId") Long boxId);

    // 添加收藏
    int addFavorite(@Param("userId") Long userId, @Param("boxId") Long boxId);

    // 取消收藏
    int removeFavorite(@Param("userId") Long userId, @Param("boxId") Long boxId);
}
