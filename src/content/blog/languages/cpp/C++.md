---
title: 记录一些没见过的C++语法
description: 好喜欢C++啊
pubDate: 2026-10-05
---
## 未归类

### constexpr
## C++11
### `[[noreturn]]`

```c++
[[noreturn]] void fatal(const char* msg) {
    throw std::runtime_error(msg);
}
```
含义是函数要么抛异常、要么调 abort/exit 之类直接终止进程，反正不会通过 return 回到调用点。编译器据此可以做优化，也能检查出"你以为会返回、其实不会"的错误。

用错有代价：如果一个标了 `[[noreturn]]` 的函数实际会正常返回，程序行为未定义。所以只能用在确实不返回的函数上，典型如 `std::terminate`、`std::abort`、`throw` 的包装、`std::exit`。

C++11 引入的。同一批属性还有 `[[deprecated]]`（C++14）、`[[nodiscard]]`（C++17）、`[[maybe_unused]]`（C++17）等，都在往这个统一属性语法上靠，取代了之前编译器各自的 `__attribute__((noreturn))`、`__declspec(noreturn)` 这类非标准写法。

## C++14
### `[[deprecated]]`

## C++17

### `[[nodiscard]]`
### `[[maybe_unused]]`

### is_integral
`integral` 是"整型的"，指整数类型。

>名字来源就是数学里"整数"的 integral。别和 calculus 里的 integral（积分）混

`std::integral<T>` 是个 concept，当 T 是整数类型时为真，包括 `bool`、`char`、`short`、`int`、`long`、`long long` 以及它们的无符号版本，即标准里所有 `is_integral` 为真的类型。

`std::is_integral` 是 C++11 就有的类型特征，`std::integral` 是 C++20 把它包装成 concept 的版本，用法从 `enable_if_t<is_integral_v<T>>` 变成 `requires std::integral<T>`
## C++20
### constinit
### requires 
`requires` 是 C++20 的关键字，用来给模板加约束，也就是限制"这个模板只接受什么样的类型"。
```c++
template<class T> requires std::integral<T>
T add(T a, T b);
```

```c++
requires std::derived_from<TLocales, Locales> // 求出一个编译期 bool 值
```
另一种叫 requires 表达式，用来描述"类型 T 必须满足哪些操作"，跟约束是两回事但同名：

```c++
template<class T>
concept Addable = requires(T a, T b) { a + b; };// 要求必须能满足函数内操作
```


### concept
`concept` 是 C++20 新增的关键字，跟 requires 同期。
```c++
template<class T>
concept Addable = requires(T a, T b) { a + b; };
```
定义出来的 `Addable` 就是个 concept，可以像 `std::integral` 那样直接用在 requires 子句或模板参数上：
```c++
template<Addable T>
T add(T a, T b);
```
```c++
template<class T> requires Addable<T> // 用 requires 子句，可以引用 T
T add(T a, T b);
```
```c++
Addable auto add(Addable auto a, Addable auto b);//这种 `Concept auto` 组合是合法的，但它整体是另一个语法，不是你那行。
```

## C++23
```c++
auto func(this auto&& self, 其他参数)
```
传统写法里，成员函数隐式带一个 this，函数体内用 `this->xxx` 或直接写成员名访问自己，但你没法给这个 this 起名字。新语法把它摊开成一个真正的参数。
第一个参数位置的 `this auto&& self` 就是那个"自己"。`this` 是关键字，标记"这个参数是对象本身，不是普通参数"；`auto&&` 是类型推导，`self` 是你取的名字，函数体里就用 `self` 访问自己。
为什么是 `auto&&`。`auto&&` 是转发引用，能接住任意 value category：左值对象调用时自推成左值引用，右值对象调用时成右值引用，const 也一并带上。这就让它对 const/非const、左值/右值四种组合都能工作，等价于同时写出 & 、const&、&&、const&& 四个重载。传统要写四份的活，这里一份搞定。