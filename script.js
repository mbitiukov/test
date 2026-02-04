const startScreen = document.querySelector('.start-screen');
const track = document.querySelector('.gallery-track');
const gallery = document.querySelector('.gallery');

let cards = [];
let initialized = false;
let infiniteInitialized = false;
let hasActiveCard = false;
let ticking = false;


//Serwise worker 
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}

/* Enter gallery */
startScreen.addEventListener('click', () => {
    if (initialized) return;
    initialized = true;

    document.body.classList.add('state-gallery');
    initInfiniteScroll();
    updateVideoPlayback();
});

/* Video helper */
function forcePlayVideo(video) {
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const p = video.play();
    if (p !== undefined) p.catch(() => {});
}

function updateVideoPlayback() {
    cards.forEach(card => {
        const video = card.querySelector('video');
        if (!video) return;

        const rect = card.getBoundingClientRect();
        const visible =
            rect.right > 0 &&
            rect.left < window.innerWidth;

        if (visible) {
            forcePlayVideo(video);
        } else {
            video.pause();
        }
    });
}

/* Infinite scroll */
function initInfiniteScroll() {
    if (infiniteInitialized) return;
    infiniteInitialized = true;

    const originals = Array.from(track.children);
    const originalCount = originals.length;

    /* Right clones */
    originals.forEach(card => {
        track.appendChild(card.cloneNode(true));
    });

    /* Left clones */
    const leftFragment = document.createDocumentFragment();
    originals.forEach(card => {
        leftFragment.appendChild(card.cloneNode(true));
    });
    track.insertBefore(leftFragment, track.firstChild);

    cards = Array.from(track.children);

    const cardWidth = originals[0].offsetWidth;
    const gap = parseInt(getComputedStyle(track).gap) || 0;
    const originalSetWidth = originalCount * (cardWidth + gap);

    // start at the originals
    track.scrollLeft = originalSetWidth;

    function handleInfiniteScroll() {
        if (hasActiveCard) return;

        const min = originalSetWidth;
        const max = originalSetWidth * 2;

        if (track.scrollLeft < min) {
            track.scrollLeft += originalSetWidth;
            return;
        }

        if (track.scrollLeft > max) {
            track.scrollLeft -= originalSetWidth;
            return;
        }
    }

    track.addEventListener('scroll', () => {
        if (ticking) return;

        ticking = true;
        requestAnimationFrame(() => {
            handleInfiniteScroll();
            updateVideoPlayback();
            ticking = false;
        });
    });

    track.addEventListener('wheel', e => {
        if (hasActiveCard) return;
        e.preventDefault();
        track.scrollLeft += e.deltaY;
    }, { passive: false });

    setupCardClicks();
    updateVideoPlayback();
}

/* Card interaction */
function setupCardClicks() {
    cards.forEach(card => {
        card.addEventListener('click', e => {
            e.stopPropagation();

            const isActive = card.classList.contains('active');

            cards.forEach(c => c.classList.remove('active'));
            hasActiveCard = false;

            if (!isActive) {
                card.classList.add('active');
                hasActiveCard = true;

                const video = card.querySelector('video');
                forcePlayVideo(video);
            }
        });
    });
}

/* Click outside */
gallery.addEventListener('click', () => {
    if (!hasActiveCard) return;

    cards.forEach(c => c.classList.remove('active'));
    hasActiveCard = false;
});
