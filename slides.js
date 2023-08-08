document.getElementById("prev").addEventListener("click", function() {
    moveSlides(-1);
});

document.getElementById("next").addEventListener("click", function() {
    moveSlides(1);
});

document.getElementById("dot1").addEventListener("click", function() {
    currentSlide(1);
});

document.getElementById("dot2").addEventListener("click", function() {
    currentSlide(2);
});

let slideIndex = 1;

function moveSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {
        slideIndex = 1
    }

    if (n < 1) {
        slideIndex = slides.length
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }

    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].classList.add("active");
}



showSlides(slideIndex);
