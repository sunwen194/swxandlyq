// ============================================
// 网站主脚本 - 恋爱纪念网站
// ============================================

// ========== 1. 轮播图功能 ==========
let currentSlide = 0;
const totalSlides = document.querySelectorAll('.carousel-item').length;
let slideInterval;

// 切换到指定轮播
function goToSlide(index) {
    const slides = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');

    // 边界处理
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;

    // 移除当前激活状态
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');

    // 设置新的激活状态
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');

    // 重置自动轮播计时器
    resetSlideInterval();
}

// 下一张
function nextSlide() {
    goToSlide(currentSlide + 1);
}

// 上一张
function prevSlide() {
    goToSlide(currentSlide - 1);
}

// 启动自动轮播
function startSlideInterval() {
    slideInterval = setInterval(nextSlide, 5000); // 5秒切换一次
}

// 重置自动轮播
function resetSlideInterval() {
    clearInterval(slideInterval);
    startSlideInterval();
}

// 页面加载完成后启动轮播
startSlideInterval();


// ========== 2. 恋爱天数计算 ==========
function calculateLoveDays() {
    // 在一起的日期：2022年1月14日
    const startDate = new Date('2022-01-14');
    const today = new Date();
    
    // 计算相差天数
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // 更新页面上所有天数显示
    const dayElements = document.querySelectorAll('#loveDays, #togetherDays, #footerDays');
    dayElements.forEach(el => {
        if (el) el.textContent = diffDays;
    });

    // 计算距离下一个生日还有多少天（7月15日）
    const birthdayMonth = 6; // 7月（0开始）
    const birthdayDay = 15;
    let nextBirthday = new Date(today.getFullYear(), birthdayMonth, birthdayDay);
    
    if (nextBirthday < today) {
        nextBirthday = new Date(today.getFullYear() + 1, birthdayMonth, birthdayDay);
    }
    
    const daysToBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
    const birthdayEl = document.getElementById('birthdayDays');
    if (birthdayEl) birthdayEl.textContent = daysToBirthday;
}

// 页面加载时计算
calculateLoveDays();


// ========== 3. 音乐播放器功能 ==========

// ===== 歌单配置（在这里添加/修改歌曲）=====
// 📌 修改说明：
// - title: 歌曲名
// - artist: 歌手
// - src: 音频文件路径（放在 music/ 文件夹里）
// - cover: 专辑封面图片路径（放在 images/ 文件夹里）
// - lrc: 歌词文件路径（放在 music/ 文件夹里，.lrc 格式）
const playlist = [
    {
        title: '浴室',
        artist: '未知',
        src: 'audio/yushi.MP3',      // 改成你的文件名
        cover: 'images/牵手.jpg',  // 专辑封面
        lrc: 'audio/yushi.lrc'       // 歌词文件（如果有的话）
    },
    {
        title: '指纹',
        artist: '未知',
        src: 'audio/小孙.ogg',       // 第二首
        cover: 'images/album2.jpg',
        lrc: 'audio/小孙.lrc'
    },
    {
        title: '痛苦',
        artist: '未知',
        src: 'audio/痛苦.MP3',       // 第二首
        cover: 'images/album2.jpg',
        lrc: 'audio/痛苦.lrc'
    },
    {
        title: '窗外的天气',
        artist: '未知',
        src: 'audio/窗外的天气.MP3',       // 第二首
        cover: 'images/album2.jpg',
        lrc: 'audio/窗外的天气.lrc'
    },
    {
        title: '呜',
        artist: '未知',
        src: 'audio/呜.MP3',       // 第二首
        cover: 'images/album2.jpg',
        lrc: 'audio/呜.lrc'
    }
];


// 当前播放歌曲索引
let currentSongIndex = 0;
let isPlaying = false;
let lyricsData = [];
let currentLyricIndex = -1;

// 获取DOM元素
const audioPlayer = document.getElementById('audioPlayer');
const playIcon = document.getElementById('playIcon');
const musicDisc = document.getElementById('musicDisc');
const albumCover = document.getElementById('albumCover');
const musicTitle = document.getElementById('musicTitle');
const musicArtist = document.getElementById('musicArtist');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const lyricsPanel = document.getElementById('lyricsPanel');
const lyricsContainer = document.getElementById('lyricsContainer');
const playlistPanel = document.getElementById('playlistPanel');
const playlistContent = document.getElementById('playlistContent');

// ===== 初始化歌单列表 =====
function initPlaylist() {
    playlistContent.innerHTML = playlist.map((song, index) => `
        <div class="playlist-item ${index === currentSongIndex ? 'active' : ''}" onclick="playSong(${index})">
            <i class="fas ${index === currentSongIndex && isPlaying ? 'fa-volume-up' : 'fa-music'}"></i>
            <span class="playlist-song">${song.title}</span>
        </div>
    `).join('');
}

// ===== 播放指定歌曲 =====
function playSong(index) {
    currentSongIndex = index;
    const song = playlist[index];

    // 更新音频源
    audioPlayer.src = song.src;
    
    // 更新歌曲信息
    musicTitle.textContent = song.title;
    musicArtist.textContent = song.artist;
    albumCover.src = song.cover;

    // 更新歌单高亮
    initPlaylist();

    // 加载歌词
    loadLyrics(song.lrc);

    // 播放
    audioPlayer.play().then(() => {
        isPlaying = true;
        updatePlayButton();
    }).catch(err => {
        console.log('播放失败:', err);
    });
}

// ===== 播放/暂停切换 =====
function togglePlay() {
    if (audioPlayer.src === '') {
        // 如果还没加载歌曲，播放第一首
        playSong(0);
        return;
    }

    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
    } else {
        audioPlayer.play();
        isPlaying = true;
    }
    updatePlayButton();
}

// ===== 更新播放按钮图标 =====
function updatePlayButton() {
    if (isPlaying) {
        playIcon.className = 'fas fa-pause';
        musicDisc.classList.add('playing');
    } else {
        playIcon.className = 'fas fa-play';
        musicDisc.classList.remove('playing');
    }
    // 更新歌单图标
    initPlaylist();
}

// ===== 上一首 =====
function prevSong() {
    let newIndex = currentSongIndex - 1;
    if (newIndex < 0) newIndex = playlist.length - 1;
    playSong(newIndex);
}

// ===== 下一首 =====
function nextSong() {
    let newIndex = currentSongIndex + 1;
    if (newIndex >= playlist.length) newIndex = 0;
    playSong(newIndex);
}

// ===== 进度条跳转 =====
function seekMusic(event) {
    const track = event.currentTarget;
    const rect = track.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
}

// ===== 格式化时间（秒 -> 分:秒）=====
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ===== 音频事件监听 =====
audioPlayer.addEventListener('timeupdate', () => {
    // 更新进度条
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressFill.style.width = percent + '%';
    
    // 更新当前时间
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);

    // 更新歌词
    updateLyrics(audioPlayer.currentTime);
});

audioPlayer.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('ended', () => {
    // 播放完自动下一首
    nextSong();
});

// 初始化歌单
initPlaylist();


// ========== 4. LRC歌词解析 & 显示 ==========

// ===== 解析LRC歌词 =====
function parseLRC(lrcText) {
    const lines = lrcText.split('\n');
    const result = [];
    const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;

    lines.forEach(line => {
        const matches = [...line.matchAll(timeReg)];
        if (matches.length > 0) {
            // 获取歌词文本（去掉时间标签后的部分）
            const text = line.replace(timeReg, '').trim();
            if (text) {
                matches.forEach(match => {
                    const mins = parseInt(match[1]);
                    const secs = parseInt(match[2]);
                    const ms = parseInt(match[3].padEnd(3, '0'));
                    const time = mins * 60 + secs + ms / 1000;
                    result.push({ time, text });
                });
            }
        }
    });

    // 按时间排序
    result.sort((a, b) => a.time - b.time);
    return result;
}

// ===== 加载歌词文件 =====
async function loadLyrics(lrcPath) {
    try {
        const response = await fetch(lrcPath);
        if (!response.ok) throw new Error('歌词文件不存在');
        const text = await response.text();
        lyricsData = parseLRC(text);
        currentLyricIndex = -1;
        renderLyrics();
    } catch (err) {
        console.log('加载歌词失败:', err);
        lyricsData = [];
        lyricsContainer.innerHTML = `
            <div class="lyrics-placeholder">
                <i class="fas fa-music"></i>
                <p>暂无歌词</p>
            </div>
        `;
    }
}

// ===== 渲染歌词到面板 =====
function renderLyrics() {
    if (lyricsData.length === 0) return;

    lyricsContainer.innerHTML = lyricsData.map((item, index) => `
        <div class="lyrics-line" data-index="${index}">${item.text}</div>
    `).join('');
}

// ===== 更新当前歌词 =====
function updateLyrics(currentTime) {
    if (lyricsData.length === 0) return;

    // 找到当前时间对应的歌词行
    let index = -1;
    for (let i = 0; i < lyricsData.length; i++) {
        if (currentTime >= lyricsData[i].time) {
            index = i;
        }
    }

    // 如果歌词行没变，不更新
    if (index === currentLyricIndex) return;
    currentLyricIndex = index;

    // 更新高亮
    const lines = lyricsContainer.querySelectorAll('.lyrics-line');
    lines.forEach((line, i) => {
        if (i === index) {
            line.classList.add('active');
            // 自动滚动到中间
            line.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            line.classList.remove('active');
        }
    });
}


// ========== 5. 面板切换（歌词/歌单）==========

// ===== 切换歌词面板 =====
function toggleLyrics() {
    lyricsPanel.classList.toggle('show');
    // 打开歌词时关闭歌单
    if (lyricsPanel.classList.contains('show')) {
        playlistPanel.classList.remove('show');
    }
}

// ===== 切换歌单面板 =====
function togglePlaylist() {
    playlistPanel.classList.toggle('show');
    // 打开歌单时关闭歌词
    if (playlistPanel.classList.contains('show')) {
        lyricsPanel.classList.remove('show');
    }
}


// ========== 6. 导航栏滚动效果 ==========
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.06)';
    }
});


// ========== 7. 平滑滚动到锚点 ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // 减去导航栏高度
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});


// ========== 8. 图片懒加载优化 ==========
// （如果图片较多可以启用）
/*
if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                imgObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imgObserver.observe(img);
    });
}
*/


// ========== 初始化提示 ==========
console.log('%c❤️ 恋爱纪念网站已加载', 'color:#ff6b6b;font-size:16px;font-weight:bold;');
console.log('%c提示：请将图片放入 images/ 文件夹，音乐放入 music/ 文件夹', 'color:#666;font-size:12px;');
