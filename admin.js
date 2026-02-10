// Check authentication
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('gedp_logged_in') !== 'true') {
        window.location.href = 'admin-login.html';
    }
    loadArticles();
});

function handleLogout() {
    sessionStorage.removeItem('gedp_logged_in');
    window.location.href = 'admin-login.html';
}

// Data Management
const defaultArticles = [
    {
        id: '1',
        title: 'Minister launches GEDP Phase 2 Expansion',
        img: '/haruna4.jpg',
        cat: 'Announcement',
        excerpt: 'The Ministry of Education has officially launched the second phase...',
        date: 'February 9, 2026'
    },
    {
        id: '2',
        title: 'Masterclass: Maximizing Data Analytics for GES',
        img: '/paperless.jpg',
        cat: 'Training',
        excerpt: 'Our upcoming training session aims to equip administrators...',
        date: 'February 9, 2026'
    },
    {
        id: '3',
        title: 'Going Paperless: The Journey of 500 Schools',
        img: '/director3.jpg',
        cat: 'Innovation',
        excerpt: 'A deep dive into how 500 schools across Ghana successfully transitioned...',
        date: 'February 9, 2026'
    }
];

function getArticles() {
    const stored = localStorage.getItem('gedp_articles');
    let articles;
    if (!stored) {
        articles = defaultArticles;
        localStorage.setItem('gedp_articles', JSON.stringify(articles));
    } else {
        articles = JSON.parse(stored);
    }

    // Migration logic
    let migrationNeeded = false;
    articles.forEach(a => {
        if (a.img === '/Haruna-Iddrisu.webp') {
            a.img = '/haruna4.jpg';
            migrationNeeded = true;
        }
    });

    if (migrationNeeded) {
        localStorage.setItem('gedp_articles', JSON.stringify(articles));
    }

    return articles;
}

function loadArticles() {
    const articles = getArticles();
    const tbody = document.getElementById('articleTableBody');
    const totalPostsEl = document.getElementById('totalPosts');

    totalPostsEl.textContent = articles.length;
    tbody.innerHTML = '';

    articles.forEach(art => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${art.img}" style="width: 50px; height: 35px; object-fit: cover; border-radius: 4px;"></td>
            <td style="font-weight: 600;">${art.title}</td>
            <td>${art.cat}</td>
            <td><span class="status-badge status-published">Published</span></td>
            <td class="action-btns">
                <span class="action-icon" onclick="alert('Editor coming soon!')">✎</span>
                <span class="action-icon delete" onclick="deleteArticle('${art.id}')">🗑</span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Modal Logic
function openModal() {
    document.getElementById('postModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('postModal').style.display = 'none';
    document.getElementById('articleForm').reset();
}

// Form Submission
document.getElementById('articleForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const articles = getArticles();
    const newArticle = {
        id: Date.now().toString(),
        title: document.getElementById('postTitle').value,
        cat: document.getElementById('postCategory').value,
        img: '/' + document.getElementById('postImage').value.replace(/^\//, ''),
        excerpt: document.getElementById('postExcerpt').value,
        body: document.getElementById('postBody').value,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    articles.unshift(newArticle);
    localStorage.setItem('gedp_articles', JSON.stringify(articles));

    loadArticles();
    closeModal();
});

function deleteArticle(id) {
    if (confirm('Are you sure you want to delete this article?')) {
        let articles = getArticles();
        articles = articles.filter(a => a.id !== id);
        localStorage.setItem('gedp_articles', JSON.stringify(articles));
        loadArticles();
    }
}

// View Switching
function switchView(view) {
    const articlesView = document.getElementById('articlesView');
    const galleryView = document.getElementById('galleryView');
    const navArticles = document.getElementById('nav-articles');
    const navGallery = document.getElementById('nav-gallery');

    if (view === 'articles') {
        articlesView.style.display = 'block';
        galleryView.style.display = 'none';
        navArticles.classList.add('active');
        navGallery.classList.remove('active');
        loadArticles();
    } else {
        articlesView.style.display = 'none';
        galleryView.style.display = 'grid';
        navArticles.classList.remove('active');
        navGallery.classList.add('active');
        loadGallery();
    }
}

// Gallery Logic
const siteImages = [
    '/haruna4.jpg',
    '/haruna2.jpg',
    '/haruna3.jpg',
    '/paperless.jpg',
    '/director3.jpg',
    '/GEDP.png',
    '/hero_modules_bg.png',
    '/GEDP-fav.png'
];

function loadGallery() {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';

    siteImages.forEach(imgSrc => {
        const div = document.createElement('div');
        div.style.cssText = 'background: #f1f5f9; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; position: relative; group;';
        div.innerHTML = `
            <img src="${imgSrc}" style="width: 100%; height: 120px; object-fit: cover; display: block;">
            <div style="padding: 0.8rem; font-size: 0.75rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; background: white;">
                ${imgSrc.split('/').pop()}
            </div>
        `;
        grid.appendChild(div);
    });
}
