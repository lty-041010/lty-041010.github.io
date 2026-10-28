document.addEventListener('DOMContentLoaded', function() {
    // ================= 1. 精准设备判定逻辑 =================
    function getDeviceType() {
        var ua = navigator.userAgent.toLowerCase();
        var shortSide = Math.min(window.screen.width, window.screen.height);
        var isTouch = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;

        if (ua.indexOf('macintosh') > -1 && isTouch && shortSide > 800) {
            return 'tablet';
        }
        if (/android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
            if (ua.indexOf('android') > -1 && shortSide > 600) {
                return 'tablet';
            }
            return 'mobile';
        }
        if (/ipad|tablet|playbook|silk/i.test(ua)) {
            return 'tablet';
        }
        if (window.innerWidth <= 768) {
            return 'mobile';
        }
        return 'desktop';
    }

    var deviceType = getDeviceType();
    console.log("当前设备判定为: " + deviceType);

    // ================= 2. 根据设备分配图池 =================
    var apiPool;
    if (deviceType === 'mobile') {
        apiPool = [
            "https://api.yppp.net/pe.php",
            "https://api.dearxuan.com/image?type=mobile",
            "https://api.dujin.org/bing/1080.php"
        ];
    } else if (deviceType === 'tablet') {
        apiPool = [
            "https://api.dujin.org/bing/1920.php",
            "https://t.alcy.cc/pc"
        ];
    } else {
        apiPool = [
            "https://uapis.cn/api/v1/random/image?category=landscape",
            "https://api.dujin.org/bing/1920.php",
            "https://t.alcy.cc/pc"
        ];
    }

    var fallbackImg = "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1920&auto=format&fit=crop";

    // ================= 3. 自动重试加载背景 =================
    apiPool.sort(() => Math.random() - 0.5);

    function loadBackground(apiList, index) {
        if (index >= apiList.length) {
            document.documentElement.style.setProperty('--bg-img', "url('" + fallbackImg + "')");
            document.body.classList.add('bg-random-image');
            console.warn('所有 API 均失效，已启用兜底图');
            return;
        }

        var currentApi = apiList[index];
        var finalUrl = currentApi.includes("bing") ? currentApi : currentApi + (currentApi.includes("?") ? "&" : "?") + "t=" + Date.now();

        var imgTester = new Image();
        imgTester.src = finalUrl;

        imgTester.onload = function() {
            document.documentElement.style.setProperty('--bg-img', "url('" + finalUrl + "')");
            document.body.classList.add('bg-random-image');
        };

        imgTester.onerror = function() {
            console.warn('接口 ' + currentApi + ' 加载失败，尝试下一个...');
            loadBackground(apiList, index + 1);
        };
    }

    loadBackground(apiPool, 0);
    document.body.classList.add('ui-glass');

    // ================= 4. 文章封面多端适配 =================
    var covers = document.querySelectorAll(".post-bg");
    covers.forEach(function (cover) {
        var coverApi = deviceType === 'mobile' ? "https://api.dearxuan.com/image?type=mobile" : apiPool[0];
        var coverUrl = coverApi + (coverApi.includes("?") ? "&" : "?") + "t=" + Date.now() + Math.floor(Math.random() * 100);
        cover.style.backgroundImage = "url('" + coverUrl + "')";
    });

    // ================= 5. 菜单「最新文章」平滑滚动到文章区 =================
    // 只在首页生效，其他页面保持正常跳转
    var isHome = (window.location.pathname === '/' || window.location.pathname === '/index.html');
    if (isHome) {
        document.querySelectorAll('a[href*="#recent-posts"]').forEach(function(link) {
            link.addEventListener('click', function(e) {
                var target = document.getElementById('recent-posts');
                if (target) {
                    e.preventDefault();
                    window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
                }
            });
        });
    }

    // ================= 6. 全局悬浮预览窗 =================
    setTimeout(function() {
        const targetItems = document.querySelectorAll('.flink-list-item, .nav-card');
        if(targetItems.length === 0) return;

        const popover = document.createElement('div');
        popover.id = 'global-flink-popover';

        const avatarImgEl = document.createElement('img');
        avatarImgEl.className = 'preview-avatar';

        const avatarEmojiEl = document.createElement('div');
        avatarEmojiEl.className = 'preview-avatar-emoji';

        const nameEl = document.createElement('div');
        nameEl.className = 'preview-name';

        const descrEl = document.createElement('div');
        descrEl.className = 'preview-descr';

        popover.appendChild(avatarImgEl);
        popover.appendChild(avatarEmojiEl);
        popover.appendChild(nameEl);
        popover.appendChild(descrEl);
        document.body.appendChild(popover);

        targetItems.forEach(item => {
            let name = '';
            let descr = '';
            let avatarSrc = '';
            let isEmoji = false;

            if (item.classList.contains('flink-list-item')) {
                const img = item.querySelector('img');
                const itemNameEl = item.querySelector('.flink-item-name');
                const itemDescrEl = item.querySelector('.flink-item-desc');

                name = itemNameEl ? itemNameEl.innerText.trim() : '神秘站点';
                descr = itemDescrEl ? itemDescrEl.innerText.trim() : '这个人很懒，什么都没留下';

                if (img && img.src && !img.src.includes('data:image')) {
                    avatarSrc = img.src;
                } else {
                    avatarSrc = 'https://api.dicebear.com/7.x/notionists/svg?seed=' + encodeURIComponent(name) + '&backgroundColor=b6e3f4,c0aede,d1d4f9';
                }
                isEmoji = false;
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
                nameEl.innerText = name;
                descrEl.innerText = descr;

                if (isEmoji) {
                    avatarImgEl.style.display = 'none';
                    avatarEmojiEl.innerText = avatarSrc;
                    avatarEmojiEl.style.display = 'flex';
                } else {
                    avatarEmojiEl.style.display = 'none';
                    avatarImgEl.src = avatarSrc;
                    avatarImgEl.style.display = 'block';
                }

                popover.style.opacity = '1';
                popover.style.visibility = 'visible';
                popover.style.transform = 'translateY(0) scale(1)';
            });

            item.addEventListener('mousemove', function(e) {
                let x = e.clientX + 20;
                let y = e.clientY + 20;
                const popoverWidth = 260;
                const popoverHeight = 180;

                if (x + popoverWidth > window.innerWidth) x = e.clientX - popoverWidth - 20;
                if (y + popoverHeight > window.innerHeight) y = e.clientY - popoverHeight - 20;

                popover.style.left = x + 'px';
                popover.style.top = y + 'px';
            });

            item.addEventListener('mouseleave', function() {
                popover.style.opacity = '0';
                popover.style.visibility = 'hidden';
                popover.style.transform = 'translateY(10px) scale(0.95)';
            });
        });
    }, 500);
});