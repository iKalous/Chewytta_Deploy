package web.project.chewytta.mapper;

import org.apache.ibatis.annotations.Mapper;
import web.project.chewytta.model.BlindBox;

import java.util.List;

@Mapper
public interface BlindBoxMapper {

    List<BlindBox> selectAllBoxes();

    BlindBox selectBoxById(Long id);

    int insertBox(BlindBox box);

    int updateBox(BlindBox box); // 新增

    int deleteBox(Long id);
    // 根据名称模糊搜索盲盒
    List<BlindBox> searchBoxesByName(String keyword);

}
