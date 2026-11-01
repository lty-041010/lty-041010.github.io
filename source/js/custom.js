document.addEventListener('DOMContentLoaded', function() {
    // ================= 0. 究极防转圈 + 友链文字头像兜底 =================
    function setTextAvatar(imgElement) {
        if (!imgElement || imgElement.dataset.isHandled) return;
        imgElement.dataset.isHandled = 'true';

        let name = '友';
        const container = imgElement.closest('.flink-list-item');
        if (container) {
            const nameEl = container.querySelector('.flink-item-name');
            if (nameEl && nameEl.innerText) name = nameEl.innerText.trim();
        }

        const firstChar = name.charAt(0).toUpperCase();
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB', '#F39C12', '#1ABC9C'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        const bgColor = colors[Math.abs(hash) % colors.length];

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="${bgColor}"/><text x="50%" y="50%" dy=".35em" fill="#ffffff" font-size="45" font-family="sans-serif" font-weight="bold" text-anchor="middle">${firstChar}</text></svg>`;
        
        imgElement.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        imgElement.style.objectFit = 'cover';
        imgElement.style.display = 'block';
    }

    // ★ 极速斩首行动：第一时间把坏链接从 DOM 里删掉，绝不发请求
    function instantFixBadImages() {
        const blackList = ['rainyunrgs.cn', 'shangdi.avif', 'yorutubasa.top'];
        const imgs = document.querySelectorAll('.flink-list-item img');
        
        imgs.forEach(img => {
            const attrs = ['src', 'data-src', 'data-original', 'data-lazy-src'];
            let isBad = false;
            
            attrs.forEach(attr => {
                const val = img.getAttribute(attr);
                if (val && blackList.some(bad => val.includes(bad))) {
                    isBad = true;
                    img.removeAttribute(attr); 
                }
            });

            if (isBad) {
                setTextAvatar(img);
                img.dataset.checked = 'true'; 
            }
        });
    }
    instantFixBadImages();

    // 正常图片的网络超时检测
    function processImages() {
        const imgs = document.querySelectorAll('.flink-list-item img');
        imgs.forEach(img => {
            if (img.dataset.checked) return; 
            img.dataset.checked = 'true';

            const realSrc = img.getAttribute('data-src') || img.getAttribute('src');
            if (!realSrc || realSrc.includes('data:image')) return;

            const tester = new Image();
            tester.referrerPolicy = 'no-referrer';
            
            const timer = setTimeout(() => {
                tester.src = ''; 
                setTextAvatar(img);
            }, 1500);

            tester.onload = function() {
                clearTimeout(timer);
                // ★ 修复 Bug：如果超时后已经被换成文字头像了，就不要用慢图去覆盖它
                if (!img.dataset.isHandled) {
                    img.src = realSrc; 
                }
            };
            tester.onerror = function() {
                clearTimeout(timer);
                tester.src = ''; 
                setTextAvatar(img);
            };
            tester.src = realSrc;
        });
    }
    setTimeout(processImages, 500);

    // ================= 1. 设备判定 =================
    function getDeviceType() {
        var ua = navigator.userAgent.toLowerCase();
        var shortSide = Math.min(window.screen.width, window.screen.height);
        var isTouch = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
        if (ua.indexOf('macintosh') > -1 && isTouch && shortSide > 800) return 'tablet';
        if (/android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
            if (ua.indexOf('android') > -1 && shortSide > 600) return 'tablet';
            return 'mobile';
        }
        if (/ipad|tablet|playbook|silk/i.test(ua)) return 'tablet';
        if (window.innerWidth <= 768) return 'mobile';
        return 'desktop';
    }
    var deviceType = getDeviceType();

    // ================= 2. 极度稳定的图池 =================
    var apiPool;
    if (deviceType === 'mobile') {
        apiPool = ["https://t.alcy.cc/mp", "https://api.dearxuan.com/image?type=mobile"];
    } else {
        apiPool = ["https://t.alcy.cc/pc", "https://uapis.cn/api/v1/random/image?category=landscape"];
    }

    var fallbackImg = "https://uapis.cn/api/v1/random/image?category=landscape";

    // ================= 3. 并发加载背景图 =================
    function loadBackground(apiList) {
        let isLoaded = false; 
        apiList.forEach(function(currentApi) {
            var finalUrl = currentApi + (currentApi.includes("?") ? "&" : "?") + "t=" + Date.now();
            var imgTester = new Image();
            imgTester.src = finalUrl;
            imgTester.onload = function() {
                if (isLoaded) return; 
                isLoaded = true;
                document.documentElement.style.setProperty('--bg-img', "url('" + finalUrl + "')");
                document.body.classList.add('bg-random-image');
            };
        });
        setTimeout(function() {
            if (!isLoaded) {
                isLoaded = true;
                document.documentElement.style.setProperty('--bg-img', "url('" + fallbackImg + "')");
                document.body.classList.add('bg-random-image');
            }
        }, 2000); 
    }
    loadBackground(apiPool);
    document.body.classList.add('ui-glass');

    // ================= 4. 文章封面 =================
    document.querySelectorAll(".post-bg").forEach(function (cover) {
        var coverApi = deviceType === 'mobile' ? apiPool[0] : "https://t.alcy.cc/pc";
        var coverUrl = coverApi + (coverApi.includes("?") ? "&" : "?") + "t=" + Date.now() + Math.floor(Math.random() * 100);
        cover.style.backgroundImage = "url('" + coverUrl + "')";
    });

    // ================= 5. 平滑滚动 =================
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        document.querySelectorAll('a[href*="#recent-posts"]').forEach(function(link) {
            link.addEventListener('click', function(e) {
                var target = document.getElementById('recent-posts');
                if (target) { e.preventDefault(); window.scrollTo({ top: target.offsetTop, behavior: 'smooth' }); }
            });
        });
    }

    // ================= 6. 悬浮预览窗 =================
    setTimeout(function() {
        const targetItems = document.querySelectorAll('.flink-list-item, .nav-card');
        if(targetItems.length === 0) return;

        const popover = document.createElement('div');
        popover.id = 'global-flink-popover';
        const avatarImgEl = document.createElement('img'); avatarImgEl.className = 'preview-avatar';
        const avatarEmojiEl = document.createElement('div'); avatarEmojiEl.className = 'preview-avatar-emoji';
        const nameEl = document.createElement('div'); nameEl.className = 'preview-name';
        const descrEl = document.createElement('div'); descrEl.className = 'preview-descr';

        popover.appendChild(avatarImgEl); popover.appendChild(avatarEmojiEl); popover.appendChild(nameEl); popover.appendChild(descrEl);
        document.body.appendChild(popover);

        targetItems.forEach(item => {
            let name = '', descr = '', avatarSrc = '', isEmoji = false;
            if (item.classList.contains('flink-list-item')) {
                const img = item.querySelector('img');
                const itemNameEl = item.querySelector('.flink-item-name');
                const itemDescrEl = item.querySelector('.flink-item-desc');
                name = itemNameEl ? itemNameEl.innerText.trim() : '神秘站点';
                descr = itemDescrEl ? itemDescrEl.innerText.trim() : '这个人很懒，什么都没留下';
                if (img && img.src && !img.src.includes('data:image')) { avatarSrc = img.src; } 
                else { avatarSrc = 'https://api.dicebear.com/7.x/notionists/svg?seed=' + encodeURIComponent(name) + '&backgroundColor=b6e3f4,c0aede,d1d4f9'; }
            } else if (item.classList.contains('nav-card')) {
                const itemNameEl = item.querySelector('.nav-title');
                const itemDescrEl = item.querySelector('.nav-desc');
                const iconEl = item.querySelector('.nav-icon');
                name = itemNameEl ? itemNameEl.innerText.trim() : '常用网站';
                descr = itemDescrEl ? itemDescrEl.innerText.trim() : '暂无描述';
                avatarSrc = iconEl ? iconEl.innerText.trim() : '🔗';
                isEmoji = true;
            }

            item.addEventListener('mouseenter', function() {
                nameEl.innerText = name; descrEl.innerText = descr;
                if (isEmoji) { avatarImgEl.style.display = 'none'; avatarEmojiEl.innerText = avatarSrc; avatarEmojiEl.style.display = 'flex'; } 
                else { avatarEmojiEl.style.display = 'none'; avatarImgEl.src = avatarSrc; avatarImgEl.style.display = 'block'; }
                popover.style.opacity = '1'; popover.style.visibility = 'visible'; popover.style.transform = 'translateY(0) scale(1)';
            });

            item.addEventListener('mousemove', function(e) {
                let x = e.clientX + 20, y = e.clientY + 20;
                if (x + 260 > window.innerWidth) x = e.clientX - 260 - 20;
                if (y + 180 > window.innerHeight) y = e.clientY - 180 - 20;
                popover.style.left = x + 'px'; popover.style.top = y + 'px';
            });

            item.addEventListener('mouseleave', function() {
                popover.style.opacity = '0'; popover.style.visibility = 'hidden'; popover.style.transform = 'translateY(10px) scale(0.95)';
            });
        });
    }, 500);
});