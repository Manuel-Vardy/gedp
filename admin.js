// Check authentication
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('gedp_logged_in') !== 'true') {
        window.location.href = 'admin-login.html';
    }

    initCategories();
    initImageUploader();
    loadArticles();
});

function handleLogout() {
    sessionStorage.removeItem('gedp_logged_in');
    window.location.href = 'admin-login.html';
}

// Data Management
const defaultArticles = [
    {
        id: 'new-1',
        title: 'GES Promotion Examination Centres 2025 – Check Here!',
        img: '/New%20Images/bece.jpg',
        cat: 'Announcement',
        excerpt: 'The GES has officially released the Promotion Examination Centres. Check your region and centre details here.',
        date: 'February 17, 2026',
        readTime: '5 min read',
        link: 'blog-post.html?id=new-1&v=12',
        featured: true
    },
    {
        id: 'new-2',
        title: 'Director General for GES, Prof. E.K.Davies Announces Bold Reforms to Boost Credibility of 2025 BECE School Selection',
        img: '/director3.jpg',
        cat: 'News',
        excerpt: 'Prof. E.K.Davies introduces targeted reforms to strengthen transparency and accountability in the 2025 BECE school selection process.',
        date: 'February 17, 2026',
        readTime: '6 min read',
        link: 'blog-post.html?id=new-2&v=12',
        featured: true
    },
    {
        id: 'new-3',
        title: 'Why Professor Davis and the Minister of Education deserve national commendation',
        img: '/haruna4.jpg',
        cat: 'News',
        excerpt: 'Education stakeholders laud the success of the 2025 BECE and CSSPS as one of the most transparent in history.',
        date: 'February 17, 2026',
        readTime: '7 min read',
        link: 'blog-post.html?id=new-3&v=12',
        featured: true
    },
    {
        id: 'new-4',
        title: 'Engage with stakeholders to deliver robust digital education policy – Haruna to GES Council',
        img: '/haruna3.jpg',
        cat: 'News',
        excerpt: 'The GES Council has been tasked to develop Ghana’s first-ever comprehensive Digital Education Policy by early 2026.',
        date: 'February 17, 2026',
        readTime: '8 min read',
        link: 'blog-post.html?id=new-4&v=12',
        featured: true
    },
    {
        id: 'new-5',
        title: 'Government to commit ¢1bn to school infrastructure in 2026 – Education Minister',
        img: '/haruna2.jpg',
        cat: 'News',
        excerpt: 'The government will inject GH₵1 billion from the GETFund in 2026 to address infrastructure challenges and eliminate the double-track system.',
        date: 'February 17, 2026',
        readTime: '5 min read',
        link: 'blog-post.html?id=new-5&v=12',
        featured: true
    },
    {
        id: 'new-6',
        title: 'GES 2025 Posting for Staff Returning from Study Leave with Pay – Check Here!',
        img: '/male-shaking-hands.jpg',
        cat: 'News',
        excerpt: 'GES has announced the posting process for staff returning from study leave with pay. Applications are open until Nov 7, 2025.',
        date: 'February 17, 2026',
        readTime: '6 min read',
        link: 'blog-post.html?id=new-6&v=12',
        featured: true
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
                <span class="action-icon" onclick="editArticle('${art.id}')">✎</span>
                <span class="action-icon delete" onclick="deleteArticle('${art.id}')">🗑</span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function editArticle(id) {
    const articles = getArticles();
    const art = articles.find(a => a.id === id);
    if (!art) return;

    currentEditId = id;
    document.getElementById('modalTitle').textContent = 'Edit Article';
    document.querySelector('.admin-btn-primary').textContent = 'Update Article';

    document.getElementById('postTitle').value = art.title;
    document.getElementById('postExcerpt').value = art.excerpt || '';
    document.getElementById('postBody').value = art.body || '';
    document.getElementById('postImage').value = art.img;

    renderCategories(art.cat);

    // Image preview
    const preview = document.getElementById('imagePreview');
    const hint = document.getElementById('imageHint');
    if (art.img) {
        preview.src = art.img;
        preview.style.display = 'block';
        hint.style.display = 'none';
        document.getElementById('imageFilename').textContent = art.img.split('/').pop();
    }

    document.getElementById('postModal').style.display = 'flex';
}

// Modal Logic
function openModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Create New Article';
    document.querySelector('.admin-btn-primary').textContent = 'Save Article';
    renderCategories();
    document.getElementById('postModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('postModal').style.display = 'none';
    document.getElementById('articleForm').reset();
    currentEditId = null;

    const preview = document.getElementById('imagePreview');
    const hint = document.getElementById('imageHint');
    const filename = document.getElementById('imageFilename');
    const hiddenImg = document.getElementById('postImage');
    const fileInput = document.getElementById('postImageFile');
    const dropzone = document.getElementById('imageDropzone');

    if (preview) {
        preview.src = '';
        preview.style.display = 'none';
    }
    if (hint) hint.style.display = '';
    if (filename) filename.textContent = '';
    if (hiddenImg) hiddenImg.value = '';
    if (fileInput) fileInput.value = '';
    if (dropzone) dropzone.classList.remove('dragover');
}

function getCategories() {
    const stored = localStorage.getItem('gedp_categories');
    if (!stored) return ['Announcement', 'Training', 'Innovation'];
    try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) return parsed;
        return ['Announcement', 'Training', 'Innovation'];
    } catch {
        return ['Announcement', 'Training', 'Innovation'];
    }
}

function setCategories(categories) {
    localStorage.setItem('gedp_categories', JSON.stringify(categories));
}

function renderCategories(selectedValue) {
    const select = document.getElementById('postCategory');
    if (!select) return;

    const categories = getCategories();
    select.innerHTML = '';
    categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
    });

    if (selectedValue && categories.includes(selectedValue)) {
        select.value = selectedValue;
    }
}

function initCategories() {
    renderCategories();

    const addBtn = document.getElementById('addCategoryBtn');
    const input = document.getElementById('newCategory');
    if (!addBtn || !input) return;

    const add = () => {
        const raw = input.value || '';
        const value = raw.trim();
        if (!value) return;

        const categories = getCategories();
        const exists = categories.some(c => c.toLowerCase() === value.toLowerCase());
        if (!exists) {
            categories.push(value);
            setCategories(categories);
        }

        renderCategories(value);
        input.value = '';
    };

    addBtn.addEventListener('click', add);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            add();
        }
    });
}

function initImageUploader() {
    const dropzone = document.getElementById('imageDropzone');
    const fileInput = document.getElementById('postImageFile');
    const hiddenImg = document.getElementById('postImage');
    const preview = document.getElementById('imagePreview');
    const hint = document.getElementById('imageHint');
    const filename = document.getElementById('imageFilename');

    if (!dropzone || !fileInput || !hiddenImg || !preview || !hint || !filename) return;

    const setFile = (file) => {
        if (!file || !file.type || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = typeof reader.result === 'string' ? reader.result : '';
            if (!dataUrl) return;

            hiddenImg.value = dataUrl;
            preview.src = dataUrl;
            preview.style.display = 'block';
            hint.style.display = 'none';
            filename.textContent = file.name;
        };
        reader.readAsDataURL(file);
    };

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files && fileInput.files[0];
        if (file) setFile(file);
    });

    dropzone.addEventListener('dragenter', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (!file) return;
        setFile(file);
    });
}

// Form Submission
document.getElementById('articleForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const articles = getArticles();
    const title = document.getElementById('postTitle').value;
    const cat = document.getElementById('postCategory').value;
    const img = document.getElementById('postImage').value;
    const excerpt = document.getElementById('postExcerpt').value;
    const body = document.getElementById('postBody').value;

    if (currentEditId) {
        // Update existing
        const index = articles.findIndex(a => a.id === currentEditId);
        if (index !== -1) {
            articles[index] = {
                ...articles[index],
                title,
                cat,
                img,
                excerpt,
                body
            };
        }
    } else {
        // Create new
        const newArticle = {
            id: Date.now().toString(),
            title,
            cat,
            img,
            excerpt,
            body,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        };
        articles.unshift(newArticle);
    }

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
