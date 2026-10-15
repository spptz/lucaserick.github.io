const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

// Inicializar animações (AOS)
AOS.init({
    once: true,
    offset: 100,
    duration: 800,
    easing: 'ease-out-cubic',
    disable: prefersReducedMotion,
});

// Sombra na navbar ao dar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('shadow-lg', window.scrollY > 20);
}, { passive: true });

// Menu Mobile (Toggle)
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function setMobileMenuOpen(isOpen) {
    menu.classList.toggle('hidden', !isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
}

btn.addEventListener('click', () => {
    setMobileMenuOpen(menu.classList.contains('hidden'));
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        setMobileMenuOpen(false);
    });
});

// Carrossel de projetos (scroll nativo; as setas avançam um card por vez)
const projectTrack = document.getElementById('project-track');
const projectCards = Array.from(document.querySelectorAll('.project-card'));
const projectPrev = document.getElementById('project-prev');
const projectNext = document.getElementById('project-next');

function getProjectStep() {
    if (!projectTrack || projectCards.length === 0) {
        return 0;
    }

    const firstCard = projectCards[0];
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(projectTrack).columnGap || getComputedStyle(projectTrack).gap || '0');
    return cardWidth + gap;
}

function updateProjectButtons() {
    if (!projectTrack || !projectPrev || !projectNext) {
        return;
    }

    const maxScrollLeft = projectTrack.scrollWidth - projectTrack.clientWidth;
    projectPrev.disabled = projectTrack.scrollLeft <= 1;
    projectNext.disabled = projectTrack.scrollLeft >= maxScrollLeft - 1;
}

if (projectTrack && projectPrev && projectNext) {
    projectPrev.addEventListener('click', () => {
        projectTrack.scrollBy({ left: -getProjectStep(), behavior: scrollBehavior });
    });

    projectNext.addEventListener('click', () => {
        projectTrack.scrollBy({ left: getProjectStep(), behavior: scrollBehavior });
    });

    projectTrack.addEventListener('scroll', updateProjectButtons, { passive: true });
    window.addEventListener('resize', updateProjectButtons);
}

updateProjectButtons();

// Rola até a seção descontando a altura da navbar fixa ao clicar nos links do cabeçalho.
const headerLinks = document.querySelectorAll('nav a[href^="#"], #trajetoria-btn');

function getTopScrollY(targetSection) {
    const navHeight = navbar ? navbar.offsetHeight : 0;
    const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;
    const extraOffset = isMobileViewport ? 96 : 48;
    const topY = targetSection.getBoundingClientRect().top + window.scrollY - navHeight - extraOffset;
    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
    return Math.min(maxScrollY, Math.max(0, topY));
}

headerLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        const hash = link.getAttribute('href');

        if (!hash || hash.length <= 1) {
            return;
        }

        const targetSection = document.querySelector(hash);
        if (!targetSection) {
            return;
        }

        event.preventDefault();

        window.scrollTo({
            top: getTopScrollY(targetSection),
            behavior: scrollBehavior
        });

        history.replaceState(null, '', hash);
    });
});

// Máquina de escrever (Typing Effect)
const texts = [
    "Engenharia de Software", 
    "Desenvolvimento FullStack",  
    "Análise de Dados"
];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";
let isDeleting = false;
const typingElement = document.getElementById('typing-text');

function type() {
    if (count === texts.length) {
        count = 0;
    }
    currentText = texts[count];

    if (isDeleting) {
        letter = currentText.slice(0, --index);
    } else {
        letter = currentText.slice(0, ++index);
    }

    typingElement.textContent = letter;

    let typeSpeed = 100;

    if (isDeleting) {
        typeSpeed /= 2;
    }

    if (!isDeleting && letter.length === currentText.length) {
        typeSpeed = 2000; // Tempo de pausa com a palavra completa
        isDeleting = true;
    } else if (isDeleting && letter.length === 0) {
        isDeleting = false;
        count++;
        typeSpeed = 500; // Tempo antes de começar a próxima palavra
    }

    setTimeout(type, typeSpeed);
}

// Iniciar efeito de digitação após 1 segundo (texto fixo se o usuário pediu menos movimento)
if (prefersReducedMotion) {
    typingElement.textContent = texts[0];
} else {
    setTimeout(type, 1000);
}
