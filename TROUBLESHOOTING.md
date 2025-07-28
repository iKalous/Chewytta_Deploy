可能会出现openjdk无法拉取或者nginx-latest无法拉取的情况。

这里提供了解决方案：

通过dockerhub手动拉取镜像
搜索 ikalous 会出现我上传的项目相关镜像，下载jdk和nginx-latest的镜像即可

由于还未修改dockerfile，请在拉取镜像以后修改dockerfile
分别是前端 Dockerfile Dockerfile.simple 和 后端 Dockerfile Dockerfile.simple

# 原内容：FROM nginx:latest
# 改为：
FROM ikalous/images_for_cheytta:nginx-latest

# 原内容：FROM openjdk:17-jdk-slim
# 改为：
FROM ikalous/images_for_cheytta:openjdk-17-jdk-slim

即可接着启动 一键启动脚本 了。