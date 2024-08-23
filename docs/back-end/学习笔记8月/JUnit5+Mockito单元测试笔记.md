## 单元测试笔记



### 一、案例

#### 1、引入依赖

~~~xml
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-test-autoconfigure</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.mockito</groupId>
            <artifactId>mockito-inline</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <version>5.7.2</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-engine</artifactId>
            <version>5.7.2</version>
            <scope>test</scope>
        </dependency>
~~~



#### 2、创建数据库连接启动类（根据不同数据库选择，此处展示jpa连接）

~~~java
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.AdviceMode;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.annotation.EnableTransactionManagement;


/**
 * 用于单元测试的启动类
 */

@SpringBootApplication(scanBasePackages = {"com.xxx.xxx","com.xxx.xxx"})
@EnableJpaAuditing
@EnableJpaRepositories(repositoryBaseClass = SimpleJpaRepository.class)
@EnableTransactionManagement(mode = AdviceMode.ASPECTJ)
@EnableAspectJAutoProxy(proxyTargetClass = true)
@EnableAsync(mode = AdviceMode.ASPECTJ)
public class Application4Tests {

    public static void main(String[] args) {
        SpringApplication.run(Application4Tests.class, args);
    }
}
~~~



#### 3、数据库连接基本测试类

~~~java
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Order;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ContextConfiguration;


@DataJpaTest // 扫描 repository 接口及其他必要组件，默认开启了事务，不管有没有异常都进行回滚
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // 直接操作数据库而不是内存
@ContextConfiguration(classes = Application4Tests.class) // 指定启动类
public class BaseTests {

    @BeforeEach
    @Order(0)
    public void setUp(){
        // 启用 mockito 注解
        MockitoAnnotations.openMocks(this);
    }

}
~~~



#### 4、需要查询数据库的测试类

~~~java
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.boot.test.mock.mockito.SpyBean;

import java.util.List;

/**
 * @author xuhh
 * @date 2024/05/16
 */

public class SaasServiceTest extends BaseTests {

    @SpyBean
    private SaasServiceSoftwareRepository saasServiceSoftwareRepository;

    @InjectMocks
    private SaasServiceService saasServiceService;

    @Test
    @DisplayName("从数据库获取软件树")
    void getSoftwareTreeByAdmin(){
        List<SaasServiceSoftwareTreeVO> softwareTreeByAdmin = saasServiceService.getSoftwareTreeByAdmin(10000);
        System.out.println(softwareTreeByAdmin);
    }
}
~~~



#### 5、无需查询数据库的测试类

~~~java
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.List;

@ExtendWith(MockitoExtension.class)
public class SaasServiceServiceTest{

    @Mock
    private SaasServiceSoftwareRepository saasServiceSoftwareRepository;

    @InjectMocks
    private SaasServiceService saasServiceService;

    public static SaasServiceSoftwareDO createSampleObject() {
        SaasServiceSoftwareDO softwareDO = new SaasServiceSoftwareDO();
        softwareDO.setSoftwareId(1);
        softwareDO.setIsApp(true);
        softwareDO.setIsShowInPortal(false);
        softwareDO.setAppCode("APP001");
        softwareDO.setCode("SW001");
        softwareDO.setLevel(1);
        softwareDO.setParentId(0);
        softwareDO.setDefaultRoleIds("1,2,3");
        softwareDO.setDefaultOpenSubIds("10,11");
        softwareDO.setOpenLinkageIds("20,21");
        softwareDO.setCloseLinkageIds("30,31");
        softwareDO.setName("Sample Software");
        softwareDO.setLogo("https://example.com/logo.png");
        softwareDO.setDescription("A detailed description of the software.");
        softwareDO.setRemark("Additional notes for this software.");
        softwareDO.setSort(100);

        return softwareDO;
    }

    @BeforeEach
    void init(){
        SaasServiceSoftwareDO sampleObject = createSampleObject();
        Mockito.when(saasServiceSoftwareRepository.getListByIsAppAndProductId(true,10000)).thenReturn(List.of(sampleObject));
    }

    @Test
    @DisplayName("获取软件树")
    void getSoftwareTreeByAdmin(){
        List<SaasServiceSoftwareTreeVO> softwareTreeByAdmin = saasServiceService.getSoftwareTreeByAdmin(10000);
        System.out.println(softwareTreeByAdmin);
    }
}
~~~



### 二、注解介绍

1、@InjectMocks

这个注解用于实例化并把模拟(mock)或者伪造(spy)对象自动注入到被测试对象中。具体来说，它用于创建类的实例，其余的属性将由 Mockito 通过自动导入的方式注入。

使用场景：当你需要模拟测试类的部分行为，同时需要使用 Mock 对象自动注入 Mock 或 Spy 对象到被测试类中。

2、@SpyBean

这个 Spring Boot 的注解可以用来包装一个真实的 Bean，所以真实的方法会被调用，但你仍然可以控制它的行为（比如返回值、抛出异常等）。可以用 @SpyBean 替换 @Autowired + spy() 的调用。通过此注解，你可以在所有调用真实方法的同时，仍得到方法调用的控制权。

使用场景：需要真实调用 Bean 的方法，但同时也需要控制（比如，改变特定方法的行为、监视方法调用等）的场合。

3、@MockBean

这个是 Spring Boot 专有的注解，和 @Mock 有点像。 @MockBean 会向 Spring 应用上下文添加 Mock 实例，这主要是用在 Spring Boot 应用的集成测试中。

使用场景：当你希望在 Spring 测试中，直接使用模拟对象替换 Spring 上下文中的 Bean 时可以使用它。

4、@Mock

这个是 Mockito 的注解。被 @Mock 注解的对象会被 Mockito 初始化为 Mock 对象。 @Mock 创建的是一个全新的Mock对象，并非Spring上下文中的bean。

使用场景：当你需要模拟一个对象，以隔离和减小测试的范围时，就可以使用它。

5、@Captor

这个注解用于创建参数捕获器（ArgumentCaptor）。参数捕获器可以捕获方法调用中的参数值，从而让你可以验证输入或存根(stub)带有特定参数的方法。

6、@Reset

这个注解可以重置mock对象。它有两个可选的重置策略： BEFORE 代表在每个测试方法之前重置 mock；AFTER 代表在每个测试方法之后重置 mock。

7、@Spy

这个注解用于创建一个 "伪造"（Spy）对象。和正常的 Mock 对象不同，Spy 对象默认调用真实的方法实现。



### 三、问题

#### `@Mock` 和 `@MockBean` 的异同？

###### 相同点：

- 它们都用于创建 mock 对象，在进行单元测试或集成测试时模拟对象的行为。

###### 不同点：

1. **定义范围和使用环境：**
   - `@Mock` 是 Mockito 提供的注解，用于单元测试中。
   - `@MockBean` 是 Spring Boot 测试提供的注解，主要用于集成测试中。
2. **作用域：**
   - 使用 `@Mock` 创建的 mock 对象只存在于当前测试类的上下文中。
   - `@MockBean` 不仅创建了一个 Mock 对象，还会替换掉 Spring 应用上下文中同类型的 Bean，确保在当前应用上下文中所有对该 Bean 的引用都是用的 Mock 对象。这对于集成测试而言是非常有用的，尤其是当你需要模拟整个应用中的组件行为时。
3. **自动装配：**
   - `@MockBean` 在创建 mock 对象后，会自动装配到 Spring 上下文中，所有使用了 Spring 的自动装配来注入该类型对象的地方都会自动替换为 mock 实例。
   - `@Mock` 创建的 mock 实例需要手动通过 Mockito 的工具方法（如 `MockitoAnnotations.initMocks(this);`）进行初始化，并且需要手动注入到被测试的对象中。

###### 使用场景差异：

- 当你仅仅进行单元测试，特别是不涉及 Spring 上下文管理的对象时，使用 `@Mock` 是更合适的选择。
- 当进行集成测试，特别是需要 Spring 管理的 Bean 之间的交互时，使用 `@MockBean` 能够确保 Spring 应用上下文中的相关 Bean 被 mock 对象所替换，这样能在保持测试隔离的同时，模拟整个应用的环境。
