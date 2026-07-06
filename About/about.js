$(document).ready(function(){
    $(window).scroll(function(){
        // sticky navbar on scroll script
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky");
        }else{
            $('.navbar').removeClass("sticky");
        }
        
        // scroll-up button show/hide script
        if(this.scrollY > 500){
            $('.scroll-up-btn').addClass("show");
        }else{
            $('.scroll-up-btn').removeClass("show");
        }
    });

    // slide-up script
    $('.scroll-up-btn').click(function(){
        $('html').animate({scrollTop: 0});
        // removing smooth scroll on slide-up button click
        $('html').css("scrollBehavior", "auto");
    });

    $('.navbar .menu li a').click(function(){
        // applying again smooth scroll on menu items click
        $('html').css("scrollBehavior", "smooth");
    });

    // toggle menu/navbar script
    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    });

});

// Dark Mode toggle
const toggle = document.getElementById('toggle');
const body = document.body;

toggle.addEventListener('input', e => {
    const isChecked = e.target.checked;

    if (isChecked) {
        body.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
    }
});

  const images = ['aboutmemainpic.jpg', 'esportsgroupphoto.jpg', 'awards.jpg', 'SHPromiseClubPhoto.png'];
  const aboutSection = document.querySelector('.home');
  const homeBg = document.querySelector('.home-bg');
  const dotsContainer = document.getElementById('dots-container');
   const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  let currentIndex = 0;
  let intervalId;
  let fadeTimeout;


  images.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      showSlide(i);
      resetInterval();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  function showSlide(index) {
    currentIndex = index;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');

    if (!homeBg.classList.contains('visible')) {
      homeBg.style.backgroundImage = `url(${images[currentIndex]})`;
      homeBg.classList.add('visible');
      return;
    }

    homeBg.classList.remove('visible');
    clearTimeout(fadeTimeout);
    fadeTimeout = setTimeout(() => {
      homeBg.style.backgroundImage = `url(${images[currentIndex]})`;
      homeBg.classList.add('visible');
    }, 250);
  }

 function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showSlide(currentIndex);
  }

  function resetInterval() {
    clearInterval(intervalId);
    intervalId = setInterval(nextSlide, 5000);
  }

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetInterval();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetInterval();
  });

  // Start the slideshow
  showSlide(currentIndex);
  intervalId = setInterval(nextSlide, 3000);
