let currentSlide = 0;
const slides = document.getElementsByClassName('slide');
const btn_next = document.querySelector('.next');
const btn_prev = document.querySelector('.prev');
const btn = document.getElementById('btn_test');
const containerslides=document.querySelector('.slides-container');

console.log(containerslides.children)
array.forEach(element => {
  
});
function showSlide(index) {
  const totalSlides = slides.length;
  currentSlide = (index + totalSlides) % totalSlides; 
  const offset = -currentSlide * 100;
  document.querySelector('.slides-container').style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}


btn_next.addEventListener('click', nextSlide);  
btn_prev.addEventListener('click', prevSlide);  


setInterval(nextSlide, 3000);
//as fotos estao no container, ent tenho que "tirar elas" do container e passar para as proximas 