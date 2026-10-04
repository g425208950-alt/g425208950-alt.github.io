import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	// `**/` 会递归到子目录，附件目录里的 .md（Excalidraw 的 xxx.excalidraw.md）
	// 也会被当成文章，这里用 `!` 取反排除掉。
	loader: glob({
		base: './src/content/blog',
		pattern: ['**/*.{md,mdx}', '!attachment/**'],
	}),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			// 草稿：写了 draft: true 的文章只在本地 `astro dev` 里出现，
			// 不会生成线上页面、不进列表、不进 RSS。可以放心 commit / push。
			draft: z.boolean().default(false),
		}),
});

export const collections = { blog };
