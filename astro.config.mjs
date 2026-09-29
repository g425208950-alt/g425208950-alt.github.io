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
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
