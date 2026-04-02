const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
const protocol = rootDomain.includes('localhost') ? 'http' : 'https';

export const siteConfig = {
  name: 'Promtify',
  description: 'Ship beautiful UIs with AI - curated prompts, one-click generation, and education.',
  url: process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${rootDomain}`,
  ogImage: `${protocol}://${rootDomain}/og.jpg`,

  // Subdomain URLs
  appUrl: process.env.NEXT_PUBLIC_APP_SUBDOMAIN_URL || `${protocol}://app.${rootDomain}`,
  adminUrl: process.env.NEXT_PUBLIC_ADMIN_SUBDOMAIN_URL || `${protocol}://admin.${rootDomain}`,
  marketingUrl: `${protocol}://${rootDomain}`,

  links: {
    twitter: 'https://twitter.com/promtify',
    github: 'https://github.com/promtify',
    discord: 'https://discord.gg/promtify',
  },
  creator: 'Mubashir Ahmed',
  keywords: [
    'AI prompts',
    'UI generation',
    'Flutter',
    'React',
    'Code generation',
    'Design system',
  ],
};

export type SiteConfig = typeof siteConfig;
