/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://www.chzzkcounts.live',
    generateRobotsTxt: true,
    transform: async (config, path) => {
        if (path.startsWith('/counter/')) {
            return {
                loc: `${config.siteUrl}${path}`,
                changefreq: 'daily',
                priority: 0.8,
            };
        }
        return {
            loc: `${config.siteUrl}${path}`,
            changefreq: 'weekly',
            priority: 0.7,
        };
    },
};
