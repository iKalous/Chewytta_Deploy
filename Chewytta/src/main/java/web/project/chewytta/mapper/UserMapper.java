package web.project.chewytta.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import web.project.chewytta.model.User;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface UserMapper {

    // 根据ID查询用户
    User selectById(Long id);

    // 根据用户名查询用户
    User selectByUsername(String username);

    // 查询所有用户
    List<User> selectAll();

    // 插入新用户
    int insert(User user);

    // 更新用户信息
    int update(User user);

    // 删除用户
    int deleteById(Long id);

    // 用户登录验证
//    User login(@Param("username") String username, @Param("password") String password);

    // 只传入 account 参数即可
    User loginByAccount(@Param("account") String account);

    // 修改密码
    int updatePassword(@Param("id") Long id, @Param("newPassword") String newPassword);

    // 修改昵称
    int updateNickname(@Param("id") Long id, @Param("nickname") String nickname);

    int updateAvatar(@Param("id") Long id, @Param("avatarUrl") String avatarUrl);

    // web/project/chewytta/mapper/UserMapper.java

    // 在接口中添加方法
    int updateBalance(@Param("id") Long id, @Param("balance") BigDecimal balance);

}
