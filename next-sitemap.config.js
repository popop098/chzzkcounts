/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://www.chzzkcounts.live',
    generateRobotsTxt: true,
    exclude: ['/api/*', '/_error', '/404'],
    transform: async (config, path) => {
        if (path.startsWith('/counter/')) {
            return {
                loc: encodeURI(path), // URL encode non-ASCII characters
                changefreq: 'daily',
                priority: 0.9,
                lastmod: new Date().toISOString(),
            };
        }
        return {
            loc: encodeURI(path),
            changefreq: 'weekly',
            priority: 0.7,
            lastmod: new Date().toISOString(),
        };
    },
    robotsTxtOptions: {
        policies: [
            { userAgent: '*', allow: '/' },
            { userAgent: '*', disallow: ['/api'] },
        ],
        additionalSitemaps: [
            `${'https://www.chzzkcounts.live'}/sitemap.xml`,
        ],
    },
};
