// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// ---------------------------------------------------------------------------
// GitHub Pages 配置（一般不用改这里）
// ---------------------------------------------------------------------------
// GitHub Pages 有两种站点，URL 形态不同：
//
//   1) 用户站点 —— 仓库名必须是 <你的用户名>.github.io
//      地址：https://<用户名>.github.io/
//      base = '/'
//
//   2) 项目站点 —— 仓库名是任意别的名字，比如 blog、my-site
//      地址：https://<用户名>.github.io/<仓库名>/
//      base = '/<仓库名>'
//
// 下面会自动识别。GitHub Actions 里 GitHub 会注入 GITHUB_REPOSITORY 之类的
// 环境变量，所以在 CI 上构建时不需要你手填任何东西；本地开发则退化成
// site = https://example.com、base = '/'。
//
// 想手动覆盖（比如以后绑定了自己的域名），用环境变量：
//   SITE_URL=https://my-domain.com BASE_PATH=/ npm run build
// ---------------------------------------------------------------------------

const [repoOwner, repoName] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const owner = process.env.GITHUB_REPOSITORY_OWNER || repoOwner;

const isUserSite = Boolean(repoName?.endsWith('.github.io'));

const site = process.env.SITE_URL ?? (owner ? `https://${owner}.github.io` : 'https://example.com');
const base = process.env.BASE_PATH ?? (repoName && !isUserSite ? `/${repoName}` : '/');

// https://astro.build/config
export default defineConfig({
	site,
	base,
	integrations: [mdx(), sitemap()],

	// 关掉开发时左下角那个悬浮调试工具栏。它只在 dev 下存在，不进构建产物。
	// 注意：改这个文件后必须重启 dev server 才生效，刷新页面不够。
	devToolbar: {
		enabled: false,
	},

	fonts: [
		{
			provider: fontProviders.local(),
			// 只含 latin 子集，两个字重加起来约 47 KB。中文不在这里，
			// 交给 global.css 里 --font-sans 后面的系统中文字体兜底。
			name: 'Inter',
			cssVariable: '--font-inter',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/inter-latin-400-normal.woff2'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/inter-latin-700-normal.woff2'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
		{
			provider: fontProviders.local(),
			// 衬线体，只用在文章页的标题上（见 global.css 的 --font-serif）。
			// 同样只打包 latin 子集，两个字重共约 46 KB。中文标题不在这里 ——
			// Windows 上的中文衬线基本只有宋体，屏幕上不好看，所以中文标题
			// 仍落到系统黑体，和正文一致。
			name: 'Newsreader',
			cssVariable: '--font-newsreader',
			fallbacks: ['serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/newsreader-latin-400-normal.woff2'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/newsreader-latin-600-normal.woff2'],
						weight: 600,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
