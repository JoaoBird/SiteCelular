document.addEventListener('DOMContentLoaded', function() {
    const slidesContainer = document.querySelector('.slides');
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelector('.indicators');

    if (!slides.length || !slidesContainer) {
        return;
    }

    let currentSlide = 0;

    if (indicators) {
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === currentSlide) dot.classList.add('active');
            dot.onclick = () => showSlide(index);
            indicators.appendChild(dot);
        });
    }

    function updateIndicators() {
        const dots = document.querySelectorAll('.dot');
        if (dots.length) {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentSlide].classList.add('active');
        }
    }

    function showSlide(index) {
        if (!slidesContainer) return;
        
        const totalSlides = slides.length;
        currentSlide = (index + totalSlides) % totalSlides;
        const offset = -currentSlide * 100;
        slidesContainer.style.transform = `translateX(${offset}%)`;
        slidesContainer.style.transition = 'transform 0.5s ease'; // Adiciona transição suave
        updateIndicators();
    }

    if (slides.length > 1) {
        setInterval(() => showSlide(currentSlide + 1), 3000);
    }

    showSlide(currentSlide);

    const dropdownToggle = document.querySelector('.dropdown-toggle');
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;
            if (dropdown) {
                dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
            }
        });

        // Fecha o dropdown ao clicar fora
        document.addEventListener('click', function(e) {
            if (!dropdownToggle.contains(e.target) && dropdownToggle.nextElementSibling && dropdownToggle.nextElementSibling.style.display === "block") {
                dropdownToggle.nextElementSibling.style.display = "none";
            }
        });
    }
});