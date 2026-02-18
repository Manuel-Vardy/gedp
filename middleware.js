import { next } from '@vercel/edge';

// Article metadata — image paths must NOT have spaces (use %20)
const articleMetadata = {
    'new-1': {
        title: 'GES Promotion Examination Centres 2025 – Check Here!',
        description: 'The GES has officially released the Promotion Examination Centres. Check your region and centre details here.',
        image: '/New%20Images/bece.jpg'
    },
    'new-2': {
        title: 'Director General for GES, Prof. E.K.Davies Announces Bold Reforms to Boost Credibility of 2025 BECE School Selection',
        description: 'Prof. E.K.Davies introduces targeted reforms to strengthen transparency and accountability in the 2025 BECE school selection process.',
        image: '/director3.jpg'
    },
    'new-3': {
        title: 'Why Professor Davis and the Minister of Education deserve national commendation',
        description: 'Education stakeholders laud the success of the 2025 BECE and CSSPS as one of the most transparent in history.',
        image: '/haruna4.jpg'
    },
    'new-4': {
        title: 'Engage with stakeholders to deliver robust digital education policy – Haruna to GES Council',
        description: "The GES Council has been tasked to develop Ghana's first-ever comprehensive Digital Education Policy by early 2026.",
        image: '/haruna3.jpg'
    },
    'new-5': {
        title: 'Government to commit ¢1bn to school infrastructure in 2026 – Education Minister',
        description: 'The government will inject GH₵1 billion from the GETFund in 2026 to address infrastructure challenges and eliminate the double-track system.',
        image: '/haruna2.jpg'
    },
    'new-6': {
        title: 'GES 2025 Posting for Staff Returning from Study Leave with Pay – Check Here!',
        description: 'GES has announced the posting process for staff returning from study leave with pay. Applications are open until Nov 7, 2025.',
        image: '/male-shaking-hands.jpg'
    }
};

function isSocialCrawler(userAgent) {
    if (!userAgent) return false;
    const ua = userAgent.toLowerCase();
    return (
        ua.includes('whatsapp') ||
        ua.includes('facebookexternalhit') ||
        ua.includes('facebot') ||
        ua.includes('twitterbot') ||
        ua.includes('linkedinbot') ||
        ua.includes('slackbot') ||
        ua.includes('telegrambot') ||
        ua.includes('discordbot') ||
        ua.includes('skypeuripreview') ||
        ua.includes('pinterest') ||
        ua.includes('redditbot') ||
        ua.includes('iframely') ||
        ua.includes('embedly') ||
        ua.includes('vkshare')
    );
}

function escapeAttr(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

export default async function middleware(request) {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;
    const userAgent = request.headers.get('user-agent') || '';

    // Only intercept blog-post routes for social crawlers
    const isBlogPost = pathname === '/blog-post' ||
        pathname === '/blog-post.html' ||
        pathname.startsWith('/blog-post');

    if (!isBlogPost || !isSocialCrawler(userAgent)) {
        // Pass through to the actual page for regular browsers
        return next();
    }

    // Resolve article metadata
    const id = searchParams.get('id');
    const titleParam = searchParams.get('title');
    const imgParam = searchParams.get('img');

    let meta;
    if (id && articleMetadata[id]) {
        meta = articleMetadata[id];
    } else {
        // Fallback: use URL params, encoding any spaces in the image path
        const rawImg = imgParam || '/director3.jpg';
        meta = {
            title: titleParam || 'Ghana Education Digital Platform News',
            description: 'Latest news and updates from the Ghana Education Digital Platform.',
            image: rawImg.replace(/ /g, '%20')
        };
    }

    const origin = url.origin;
    // Ensure image URL is absolute and properly encoded
    const imageUrl = meta.image.startsWith('http')
        ? meta.image
        : `${origin}${meta.image}`;
    const pageUrl = request.url;
    const fullTitle = escapeAttr(`${meta.title} | GEDP`);
    const desc = escapeAttr(meta.description);
    const safeImage = escapeAttr(imageUrl);
    const safePage = escapeAttr(pageUrl);

    // Return a minimal HTML page with correct OG tags for the crawler.
    // Regular users never see this — they get next() above.
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${fullTitle}</title>
  <meta name="description" content="${desc}">

  <!-- Open Graph (WhatsApp, Facebook, LinkedIn) -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Ghana Education Digital Platform">
  <meta property="og:url" content="${safePage}">
  <meta property="og:title" content="${fullTitle}">
  <meta property="og:description" content="${desc}">
  <meta property="og:image" content="${safeImage}">
  <meta property="og:image:secure_url" content="${safeImage}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${fullTitle}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${fullTitle}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${safeImage}">
</head>
<body>
  <p>Redirecting... <a href="${safePage}">Click here</a></p>
</body>
</html>`;

    return new Response(html, {
        status: 200,
        headers: {
            'content-type': 'text/html;charset=UTF-8',
            'cache-control': 'public, max-age=300, s-maxage=300'
        }
    });
}

export const config = {
    matcher: ['/blog-post', '/blog-post.html']
};
