/*global $, document, window, setTimeout */

$(document).ready(function () {
    "use strict";
    
    var $slider = $(".gallery-slider");
    var $prevArrow = $(".prev-arrow");
    var $nextArrow = $(".next-arrow");
    var $pager = $(".pager");
    var currentSlide, totalSlides, slidesToShow, totalPages, currentPage, remainingSlides;
    
    // Инициализация Slick Slider
    $slider.slick({
        arrows: false,
        dots: false,
        infinite: false,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToScroll: 1,
                    slidesToShow: 1
                }
            }
        ],
        slidesToScroll: 3,
        slidesToShow: 3
    });

    // Функция для проверки корректности отображения слайдов
    function ensureCorrectSlides() {
        currentSlide = $slider.slick("slickCurrentSlide");
        totalSlides = $slider.find(".slick-slide").length;
        slidesToShow = $slider.slick("slickGetOption", "slidesToShow");
        
        // Если мы на последней странице и осталось меньше слайдов, 
        // чем slidesToShow
        if (currentSlide >= totalSlides - slidesToShow && 
            window.innerWidth > 768) {
            remainingSlides = totalSlides - currentSlide;
            
            // Если осталось только 2 слайда, убедимся что показываем именно их
            if (remainingSlides === 2) {
                // Логирование для отладки
                console.log("Showing last 2 slides");
            }
        }
    }

    // Функция для обновления пейджера и состояния стрелок
    function updateControls() {
        currentSlide = $slider.slick("slickCurrentSlide");
        totalSlides = $slider.find(".slick-slide").length;
        slidesToShow = $slider.slick("slickGetOption", "slidesToShow");
        
        // Рассчитываем общее количество страниц
        totalPages = Math.ceil(totalSlides / slidesToShow);
        
        // Рассчитываем текущую страницу
        currentPage = Math.floor(currentSlide / slidesToShow) + 1;
        
        // Обновляем пейджер
        $pager.text(currentPage + " / " + totalPages);
        
        // Управление состоянием стрелок
        $prevArrow.prop("disabled", currentSlide === 0);
        $nextArrow.prop("disabled", currentSlide >= totalSlides - slidesToShow);
        
        // Проверяем корректность отображения слайдов
        ensureCorrectSlides();
    }

    // Обработчики для стрелок
    $prevArrow.on("click", function () {
        if (!$prevArrow.prop("disabled")) {
            $slider.slick("slickPrev");
        }
    });

    $nextArrow.on("click", function () {
        if (!$nextArrow.prop("disabled")) {
            $slider.slick("slickNext");
        }
    });

    // Обновление контролов при изменении слайда
    $slider.on("afterChange", function (event, slick, currentSlideNumber) {
        updateControls();
    });

    // Обновление контролов при изменении размера окна
    $(window).on("resize", function () {
        setTimeout(updateControls, 100);
    });

    // Инициализация при загрузке
    setTimeout(updateControls, 100);
});