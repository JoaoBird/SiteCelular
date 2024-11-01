SCRIPT JS 
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelector('.indicators');

// Cria os indicadores
slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (index === currentSlide) dot.classList.add('active');
    dot.onclick = () => showSlide(index);
    indicators.appendChild(dot);
});

function updateIndicators() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
}

function showSlide(index) {
    const totalSlides = slides.length;
    currentSlide = (index + totalSlides) % totalSlides; // Garante que o índice esteja no intervalo
    const offset = -currentSlide * 100; // Cada slide ocupa 100% da largura
    document.querySelector('.slides').style.transform = translateX(${offset}%);
    updateIndicators();
}

// Mudar slide automaticamente a cada 3 segundos
setInterval(() => showSlide(currentSlide + 1), 3000);

// Exibir a última imagem ao lado da primeira
document.addEventListener('DOMContentLoaded', () => {
    showSlide(currentSlide); // Mostra o slide inicial
});