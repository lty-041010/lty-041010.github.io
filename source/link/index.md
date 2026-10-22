---
title: 友链
date: 2026-10-19 22:04:07
type: "link"
comments: true
---

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

<style>
/* Toast 提示框样式 */
#custom-toast {
    visibility: hidden;
    min-width: 250px;
    background-color: #49B1F5; /* 主题蓝 */
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

<script>
// 显示 Toast 的函数
function showToast(message) {
  var toast = document.getElementById("custom-toast");
  toast.innerText = message;
  toast.className = "show";
  
  // 3秒后自动隐藏
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

  // 拼接成人类友好的文本 + YAML 源码
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
             

  // 复制到剪贴板
  navigator.clipboard.writeText(text).then(function() {
    // 复制成功，显示小提示
    showToast("✅ 申请格式已复制！请去下方评论区粘贴发布");
    
    // 自动平滑滚动到页面底部的评论区
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }).catch(function(err) {
    // 只有在复制失败这种极端情况下，才使用 alert 让用户手动复制
    alert("复制失败，请手动复制以下内容：\n\n" + text);
  });
}
</script>

