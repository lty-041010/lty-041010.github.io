export const site = {
  /** 站点名（显示在导航左侧） */
  name: '龙天宇',
  /** 头像路径，指向 public 里的图片 */
  avatar: '/my-avatar.jpg', 
  /** 完整标题（浏览器标签） */
  title: '龙天宇的博客',
  description: '记录前端、设计与生活。',
  /** 部署后的完整地址，末尾必须带 / */
  url: 'https://lty04.dpdns.org/',
  author: '龙天宇',
  /** 备案号，没有就留空字符串 */
  icp: '',
  social: {
    github: 'https://github.com/lty-041010',
    twitter: '',
    email: 'mailto:1373422192@qq.com',
  },
  /** giscus 评论，默认关闭 */
  giscus: {
    enabled: false,
    repo: 'YOUR_GITHUB_USERNAME/YOUR_REPO_NAME',
    repoId: '',
    category: 'Announcements',
    categoryId: '',
    mapping: 'pathname',
    lang: 'zh-CN',
  },
} as const
