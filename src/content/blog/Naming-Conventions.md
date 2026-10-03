---
title: 命名规则
description: 命名规则速查
pubDate: 2026/10/03
---





| 规范名称                                           | **别名 / 细分**               | **格式特征**          | **典型示例**                                          | **常见应用场景**                            |
| ---------------------------------------------- | ------------------------- | ----------------- | ------------------------------------------------- | ------------------------------------- |
| 小驼峰命名法<br><br>  <br><br>`camelCase`            | Lower Camel Case          | 首字母小写，后续单词首字母大写   | `userProfile`<br><br>  <br><br>`fetchDataList`    | Java/JS/Go 的变量名、函数/方法名、属性名            |
| 大驼峰命名法<br><br>  <br><br>`PascalCase`           | 帕斯卡命名法 / Upper Camel Case | 所有单词首字母均大写        | `UserProfile`<br><br>  <br><br>`OrderService`     | 类名（Class）、接口（Interface）、类型定义、React 组件 |
| 蛇形命名法<br><br>  <br><br>`snake_case`            | 下划线命名法                    | 单词全小写，以下划线 `_` 连接 | `user_profile`<br><br>  <br><br>`order_item_id`   | Python 变量与函数、C/C++ 标准库、数据库字段名         |
| 大蛇形命名法<br><br>  <br><br>`SCREAMING_SNAKE_CASE` | 常量命名法 / Macro Case        | 单词全大写，以下划线 `_` 连接 | `MAX_RETRY_COUNT`<br><br>  <br><br>`DEFAULT_PORT` | 全局常量、环境变量、C 语言宏定义                     |
| 短横线命名法<br><br>  <br><br>`kebab-case`           | 烤肉串命名法 / 脊柱命名法            | 单词全小写，以连字符 `-` 连接 | `user-profile`<br><br>  <br><br>`btn-primary`     | URL 路径、CSS 类名、HTML 自定义属性、包名           |