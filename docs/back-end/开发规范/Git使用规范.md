# Git使用规范

规范使用GIT有利于向团队成员传达清晰有效的信息，增强团队的协作，减少沟通成本，同时也便于后期维护对历史提交、变更信息的追溯。

# 分支管理规范

目前使用度比较高的工作流有Git Flow、GitHub Flow、GitLab Flow，结合团队当前的开发发布流程，使用Git Flow作为分支管理策略，并作了一些调整。Git flow是由Vincent Driessen于2010 年提出的代码分支管理模型。

## **Git Flow分支命名规范**

- master 分支：`master` 分支有且仅有一个，名称即为 `master`，不能有master-xxx命名的分支存在。
- develop 分支：`develop` 分支有且仅有一个，名称即为 `develop`，不能有develop-xxx命名的分支存在。
- feature 分支：feature/<版本号>-<功能名>，例如：feature/v1.3-login。
- hotfix 分支：用于修复生产环境的临时分支。

## **Git Flow分支说明**

- **master(常驻)**

  代码库主分支，所有提供给用户使用的正式版本，都在这个主分支上发布。它是自动建立的，版本库初始化以后，默认就是在主分支在进行开发。团队成员从主分支(`master`)获得的都是处于可发布状态的代码。

  生产环境只能使用master分支进行发布，每次版本成功发布后，要打上`tag`版本标签，以便发布的回滚，版本代码的追溯。

- **develop(常驻)**

  汇总开发者完成的工作成果，`develop`主要用于版本完整功能的测试，对应于`测试环境`，`develop`分支代码的修改仅限于修复测试环境的bug，简单的性能优化、代码优化，对于周期长的性能优化、重构要单独创建一个`feature`分支。

  测试通过后，如果要进行版本发布，才将`develop`合并到`master`分支。

- **feature**

  当要开发新功能时，从` develop`分支创建一个新的 `feature` 分支，并在 `feature` 分支上进行开发。

  分支创建后要push到远端，以便多人联合开发。

  `feature`对应发布到`开发环境`，用于前后端在开发阶段的功能联调。

  开发完成后，需要将该 `feature` 分支合并到 `develop` 分支，最后**删除**该 `feature` 分支。

- **hotfix**

  当 `master` 分支中的产品出现需要立即修复的 bug 时，从 `master` 分支上创建一个新的 `hotfix` 分支，并在 `hotfix` 分支上进行 BUG 修复。修复完成后，需要将 `hotfix` 分支合并到 `master` 分支和 `develop` 分支，并为 `master` 分支添加新的版本号 `tag`，最后**删除** `hotfix` 分支。

# 分支操作规范

为了使Git提交历史的图谱更具有可读性，应减少不必要merge节点，避免出现过多的分叉。

## git pull 使用 rebase方式

**同一分支**更新文件时，使用`rebase`方式，避免代码冲突时，分支记录中出现不必要的 Merge branch ‘develop’ of … 记录

```javascript
	#pull命令
	$ git pull --rebase
	
	#或者修改pull默认的fast-forward模式为 rebase模式
	$ git config --global pull.rebase true		//这个配置就是告诉git在每次pull前先进行rebase操作。
```

在IDEA中的设置update 方式为 rebase

 

## 不同分支合并使用 --no-ff方式

```javascript
	#切换到develop分支
	$ git checkout develop
	#使用no-ff 递归合并，将feature/v1.6合并到当前分支
	$ git merge --no-ff feature/v1.6
```



## 合理的使用cherry-pick

使用cherry-pick 可以将任何分支的选定的单个提交集成到当前的 HEAD 分支中。

```javascript
	# af02e0b是待集成commit节点的SHA值
	$ git cherry-pick af02e0b
	# 只将提交的更改添加到工作副本，而不是直接commit
	$ git cherry-pick af02e0b --no-commit
```

cherry-pick 会引起重复提交，cherry-pick时是生成**全新的提交对象**，具有自己的新 SHA 标识符。

 

# 提交信息规范

Angular规范是目前使用最广的写法，比较合理和系统化，并且有配套的工具（IDEA 2020版本开始集成了这种写法）,本文参考了Angular规范并进行适当的调整。

**commit message格式**

```text
<type>(<scope>): <subject>	//冒号后要加空格
// 空一行
<body>
// 空一行
<footer>
```

- **type(必须)**
  type用于说明git commit的类别，允许使用下面的标识。

|   标识   | 说明                                                         |
| :------: | :----------------------------------------------------------- |
|   feat   | 新功能。                                                     |
|   fix    | 修复bug，可以是QA发现的BUG，也可以是研发自己发现的BUG。      |
|   test   | 增加测试。                                                   |
|   perf   | 优化相关，比如提升性能、体验。                               |
| refactor | 重构（即不是新增功能，也不是修改bug的代码变动）。            |
|  merge   | 代码合并。                                                   |
|   sync   | 同步主线或分支的Bug。                                        |
|   docs   | 文档（documentation）。                                      |
|  style   | 格式（不影响代码运行的变动）。                               |
|  revert  | 回滚到上一个版本。                                           |
|  chore   | 与src、test 源文件无关的其它变动。                           |
|    ci    | CI相关的配置、脚本。                                         |
|  build   | 构造工具的或者外部依赖的改动，例如webpack，npm，maven，gradle。 |



- **scope(可选)**
  scope用于说明 commit 影响的范围。
  例如在Angular，可以是location，browser，compile，compile，animations，http，core等。如果你的修改影响了不止一个scope，你可以使用 *代替。

  

- **subject(必须)**
  subject是commit目的的**简短**描述，建议使用中文。

  

- **body(可选)**
  补充subject，如必要性、解决的问题、可能影响的地方，可以换行 如果有链接一定附上链接

  

- **footer(可选)**
  bug的id、issue的id等