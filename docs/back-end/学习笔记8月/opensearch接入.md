参考文档

https://blog.csdn.net/abu935009066/article/details/134883389

https://github.com/opensearch-project/opensearch-java/tree/main

https://github.com/opensearch-project/opensearch-java/blob/main/COMPATIBILITY.md#compatibility-with-jdk



https://blog.csdn.net/wsstjj/article/details/135339966?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_utm_term~default-1-135339966-blog-84809026.235^v43^pc_blog_bottom_relevance_base6&spm=1001.2101.3001.4242.2&utm_relevant_index=2

java8连接opensearch





```
        <dependency>
            <groupId>org.opensearch.client</groupId>
            <artifactId>opensearch-rest-high-level-client</artifactId>
            <version>1.3.10</version>
        </dependency>
```





https://es.dev.cheersmind.qst 账号:admin  密码:admin



配置docker网络

```
docker network create -d bridge --subnet 192.168.0.0/24 --gateway 192.168.0.1 localNet
```

本地docker配置

```
openSearch
discovery.type=single-node 单节点模式
network.host=0.0.0.0 在外部IP也能访问
plugins.security.disabled=false 禁用安全套件（为true的话无需密码认证)

Dashbord
server.host=0.0.0.0 允许外部IP访问（可不配置）
OPENSEARCH_HOSTS=http://192.168.0.1:9200 配置opensearch地址
OPENSEARCH_USERNAME=admin
OPENSEARCH_PASSWORD=admin
```

关闭https

```
#进入容器
docker exec -it openSearch1.3.10 /bin/bash
#编辑opensearch.yml文件
vi /usr/share/opensearch/config/opensearch.yml
#修改 plugins.security.ssl.http.enabled的值为false
plugins.security.ssl.http.enabled: false
#保存后重启docker

```



