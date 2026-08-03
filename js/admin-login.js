/* ========================================
   管理后台登录页脚本 (admin-login.js)
   ======================================== */

(function() {
    'use strict';

    /**
     * 处理登录提交：直接跳转到管理后台
     */
    function handleLogin(event) {
        event.preventDefault();

        var loginBtn = document.querySelector('.login-btn');
        loginBtn.disabled = true;
        loginBtn.textContent = '登录中...';

        setTimeout(function() {
            window.location.href = 'admin-dashboard.html';
        }, 500);
    }

    /**
     * 初始化
     */
    function init() {
        var loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        var inputs = document.querySelectorAll('.login-input');
        inputs.forEach(function(input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleLogin(e);
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
