/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://www.chzzkcounts.live',
    generateRobotsTxt: true,
    transform: async (config, path) => {
        // 동적 페이지 URL 생성 로직
        return path.includes('/counter/')
            ? {
                loc: path,
                changefreq: 'daily',
                priority: 0.8,
            }
            : config(path);
    },
};
