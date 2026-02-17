import { next } from '@vercel/edge';

// Article metadata mapping
const articleMetadata = {
    'new-1': {
        title: 'GES Promotion Examination Centres 2025 – Check Here!',
        description: 'The GES has officially released the Promotion Examination Centres. Check your region and centre details here.',
        image: '/New Images/bece.jpg',
        category: 'Announcement'
    },
    'new-2': {
        title: 'Director General for GES, Prof. E.K.Davies Announces Bold Reforms to Boost Credibility of 2025 BECE School Selection',
        description: 'Prof. E.K.Davies introduces targeted reforms to strengthen transparency and accountability in the 2025 BECE school selection process.',
        image: '/director3.jpg',
        category: 'News'
    },
    'new-3': {
        title: 'Why Professor Davis and the Minister of Education deserve national commendation',
        description: 'Education stakeholders laud the success of the 2025 BECE and CSSPS as one of the most transparent in history.',
        image: '/haruna4.jpg',
        category: 'News'
    },
    'new-4': {
        title: 'Engage with stakeholders to deliver robust digital education policy – Haruna to GES Council',
        description: 'The GES Council has been tasked to develop Ghana\'s first-ever comprehensive Digital Education Policy by early 2026.',
        image: '/haruna3.jpg',
        category: 'News'
    },
    'new-5': {
        title: 'Government to commit ¢1bn to school infrastructure in 2026 – Education Minister',
        description: 'The government will inject GH₵1 billion from the GETFund in 2026 to address infrastructure challenges and eliminate the double-track system.',
        image: '/haruna2.jpg',
        category: 'News'
    },
    'new-6': {
        title: 'GES 2025 Posting for Staff Returning from Study Leave with Pay – Check Here!',
        description: 'GES has announced the posting process for staff returning from study leave with pay. Applications are open until Nov 7, 2025.',
        image: '/male-shaking-hands.jpg',
        category: 'News'
    }
};

// Social media crawler user agents
const crawlerUserAgents = [
    'facebookexternalhit',
    'Facebot',
    'Twitterbot',
    'WhatsApp',
    'LinkedInBot',
    'Slackbot',
    'TelegramBot',
    'Discordbot',
    'SkypeUriPreview',
    'Pinterest',
    'redditbot'
];

function isCrawler(userAgent) {
    if (!userAgent) return false;
    return crawlerUserAgents.some(crawler =>
        userAgent.toLowerCase().includes(crawler.toLowerCase())
    );
}

export default async function middleware(request) {
    const { pathname, searchParams } = new URL(request.url);
    const userAgent = request.headers.get('user-agent') || '';

    // Only process blog-post requests from crawlers
    if (!pathname.includes('blog-post') || !isCrawler(userAgent)) {
        return next();
    }

    // Get article parameters
    const id = searchParams.get('id');
    const title = searchParams.get('title');
    const img = searchParams.get('img');
    const cat = searchParams.get('cat');

    // Determine metadata to use
    let metadata;

    if (id && articleMetadata[id]) {
        // Use predefined metadata for known articles
        metadata = articleMetadata[id];
    } else if (title || img) {
        // Use URL parameters if provided
        metadata = {
            title: title || 'Ghana Education Digital Platform News',
            description: 'Latest news and updates from the Ghana Education Digital Platform.',
            image: img || '/director3.jpg',
            category: cat || 'News'
        };
    } else {
        // Default metadata
        metadata = {
            title: 'Ghana Education Digital Platform News',
            description: 'Latest news and updates from the Ghana Education Digital Platform.',
            image: '/director3.jpg',
            category: 'News'
        };
    }

    // Fetch the original HTML
    const response = await fetch(new URL('/blog-post.html', request.url));
    let html = await response.text();

    // Build absolute URLs
    const origin = new URL(request.url).origin;
    const absoluteImageUrl = metadata.image.startsWith('http')
        ? metadata.image
        : `${origin}${metadata.image}`;
    const absolutePageUrl = request.url;
    const fullTitle = `${metadata.title} | GEDP`;

    // Replace meta tags with article-specific content
    html = html
        // Update page title
        .replace(
            /<title>.*?<\/title>/,
            `<title>${fullTitle}</title>`
        )
        // Update description
        .replace(
            /<meta name="description" content=".*?">/,
            `<meta name="description" content="${metadata.description}">`
        )
        // Update Open Graph tags
        .replace(
            /<meta property="og:url" content=".*?" id="og-url">/,
            `<meta property="og:url" content="${absolutePageUrl}" id="og-url">`
        )
        .replace(
            /<meta property="og:title" content=".*?" id="og-title">/,
            `<meta property="og:title" content="${fullTitle}" id="og-title">`
        )
        .replace(
            /<meta property="og:description" content=".*?" id="og-description">/,
            `<meta property="og:description" content="${metadata.description}" id="og-description">`
        )
        .replace(
            /<meta property="og:image" content=".*?" id="og-image">/,
            `<meta property="og:image" content="${absoluteImageUrl}" id="og-image">`
        )
        // Update Twitter Card tags
        .replace(
            /<meta name="twitter:url" content=".*?" id="twitter-url">/,
            `<meta name="twitter:url" content="${absolutePageUrl}" id="twitter-url">`
        )
        .replace(
            /<meta name="twitter:title" content=".*?" id="twitter-title">/,
            `<meta name="twitter:title" content="${fullTitle}" id="twitter-title">`
        )
        .replace(
            /<meta name="twitter:description" content=".*?" id="twitter-description">/,
            `<meta name="twitter:description" content="${metadata.description}" id="twitter-description">`
        )
        .replace(
            /<meta name="twitter:image" content=".*?" id="twitter-image">/,
            `<meta name="twitter:image" content="${absoluteImageUrl}" id="twitter-image">`
        );

    return new Response(html, {
        headers: {
            'content-type': 'text/html;charset=UTF-8',
            'cache-control': 'public, max-age=3600, s-maxage=3600'
        }
    });
}

export const config = {
    matcher: ['/blog-post', '/blog-post.html']
};
