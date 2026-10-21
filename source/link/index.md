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

<script>
function generateFriendLink() {
  var name = document.getElementById('fl-name').value.trim();
  var link = document.getElementById('fl-link').value.trim();
  var avatar = document.getElementById('fl-avatar').value.trim();
  var descr = document.getElementById('fl-descr').value.trim();

  if (!name || !link || !avatar) {
    alert("请至少填写：网站名称、网站链接、头像直链！");
    return;
  }

  // 按照 YAML 格式拼接文本
  var text = "- name: " + name + "\n" +
             "  link: " + link + "\n" +
             "  avatar: " + avatar + "\n" +
             "  descr: " + (descr ? descr : "这个人很懒，什么都没写");

  // 复制到剪贴板
  navigator.clipboard.writeText(text).then(function() {
    alert("✅ 申请格式已复制！\n\n请去下方的评论区直接粘贴 (Ctrl+V) 发布即可。");
    
    // 自动平滑滚动到页面底部的评论区
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }).catch(function(err) {
    alert("复制失败，请手动复制以下内容：\n\n" + text);
  });
}
</script>