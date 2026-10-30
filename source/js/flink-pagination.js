document.addEventListener('DOMContentLoaded', function () {
    // 配置：每页显示多少个卡片
    const PAGE_SIZE = 12; 
    
    // 找到页面上所有的友链分组
    const flinkLists = document.querySelectorAll('.flink-list');

    flinkLists.forEach((list, groupIndex) => {
        // 提取当前分组的所有卡片
        const items = Array.from(list.children).filter(el => el.classList.contains('flink-list-item'));
        
        // 如果卡片数量小于每页显示数，就不分页了
        if (items.length <= PAGE_SIZE) return;

        const totalPages = Math.ceil(items.length / PAGE_SIZE);
        let currentPage = 1;

        // 创建分页按钮容器
        const pagination = document.createElement('div');
        pagination.className = 'flink-pagination';
        pagination.style.cssText = 'display: flex; justify-content: center; gap: 10px; margin-top: 25px; margin-bottom: 15px;';

        // 渲染当前页的数据
        function renderPage(page) {
            // 先隐藏所有
            items.forEach(item => item.style.display = 'none');
            
            // 计算当前页的起始和结束索引
            const start = (page - 1) * PAGE_SIZE;
            const end = start + PAGE_SIZE;
            
            // 显示当前页
            items.slice(start, end).forEach(item => item.style.display = 'block');
            
            // 更新按钮状态
            updateButtons(page, totalPages);
            
            // 如果点击了翻页，平滑滚动回列表顶部
            if (page !== 1) {
                const offsetTop = list.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        }

        // 更新按钮 UI
        function updateButtons(page, total) {
            pagination.innerHTML = ''; // 清空

            // 上一页按钮
            const prevBtn = document.createElement('button');
            prevBtn.innerText = '上一页';
            prevBtn.className = 'page-btn';
            prevBtn.disabled = page === 1;
            prevBtn.onclick = () => { currentPage--; renderPage(currentPage); };
            pagination.appendChild(prevBtn);

            // 页码信息
            const pageInfo = document.createElement('span');
            pageInfo.innerText = `${page} / ${total}`;
            pageInfo.className = 'page-info';
            pagination.appendChild(pageInfo);

            // 下一页按钮
            const nextBtn = document.createElement('button');
            nextBtn.innerText = '下一页';
            nextBtn.className = 'page-btn';
            nextBtn.disabled = page === total;
            nextBtn.onclick = () => { currentPage++; renderPage(currentPage); };
            pagination.appendChild(nextBtn);
        }

        // 把分页容器插入到列表后面
        list.parentNode.insertBefore(pagination, list.nextSibling);

        // 初始化第一页
        renderPage(1);
    });
});