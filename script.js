

window.addEventListener("load", () => {

    const animations = [
        { selector: ".top-tags", class: "from-top", delay: 0 },
        { selector: ".left h1", class: "from-left", delay: 0.3 },
        { selector: ".desc", class: "from-left", delay: 0.6 },
        { selector: ".live-line", class: "from-bottom", delay: 0.9 },
        { selector: ".buttons", class: "zoom-in", delay: 1.2 },
        { selector: ".site-link", class: "from-bottom", delay: 1.5 },
        { selector: ".right", class: "from-right", delay: 0.6 },
        { selector: ".stats", class: "from-bottom", delay: 1.8 },
    ];

    animations.forEach(item => {
        const el = document.querySelector(item.selector);
        if (el) {
            el.style.animationDelay = `${item.delay}s`;
            el.classList.add(item.class);
        }
    });

    // ===== HIDE INTRO (PREMIUM GSAP TRANSITION) =====
    setTimeout(() => {
        const intro = document.getElementById("intro");
        const site = document.getElementById("real-site");

        // Lock the intro over the screen so the site can load underneath it without layout jumping
        intro.style.position = "fixed";
        intro.style.top = "0";
        intro.style.left = "0";
        intro.style.width = "100%";
        intro.style.zIndex = "9999";

        // Unhide site but keep it invisible for animation
        site.style.display = "block";
        
        if (typeof gsap !== 'undefined') {
            gsap.set(site, { opacity: 0, y: 100, scale: 0.95 });

            // Fade out intro with blur
            gsap.to(intro, {
                opacity: 0,
                scale: 1.1,
                filter: "blur(20px)",
                duration: 1.5,
                ease: "power2.inOut",
                onComplete: () => {
                    intro.style.display = "none";
                }
            });

            // Reveal site gracefully at the same time
            gsap.to(site, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 2,
                delay: 0.3, // Slight delay for overlap
                ease: "power3.out",
                onComplete: () => {
                    initScrollAnimations(); 
                }
            });
        } else {
            // Fallback if GSAP is somehow not loaded yet
            intro.style.display = "none";
            initScrollAnimations();
        }
    }, 3200); // Trigger slightly earlier for better UX
});


// ===============================
// SCROLL REVEAL (SECTIONS)
// ===============================
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn("GSAP or ScrollTrigger not loaded");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Reset old classes
    gsap.set(".slide-in-left, .slide-in-right, .slide-in-up, .reveal", { 
        opacity: 1, 
        x: 0, 
        y: 0, 
        transform: "none",
        filter: "blur(0px)"
    });

    const sections = document.querySelectorAll("section");

    sections.forEach((section, i) => {
        // Create a single timeline for the section's entire lifecycle on screen
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 90%",   // Start timeline when section enters the viewport
                end: "bottom 10%",  // End timeline when section leaves the viewport
                scrub: 1.5          // Smooth scrubbing
            }
        });

        if (i !== 0) {
            // 1. ENTER (takes up 25% of the scroll distance)
            tl.fromTo(section, 
                { opacity: 0, y: 80, scale: 0.95, filter: "blur(8px)" },
                { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "power2.out" }
            );
        } else {
            // First section is already visible, so we just add a placeholder duration
            tl.to({}, { duration: 1.5 });
        }

        // 2. STAY VISIBLE (takes up 50% of the scroll distance, no fading or moving)
        tl.to(section, { opacity: 1, y: 0, scale: 1, duration: 3 });

        // 3. EXIT (takes up 25% of the scroll distance as it leaves)
        tl.to(section, { 
            opacity: 0, 
            y: -80, 
            scale: 0.95, 
            filter: "blur(8px)", 
            duration: 1.5, 
            ease: "power2.in" 
        });
    });
}


// ===============================

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".ul-list li");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute("id");
        }
    });

    navItems.forEach(item => {
        item.classList.remove("active");

        const link = item.querySelector("a");
        if (link && link.getAttribute("href") === `#${current}`) {
            item.classList.add("active");
        }
    });
});

// ===============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            window.scrollTo({
                top: target.offsetTop - 120,
                behavior: "smooth"
            });
        }
    });
});
