jQuery(document).ready(function($){
$('.logo-normal').on('click', function(){

	$('.hero').addClass('locked');

	scrollLocked = false;

	// restore normal video speed
	bgVideo.playbackRate = 1;

});

var bgVideo = document.querySelector('.bg-video');

// slow motion before click
bgVideo.playbackRate = 0.5;  
	let scrollLocked = true;
	// Variables
	var hijacking = $('body').data('hijacking'),
		delta = 0,
		scrollThreshold = 1,
		actual = 1,
		animating = false;
var touchStartY = 0;
var touchEndY = 0;
var swipeThreshold = 50; // how sensitive swipe is
	// DOM elements
	var sectionsAvailable = $('.cd-section'),
		verticalNav = $('.cd-vertical-nav'),
		prevArrow = verticalNav.find('a.cd-prev'),
		nextArrow = verticalNav.find('a.cd-next');

	// Media query check
	var MQ = deviceType(),
		bindToggle = false;

	bindEvents(MQ, true);



	function bindEvents(MQ, bool) {
		if (bool) {
			if (hijacking === 'on') {
				initHijacking();
				$(window).on('DOMMouseScroll mousewheel', scrollHijacking);
			} else {
				scrollAnimation();
				$(window).on('scroll', scrollAnimation);
			}
			prevArrow.on('click', prevSection);
			nextArrow.on('click', nextSection);

			$(document).on('keydown', function(event){
				if (event.which === 40 && !nextArrow.hasClass('inactive')) {
					event.preventDefault();
					nextSection();
				} else if (event.which === 38 && (!prevArrow.hasClass('inactive') || (prevArrow.hasClass('inactive') && $(window).scrollTop() !== sectionsAvailable.eq(0).offset().top))) {
					event.preventDefault();
					prevSection();
				}
			});

			checkNavigation();
		}
	}

	// Normal scroll 
	function scrollAnimation(){
		(!window.requestAnimationFrame) ? animateSection() : window.requestAnimationFrame(animateSection);
	}

	function animateSection() {
		var scrollTop = $(window).scrollTop(),
			windowHeight = $(window).height();

		sectionsAvailable.each(function(){
			var actualBlock = $(this),
				offset = scrollTop - actualBlock.offset().top;

			var animationValues = setSectionAnimationParallax(offset, windowHeight);

			transformSection(actualBlock.children('div'), animationValues[0], animationValues[1], animationValues[2], animationValues[3], animationValues[4]);
			(offset >= 0 && offset < windowHeight) ? actualBlock.addClass('visible') : actualBlock.removeClass('visible');
		});

		checkNavigation();
	}

	function transformSection(element, translateY, scaleValue, rotateXValue, opacityValue, boxShadow) {
		element.velocity({
			translateY: translateY + 'vh',
			scale: scaleValue,
			rotateX: rotateXValue,
			opacity: opacityValue,
			boxShadowBlur: boxShadow + 'px',
			translateZ: 0
		}, 0);
	}

	// Hijacking initialization 
	function initHijacking() {
		var visibleSection = sectionsAvailable.filter('.visible'),
			topSection = visibleSection.prevAll('.cd-section'),
			bottomSection = visibleSection.nextAll('.cd-section');

		visibleSection.children('div').velocity('translateNone', 1, function(){
			visibleSection.css('opacity', 1);
			topSection.css('opacity', 1);
			bottomSection.css('opacity', 1);
		});
		topSection.children('div').velocity('translateUp.half', 0);
		bottomSection.children('div').velocity('translateDown', 0);
	}

function scrollHijacking(event) {

    if (scrollLocked) return false;

    const visibleSection = document.querySelector('.cd-section.visible');
    if (!visibleSection) return false;

    const galleryTrack = visibleSection.querySelector('.gallery-track');
    if (!galleryTrack) return defaultSectionScroll(event);

    const firstCard = galleryTrack.querySelector('.card');
    if (!firstCard) return defaultSectionScroll(event);

    const cardRect = firstCard.getBoundingClientRect();

    const mouseY = event.originalEvent.clientY;

    //  Allow horizontal scroll only inside vertical band of cards
    const insideCardBand =
        mouseY >= cardRect.top &&
        mouseY <= cardRect.bottom;

    if (insideCardBand) {

        const deltaY = event.originalEvent.wheelDelta
            ? -event.originalEvent.wheelDelta
            : event.originalEvent.detail * 40;

        galleryTrack.scrollLeft += deltaY;

        return false; // block section scroll
    }

    return defaultSectionScroll(event);
}

function defaultSectionScroll(event) {

    const visibleSection = $('.cd-section.visible');

    // prevent scrolling above the first section
    if (
        visibleSection.is(':first-of-type') &&
        (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0)
    ) {
        return false;
    }

    if (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0) {

        delta--;
        (Math.abs(delta) >= scrollThreshold) && prevSection();

    } else {

        delta++;
        (delta >= scrollThreshold) && nextSection();

    }

    return false;
}
let touchStartX = 0;

window.addEventListener('touchstart', e => {
    const gallery = document.querySelector('.cd-section.visible .gallery-track');
    if (!gallery) return;

    if (e.target.closest('.gallery-track')) {
        touchStartX = e.touches[0].clientX;
    }
}, { passive: true });

window.addEventListener('touchmove', e => {

    const gallery = document.querySelector('.cd-section.visible .gallery-track');
    if (!gallery) return;

    if (!e.target.closest('.gallery-track')) return;

    const diffX = touchStartX - e.touches[0].clientX;
    gallery.scrollLeft += diffX;
    touchStartX = e.touches[0].clientX;

}, { passive: true });
	function prevSection(event) {
		    if (scrollLocked) return;

    var visibleSection = sectionsAvailable.filter('.visible');

    /* STOP if already on the first section */
    if (visibleSection.is(':first-of-type')) {
        return;
    }

    typeof event !== 'undefined' && event.preventDefault();

		var visibleSection = sectionsAvailable.filter('.visible'),
			middleScroll = (hijacking === 'off' && $(window).scrollTop() !== visibleSection.offset().top);

		if (middleScroll) visibleSection = visibleSection.next('.cd-section');

		var animationParams = ['translateNone', 'translateUp.half', 'translateDown', 700, 'easeInCubic'];

		unbindScroll(visibleSection.prev('.cd-section'), animationParams[3]);

		if (!animating && !visibleSection.is(':first-child')) {
			animating = true;
			visibleSection.removeClass('visible').children('div').velocity(animationParams[2], animationParams[3], animationParams[4])
				.end().prev('.cd-section').addClass('visible').children('div').velocity(animationParams[0], animationParams[3], animationParams[4], function(){
					animating = false;
					if (hijacking === 'off') $(window).on('scroll', scrollAnimation);
				});
			actual--;
		}
		resetScroll();
	}

	function nextSection(event) {
		if (scrollLocked) return;
		typeof event !== 'undefined' && event.preventDefault();

		var visibleSection = sectionsAvailable.filter('.visible'),
			middleScroll = (hijacking === 'off' && $(window).scrollTop() !== visibleSection.offset().top);

		var animationParams = ['translateNone', 'translateUp.half', 'translateDown', 700, 'easeInCubic'];

		unbindScroll(visibleSection.next('.cd-section'), animationParams[3]);

		if (!animating && !visibleSection.is(':last-of-type')) {
			animating = true;
			visibleSection.removeClass('visible').children('div').velocity(animationParams[1], animationParams[3], animationParams[4])
				.end().next('.cd-section').addClass('visible').children('div').velocity(animationParams[0], animationParams[3], animationParams[4], function(){
					animating = false;
					checkShowreelTrigger();
					if (hijacking === 'off') $(window).on('scroll', scrollAnimation);
				});
			actual++;
		}
		resetScroll();
	}

	function unbindScroll(section, time) {
		if (hijacking === 'off') {
			$(window).off('scroll', scrollAnimation);
			section.velocity("scroll", { duration: time });
		}
	}

	function resetScroll() {
		delta = 0;
		checkNavigation();
	}

	function checkNavigation() {
		sectionsAvailable.filter('.visible').is(':first-of-type') ? prevArrow.addClass('inactive') : prevArrow.removeClass('inactive');
		sectionsAvailable.filter('.visible').is(':last-of-type') ? nextArrow.addClass('inactive') : nextArrow.removeClass('inactive');
	}

	function resetSectionStyle() {
		sectionsAvailable.children('div').attr('style', '');
	}

	function deviceType() {
		return window.getComputedStyle(document.querySelector('body'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
	}

	function setSectionAnimationParallax(sectionOffset, windowHeight) {
		var translateY = 100;

		if (sectionOffset >= -windowHeight && sectionOffset <= 0) {
			translateY = (-sectionOffset) * 100 / windowHeight;
		} else if (sectionOffset > 0 && sectionOffset <= windowHeight) {
			translateY = (-sectionOffset) * 50 / windowHeight;
		} else if (sectionOffset < -windowHeight) {
			translateY = 100;
		} else {
			translateY = -50;
		}

		return [translateY, 1, '0deg', 1, 0];
	}

/* ======================
MENU NAVIGATION
====================== */

$('.menu-item').on('click', function(){

    scrollLocked = false;

    const target = parseInt($(this).data('section'));

    function move(){

        if(actual < target){
            nextSection();
            setTimeout(move, 750);
        }

        else if(actual > target){
            prevSection();
            setTimeout(move, 750);
        }

    }

    move();

});

$('.menu-logo').on('click', function(){

    scrollLocked = false;

    function move(){

        if(actual > 1){
            prevSection();
            setTimeout(move, 750);
        }

    }

    move();

});

$('.showreel-btn').on('click', function(e){

    e.preventDefault();

    const target = 2; 

    function move(){

        if(actual > target){
            prevSection();
            setTimeout(move, 750);
        }

    }

    move();

});

});

$.Velocity.RegisterEffect("translateUp", { defaultDuration: 1, calls: [[{ translateY: '-100%' }, 1]] });
$.Velocity.RegisterEffect("translateDown", { defaultDuration: 1, calls: [[{ translateY: '100%' }, 1]] });
$.Velocity.RegisterEffect("translateNone", { defaultDuration: 1, calls: [[{ translateY: '0', opacity: '1', scale: '1', rotateX: '0', boxShadowBlur: '0' }, 1]] });
$.Velocity.RegisterEffect("translateUp.half", { defaultDuration: 1, calls: [[{ translateY: '-50%' }, 1]] });



const container = document.querySelector('.center-content');
const videos = document.querySelectorAll('.hover-video');

container.addEventListener('mouseenter', () => {
	videos.forEach(video => {
		video.currentTime = 0;
		video.play();
	});
});

container.addEventListener('mouseleave', () => {
	videos.forEach(video => {
		video.pause();
	});
});

const logo = document.querySelector('.logo-normal');
const hero = document.querySelector('.hero');

logo.addEventListener('click', () => {


    hero.classList.add('locked');
    scrollLocked = false;

    document.body.classList.add('menu-visible');

});

/* =========================
   GALLERY 
========================= */

const track = document.querySelector('.gallery-track');
const gallery = document.querySelector('.gallery');

let cards = [];
let hasActiveCard = false;
let infiniteInitialized = false;

/* play video safely */
function forcePlayVideo(video) {
    if (!video) return;
    video.muted = true;
    video.playsInline = true;
    video.play().catch(()=>{});
}

/* card expand */
function centerCard(card) {

    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    const cardCenter = cardRect.left + cardRect.width / 2;
    const trackCenter = trackRect.left + trackRect.width / 2;

    const offset = cardCenter - trackCenter;

    track.scrollBy({
        left: offset,
        behavior: 'smooth'
    });
}

function setupCardClicks() {

    const originalsCount = cards.length / 3;

    cards.forEach((card, index) => {

        card.addEventListener('click', e => {
            e.stopPropagation();

            const logicalIndex = index % originalsCount;

            // find the card in the MIDDLE set
            const middleIndex = logicalIndex + originalsCount;
            const middleCard = track.children[middleIndex];

            const alreadyActive = middleCard.classList.contains('active');

            // remove all actives
            cards.forEach(c => c.classList.remove('active'));
            hasActiveCard = false;

            if (!alreadyActive) {

                middleCard.classList.add('active');
                hasActiveCard = true;

                forcePlayVideo(middleCard.querySelector('video'));

                centerCard(middleCard);
            }
        });
    });
}

/* click outside closes card */
gallery?.addEventListener('click', () => {
    if (!hasActiveCard) return;
    cards.forEach(c => c.classList.remove('active'));
    hasActiveCard = false;
});

/* infinite horizontal carousel */
function initInfiniteScroll() {
    if (!track || infiniteInitialized) return;
    infiniteInitialized = true;

    const originals = Array.from(track.children);
    const originalCount = originals.length;

    /* clone right */
    originals.forEach(card => track.appendChild(card.cloneNode(true)));

    /* clone left */
    const leftFragment = document.createDocumentFragment();
    originals.forEach(card => leftFragment.appendChild(card.cloneNode(true)));
    track.insertBefore(leftFragment, track.firstChild);

    cards = Array.from(track.children);
    setupCardClicks();

    const cardWidth = originals[0].offsetWidth;
    const gap = parseInt(getComputedStyle(track).gap) || 0;
    const setWidth = originalCount * (cardWidth + gap);

    track.scrollLeft = setWidth;

   track.addEventListener('scroll', () => {

    const totalWidth = setWidth;
    const leftBoundary = totalWidth * 0.5;
    const rightBoundary = totalWidth * 2.5;

    if (track.scrollLeft <= leftBoundary) {
        track.scrollLeft += totalWidth;
    }

    if (track.scrollLeft >= rightBoundary) {
        track.scrollLeft -= totalWidth;
    }

});

    /* enable touch horizontal scroll */
    if (isTouch) {
        track.style.overflowX = 'auto';
        track.style.scrollSnapType = 'x mandatory';
    }
}
function checkShowreelTrigger() {

    const section = document.querySelector('.cd-section:nth-of-type(2)');
    if (!section || !section.classList.contains('visible')) return;

    if (section.dataset.animated === "true") return; // prevent rerun
    section.dataset.animated = "true";

    const layer = section.querySelector('.showreel-transition');
    if (!layer) return;

    setTimeout(() => {

        document.body.classList.add('state-showreel-confirm');

        setTimeout(() => {
            document.body.classList.add('state-showreel-leave');
        }, 1800);

        setTimeout(() => {
            document.body.classList.add('state-gallery');
            layer.style.pointerEvents = 'none';
        }, 2600);

    }, 300);
}
/* auto start gallery if page has it */
initInfiniteScroll();

