# 使用官方OpenJDK 17基础镜像
FROM openjdk:17-jdk-slim

# 设置工作目录
WORKDIR /app

# 复制Maven包装器和项目配置文件
COPY mvnw .
COPY mvnw.cmd .
COPY pom.xml .
COPY .mvn .mvn

# 复制源代码
COPY src src

# 给Maven包装器执行权限
RUN chmod +x mvnw

# 构建应用程序
RUN ./mvnw clean package -DskipTests

# 暴露端口
EXPOSE 8080

# 运行应用程序
CMD ["java", "-jar", "target/Chewytta-0.0.1-SNAPSHOT.jar"]
