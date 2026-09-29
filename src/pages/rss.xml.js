import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { basePath, withBase } from '../utils/url';

export async function GET(context) {
	const posts = await getCollection('blog');
	// 频道本身的地址也要带上 base，否则项目站点下会指向域名根路径。
	const site = new URL(basePath, context.site);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site,
		items: posts.map((post) => ({
			...post.data,
			// link 是绝对路径，@astrojs/rss 会相对 site 解析它。
			link: withBase(`blog/${post.id}/`),
		})),
	});
}
