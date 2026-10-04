import type { CollectionEntry } from 'astro:content';

/**
 * 文章的 URL slug。
 *
 * 内容集合里 `post.id` 是「相对 src/content/blog 的路径」（不带扩展名），
 * 例如 `languages/javascript/vue`。如果直接拿它当路由参数，URL 就会跟着
 * 文件夹走，整理一次目录线上链接全废。
 *
 * 这里只取最后一段（文件名），让 URL 和存放位置解耦：
 *   src/content/blog/languages/javascript/vue.md → /blog/vue/
 *   src/content/blog/beginning.md                → /blog/beginning/
 *
 * 代价：不同文件夹里不能有同名文件，否则会撞成同一个 URL。
 */
export function postSlug(post: CollectionEntry<'blog'>): string {
	const { id } = post;
	return id.slice(id.lastIndexOf('/') + 1);
}
