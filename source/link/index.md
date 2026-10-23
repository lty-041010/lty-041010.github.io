---
title: 友链
date: 2026-10-19 22:04:07
type: "link"
comments: true
---

{% raw %}
<!-- ================= 1. 样式区域 ================= -->
<style>
/* 搜索框样式 */
.link-search-box {
    display: flex;
    justify-content: center;
    margin: 20px auto 30px auto;
    max-width: 500px;
}
.link-search-box input {
    width: 100%;
    padding: 12px 20px;
    border-radius: 25px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    font-size: 15px;
    color: #333;
    outline: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}
.link-search-box input:focus {
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
    border-color: #49B1F5;
}
[data-theme="dark"] .link-search-box input {
    background: rgba(30, 30, 30, 0.6);
    border-color: rgba(255, 255, 255, 0.1);
    color: #fff;
}
[data-theme="dark"] .link-search-box input:focus {
    background: rgba(30, 30, 30, 0.9);
}

/* Toast 提示框样式 */
#custom-toast {
    visibility: hidden;
    min-width: 250px;
    background-color: #49B1F5;
    color: #fff;
    text-align: center;
    border-radius: 8px;
    padding: 16px;
    position: fixed;
    z-index: 10000;
    left: 50%;
    bottom: 30px;
    transform: translateX(-50%);
    font-size: 15px;
    font-weight: bold;
    opacity: 0;
    transition: opacity 0.3s, bottom 0.3s;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}
#custom-toast.show {
    visibility: visible;
    opacity: 1;
    bottom: 50px;
}
</style>

<!-- ================= 2. 脚本区域 ================= -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // ---- A. 搜索框逻辑 ----
    setTimeout(function() {
        const flinkContainer = document.querySelector('.flink');
        // 🚨 核心防重复：如果页面上已经存在搜索框，直接退出，防止重复生成
        if (!flinkContainer || document.getElementById('link-search-input')) return;

        // 创建搜索框并插入到 .flink 容器内部的最前面
        const searchBox = document.createElement('div');
        searchBox.className = 'link-search-box';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'link-search-input';
        searchInput.placeholder = '🔍 搜索博友名称或描述...';
        
        searchBox.appendChild(searchInput);
        flinkContainer.insertBefore(searchBox, flinkContainer.firstChild);

        // 实时搜索过滤逻辑
        searchInput.addEventListener('input', function(e) {
            const keyword = e.target.value.toLowerCase().trim();
            const items = flinkContainer.querySelectorAll('.flink-list-item');
            const h2s = flinkContainer.querySelectorAll('h2');
            const descs = flinkContainer.querySelectorAll('.flink-desc');

            if (keyword === '') {
                items.forEach(item => item.style.display = '');
                h2s.forEach(h2 => h2.style.display = '');
                descs.forEach(desc => desc.style.display = '');
                return;
            }

            h2s.forEach(h2 => h2.style.display = 'none');
            descs.forEach(desc => desc.style.display = 'none');

            items.forEach(item => {
                const name = item.querySelector('.flink-item-name') ? item.querySelector('.flink-item-name').innerText.toLowerCase() : '';
                const descr = item.querySelector('.flink-item-desc') ? item.querySelector('.flink-item-desc').innerText.toLowerCase() : '';
                
                if (name.includes(keyword) || descr.includes(keyword)) {
                    item.style.display = ''; 
                } else {
                    item.style.display = 'none'; 
                }
            });

            h2s.forEach(h2 => {
                let nextNode = h2.nextElementSibling;
                let hasVisible = false;
                
                while (nextNode && nextNode.tagName !== 'H2') {
                    if (nextNode.classList.contains('flink-list')) {
                        const listItems = nextNode.querySelectorAll('.flink-list-item');
                        listItems.forEach(item => {
                            if (item.style.display !== 'none') {
                                hasVisible = true;
                            }
                        });
                    }
                    nextNode = nextNode.nextElementSibling;
                }

                if (hasVisible) {
                    h2.style.display = '';
                    if (h2.nextElementSibling && h2.nextElementSibling.classList.contains('flink-desc')) {
                        h2.nextElementSibling.style.display = '';
                    }
                }
            });
        });
    }, 500);
});

// ---- B. 友链申请表单逻辑 ----
function showToast(message) {
  var toast = document.getElementById("custom-toast");
  toast.innerText = message;
  toast.className = "show";
  setTimeout(function(){ 
    toast.className = toast.className.replace("show", ""); 
  }, 3000);
}

function generateFriendLink() {
  var name = document.getElementById('fl-name').value.trim();
  var link = document.getElementById('fl-link').value.trim();
  var avatar = document.getElementById('fl-avatar').value.trim();
  var descr = document.getElementById('fl-descr').value.trim();

  if (!name || !link || !avatar) {
    showToast("❌ 请至少填写：网站名称、网站链接、头像直链！");
    return;
  }

  var text = "✨ 【友链申请】\n" +
             "🏷️ 网站名称：" + name + "\n" +
             "🔗 网站链接：" + link + "\n" +
             "🖼️ 头像直链：" + avatar + "\n" +
             "📝 网站描述：" + (descr ? descr : "这个人很懒，什么都没写") + "\n\n" +
             "👇 以下为 YAML 配置，请博主复制到 link.yml 👇\n" +
             "- name: " + name + "\n" +
             "  link: " + link + "\n" +
             "  avatar: " + avatar + "\n" +
             "  descr: " + (descr ? descr : "这个人很懒，什么都没写");

  navigator.clipboard.writeText(text).then(function() {
    showToast("✅ 申请格式已复制！请去下方评论区粘贴发布");
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }).catch(function(err) {
    alert("复制失败，请手动复制以下内容：\n\n" + text);
  });
}
</script>

<!-- ================= 3. 页面正文内容 ================= -->
## 🤝 交换友链

欢迎交换友链！请确保你的网站内容合法合规，且能够正常访问。如果你希望出现在上面的“博友们”区域，请在下方填写你的信息生成格式，然后去评论区粘贴提交。

<!-- 表单 UI 容器 -->
<div id="friend-link-form">
  <h3>📝 填写友链申请</h3>
  
  <div class="form-group">
    <input type="text" id="fl-name" placeholder="网站名称 (必填)">
  </div>
  
  <div class="form-group">
    <input type="url" id="fl-link" placeholder="网站链接 https://... (必填)">
  </div>
  
  <div class="form-group">
    <input type="url" id="fl-avatar" placeholder="头像图片直链 https://... (必填)">
  </div>
  
  <div class="form-group">
    <input type="text" id="fl-descr" placeholder="一句话描述 (选填)">
  </div>
  
  <button onclick="generateFriendLink()" id="submit-btn">
    🚀 生成并复制申请信息
  </button>
</div>

<!-- 轻提示 (Toast) 容器 -->
<div id="custom-toast"></div>

{% endraw %}