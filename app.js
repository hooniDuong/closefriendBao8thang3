document.addEventListener('DOMContentLoaded', () => {
    // --- PIN Logic ---
    const CORRECT_PIN = "130524";
    let currentPin = "";

    const dots = document.querySelectorAll('.dot');
    const keys = document.querySelectorAll('.key:not(.function)');
    const clearBtn = document.getElementById('clear-btn');
    const delBtn = document.getElementById('del-btn');
    const heartHint = document.getElementById('heart-hint');
    const hintPopup = document.getElementById('hint-popup');

    heartHint.addEventListener('click', () => {
        hintPopup.classList.toggle('show');
        setTimeout(() => hintPopup.classList.remove('show'), 3000);
    });

    keys.forEach(key => {
        key.addEventListener('click', () => {
            if (currentPin.length < 6) {
                currentPin += key.textContent;
                updateDots();
                if (currentPin.length === 6) {
                    checkPin();
                }
            }
        });
    });

    clearBtn.addEventListener('click', () => {
        currentPin = "";
        updateDots();
        resetDotErrors();
    });

    delBtn.addEventListener('click', () => {
        currentPin = currentPin.slice(0, -1);
        updateDots();
        resetDotErrors();
    });

    function updateDots() {
        dots.forEach((dot, index) => {
            if (index < currentPin.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    function resetDotErrors() {
        dots.forEach(dot => dot.classList.remove('error'));
    }

    function checkPin() {
        if (currentPin === CORRECT_PIN) {
            // Success
            triggerSparkles();
            setTimeout(() => {
                transitionToDashboard();
            }, 1200); // Faster transition
        } else {
            // Error
            dots.forEach(dot => dot.classList.add('error'));
            setTimeout(() => {
                currentPin = "";
                updateDots();
                resetDotErrors();
            }, 500);
        }
    }

    function triggerSparkles() {
        if (typeof confetti === 'function') {
            var duration = 2000;
            var end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#fce4ec', '#ff4f87', '#ffffff']
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#fce4ec', '#ff4f87', '#ffffff']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
    }

    // --- Navigation Logic ---
    const lockScreen = document.getElementById('lock-screen');
    const mainDashboard = document.getElementById('main-dashboard');
    const backBtn = document.getElementById('back-btn');
    const sections = ['music', 'letter', 'memories', 'surprise'];

    // Create a fluid transition element dynamically
    const transitionEl = document.createElement('div');
    transitionEl.className = 'liquid-transition';
    document.body.appendChild(transitionEl);

    function transitionToDashboard() {
        transitionEl.classList.add('active');

        setTimeout(() => {
            lockScreen.classList.remove('active');
            lockScreen.classList.add('hidden');
            mainDashboard.classList.remove('hidden');
            // Small delay to allow display block to apply before opacity transition
            setTimeout(() => {
                mainDashboard.classList.add('active');
                transitionEl.classList.remove('active');
            }, 50);
        }, 800);
    }

    sections.forEach(sec => {
        const card = document.getElementById(`card-${sec}`);
        const sectionEl = document.getElementById(`section-${sec}`);

        card.addEventListener('click', () => {
            mainDashboard.classList.remove('active');
            setTimeout(() => {
                mainDashboard.classList.add('hidden');
                sectionEl.classList.remove('hidden');
                setTimeout(() => {
                    sectionEl.classList.add('active');
                    backBtn.classList.remove('hidden');

                    // Trigger section specific initializations
                    if (sec === 'memories') initMemories();
                    if (sec === 'surprise') initSurprise();
                    if (sec === 'letter') initLetter();
                }, 50);
            }, 800); // Wait for fade out
        });
    });

    backBtn.addEventListener('click', () => {
        // Find active section
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection) {
            activeSection.classList.remove('active');
            backBtn.classList.add('hidden');

            // Cleanups
            if (activeSection.id === 'section-music') pauseAudio();
            if (activeSection.id === 'section-surprise' && window.StopSurpriseEffects) {
                window.StopSurpriseEffects();
                document.getElementById('section-surprise').style.background = '#000';
            }

            setTimeout(() => {
                activeSection.classList.add('hidden');
                mainDashboard.classList.remove('hidden');
                setTimeout(() => {
                    mainDashboard.classList.add('active');
                }, 50);
            }, 800);
        }
    });

    // --- 1. Music Player ---
    const audioEl = document.getElementById('audio-element');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const playIcon = document.getElementById('play-icon');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const vinylDisc = document.getElementById('vinyl-disc');
    const songTitleEl = document.querySelector('.song-info h3');
    const songArtistEl = document.querySelector('.song-info p');

    const playlist = [
        {
            title: "Anh Nhà Ở Đâu Thế",
            artist: "AMEE x BRAY",
            src: "music/1anhnhaodauthe/anhnhaodauthe.mp3",
            cover: "music/1anhnhaodauthe/1.jpg"
        },
        {
            title: "Chỉ Muốn Bên Em Lúc Này",
            artist: "JIKI X, HUY VẠC",
            src: "music/2chimuonbenemlucnay/chimuonbenemlucnay.mp3",
            cover: "music/2chimuonbenemlucnay/2.jpg"
        },
        {
            title: "Muốn Nói Với Em",
            artist: "Tích Kỳ",
            src: "music/3muonnoivoiem/muonnoivoiem.mp3",
            cover: "music/3muonnoivoiem/3.jpg"
        },
        {
            title: "Bên Trên Tầng Lầu",
            artist: "Tăng Duy Tân",
            src: "music/4bentrentanglau/bentrentanglau.mp3",
            cover: "music/4bentrentanglau/4.jpg"
        },
        {
            title: "Em Là Ai",
            artist: "Keyo",
            src: "music/5emlaai/emlaai.mp3",
            cover: "music/5emlaai/5.jpg"
        },
        {
            title: "Mãi Mãi Một Tình Yêu",
            artist: "Đan Trường",
            src: "music/6maimaimottinhyeu/maimaimottinhyeu.mp3",
            cover: "music/6maimaimottinhyeu/6.jpg"
        },
        {
            title: "Thôi Em Đừng Đi",
            artist: "RPT MCK (feat. Trung Trần)",
            src: "music/7thoemdungdi/thoiemdungdi.mp3",
            cover: "music/7thoiemdungdi/7.jpg"
        }
    ];

    const playlistListEl = document.getElementById('playlist-list');

    let currentTrackIndex = 0;
    let isPlaying = false;

    // Render Playlist UI
    function renderPlaylist() {
        playlistListEl.innerHTML = '';
        playlist.forEach((track, index) => {
            const li = document.createElement('li');
            li.className = 'playlist-item';
            if (index === currentTrackIndex) li.classList.add('active');

            li.innerHTML = `
                <img src="${track.cover}" alt="Cover" class="playlist-thumb">
                <div class="playlist-info">
                    <h4>${track.title}</h4>
                    <p>${track.artist}</p>
                </div>
            `;

            li.addEventListener('click', () => {
                currentTrackIndex = index;
                loadTrack(currentTrackIndex);
                if (!isPlaying) playAudio();
            });

            playlistListEl.appendChild(li);
        });
    }

    function loadTrack(index) {
        const track = playlist[index];
        audioEl.src = track.src;
        vinylDisc.src = track.cover;
        songTitleEl.textContent = track.title;
        songArtistEl.textContent = track.artist;
        progressBar.style.width = '0%';

        // Update active class in playlist
        document.querySelectorAll('.playlist-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }

    // Initialize
    renderPlaylist();
    loadTrack(currentTrackIndex);

    function togglePlay() {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    }

    function playAudio() {
        audioEl.play().catch(e => console.log("Audio play failed:", e));
        isPlaying = true;
        vinylDisc.classList.add('playing');
        playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
    }

    function pauseAudio() {
        audioEl.pause();
        isPlaying = false;
        vinylDisc.classList.remove('playing');
        playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) playAudio();
    }

    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) playAudio();
    }

    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);

    // Auto next when song ends
    audioEl.addEventListener('ended', nextTrack);

    audioEl.addEventListener('timeupdate', updateProgress);

    function updateProgress() {
        const { duration, currentTime } = audioEl;
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }
    }

    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audioEl.duration;
        audioEl.currentTime = (clickX / width) * duration;
    });

    // --- 2. Interactive Letter ---
    const envelope = document.querySelector('.envelope');
    const typeWriterText = document.getElementById('typewriter-text');
    const letterContent = "Chúc mừng 8/3 đến em Thỏ yêu của anh 💐 \n\n Cảm ơn em vì đã luôn ở bên anh, mang đến cho anh rất nhiều niềm vui, sự ấm áp và những khoảnh khắc thật đặc biệt. Với anh, em không chỉ đáng yêu như một chú thỏ nhỏ mà còn là người khiến mỗi ngày của anh trở nên ý nghĩa hơn.\n\n Anh mong rằng hôm nay và cả những ngày sau này, em luôn thật xinh đẹp, vui vẻ, hạnh phúc và được yêu thương thật nhiều. Anh sẽ luôn cố gắng để là người mang lại nụ cười cho em.\n\n Chúc em một ngày 8/3 thật ngọt ngào, Thỏ yêu của anh";
    let isTyping = false;
    let typeTimeOut;

    function initLetter() {
        // Reset letter
        envelope.classList.remove('open');
        typeWriterText.textContent = "";
        isTyping = false;
        clearTimeout(typeTimeOut);
    }

    envelope.addEventListener('click', () => {
        if (!envelope.classList.contains('open')) {
            envelope.classList.add('open');
            setTimeout(startTypewriter, 1000); // Wait for envelope to open
        }
    });

    function startTypewriter() {
        if (isTyping) return;
        isTyping = true;
        typeWriterText.textContent = "";
        let i = 0;

        function type() {
            if (i < letterContent.length && isTyping) {
                typeWriterText.textContent += letterContent.charAt(i);
                i++;
                typeTimeOut = setTimeout(type, 50); // Speed of typing
            }
        }
        type();
    }

    // --- 3. Memories ---
    function initMemories() {
        const trackTop = document.getElementById('track-top');
        const trackBottom = document.getElementById('track-bottom');

        // Only inject if empty
        if (trackTop.children.length === 0) {
            // Updated to load 7 images per row from the anhMemories folder
            const topPhotos = [
                "anhMemories/hangtren/1.jpg",
                "anhMemories/hangtren/2.jpg",
                "anhMemories/hangtren/3.jpg",
                "anhMemories/hangtren/4.jpg",
                "anhMemories/hangtren/5.jpg",
                "anhMemories/hangtren/6.jpg",
                "anhMemories/hangtren/7.jpg"
            ];

            const bottomPhotos = [
                "anhMemories/hangduoi/1.jpg",
                "anhMemories/hangduoi/2.jpg",
                "anhMemories/hangduoi/3.jpg",
                "anhMemories/hangduoi/4.jpg",
                "anhMemories/hangduoi/5.jpg",
                "anhMemories/hangduoi/6.jpg",
                "anhMemories/hangduoi/7.jpg"
            ];

            // Duplicate for infinite scroll effect
            const topContent = [...topPhotos, ...topPhotos].map(src => `<img src="${src}" class="memory-img" alt="Memory">`).join('');
            const bottomContent = [...bottomPhotos, ...bottomPhotos].map(src => `<img src="${src}" class="memory-img" alt="Memory">`).join('');

            trackTop.innerHTML = topContent;
            trackBottom.innerHTML = bottomContent;

            // Setup lightbox listeners on dynamically added images
            document.querySelectorAll('.memory-img').forEach(img => {
                img.addEventListener('click', (e) => {
                    openLightbox(e.target.src);
                });
            });
        }
    }

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
    }

    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.classList.remove('active');
    });

    // --- 4. Surprise Finale ---
    let fallingPhotoInterval;
    const voiceBtn = document.getElementById('voice-message-btn');
    const voiceAudio = document.getElementById('voice-audio-element');
    let isVoicePlaying = false;

    function initSurprise() {
        if (window.StartSurpriseEffects) {
            window.StartSurpriseEffects();
        }

        // Show elements with delays
        setTimeout(() => {
            document.getElementById('meadow-overlay').classList.add('show');
            document.getElementById('silhouette-container').classList.add('show');
        }, 1500);

        setTimeout(() => {
            document.getElementById('closing-message').classList.add('show');
            voiceBtn.classList.add('show');
        }, 4000);

        // Falling photos after 10 seconds
        setTimeout(() => {
            startFallingPhotos();
        }, 10000);
    }

    voiceBtn.addEventListener('click', () => {
        if (isVoicePlaying) {
            voiceAudio.pause();
            isVoicePlaying = false;
            voiceBtn.classList.remove('playing');
            voiceBtn.querySelector('span').textContent = "Nghe lời nhắn";
            if (audioEl && isPlaying) audioEl.volume = 1; // Restore BGM volume
        } else {
            // Optional: You can set a real source here later if not set in HTML
            // voiceAudio.src = 'path/to/voice-message.mp3';
            voiceAudio.play().catch(e => console.log("Voice audio play failed:", e));
            isVoicePlaying = true;
            voiceBtn.classList.add('playing');
            voiceBtn.querySelector('span').textContent = "Tạm dừng";

            // Lower background music volume if it's playing
            if (audioEl && isPlaying) {
                audioEl.volume = 0.2;
            }
        }
    });

    voiceAudio.addEventListener('ended', () => {
        isVoicePlaying = false;
        voiceBtn.classList.remove('playing');
        voiceBtn.querySelector('span').textContent = "Nghe lời nhắn";
        if (audioEl && isPlaying) audioEl.volume = 1; // Restore BGM volume
    });

    function startFallingPhotos() {
        if (fallingPhotoInterval) clearInterval(fallingPhotoInterval);

        const photoUrls = [
            "anhMemories/hangtren/1.jpg",
            "anhMemories/hangtren/2.jpg",
            "anhMemories/hangtren/3.jpg",
            "anhMemories/hangtren/4.jpg",
            "anhMemories/hangtren/5.jpg",
            "anhMemories/hangtren/6.jpg",
            "anhMemories/hangtren/7.jpg",
            "anhMemories/hangduoi/1.jpg",
            "anhMemories/hangduoi/2.jpg",
            "anhMemories/hangduoi/3.jpg",
            "anhMemories/hangduoi/4.jpg",
            "anhMemories/hangduoi/5.jpg",
            "anhMemories/hangduoi/6.jpg",
            "anhMemories/hangduoi/7.jpg"
        ];

        fallingPhotoInterval = setInterval(() => {
            if (!document.getElementById('section-surprise').classList.contains('active')) {
                clearInterval(fallingPhotoInterval);
                return;
            }
            createFallingPhoto(photoUrls[Math.floor(Math.random() * photoUrls.length)]);
        }, 1500); // Drop 1 photo every 1.5s
    }

    function createFallingPhoto(src) {
        const photo = document.createElement('img');
        photo.src = src;
        photo.className = 'falling-photo';

        // Random horizontal start (avoid boundaries)
        const startX = Math.random() * 80 + 10;
        photo.style.left = startX + 'vw';

        // Random fall speed and rotation target
        const fallDuration = Math.random() * 5 + 8; // 8s to 13s
        const rotateEnd = (Math.random() - 0.5) * 720;

        photo.style.animation = `fallDown ${fallDuration}s linear forwards`;
        photo.style.setProperty('--rot-end', rotateEnd + 'deg');

        photo.addEventListener('click', () => {
            openLightbox(src);
        });

        document.getElementById('section-surprise').appendChild(photo);

        // Cleanup after fall
        setTimeout(() => {
            if (photo.parentNode) photo.parentNode.removeChild(photo);
        }, fallDuration * 1000);
    }
});
