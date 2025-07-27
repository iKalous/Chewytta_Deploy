package web.project.chewytta;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

// 添加了 @EnableConfigurationProperties 注解
@SpringBootApplication
@EnableConfigurationProperties
public class ChewyttaApplication {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(ChewyttaApplication.class);
        app.setMainApplicationClass(ChewyttaApplication.class);
        app.setWebApplicationType(WebApplicationType.SERVLET);
        app.run(args);
    }
}

