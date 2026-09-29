/**
 * 站内链接工具。
 *
 * GitHub Pages 的项目站点会把整站挂在子路径下（base = "/仓库名"），
 * 因此页面里所有指向站内的链接、图片、favicon 都必须带上 base 前缀，
 * 否则部署后会 404。这里统一处理，避免每处都手写字符串拼接。
 *
 * 注意：不同 Astro 版本里 import.meta.env.BASE_URL 是否带结尾斜杠并不一致，
 * 所以先把它规范化成不带结尾斜杠的形式：
 *   - 根站点（用户站点 / 自定义域名）→ ""
 *   - 子路径站点（项目站点）        → "/仓库名"
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** 带结尾斜杠的站点根路径：根站点是 "/"，子路径站点是 "/仓库名/"。 */
export const basePath = `${BASE}/`;

/**
 * 把站内路径解析成带 base 的绝对路径。
 *
 * withBase('blog/hello/')  → '/blog/hello/'  （根站点）
 *                          → '/仓库名/blog/hello/'（项目站点）
 * withBase('/about')       → 前导斜杠有无都可以
 * withBase('')             → 站点根路径
 */
export function withBase(path: string): string {
	return `${BASE}/${path.replace(/^\/+/, '')}`;
}
