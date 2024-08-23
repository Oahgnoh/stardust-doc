## jpa学习

#### 需要了解的

Repository ：

是 Spring Data Common ⾥⾯的顶级⽗类接⼝，操作 DB 的⼊⼝类。Spring 底层做动态代理的时候发现只要是它的子类或者实现类，都代表储存库操作。所以不用再把自定义Repository 注入spring容器

7 个⼤ Repository 接⼝：

Repository(org.springframework.data.repository)，没有暴露任何⽅法；
CrudRepository(org.springframework.data.repository)，简单的 Curd ⽅法；
PagingAndSortingRepository(org.springframework.data.repository)，带分⻚和排序的⽅法；
QueryByExampleExecutor(org.springframework.data.repository.query)，简单 Example 查询；
JpaRepository(org.springframework.data.jpa.repository)，JPA 的扩展⽅法；
JpaSpecificationExecutor(org.springframework.data.jpa.repository)，JpaSpecification 扩展查询；
QueryDslPredicateExecutor(org.springframework.data.querydsl)，QueryDsl 的封装。

两⼤ Repository 实现类：

SimpleJpaRepository(org.springframework.data.jpa.repository.support)，JPA 所有接⼝的默认实现类；
QueryDslJpaRepository(org.springframework.data.jpa.repository.support)，QueryDsl 的实现类。



#### SimpleJpaRepository

save、deleteById、deleteAll 会通过 findById 先查询⼀下实体对象的 ID，然后再去对查询出来的实体对象进⾏保存操作。故做 Save 的时候不用先主动去 Find ⼀下。

关于 entityInformation.isNew(entity)：如果当传递的参数⾥⾯没有 ID，则直接 insert；若当传递的参数⾥⾯有 ID，则会触发 select 查询。此⽅法会去看⼀下数据库⾥⾯是否存在此记录，若存在，则 update，否则 insert。**（此处的update是全量更新，DB有值可能会被赋为null）**



#### JpaRepository

flush() 和 saveAndFlush() 能⼿动刷新 session，把对象的值⽴即更新到数据库。

因为 JPA 是 由 Hibernate 实现的，所以有 session ⼀级缓存机制，当调⽤ save() ⽅法的时候，数据库⾥⾯是不会⽴即变化的。



#### 自定义的UserRepository

~~~java
public interface UserRepository extends JpaRepository<User,Long> {
}
~~~

UserRepository 的实现类是 Spring 启动的时候，利⽤ Java 动态代理机制帮我们⽣成的实现类，⽽真正的实现类就是 SimpleJpaRepository。



在spring-data-jpa的maven文件META-INF下的spring.factories可查看到bean的加载配置

~~~java
// 指定了使用Spring Data JPA提供的 JpaRepositoryFactory 作为存储库工厂，以便创建JPA存储库实例。
org.springframework.data.repository.core.support.RepositoryFactorySupport=org.springframework.data.jpa.repository.support.JpaRepositoryFactory
// 指定了使用Hibernate作为JPA实现时的代理检测器。
org.springframework.data.util.ProxyUtils$ProxyDetector=org.springframework.data.jpa.util.HibernateProxyDetector
~~~

~~~java
public class JpaRepositoryFactory extends RepositoryFactorySupport{}
~~~

在RepositoryFactorySupport里将UserRepository 的接⼝会被动态代理成 SimpleJapRepository 的实现

~~~java
public <T> T getRepository(Class<T> repositoryInterface, RepositoryFragments fragments) {
    ···
	result.setTarget(target);
    result.setInterfaces(repositoryInterface, Repository.class, TransactionalProxy.class);
    ···
}		
~~~

每⼀个 Repository 的⼦类，都会通过这⾥的动态代理⽣成实现类。



#### DQM语法

带查询功能的⽅法名由查询策略（关键字）+ 查询字段 + ⼀些限制性条件组成

~~~java
// and 条件更多、distinct or 排序、忽略⼤⼩写的例⼦
interface PersonRepository extends Repository<User, Long> {
    
    // and 的查询关系
    List<User> findByEmailAddressAndLastname(String emailAddress, String lastname);

    // 包含 distinct 去重，or 的 sql 语法
    List<User> findDistinctPeopleByLastnameOrFirstname(String lastname, String firstname);

    // 根据 lastname 字段查询忽略⼤⼩写
    List<User> findByLastnameIgnoreCase(String lastname);

    // 根据 lastname 和 firstname 查询 equal 并且忽略⼤⼩写
    List<User> findByLastnameAndFirstnameAllIgnoreCase(String lastname, String firstname);

    // 对查询结果根据 lastname 排序，正序
    List<User> findByLastnameOrderByFirstnameAsc(String lastname);

    // 对查询结果根据 lastname 排序，倒序
    List<User> findByLastnameOrderByFirstnameDesc(String lastname);
}
~~~

注意：

IgnoreCase 可以针对单个属性，也可针对查询条件⾥⾯所有的实体属性忽略⼤⼩写（所有属性必须在 String 情况下，使用AllIgnoreCase(…)）。

OrderBy 可以通过参数 Sort 实现指定字段的动态排序的查询⽅法（如repository.findAll(Sort.by(Sort.Direction.ASC, “myField”))）。

`org.springframework.data.repository.query.parser.PartTree` 该源码定义了逻辑和处理⽅法

`org.springframework.data.repository.query.parser.Part.Type` 该枚举定义了相关关键字



##### Sort 和 Pageable

根据 Lastname 查询 User 的分⻚和排序的实例

~~~~java
//根据分⻚参数查询User，返回⼀个带分⻚结果的Page（⽅法⼀）
Page<User> findByLastname(String lastname, Pageable pageable);

//根据分⻚参数返回⼀个Slice的user结果（⽅法⼆）
Slice<User> findByLastname(String lastname, Pageable pageable);

//根据排序结果返回⼀个List（⽅法三）
List<User> findByLastname(String lastname, Sort sort);

//根据分⻚参数返回⼀个List对象（⽅法四）
List<User> findByLastname(String lastname, Pageable pageable);
~~~~

⽅法⼀：通过 Page 返回的结果得知可⽤的元素和⻚⾯的总数。这种分⻚查询会默认执⾏⼀条 count 的 SQL 语句。
⽅法⼆：返回结果是 Slice，因为只知道是否有下⼀个 Slice 可⽤，⽽不知道 count，所以当查询较⼤的结果集时，只知道数据是⾜够的，也就是说⽤在业务场景中时不⽤关⼼⼀共有多少⻚。
⽅法三：如果只需要排序，需在 org.springframework.data.domain.Sort 参数中添加⼀个参数。
⽅法四：排序选项也通过 Pageable 实例处理。

~~~java
// 按照 id 升序查询 user ⾥⾯的第⼀⻚，每⻚⼤⼩是20条；并会返回⼀共有多少⻚的信息
Page<User> page = userRepository.findAll(PageRequest.of(0, 20, Sort.by(Sort.Direction.ASC, "id")));
~~~



##### 限制查询结果：First 和 Top

~~~java
User findFirstByOrderByLastnameAsc();
User findTopByOrderByAgeDesc();
List<User> findDistinctUserTop3ByLastname(String lastname, Pageable pageable);
List<User> findFirst10ByLastname(String lastname, Sort sort);
List<User> findTop10ByLastname(String lastname, Pageable pageable);
~~~

其中：

数值可以追加到 First 或 Top 后⾯
数字如省略，则默认⼤⼩为 1
⽀持将结果包装到 Optional 中
如果将 Pageable 作为参数，size 以 Top 和 First 后⾯的数字为准



##### @NonNull、 @Nullable 关键字（没什么作用，如果值为null会抛出错误）

@NonNull：⽤于不能为空的参数或返回值（在 @NonNullApi 适⽤的参数和返回值上不需要）。
@Nullable：⽤于可以为空的参数或返回值。

~~~java
// 添加 @Nullable 注解之后，参数和返回结果这个时候就都会允许为 null 了；
@Nullable
User findByEmailAddress(@Nullable String emailAdress);

// 返回结果允许为 null,参数不允许为 null 的情况
Optional<User> findOptionalByEmailAddress(String emailAddress); 
~~~



#### DTO 返回结果的支持方法

##### 1、定义⼀个 UserOnlyNameEmailDto

~~~java
@Data
@Builder
@AllArgsConstructor
public class UserOnlyNameEmailDto {
    private String name;
    private String email;
}
~~~

 UserRepository 写法：

~~~java
// 测试只返回 name 和 email 的 DTO
UserOnlyNameEmailDto findByEmail(String email);
~~~

**看源码的 PreferredConstructorDiscoverer 类发现，UserDTO ⾥⾯只能有⼀个全参数构造⽅法。**

Constructor 选择的时候会帮我们做构造参数的选择，如果 DTO ⾥⾯有无参构造函数，将会优先选择无参的构造方法；如果有多个构造⽅法或者没有构造函数，则会返回 null，就会报错。

使用时必须保证没有其他构造器。



##### 2、定义⼀个 UserOnlyName 的接⼝

~~~java
public interface UserOnlyName {
    String getName();
    String getEmail(); 
}
~~~

UserRepository 写法：

~~~java
/**
 * 接⼝的⽅式返回DTO
 */
UserOnlyName findByAddress(String address);
~~~

返回的userOnlyName 接⼝会变成一个代理对象，通过 Map 的格式包含返回字段的值，⽤时直接调⽤接⼝⾥⾯的⽅法，如 userOnlyName.getName() 

但是这种方法无法返回一个指定的对象，还需要对返回类型重新赋值。



#### @Query 语法

默认的策略是 CreateIfNotFoundQueryLookupStrategy，也就是如果有 @Query 注解，那么以 @Query 的注解内容为准，可以忽略⽅法名。

JPA 的判断顺序

先判断是否定义存储过程，有的话优先使用存储过程
再判断是否有 Query 注解，有的话再对注解进行处理
最后再根据方法名生成 SQL
如果都没有符合条件的话，就抛出异常

~~~java
package org.springframework.data.jpa.repository;

public @interface Query {
    /**
     * 指定 JPQL 的查询语句。
     * （nativeQuery=true 的时候，是原⽣的 Sql 语句）
     */
    String value() default "";

    /**
     * 指定 count 的 JPQL 语句，如果不指定将根据 query ⾃动⽣成。
     * （如果当 nativeQuery=true 的时候，指的是原⽣的 Sql 语句）
     */
    String countQuery() default "";

    /**
     * 根据哪个字段来 count，⼀般默认即可。
     */
    String countProjection() default "";

    /**
     * 默认是 false，表示 value ⾥⾯是不是原⽣的 sql 语句
     */
    boolean nativeQuery() default false;

    /**
     * 可以指定⼀个 query 的名字，必须唯⼀的。
     * 如果不指定，默认的⽣成规则是：
     * {$domainClass}.${queryMethodName}
     */
    String name() default "";

    /*
     * 可以指定⼀个 count 的 query 的名字，必须唯⼀的。
     * 如果不指定，默认的⽣成规则是：
     * {$domainClass}.${queryMethodName}.count
     */
    String countName() default "";
}
~~~



##### @Query 用法

~~~java
// 案例 1： 要在 Repository 的查询⽅法上声明⼀个注解，这⾥就是 @Query 注解标注的地⽅。
@Query("select u from User u where u.emailAddress = ?1")
User findByEmailAddress(String emailAddress);

// 案例 2： LIKE 查询
// 注意 firstname 不会⾃动加上 % 关键字。
@Query("select u from User u where u.firstname like %?1")
List<User> findByFirstnameEndsWith(String firstname);

// 案例 3： 直接⽤原始 SQL，nativeQuery = true 即可。
// 注意：nativeQuery 不⽀持直接 Sort 的参数查询。
@Query(value = "SELECT * FROM USERS WHERE EMAIL_ADDRESS = ?1", nativeQuery = true)
User findByEmailAddress(String emailAddress);
    
// 案例 4： 下⾯是 nativeQuery 的排序错误的写法，会导致⽆法启动。
@Query(value = "select * from user_info where first_name=?1",nativeQuery = true)
List<UserInfoEntity> findByFirstName(String firstName, Sort sort); 

// 案例 5： nativeQuery 排序的正确写法。
@Query(value = "select * from user_info where first_name=?1 order by ?2",nativeQuery = true)
List<UserInfoEntity> findByFirstName(String firstName, String sort);
// 注意：调⽤的地⽅写法 last_name 是数据⾥⾯的字段名，不是对象的字段名
repository.findByFirstName("zzn111","last_name");

~~~



##### @Query 排序

~~~java
@Query("select u from User u where u.lastname like ?1%")
List<User> findByAndSort(String lastname, Sort sort);
@Query("select u.id, LENGTH(u.firstname) as fn_len from User u where u.lastname like ?1%")
List<Object[]> findByAsArrayAndSort(String lastname, Sort sort);

//调⽤写法：
repo.findByAndSort("lannister", new Sort("firstname"));
repo.findByAndSort("stark", new Sort("LENGTH(firstname)"));
repo.findByAsArrayAndSort("bolton", new Sort("fn_len"));
~~~



##### @Query 的分页

~~~java
@Query(value = "select u from User u where u.lastname = ?1")
Page<User> findByLastname(String lastname, Pageable pageable); 
//调⽤写法
repository.findByFirstName("zzn111", new PageRequest(1,10));
~~~



##### @Param 的用法

~~~java
@Query("select u from User u where u.firstname = :firstname or u.lastname = :lastname")
User findByLastnameOrFirstname(@Param("lastname") String lastname, @Param("firstname") String firstname);
~~~







