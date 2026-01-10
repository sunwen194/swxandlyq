// 轮播图功能
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.querySelector('.carousel-control.prev');
const nextBtn = document.querySelector('.carousel-control.next');


function showSlide(index) {
    // 隐藏所有幻灯片
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    // 移除所有指示器的激活状态
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    // 显示当前幻灯片
    slides[index].classList.add('active');
    // 激活当前指示器
    indicators[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// 自动轮播
let slideInterval = setInterval(nextSlide, 3000);

// 点击事件
prevBtn.addEventListener('click', () => {
    clearInterval(slideInterval);
    prevSlide();
    slideInterval = setInterval(nextSlide, 3000);
});

nextBtn.addEventListener('click', () => {
    clearInterval(slideInterval);
    nextSlide();
    slideInterval = setInterval(nextSlide, 3000);
});

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        clearInterval(slideInterval);
        currentSlide = index;
        showSlide(currentSlide);
        slideInterval = setInterval(nextSlide, 3000);
    });
});

// 纪念日倒计时
function updateCountdown() {
    const anniversary = new Date('2022-01-20'); // 恋爱纪念日
    const now = new Date();
    const diffTime = Math.abs(now - anniversary);
    
    const years = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
    const days = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // 更新首页的天数
    const counterElement = document.querySelector('.love-counter .counter');
    if (counterElement) {
        counterElement.textContent = totalDays;
    }
    
    // 更新其他地方的纪念日天数
    const anniversaryCards = document.querySelectorAll('.anniversary-card');
    anniversaryCards.forEach((card, index) => {
        if (index < 3) { // 前三个卡片显示倒计时
            const daysElement = card.querySelector('.anniversary-days span');
            if (daysElement) {
                let targetDate;
                
                // 设置每个纪念日的日期
                if (index === 0) { // 相遇纪念日
                    targetDate = new Date(now.getFullYear(), 8, 1); // 9月1日
                } else if (index === 1) { // 恋爱纪念日
                    targetDate = new Date(now.getFullYear(), 0, 20); // 1月20日
                } else { // 生日
                    targetDate = new Date(now.getFullYear(), 6, 15); // 7月15日
                }
                
                // 如果今年的纪念日已经过了，就计算到明年的天数
                if (targetDate < now) {
                    targetDate.setFullYear(targetDate.getFullYear() + 1);
                }
                
                // 计算天数差
                const diffTime = targetDate - now;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                daysElement.textContent = diffDays;
            }
        }
    });
}

// 初始化倒计时
updateCountdown();
// 每天更新一次
setInterval(updateCountdown, 86400000);

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 导航栏滚动效果
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// 照片墙悬停效果
const photos = document.querySelectorAll('.photo-item img');
photos.forEach(photo => {
    photo.addEventListener('mouseenter', () => {
        photo.style.transform = 'scale(1.05)';
    });
    
    photo.addEventListener('mouseleave', () => {
        photo.style.transform = 'scale(1)';
    });
});

// 爱情宣言打字效果
const declarations = [
    '我爱你，直到世界尽头',
    '你是我生命中最美好的相遇',
    '每一天都因为有你而变得特别',
    '和你在一起的时光是我最珍贵的回忆',
    '我愿意陪你走过人生的每一个阶段'
];

let declIndex = 0;
let charIndex = 0;
let isDeleting = false;
const declElement = document.getElementById('love-declaration');

function typeDeclaration() {
    const currentDecl = declarations[declIndex];
    
    if (isDeleting) {
        declElement.textContent = currentDecl.substring(0, charIndex - 1);
        charIndex--;
        
        if (charIndex === 0) {
            isDeleting = false;
            declIndex = (declIndex + 1) % declarations.length;
        }
    } else {
        declElement.textContent = currentDecl.substring(0, charIndex + 1);
        charIndex++;
        
        if (charIndex === currentDecl.length) {
            isDeleting = true;
        }
    }
    
    const typingSpeed = isDeleting ? 50 : 100;
    setTimeout(typeDeclaration, typingSpeed);
}

// 页面加载完成后开始打字效果
window.addEventListener('DOMContentLoaded', function() {
    typeDeclaration();
});