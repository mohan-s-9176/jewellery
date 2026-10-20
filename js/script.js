
const slides = document.querySelectorAll(".background-slide");
const thumbnails = document.querySelectorAll(".thumbnail");
const currentSlideText = document.getElementById("current-slide");

let currentIndex = 0;
let slideInterval;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
    });

    thumbnails.forEach((thumbnail, i) => {
        thumbnail.classList.toggle("active", i === index);
    });

    currentSlideText.textContent = String(index + 1).padStart(2, "0");

    currentIndex = index;
}

function startSlideshow() {
    clearInterval(slideInterval);

    slideInterval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
    }, 6000);
}

thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
        const index = Number(thumbnail.dataset.slide);

        showSlide(index);
        startSlideshow();
    });
});

showSlide(0);
startSlideshow();
