import { Pane } from 'https://cdn.skypack.dev/tweakpane@4.0.4'
import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger);

const config = {
  theme: 'dark',
  animate: true,
  start: gsap.utils.random(0, 100, 1),
  end: gsap.utils.random(900, 1000, 1),
  scroll: true,
  snap: false,
  debug: false
}

let items = [];
let scrollerScrub;
let dimmerScrub;
let chromaEntry;
let chromaExit;
let paneElement;
let configVisible = false;

document.documentElement.setAttribute('data-theme', 'dark');

const update = () => {
  document.documentElement.dataset.theme = config.theme;
  document.documentElement.dataset.syncScrollbar = config.scroll;
  document.documentElement.dataset.animate = config.animate;
  document.documentElement.dataset.snap = config.snap;
  document.documentElement.dataset.debug = config.debug;
  document.documentElement.style.setProperty('--start', config.start);
  document.documentElement.style.setProperty('--hue', config.start);
  document.documentElement.style.setProperty('--end', config.end);
  
  if (items && items.length > 0) {
    if (!config.animate) {
      if (chromaEntry?.scrollTrigger) chromaEntry.scrollTrigger.disable(true, false);
      if (chromaExit?.scrollTrigger) chromaExit.scrollTrigger.disable(true, false);
      if (dimmerScrub) dimmerScrub.disable(true, false);
      if (scrollerScrub) scrollerScrub.disable(true, false);
      gsap.set(items, { opacity: 1 });
      gsap.set(document.documentElement, { '--chroma': 0 });
    } else {
      gsap.set(items, { opacity: (i) => (i !== 0 ? 0.2 : 1) });
      if (dimmerScrub) dimmerScrub.enable(true, true);
      if (scrollerScrub) scrollerScrub.enable(true, true);
      if (chromaEntry?.scrollTrigger) chromaEntry.scrollTrigger.enable(true, true);
      if (chromaExit?.scrollTrigger) chromaExit.scrollTrigger.enable(true, true);
    }
  }
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    !event.target.controller ||
    !event.target.controller.view ||
    !event.target.controller.view.labelElement ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update();
  
  document.startViewTransition(() => update());
}

function initializeGSAP() {
  if (!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
    items = gsap.utils.toArray('ul li');
    
    if (items && items.length > 0) {
      gsap.set(items, { opacity: (i) => (i !== 0 ? 0.2 : 1) });
    
      const dimmer = gsap
        .timeline()
        .to(items.slice(1), {
          opacity: 1,
          stagger: 0.5,
        })
        .to(
          items.slice(0, items.length - 1),
          {
            opacity: 0.2,
            stagger: 0.5,
          },
          0
        );
    
      dimmerScrub = ScrollTrigger.create({
        trigger: items[0],
        endTrigger: items[items.length - 1],
        start: 'center center',
        end: 'center center',
        animation: dimmer,
        scrub: 0.2,
      });
    
      const scroller = gsap.timeline().fromTo(
        document.documentElement,
        {
          '--hue': config.start,
        },
        {
          '--hue': config.end,
          ease: 'none',
        }
      );
    
      scrollerScrub = ScrollTrigger.create({
        trigger: items[0],
        endTrigger: items[items.length - 1],
        start: 'center center',
        end: 'center center',
        animation: scroller,
        scrub: 0.2,
      });
    
      chromaEntry = gsap.fromTo(
        document.documentElement,
        {
          '--chroma': 0,
        },
        {
          '--chroma': 0.3,
          ease: 'none',
          scrollTrigger: {
            scrub: 0.2,
            trigger: items[0],
            start: 'center center+=40',
            end: 'center center',
          },
        }
      );
      
      chromaExit = gsap.fromTo(
        document.documentElement,
        {
          '--chroma': 0.3,
        },
        {
          '--chroma': 0,
          ease: 'none',
          scrollTrigger: {
            scrub: 0.2,
            trigger: items[items.length - 2],
            start: 'center center',
            end: 'center center-=40',
          },
        }
      );
    }
  }
}



function initPane() {
  paneElement = document.querySelector('.tp-dfwv');
  if (paneElement) {
    paneElement.classList.remove('visible');
  }
}



// Load CSS
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'AutoStyle.css';
document.head.appendChild(link);

// Create config button
const configButton = document.createElement('button');
configButton.id = 'config-button';
configButton.innerHTML = `
<svg viewBox="-55 -55 110 110" width="36" height="36">
    <path id="cogwheel" d="M38.2 5.04c0.21,-1.65 0.36,-3.29 0.36,-5.04 0,-1.75 -0.15,-3.39 -0.36,-5.04l10.85 -8.48c0.98,-0.77 1.23,-2.16 0.62,-3.29l-10.28 -17.78c-0.47,-0.83 -1.34,-1.29 -2.27,-1.29 -0.3,0 -0.61,0.05 -0.87,0.15l-12.8 5.14c-2.67,-2.05 -5.55,-3.75 -8.69,-5.03l-1.95 -13.63c-0.15,-1.23 -1.23,-2.15 -2.52,-2.15l-20.56 0c-1.29,0 -2.36,0.92 -2.52,2.15l-1.95 13.63c-3.14,1.28 -6.02,3.03 -8.69,5.03l-12.8 -5.14c-0.31,-0.1 -0.61,-0.15 -0.92,-0.15 -0.88,0 -1.75,0.46 -2.22,1.29l-10.27 17.78c-0.67,1.13 -0.36,2.52 0.61,3.29l10.85 8.48c-0.21,1.65 -0.36,3.34 -0.36,5.04 0,1.69 0.15,3.39 0.36,5.04l-10.85 8.48c-0.97,0.77 -1.23,2.16 -0.61,3.29l10.27 17.78c0.47,0.83 1.34,1.29 2.27,1.29 0.31,0 0.61,-0.05 0.87,-0.15l12.8 -5.15c2.67,2.06 5.55,3.76 8.69,5.04l1.95 13.62c0.16,1.24 1.23,2.16 2.52,2.16l20.56 0c1.29,0 2.37,-0.92 2.52,-2.16l1.95 -13.62c3.14,-1.28 6.02,-3.03 8.69,-5.04l12.8 5.15c0.31,0.1 0.62,0.15 0.93,0.15 0.87,0 1.74,-0.46 2.21,-1.29l10.28 -17.78c0.61,-1.13 0.36,-2.52 -0.62,-3.29l-10.85 -8.48zm-10.17 -8.79c0.2,1.59 0.25,2.67 0.25,3.75 0,1.08 -0.1,2.21 -0.25,3.75l-0.72 5.81 4.57 3.6 5.55 4.32 -3.6 6.22 -6.52 -2.63 -5.35 -2.15 -4.63 3.49c-2.21,1.64 -4.31,2.88 -6.42,3.75l-5.45 2.21 -0.82 5.81 -1.03 6.94 -7.2 0 -0.97 -6.94 -0.83 -5.81 -5.44 -2.21c-2.22,-0.92 -4.27,-2.11 -6.33,-3.65l-4.68 -3.59 -5.44 2.21 -6.53 2.62 -3.6 -6.22 5.55 -4.32 4.58 -3.6 -0.72 -5.81c-0.16,-1.59 -0.26,-2.77 -0.26,-3.8 0,-1.03 0.1,-2.21 0.26,-3.75l0.72 -5.81 -4.58 -3.6 -5.55 -4.32 3.6 -6.22 6.53 2.62 5.34 2.16 4.63 -3.49c2.21,-1.65 4.32,-2.88 6.42,-3.76l5.45 -2.21 0.82 -5.8 1.03 -6.94 7.15 0 0.98 6.94 0.82 5.8 5.45 2.21c2.21,0.93 4.26,2.11 6.32,3.65l4.68 3.6 5.44 -2.21 6.53 -2.62 3.6 6.22 -5.5 4.37 -4.57 3.6 0.72 5.81zm-28.02 -16.81c-11.36,0 -20.56,9.2 -20.56,20.56 0,11.36 9.2,20.56 20.56,20.56 11.36,0 20.56,-9.2 20.56,-20.56 0,-11.36 -9.2,-20.56 -20.56,-20.56zm0 30.84c-5.65,0 -10.28,-4.63 -10.28,-10.28 0,-5.66 4.63,-10.28 10.28,-10.28 5.66,0 10.28,4.62 10.28,10.28 0,5.65 -4.62,10.28 -10.28,10.28z"></path>
</svg>
`;


const configStyles = `
  #config-button {
    position: fixed;
    top: clamp(10px, 2vw, 20px);
    right: clamp(10px, 2vw, 20px);
    background: transparent;
    border: none;
    padding: clamp(5px, 1vw, 10px);
    border-radius: 50%;
    aspect-ratio: 1 / 1;
    z-index: 10000;
    transition: transform 0.3s ease-in-out, background-color 0.3s ease;
    overflow: hidden;
  }

  #config-button:hover {
    transform: rotate(45deg);
    background-color: rgba(255, 255, 255, 0.1);
  }

  #config-button svg {
    width: clamp(24px, 4vw, 36px);
    height: clamp(24px, 4vw, 36px);
    transition: color 0.3s ease-in-out;
  }
  
  #config-button path {
    transition: fill 0.3s ease-in-out;
  }

  #cogwheel {
    animation: rotate-gear 12s linear infinite;
    transform-origin: center;
  }

  [data-theme="dark"] #config-button path {
    fill: rgba(255, 255, 255, 0.9);
  }

  [data-theme="light"] #config-button path {
    fill: rgba(0, 0, 0, 0.9);
  }

  [data-theme="dark"] #config-button:hover path {
    fill: rgba(0, 0, 0, 0.9);
  }

  [data-theme="light"] #config-button:hover path {
    fill: rgba(255, 255, 255, 0.9);
  }
`;

const configStyle = document.createElement('style');
configStyle.type = 'text/css';
configStyle.innerText = configStyles;
document.head.appendChild(configStyle);



// Create pane controls
const ctrl = new Pane({
  title: 'Settings',
  expanded: true,
});

ctrl.addBinding(config, 'animate', {
  label: 'Effect',
});

ctrl.addBinding(config, 'scroll', {
  label: 'Scroll',
});

ctrl.addBinding(config, 'start', {
  label: 'Hue Start',
  min: 0,
  max: 1000,
  step: 1,
});

ctrl.addBinding(config, 'end', {
  label: 'Hue End',
  min: 0,
  max: 1000,
  step: 1,
});

ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    Light: 'light',
    Dark: 'dark',
  },
});

ctrl.on('change', sync);

configButton.addEventListener('click', function() {
  if (!paneElement) {
    paneElement = document.querySelector('.tp-dfwv');
  }
  
  if (paneElement) {
    configVisible = !configVisible;
    if (configVisible) {
      paneElement.classList.add('visible');
      document.querySelector('#cogwheel').style.animationPlayState = 'paused';
    } else {
      paneElement.classList.remove('visible');
      document.querySelector('#cogwheel').style.animationPlayState = 'running';
    }
  }
});



document.addEventListener('DOMContentLoaded', () => {
  const customCursor = document.createElement('div');
  customCursor.className = 'custom-cursor';
  
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  
  customCursor.appendChild(cursorDot);
  document.body.appendChild(customCursor);
  
  document.addEventListener('mousemove', (e) => {
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;
  });
  
  document.addEventListener('mousedown', () => {
    customCursor.classList.add('clicking');
  });
  
  document.addEventListener('mouseup', () => {
    customCursor.classList.remove('clicking');
  });
  
  window.addEventListener('load', () => {
    document.body.style.cursor = 'none';
  });
  
  document.addEventListener('mouseleave', () => {
    customCursor.style.display = 'none';
  });
  
  document.addEventListener('mouseenter', () => {
    customCursor.style.display = 'block';
  });
});

document.addEventListener("DOMContentLoaded", () => {
    const configButton = document.getElementById("config-button");
    const theme = document.body.classList.contains("dark-theme") ? "dark" : "light";

    function updateHoverColor() {
        if (document.body.classList.contains("dark-theme")) {
            document.documentElement.style.setProperty("--icon-hover-color", "black");
        } else {
            document.documentElement.style.setProperty("--icon-hover-color", "white");
        }
    }

    configButton.addEventListener("mouseenter", updateHoverColor);
    configButton.addEventListener("mouseleave", updateHoverColor);

    const observer = new MutationObserver(updateHoverColor);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
});

const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
  :root {
    cursor: none;
  }
  
  .custom-cursor {
    position: fixed;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
    background-color: white;
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s;
  }
  
  .cursor-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    background-color: black;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    mix-blend-mode: difference; 
  }
  
  .custom-cursor.clicking {
    width: 24px;
    height: 24px;
  }
  
  * {
    cursor: none !important;
  }
  
  a, button, input, select, textarea, [role="button"] {
    cursor: none;
  }
`;
document.head.appendChild(cursorStyle);





document.addEventListener("DOMContentLoaded", function() {
    const dotNavigation = document.querySelector(".dot-navigation");
    const dragButton = document.querySelector(".drag-handle");
    const dotItems = document.querySelectorAll('.dot-nav__item');

    let isDragging = false;
    let startX, startY, initialX, initialY;
    let isVertical = true;
    let isHighlighted = false;
    
    const menuStyle = document.createElement('style');
    menuStyle.textContent = `
      @layer menu {
        .dot-navigation {
          transition: transform 0.3s ease;
        }
        
        .dot-navigation.vertical {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .dot-navigation.horizontal {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        
        .dot-navigation.dragging {
          transition: none;
        }
        
        .dot-navigation.scrolled-to-footer {
          transition: box-shadow 0.7s ease-in-out, background 0.7s ease-in-out;
        }
        
        .dot-navigation.fade-out {
          opacity: 1;
          box-shadow: 0 0 0 transparent !important;
          transition: opacity 0.7s ease-in-out, box-shadow 0.7s ease-in-out;
        }
      }
    `;
    document.head.appendChild(menuStyle);
    
    dotNavigation.classList.add("vertical");
    dotNavigation.classList.add("right-side");

    function getPosition() {
        const rect = dotNavigation.getBoundingClientRect();
        return {
            left: rect.left,
            top: rect.top,
            right: window.innerWidth - rect.right,
            bottom: window.innerHeight - rect.bottom,
            width: rect.width,
            height: rect.height
        };
    }

    function detectEdgeProximity() {
        const pos = getPosition();
        const threshold = 80;
        
        const nearTop = pos.top < threshold;
        const nearBottom = pos.bottom < threshold;
        const nearLeft = pos.left < threshold;
        const nearRight = pos.right < threshold;
        
        if (nearTop || nearBottom) {
            return "horizontal";
        }
        
        if (nearLeft || nearRight) {
            return "vertical";
        }
        
        return isVertical ? "vertical" : "horizontal";
    }

    function toggleOrientation(e) {
        isVertical = !isVertical;
        updateOrientationClasses();
        updatePositionSideClasses();
        e?.preventDefault();
    }
    
    function updateOrientationClasses() {
        if (isVertical) {
            dotNavigation.classList.add("vertical");
            dotNavigation.classList.remove("horizontal");
        } else {
            dotNavigation.classList.add("horizontal");
            dotNavigation.classList.remove("vertical"); 
        }
    }

    function updatePositionSideClasses() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const rect = dotNavigation.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        dotNavigation.classList.remove("left-side", "right-side", "top-side", "bottom-side");
        
        if (isVertical) {
            if (centerX < vw / 2) {
                dotNavigation.classList.add("left-side");
            } else {
                dotNavigation.classList.add("right-side");
            }
        } else {
            if (centerY < vh / 2) {
                dotNavigation.classList.add("top-side");
            } else {
                dotNavigation.classList.add("bottom-side");
            }
        }
    }

    function startDrag(e) {
        isDragging = true;
        
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        startY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const pos = getPosition();
        initialX = pos.left;
        initialY = pos.top;
        
        dotNavigation.classList.add("dragging");
        
        dotNavigation.style.position = "fixed";
        dotNavigation.style.margin = "0";
        dotNavigation.style.left = pos.left + "px";
        dotNavigation.style.top = pos.top + "px";
        dotNavigation.style.right = "auto";
        dotNavigation.style.bottom = "auto";
        dotNavigation.style.transform = "none";
        
        e.stopPropagation();
        e.preventDefault();
    }

    function moveDrag(e) {
        if (!isDragging) return;
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        
        let newX = initialX + deltaX;
        let newY = initialY + deltaY;
        
        const pos = getPosition();
        newX = Math.max(0, Math.min(newX, window.innerWidth - pos.width));
        newY = Math.max(0, Math.min(newY, window.innerHeight - pos.height));
        
        dotNavigation.style.left = newX + "px";
        dotNavigation.style.top = newY + "px";
        
        const suggestedOrientation = detectEdgeProximity();
        if ((suggestedOrientation === "horizontal" && isVertical) || 
            (suggestedOrientation === "vertical" && !isVertical)) {
            isVertical = suggestedOrientation === "vertical";
            updateOrientationClasses();
        }
        
        updatePositionSideClasses();
        
        e.stopPropagation();
        e.preventDefault();
    }

    function stopDrag(e) {
        if (!isDragging) return;
        
        isDragging = false;
        dotNavigation.classList.remove("dragging");
        
        const pos = getPosition();
        dotNavigation.style.position = "fixed";
        dotNavigation.style.left = pos.left + "px";
        dotNavigation.style.top = pos.top + "px";
        
        updatePositionSideClasses();
        
        e?.stopPropagation();
        e?.preventDefault();
    }

    dragButton.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", moveDrag);
    document.addEventListener("mouseup", stopDrag);

    dragButton.addEventListener("touchstart", startDrag);
    document.addEventListener("touchmove", moveDrag);
    document.addEventListener("touchend", stopDrag);

    dragButton.addEventListener("dblclick", toggleOrientation);
    
    let lastTap = 0;
    dragButton.addEventListener("touchend", function(e) {
        if (!isDragging) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 300 && tapLength > 0) {
                toggleOrientation(e);
            }
            lastTap = currentTime;
        }
    });

    const pageLinks = {
        'skills-section': 'Home.html',
        'experience-section': 'Experience.html',
        'education-section': 'Education.html',
        'projects-section': 'Projects.html'
    };

    dotItems.forEach(dot => {
        dot.addEventListener('click', function() {
            const targetPage = pageLinks[this.dataset.section];
            if (targetPage) window.location.href = targetPage;
        });
    });

    const currentPath = window.location.pathname.split('/').pop();
    for (const [section, page] of Object.entries(pageLinks)) {
        if (currentPath === page) {
            document.querySelector(`.dot-nav__item[data-section="${section}"]`)?.classList.add('active');
        }
    }

    window.addEventListener("scroll", function() {
        const taskHeading = document.querySelector(".task-section h2, .task-section .section-heading, .task-section .section-title");
        
        if (taskHeading) {
            const headingRect = taskHeading.getBoundingClientRect();
            const isHeadingVisible = 
                headingRect.top >= 0 && 
                headingRect.bottom <= window.innerHeight;
            
            if (isHeadingVisible && !isHighlighted) {
                dotNavigation.classList.add("scrolled-to-footer");
                dotNavigation.classList.remove("fade-out");
                isHighlighted = true;
            } 
            else if (!isHeadingVisible && isHighlighted) {
                dotNavigation.classList.add("fade-out");
                
                setTimeout(() => {
                    dotNavigation.classList.remove("scrolled-to-footer");
                    isHighlighted = false;
                }, 700);
            }
        }
    });
    
    updatePositionSideClasses();
    
    window.addEventListener("resize", updatePositionSideClasses);
});

  
document.body.appendChild(configButton);

initPane();
initializeGSAP();
update();
