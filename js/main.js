/**
 * 国控站群企业网站 - 主交互脚本
 * Full Screen Snap Scrolling + 轮播 + 导航
 */

// 版本控制：防止旧版本代码继续执行
window.HERO_SLIDER_VERSION = 8;
console.log('main.js v8 loaded');
if (window.heroTimer) clearTimeout(window.heroTimer);
window.heroTimer = null;

document.addEventListener('DOMContentLoaded', function() {
    // ==========================================
    // 全局变量
    // ==========================================
    const mainContainer = document.querySelector('.main-container');
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.home-nav-item, .sub-nav-item');
    const sidebar = document.querySelector('.sidebar');
    const pageSwitchWrapperEl = document.querySelector('.page-switch-wrapper');
    const currentPage = pageSwitchWrapperEl ? pageSwitchWrapperEl.dataset.currentPage : '';
    
    let darkSections = ['hero', 'media'];
    if (currentPage === 'technology') {
        darkSections = ['hero'];
    } else if (currentPage === 'finance') {
        darkSections = ['hero'];
    }
    
    // ==========================================
    // 侧栏折叠功能 (Sidebar Collapse)
    // ==========================================
    const BREAKPOINT_COLLAPSE = 1280;
    
    function handleSidebarCollapse() {
        const shouldCollapse = window.innerWidth < BREAKPOINT_COLLAPSE;
        sidebar.classList.toggle('collapsed', shouldCollapse);
        // 同步更新所有 section 的 padding
        sections.forEach(section => {
            section.classList.toggle('sidebar-collapsed', shouldCollapse);
        });
        // 同步更新 hero-section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.classList.toggle('sidebar-collapsed', shouldCollapse);
        }
        // 同步更新 business-bg
        const businessBg = document.querySelector('.business-bg');
        if (businessBg) {
            businessBg.classList.toggle('sidebar-collapsed', shouldCollapse);
        }
        // 同步更新 article-banner
        const articleBanner = document.querySelector('.article-banner');
        if (articleBanner) {
            articleBanner.classList.toggle('sidebar-collapsed', shouldCollapse);
        }
    }
    
    // 初始检查
    handleSidebarCollapse();
    
    // 窗口大小变化时重新检查
    window.addEventListener('resize', handleSidebarCollapse);
    
    // ==========================================
    // 智能 Scroll Snap 控制
    // 根据模块内容高度自动决定是否启用 snap
    // ==========================================
    function handleScrollSnap() {
        const viewportHeight = window.innerHeight;
        const mainContainer = document.querySelector('.main-container');
        if (!mainContainer) return;
        
        const sections = document.querySelectorAll('.section');
        let shouldDisableSnap = false;
        
        sections.forEach(section => {
            const sectionContentHeight = section.scrollHeight;
            if (sectionContentHeight > viewportHeight + 10) {
                shouldDisableSnap = true;
            }
        });
        
        mainContainer.classList.toggle('snap-disabled', shouldDisableSnap);
    }
    
    // 初始检查 + 窗口变化重新检查
    handleScrollSnap();
    window.addEventListener('resize', handleScrollSnap);
    
    // ==========================================
    // 侧边导航高亮 (基于 scroll-snap 当前区域)
    // ==========================================
    
    // 动态调整统计数据字号以适应容器宽度（三个数字统一字号）
    function adjustStatFontSize() {
        const statNums = document.querySelectorAll('.stat-num');
        const statsContainer = document.querySelector('.about-stats');
        if (!statNums.length || !statsContainer) return;
        
        // 二分法查找不溢出父容器的最大统一字号
        let low = 20, high = 100, result = 100;
        
        function anyOverflow(size) {
            statNums.forEach(num => num.style.fontSize = size + 'px');
            // 强制回流确保布局已更新
            void statsContainer.offsetHeight;
            return statsContainer.scrollWidth > statsContainer.clientWidth + 1;
        }
        
        for (let i = 0; i < 10; i++) {
            const mid = Math.floor((low + high) / 2);
            if (anyOverflow(mid)) {
                high = mid - 1;
            } else {
                result = mid;
                low = mid + 1;
            }
        }
        
        // 统一应用最终字号
        statNums.forEach(num => num.style.fontSize = result + 'px');
    }
    
    // 初始计算 + 窗口变化重新计算
    adjustStatFontSize();
    window.addEventListener('resize', adjustStatFontSize);
    
    
    function updateActiveNav() {
        const scrollTop = mainContainer.scrollTop;
        const viewportHeight = window.innerHeight;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // 判断当前 section 是否在视口中占据主要位置
            if (scrollTop >= sectionTop - viewportHeight / 2 && 
                scrollTop < sectionTop + sectionHeight - viewportHeight / 2) {
                navItems.forEach(item => item.classList.remove('active'));
                if (navItems[index]) {
                    navItems[index].classList.add('active');
                }
            }
        });
    }
    
    // 使用 IntersectionObserver 更精确地检测当前区域
    const observerOptions = {
        root: mainContainer,
        threshold: 0.5
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                // 切换导航高亮
                navItems.forEach(item => {
                    item.classList.toggle('active', item.dataset.section === sectionId);
                });
                // 切换侧栏明暗主题
                const isDarkSection = darkSections.includes(sectionId);
                if (isDarkSection) {
                    sidebar.classList.remove('theme-light');
                    sidebar.classList.add('theme-dark');
                } else {
                    sidebar.classList.remove('theme-dark');
                    sidebar.classList.add('theme-light');
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => sectionObserver.observe(section));
    
    // ==========================================
    // 导航点击平滑滚动
    // ==========================================
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // ==========================================
    // 首屏轮播 (Hero Slider) - 简洁版
    // ==========================================
    const heroSlider = {
        current: 0,
        timer: null,
        cleanupTimer: null,
        slides: [],
        dots: [],
        interval: 5000,
        
        init() {
            clearTimeout(window.heroTimer);
            window.heroTimer = null;
            
            this.slides = document.querySelectorAll('.hero-slide');
            this.dots = document.querySelectorAll('.hero-dots .dot');
            
            if (this.slides.length === 0) return;
            
            this.resetState();
            this.activateSlide(0);
            this.start();
            
            const prevBtn = document.querySelector('.hero-prev');
            const nextBtn = document.querySelector('.hero-next');
            const heroSection = document.querySelector('.hero-section');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => this.prev());
            }
            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.next());
            }
            
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goTo(index));
            });
            
            if (heroSection) {
                heroSection.addEventListener('mouseenter', () => this.stop());
                heroSection.addEventListener('mouseleave', () => {
                    const rect = heroSection.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        this.start();
                    }
                });
            }
        },
        
        resetState() {
            this.slides.forEach(slide => {
                slide.classList.remove('active');
                slide.style.zIndex = '';
            });
            this.dots.forEach(dot => {
                dot.classList.remove('active');
                const progress = dot.querySelector('.dot-progress');
                if (progress) {
                    progress.style.transition = 'none';
                    progress.style.width = '0';
                }
            });
        },
        
        activateSlide(index) {
            this.current = index;
            const slide = this.slides[index];
            const dot = this.dots[index];
            
            slide.classList.add('active');
            dot.classList.add('active');
            
            setTimeout(() => {
                const progress = dot.querySelector('.dot-progress');
                if (progress) {
                    progress.style.transition = 'width ' + this.interval + 'ms linear';
                    progress.style.width = '100%';
                }
            }, 50);
            
            setTimeout(() => {
                const bg = slide.querySelector('.hero-slide-bg');
                if (bg) {
                    bg.style.transition = 'none';
                    bg.style.transform = 'scale(1)';
                    setTimeout(() => {
                        bg.style.transition = 'transform ' + this.interval + 'ms linear';
                        bg.style.transform = 'scale(1.3)';
                    }, 50);
                }
            }, 50);
        },
        
        next() {
            const nextIndex = (this.current + 1) % this.slides.length;
            this.switchTo(nextIndex);
        },
        
        prev() {
            const prevIndex = (this.current - 1 + this.slides.length) % this.slides.length;
            this.switchTo(prevIndex);
        },
        
        goTo(index) {
            if (index >= 0 && index < this.slides.length) {
                this.switchTo(index);
            }
        },
        
        switchTo(index) {
            this.stop();
            
            const oldSlide = this.slides[this.current];
            const newSlide = this.slides[index];
            
            newSlide.style.zIndex = '4';
            newSlide.classList.add('active');
            this.dots[index].classList.add('active');
            
            this.dots.forEach(dot => {
                const progress = dot.querySelector('.dot-progress');
                if (progress) {
                    progress.style.transition = 'none';
                    progress.style.width = '0';
                }
            });
            
            setTimeout(() => {
                const progress = this.dots[index].querySelector('.dot-progress');
                if (progress) {
                    progress.style.transition = 'width ' + this.interval + 'ms linear';
                    progress.style.width = '100%';
                }
            }, 50);
            
            setTimeout(() => {
                const bg = newSlide.querySelector('.hero-slide-bg');
                if (bg) {
                    bg.style.transition = 'none';
                    bg.style.transform = 'scale(1)';
                    setTimeout(() => {
                        bg.style.transition = 'transform ' + this.interval + 'ms linear';
                        bg.style.transform = 'scale(1.3)';
                    }, 50);
                }
            }, 50);
            
            setTimeout(() => {
                oldSlide.classList.remove('active');
                oldSlide.style.zIndex = '';
                newSlide.style.zIndex = '';
            }, 800);
            
            this.current = index;
            this.start();
        },
        
        start() {
            this.stop();
            this.timer = setTimeout(() => this.next(), this.interval);
            
            const self = this;
            this.cleanupTimer = setTimeout(function cleanupOldTimers() {
                if (window.heroTimer && window.heroTimer !== self.timer) {
                    clearTimeout(window.heroTimer);
                    window.heroTimer = null;
                }
                self.cleanupTimer = setTimeout(cleanupOldTimers, 1000);
            }, 1000);
        },
        
        stop() {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            if (this.cleanupTimer) {
                clearTimeout(this.cleanupTimer);
                this.cleanupTimer = null;
            }
        }
    };
    
    heroSlider.init();
    
    // ==========================================
    // 媒体聚焦轮播 (Media Carousel)
    // ==========================================
    const mediaCarousel = {
        indicators: document.querySelectorAll('.media-indicators .media-indicator'),
        prevBtn: document.querySelector('.media-slider-prev'),
        nextBtn: document.querySelector('.media-slider-next'),
        caption: document.querySelector('.media-slider-caption'),
        current: 0,
        total: 5,
        interval: null,
        duration: 5000,
        
        data: [
            { caption: '广糖集团糖酒产品亮相第35届越南国际贸易博览会' },
            { caption: '广糖集团召开2026年工作会议暨职工代表大会' },
            { caption: '广糖集团深入推进数字化转型智慧糖业建设' },
            { caption: '广糖集团荣获广西优秀企业称号' },
            { caption: '广糖集团助力乡村振兴 带动蔗农增收' }
        ],
        
        init() {
            if (this.indicators.length === 0) return;
            this.bindEvents();
            this.startAutoPlay();
        },
        
        goTo(index) {
            if (index < 0) index = this.total - 1;
            if (index >= this.total) index = 0;
            
            this.indicators[this.current].classList.remove('active');
            this.current = index;
            this.indicators[this.current].classList.add('active');
            
            if (this.caption && this.data[this.current]) {
                this.caption.style.opacity = '0';
                setTimeout(() => {
                    this.caption.textContent = this.data[this.current].caption;
                    this.caption.style.opacity = '1';
                }, 200);
            }
        },
        
        next() {
            this.goTo(this.current + 1);
        },
        
        prev() {
            this.goTo(this.current - 1);
        },
        
        startAutoPlay() {
            this.interval = setInterval(() => this.next(), this.duration);
        },
        
        stopAutoPlay() {
            clearInterval(this.interval);
        },
        
        resetAutoPlay() {
            this.stopAutoPlay();
            this.startAutoPlay();
        },
        
        bindEvents() {
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => {
                    this.prev();
                    this.resetAutoPlay();
                });
            }
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => {
                    this.next();
                    this.resetAutoPlay();
                });
            }

            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    this.goTo(index);
                    this.resetAutoPlay();
                });
            });
        }
    };
    
    mediaCarousel.init();
    
    // ==========================================
    // 主营业务卡片交互
    // ==========================================
    const businessCards = document.querySelectorAll('.business-card');
    const businessBgImgs = document.querySelectorAll('.business-bg-img');
    const businessBgImages = [
        'public/images/business-bg-1.webp',
        'public/images/business-bg-2.webp',
        'public/images/business-bg-3.webp',
        'public/images/business-bg-4.webp'
    ];
    
    let businessCurrentIndex = 0;
    let businessInterval = null;
    
    function switchBusiness(index) {
        const prevActiveCard = document.querySelector('.business-card.active');
        const prevIndex = prevActiveCard ? parseInt(prevActiveCard.dataset.index) : -1;
        
        businessCards.forEach((card) => {
            card.classList.remove('activating', 'deactivating', 'sibling-inactive');
        });
        
        if (prevActiveCard && prevIndex !== index) {
            prevActiveCard.classList.add('deactivating');
        }
        
        if (businessCards[index]) {
            businessCards[index].classList.add('activating');
        }
        
        businessCards.forEach((card, i) => {
            if (i === index) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
                card.classList.add('sibling-inactive');
            }
        });
        
        setTimeout(() => {
            businessCards.forEach((card) => {
                card.classList.remove('activating', 'deactivating', 'sibling-inactive');
            });
        }, 450);
        
        if (businessBgImgs.length >= 2 && businessBgImages[index]) {
            const current = document.querySelector('.business-bg-img[data-active="true"]');
            const next = current === businessBgImgs[0] ? businessBgImgs[1] : businessBgImgs[0];
            next.src = businessBgImages[index];
            requestAnimationFrame(() => {
                current.removeAttribute('data-active');
                next.setAttribute('data-active', 'true');
            });
        }
        businessCurrentIndex = index;
    }
    
    function startBusinessAutoPlay() {
        businessInterval = setInterval(() => {
            businessCurrentIndex++;
            if (businessCurrentIndex >= businessCards.length) {
                businessCurrentIndex = 0;
            }
            switchBusiness(businessCurrentIndex);
        }, 4000);
    }
    
    function stopBusinessAutoPlay() {
        clearInterval(businessInterval);
    }
    
    function resetBusinessAutoPlay() {
        stopBusinessAutoPlay();
        startBusinessAutoPlay();
    }
    
    businessCards.forEach((card, index) => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            switchBusiness(index);
            resetBusinessAutoPlay();
        });
    });
    
    startBusinessAutoPlay();
    
    // ==========================================
    // 页面模块滑入/滑出动效
    // ==========================================
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const hasDecimal = end % 1 !== 0;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = progress * (end - start) + start;
            obj.innerHTML = hasDecimal ? currentValue.toFixed(1) : Math.floor(currentValue);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // 初始化：标记当前可见的section（跳过成果展示区域，动画在滚动时触发）
    document.querySelectorAll('.section').forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (section.id !== 'achievement') {
                section.classList.add('in-view');
                section.classList.add('active-section');
            }
        }
    });
    
    // 统一的滚动动效检测 - 每次进出都触发，非一次性
    let heroFirstLoad = true;
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;
            
            if (entry.isIntersecting) {
                section.classList.add('in-view');
                section.classList.add('active-section');
                
                document.querySelectorAll('.section').forEach(s => {
                    if (s !== section) {
                        s.classList.remove('active-section');
                    }
                });
                
                if (!heroFirstLoad && section.id === 'hero') {
                    heroSlider.start();
                }
                heroFirstLoad = false;
                
                if (section.id === 'about') {
                    const statNums = section.querySelectorAll('.stat-num');
                    statNums.forEach((num, index) => {
                        setTimeout(() => {
                            const endValue = parseFloat(num.getAttribute('data-value'));
                            num.innerHTML = '0';
                            animateValue(num, 0, endValue, 180);
                        }, index * 200);
                    });
                    setTimeout(adjustStatFontSize, 800);
                    
                    const financeStatNums = section.querySelectorAll('.finance-stat-num');
                    financeStatNums.forEach((num, index) => {
                        setTimeout(() => {
                            const endValue = parseFloat(num.getAttribute('data-value'));
                            num.innerHTML = '0';
                            animateValue(num, 0, endValue, 180);
                        }, index * 200);
                    });
                }
            } else {
                section.classList.remove('in-view');
                section.classList.remove('active-section');
                
                if (section.id === 'hero') {
                    heroSlider.stop();
                }
                
                if (section.id === 'about') {
                    const statNums = section.querySelectorAll('.stat-num, .finance-stat-num');
                    statNums.forEach(num => {
                        num.innerHTML = '0';
                    });
                }
            }
        });
    }, { 
        threshold: 0.1
    });
    
    document.querySelectorAll('.section').forEach(section => {
        scrollObserver.observe(section);
    });
    
    // 兜底：scroll 和 resize 后重新检查所有 section 的可见性
    let fallbackTimer = null;
    function checkSectionsVisibility() {
        document.querySelectorAll('.section').forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                if (!section.classList.contains('in-view')) {
                    section.classList.add('in-view');
                }
            } else {
                if (section.classList.contains('in-view')) {
                    section.classList.remove('in-view');
                    section.classList.remove('active-section');
                    if (section.id === 'hero') { heroSlider.stop(); }
                }
            }
        });
    }
    function debouncedCheck() {
        if (fallbackTimer) clearTimeout(fallbackTimer);
        fallbackTimer = setTimeout(checkSectionsVisibility, 200);
    }
    window.addEventListener('scroll', debouncedCheck, { passive: true });
    window.addEventListener('resize', debouncedCheck, { passive: true });
    // 页面完全加载后再检查一次
    window.addEventListener('load', () => {
        setTimeout(checkSectionsVisibility, 500);
        setTimeout(checkSectionsVisibility, 1500);
    });
    
    // ==========================================
    // 鼠标滚轮一屏一屏滚动
    // ==========================================
    let isScrolling = false;
    const scrollContainer = document.querySelector('.main-container');
    
    function getCurrentSectionIndex() {
        const sections = document.querySelectorAll('.section');
        let closestIndex = 0;
        let closestDistance = Infinity;
        sections.forEach((section, i) => {
            const rect = section.getBoundingClientRect();
            const dist = Math.abs(rect.top);
            if (dist < closestDistance) {
                closestDistance = dist;
                closestIndex = i;
            }
        });
        return closestIndex;
    }
    
    if (scrollContainer) {
        scrollContainer.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            if (isScrolling) return;
            isScrolling = true;
            
            const sections = document.querySelectorAll('.section');
            const currentIndex = getCurrentSectionIndex();
            
            if (e.deltaY > 0) {
                if (currentIndex < sections.length - 1) {
                    sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                if (currentIndex > 0) {
                    sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }, { passive: false });
    }
    
    // ==========================================
    // 搜索按钮交互 - 跳转到搜索页并携带当前主题
    // ==========================================
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            var body = document.body;
            var themes = ['theme-green', 'theme-blue', 'theme-gold'];
            var theme = themes.find(function(t) { return body.classList.contains(t); });
            // 主页没有 body theme class，通过 page-switch-wrapper 推断
            if (!theme && pageSwitchWrapperEl) {
                var pageMap = { agriculture: 'theme-green', technology: 'theme-blue', finance: 'theme-gold' };
                var currentPage = pageSwitchWrapperEl.getAttribute('data-current-page');
                theme = pageMap[currentPage] || 'theme-green';
            }
            theme = theme || 'theme-green';
            var themeParam = theme.replace('theme-', '');
            window.location.href = 'search.html?theme=' + themeParam;
        });
    }
    
    // ==========================================
    // 页面切换功能
    // 首页 (有 data-page-theme) → 跳转不同 .html 页面
    // 二级页面 (body 有 .theme-* class) → 原地切换主题
    // ==========================================
    const pageSwitchBtn = document.querySelector('.page-switch-btn');
    const isHomePage = document.body.hasAttribute('data-page-theme');
    
    if (pageSwitchWrapperEl) {
        pageSwitchWrapperEl.addEventListener('mouseenter', function() {
            this.classList.add('expanded');
        });
        
        pageSwitchWrapperEl.addEventListener('mouseleave', function() {
            this.classList.remove('expanded');
        });
    }
    
    var themeUrls = {
        'theme-green': { logo: 'public/images/logo-green.svg', logoMini: 'public/images/logo-green-mini.svg', banner: 'public/images/banner-agriculture-bg.webp', home: 'index.html', articleList: 'article-list.html' },
        'theme-blue': { logo: 'public/images/logo-blue.svg', logoMini: 'public/images/logo-blue-mini.svg', banner: 'public/images/banner-technology-bg.webp', home: 'technology.html', articleList: 'article-list-blue.html' },
        'theme-gold': { logo: 'public/images/logo-gold.svg', logoMini: 'public/images/logo-gold-mini.svg', banner: 'public/images/banner-finance-bg.webp', home: 'finance.html', articleList: 'article-list-gold.html' }
    };
    var themeNames = {
        'theme-green': 'agriculture',
        'theme-blue': 'technology',
        'theme-gold': 'finance'
    };
    // 首页页面顺序
    var homePageOrder = ['agriculture', 'technology', 'finance'];

    function switchTheme(theme) {
        var body = document.body;
        var themes = ['theme-green', 'theme-blue', 'theme-gold'];
        themes.forEach(function(t) { body.classList.remove(t); });
        body.classList.add(theme);
        
        pageSwitchWrapperEl.dataset.currentPage = themeNames[theme];
        
        var logoFull = document.querySelector('.logo-full');
        var logoMini = document.querySelector('.logo-mini');
        if (logoFull) logoFull.src = themeUrls[theme].logo;
        if (logoMini) logoMini.src = themeUrls[theme].logoMini;
        
        var bannerImg = document.querySelector('.banner-bg img');
        if (bannerImg) bannerImg.src = themeUrls[theme].banner;
        
        var breadcrumbHomeLink = document.getElementById('breadcrumb-home-link');
        if (breadcrumbHomeLink) breadcrumbHomeLink.href = themeUrls[theme].home;
        
        var breadcrumbSearchHome = document.getElementById('breadcrumb-search-home');
        if (breadcrumbSearchHome) breadcrumbSearchHome.href = themeUrls[theme].home;
        
        // 更新侧栏「首页」链接
        var sidebarHero = document.querySelector('.sub-nav-item[data-section="hero"], .home-nav-item[data-section="hero"]');
        if (sidebarHero) {
            sidebarHero.href = themeUrls[theme].home + '#hero';
        }
        
        var breadcrumbNewsLink = document.getElementById('breadcrumb-news-link');
        if (breadcrumbNewsLink) breadcrumbNewsLink.href = themeUrls[theme].articleList;
        
        var pageSwitchItems = document.querySelectorAll('.page-switch-item');
        pageSwitchItems.forEach(function(item) {
            item.classList.remove('active');
            if (item.dataset.target === themeNames[theme]) {
                item.classList.add('active');
            }
        });
    }

    if (pageSwitchBtn && pageSwitchWrapperEl) {
        pageSwitchBtn.addEventListener('click', function() {
            if (isHomePage) {
                // 首页：循环跳转 agriculture → technology → finance
                var current = pageSwitchWrapperEl.getAttribute('data-current-page');
                var idx = homePageOrder.indexOf(current);
                var next = homePageOrder[(idx + 1) % homePageOrder.length];
                var urlMap = { agriculture: 'index.html', technology: 'technology.html', finance: 'finance.html' };
                window.location.href = urlMap[next];
            } else {
                // 二级页面：原地切主题
                var body = document.body;
                var themes = ['theme-green', 'theme-blue', 'theme-gold'];
                var currentTheme = themes.find(function(t) { return body.classList.contains(t); }) || 'theme-green';
                var currentIndex = themes.indexOf(currentTheme);
                var nextIndex = (currentIndex + 1) % themes.length;
                switchTheme(themes[nextIndex]);
            }
        });
    }

    var pageSwitchItems = document.querySelectorAll('.page-switch-item');
    pageSwitchItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            var target = this.dataset.target;
            if (!target) return;
            if (isHomePage) {
                // 首页：不拦截，让 <a href> 正常跳转
                return;
            }
            var theme = Object.keys(themeNames).find(function(key) { return themeNames[key] === target; });
            if (theme) {
                e.preventDefault();
                switchTheme(theme);
                pageSwitchWrapperEl.classList.remove('expanded');
            }
        });
    });
    
    // ==========================================
    // 文章列表标签切换 (Article List Tab Switch)
    // ==========================================
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabUrls = {
        'style1': 'article-list.html',
        'style2': 'article-list-blue.html',
        'style3': 'article-list-gold.html'
    };
    
    navTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            const tabType = this.dataset.tab;
            if (tabUrls[tabType]) {
                window.location.href = tabUrls[tabType];
            }
        });
    });
    
    // ==========================================
    // 科技板块主营业务卡片hover交互 + 自动轮播
    // ==========================================
    const techBusinessCards = document.querySelectorAll('.tech-business-card');
    let techBusinessCarouselIndex = 0;
    let techBusinessCarouselTimer = null;
    
    function activateTechBusinessCard(index) {
        techBusinessCards.forEach(function(c) {
            c.classList.remove('active');
        });
        techBusinessCards[index].classList.add('active');
        techBusinessCarouselIndex = index;
    }
    
    function startTechBusinessCarousel() {
        if (techBusinessCarouselTimer) clearInterval(techBusinessCarouselTimer);
        techBusinessCarouselTimer = setInterval(function() {
            techBusinessCarouselIndex = (techBusinessCarouselIndex + 1) % techBusinessCards.length;
            activateTechBusinessCard(techBusinessCarouselIndex);
        }, 2000);
    }
    
    function stopTechBusinessCarousel() {
        if (techBusinessCarouselTimer) {
            clearInterval(techBusinessCarouselTimer);
            techBusinessCarouselTimer = null;
        }
    }
    
    techBusinessCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            stopTechBusinessCarousel();
            techBusinessCards.forEach(function(c) {
                c.classList.remove('active');
            });
            this.classList.add('active');
            techBusinessCarouselIndex = parseInt(this.dataset.index);
        });
        
        card.addEventListener('mouseleave', function() {
            startTechBusinessCarousel();
        });
    });
    
    if (techBusinessCards.length > 0) {
        startTechBusinessCarousel();
    }
    
    // ==========================================
    // 金融板块主营业务卡片滑动切换
    // ==========================================
    const financeBusinessCarousel = {
        track: document.querySelector('.finance-business-track'),
        prevBtn: document.querySelector('.finance-business-nav-prev'),
        nextBtn: document.querySelector('.finance-business-nav-next'),
        indicatorsContainer: document.querySelector('.finance-business-indicators'),
        cards: document.querySelectorAll('.finance-business-card'),
        currentPage: 0,
        cardsPerPage: 4,
        totalPages: 2,
        timer: null,
        interval: 5000,
        
        getCardsPerPage() {
            const w = window.innerWidth;
            if (w <= 767) return 1;
            if (w <= 1199) return 2;
            return 4;
        },
        
        init() {
            if (!this.track || this.cards.length === 0) return;
            this.cardsPerPage = this.getCardsPerPage();
            this.totalPages = Math.ceil(this.cards.length / this.cardsPerPage);
            this.createIndicators();
            this.bindEvents();
            this.updatePosition();
            this.startAutoPlay();
        },
        
        createIndicators() {
            if (!this.indicatorsContainer) return;
            this.indicatorsContainer.innerHTML = '';
            for (let i = 0; i < this.totalPages; i++) {
                const dot = document.createElement('span');
                dot.className = 'finance-business-indicator' + (i === 0 ? ' active' : '');
                dot.dataset.index = i;
                this.indicatorsContainer.appendChild(dot);
            }
            this.indicators = this.indicatorsContainer.querySelectorAll('.finance-business-indicator');
        },
        
        goTo(page) {
            if (page < 0) page = this.totalPages - 1;
            if (page >= this.totalPages) page = 0;
            this.currentPage = page;
            this.updatePosition();
            this.updateIndicators();
        },
        
        next() {
            this.goTo(this.currentPage + 1);
        },
        
        prev() {
            this.goTo(this.currentPage - 1);
        },
        
        updatePosition() {
            if (!this.track) return;
            const prevTotalPages = this.totalPages;
            this.cardsPerPage = this.getCardsPerPage();
            this.totalPages = Math.ceil(this.cards.length / this.cardsPerPage);
            if (this.currentPage >= this.totalPages) {
                this.currentPage = 0;
            }
            if (this.totalPages !== prevTotalPages && this.indicatorsContainer) {
                this.createIndicators();
            }
            // 桌面端固定卡片宽度 360px，响应式动态计算
            const fixedCardWidth = 360;
            const slider = this.track.parentElement;
            const sliderWidth = slider.clientWidth;
            const gap = 40;
            const minSpace = fixedCardWidth * this.cardsPerPage + gap * (this.cardsPerPage - 1);
            const cardWidth = (this.cardsPerPage >= 4 && sliderWidth >= minSpace)
                ? fixedCardWidth
                : (sliderWidth - gap * (this.cardsPerPage - 1)) / this.cardsPerPage;
            this.cards.forEach(card => {
                card.style.width = cardWidth + 'px';
                card.style.flex = 'none';
                card.style.minWidth = cardWidth + 'px';
                card.style.maxWidth = cardWidth + 'px';
            });
            const offset = -this.currentPage * (cardWidth + gap) * this.cardsPerPage;
            this.track.style.transform = 'translateX(' + offset + 'px)';
            this.updateIndicators();
        },
        
        updateIndicators() {
            if (!this.indicators) return;
            this.indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentPage);
            });
        },
        
        startAutoPlay() {
            this.stopAutoPlay();
            this.timer = setInterval(() => this.next(), this.interval);
        },
        
        stopAutoPlay() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        
        bindEvents() {
            const carousel = document.querySelector('.finance-business-carousel');
            
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => {
                    this.prev();
                    this.resetAutoPlay();
                });
            }
            
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => {
                    this.next();
                    this.resetAutoPlay();
                });
            }
            
            if (this.indicatorsContainer) {
                this.indicatorsContainer.addEventListener('click', (e) => {
                    const indicator = e.target.closest('.finance-business-indicator');
                    if (indicator && indicator.dataset.index !== undefined) {
                        this.goTo(parseInt(indicator.dataset.index));
                        this.resetAutoPlay();
                    }
                });
            }
            
            if (carousel) {
                carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
                carousel.addEventListener('mouseleave', () => this.startAutoPlay());
            }
            
            window.addEventListener('resize', () => this.updatePosition());
        },
        
        resetAutoPlay() {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    };
    
    financeBusinessCarousel.init();
    
    // ==========================================
    // 产品展示轮播 (Products Carousel)
    // ==========================================
    const productsCarousel = {
        track: document.querySelector('.products-section .products-track'),
        prevBtn: document.querySelector('.products-nav-prev'),
        nextBtn: document.querySelector('.products-nav-next'),
        indicatorsContainer: document.querySelector('.products-indicators'),
        cards: document.querySelectorAll('.products-section .product-card'),
        currentPage: 0,
        cardsPerPage: 4,
        totalPages: 0,
        timer: null,
        interval: 4000,
        
        getCardsPerPage() {
            const w = window.innerWidth;
            if (w <= 767) return 1;
            if (w <= 1199) return 2;
            return 4;
        },
        
        init() {
            if (!this.track || this.cards.length === 0) return;
            this.cardsPerPage = this.getCardsPerPage();
            this.totalPages = Math.ceil(this.cards.length / this.cardsPerPage);
            this.createIndicators();
            this.bindEvents();
            this.updatePosition();
            this.startAutoPlay();
        },
        
        createIndicators() {
            if (!this.indicatorsContainer) return;
            this.indicatorsContainer.innerHTML = '';
            for (let i = 0; i < this.totalPages; i++) {
                const dot = document.createElement('span');
                dot.className = 'products-indicator' + (i === 0 ? ' active' : '');
                dot.dataset.index = i;
                this.indicatorsContainer.appendChild(dot);
            }
            this.indicators = this.indicatorsContainer.querySelectorAll('.products-indicator');
        },
        
        goTo(page) {
            if (page < 0) page = this.totalPages - 1;
            if (page >= this.totalPages) page = 0;
            this.currentPage = page;
            this.updatePosition();
            this.updateIndicators();
        },
        
        next() {
            this.goTo(this.currentPage + 1);
        },
        
        prev() {
            this.goTo(this.currentPage - 1);
        },
        
        updatePosition() {
            if (!this.track) return;
            const prevTotalPages = this.totalPages;
            this.cardsPerPage = this.getCardsPerPage();
            this.totalPages = Math.ceil(this.cards.length / this.cardsPerPage);
            if (this.currentPage >= this.totalPages) {
                this.currentPage = 0;
            }
            if (this.totalPages !== prevTotalPages && this.indicatorsContainer) {
                this.createIndicators();
            }
            // 桌面端固定卡片宽度 330px，响应式动态计算
            const fixedCardWidth = 330;
            const slider = this.track.parentElement;
            const sliderWidth = slider.clientWidth;
            const gap = 40;
            const minSpace = fixedCardWidth * this.cardsPerPage + gap * (this.cardsPerPage - 1);
            const cardWidth = (this.cardsPerPage >= 4 && sliderWidth >= minSpace)
                ? fixedCardWidth
                : (sliderWidth - gap * (this.cardsPerPage - 1)) / this.cardsPerPage;
            this.cards.forEach(card => {
                card.style.width = cardWidth + 'px';
                card.style.flex = 'none';
                card.style.minWidth = cardWidth + 'px';
                card.style.maxWidth = cardWidth + 'px';
            });
            const offset = -this.currentPage * (cardWidth + gap) * this.cardsPerPage;
            this.track.style.transform = 'translateX(' + offset + 'px)';
            this.updateIndicators();
        },

        updateIndicators() {
            if (!this.indicators) return;
            this.indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentPage);
            });
        },

        startAutoPlay() {
            this.stopAutoPlay();
            this.timer = setInterval(() => this.next(), this.interval);
        },

        stopAutoPlay() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },

        resetAutoPlay() {
            this.stopAutoPlay();
            this.startAutoPlay();
        },

        bindEvents() {
            const carousel = document.querySelector('.products-carousel');
            
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => {
                    this.prev();
                    this.resetAutoPlay();
                });
            }
            
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => {
                    this.next();
                    this.resetAutoPlay();
                });
            }
            
            if (this.indicatorsContainer) {
                this.indicatorsContainer.addEventListener('click', (e) => {
                    const indicator = e.target.closest('.products-indicator');
                    if (indicator && indicator.dataset.index !== undefined) {
                        this.goTo(parseInt(indicator.dataset.index));
                        this.resetAutoPlay();
                    }
                });
            }
            
            if (carousel) {
                carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
                carousel.addEventListener('mouseleave', () => this.startAutoPlay());
            }
            
            window.addEventListener('resize', () => this.updatePosition());
        }
    };
    
    productsCarousel.init();
    
    // ==========================================
    // 键盘导航支持
    // ==========================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            const currentIndex = Array.from(navItems).findIndex(item => item.classList.contains('active'));
            let nextIndex;
            
            if (e.key === 'ArrowUp') {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
            } else {
                nextIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : 0;
            }
            
            sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    console.log('国控站群网站脚本已加载');
});

function toggleFinanceAbout() {
    const desc = document.querySelector('.finance-about-desc');
    const moreBtn = document.querySelector('.finance-about-more');
    if (desc && moreBtn) {
        if (desc.classList.contains('expanded')) {
            desc.classList.remove('expanded');
            moreBtn.textContent = '[更多]';
        } else {
            desc.classList.add('expanded');
            moreBtn.textContent = '[收起]';
        }
    }

    // ==========================================
    // 卡片点击跳转 — 新闻卡片整张可点击
    // ==========================================
    document.querySelectorAll('.news-card, .news-item-blue, .news-item-gold, .news-article-list > article, .finance-info-card, .tech-achievement-card').forEach(function(card) {
        card.addEventListener('click', function(e) {
            // 如果点击的是 <a> 本身或其子元素，不拦截
            if (e.target.closest('a')) return;
            var link = this.querySelector('a[href*="article-detail"]');
            if (link) {
                window.location.href = link.getAttribute('href');
            }
        });
    });
}
