package web.project.chewytta.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * 静态资源配置 - 支持内嵌前端和 SPA 路由
 */
@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {

        // 配置前端静态资源访问
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(3600)
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(@NonNull String resourcePath,
                            @NonNull Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        return requestedResource.exists() && requestedResource.isReadable()
                                ? requestedResource
                                : new ClassPathResource("/static/index.html");
                    }
                });

        // 配置文件上传资源访问
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:./ChewyApp/userdata/")
                .setCachePeriod(3600);

        // 配置管理员内容资源访问
        registry.addResourceHandler("/admin-content/**")
                .addResourceLocations("file:./AdminContent/")
                .setCachePeriod(3600);
    }
}
