/* 管理后台脚本 (admin-dashboard.js) */

document.addEventListener('DOMContentLoaded', function() {
    // 退出登录功能
    var logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('确定要退出登录吗？')) {
                window.location.href = 'admin-login.html';
            }
        });
    }

    // 侧边栏菜单点击切换
    var sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(function(item) {
        item.addEventListener('click', function() {
            sidebarItems.forEach(function(s) {
                s.classList.remove('sidebar-item--active');
            });
            item.classList.add('sidebar-item--active');
        });
    });
});
