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

    // ================= 2. 根据设备分配图池 (已剔除失效接口) =================
    var apiPool;
    if (deviceType === 'mobile') {
        apiPool = [
            "https://t.alcy.cc/mp", // 稳定移动端图源
            "https://api.btstu.cn/sjbz/api.php?lx=mobile&format=images",
            "https://api.dearxuan.com/image?type=mobile"
        ];
    } else if (deviceType === 'tablet') {
        apiPool = [
            "https://t.alcy.cc/pc",
            "https://api.btstu.cn/sjbz/api.php?lx=dongman&format=images"
        ];
    } else {
        apiPool = [
            "https://t.alcy.cc/pc", // 极其稳定的二次元图源
            "https://api.btstu.cn/sjbz/api.php?lx=dongman&format=images", // 必应/动漫图源
            "https://uapis.cn/api/v1/random/image?category=landscape"
        ];
    }

    // 兜底图（建议换成你自己服务器上的图片，比如 /img/default-bg.jpg）
    var fallbackImg = "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1920&auto=format&fit=crop";

    // ================= 3. 并发加载背景图 (加速显示，避免死等) =================
    function loadBackground(apiList) {
        // 如果图池为空，直接使用兜底图
        if (!apiList || apiList.length === 0) {
            document.documentElement.style.setProperty('--bg-img', "url('" + fallbackImg + "')");
            document.body.classList.add('bg-random-image');
            return;
        }

        let isLoaded = false; // 防止多次赋值

        // 遍历所有 API 并发请求
        apiList.forEach(function(currentApi) {
            var finalUrl = currentApi + (currentApi.includes("?") ? "&" : "?") + "t=" + Date.now();
            var imgTester = new Image();
            imgTester.src = finalUrl;

            imgTester.onload = function() {
                if (isLoaded) return; // 如果已经有图加载成功了，就不管后面的了
                isLoaded = true;
                document.documentElement.style.setProperty('--bg-img', "url('" + finalUrl + "')");
                document.body.classList.add('bg-random-image');
            };

            imgTester.onerror = function() {
                // 单个接口失败不输出警告，保持控制台整洁
            };
        });

        // 如果 5 秒钟所有接口都还没响应，直接上兜底图
        setTimeout(function() {
            if (!isLoaded) {
                isLoaded = true;
                document.documentElement.style.setProperty('--bg-img', "url('" + fallbackImg + "')");
                document.body.classList.add('bg-random-image');
            }
        }, 5000);
    }

    loadBackground(apiPool);
    document.body.classList.add('ui-glass');

    // ================= 4. 文章封面多端适配 =================
    var covers = document.querySelectorAll(".post-bg");
    covers.forEach(function (cover) {
        // 封面也使用图池里的第一个稳定接口
        var coverApi = deviceType === 'mobile' ? apiPool[0] : "https://t.alcy.cc/pc";
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