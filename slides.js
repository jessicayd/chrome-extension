document.getElementById("prev").addEventListener("click", function() {
    moveSlides(-1);
});

document.getElementById("next").addEventListener("click", function() {
    moveSlides(1);
});

document.getElementById("dot1").addEventListener("click", function() {
    currentSlides(1);
});

document.getElementById("dot2").addEventListener("click", function() {
    currentSlides(2);
});

let slideIndex = 1;
if (localStorage.getItem('slideIndex') != null) slideIndex = localStorage.getItem('slideIndex');

function moveSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlides(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    localStorage.setItem('slideIndex', slideIndex);
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {
        slideIndex = 1
        localStorage.setItem('slideIndex', slideIndex);
    }

    if (n < 1) {
        slideIndex = slides.length;
        localStorage.setItem('slideIndex', slideIndex);
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }

    slides[slideIndex-1].style.display = "flex";
    dots[slideIndex-1].classList.add("active");
}



showSlides(slideIndex);

