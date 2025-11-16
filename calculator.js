// Функционал калькулятора и валидация
(function() {
    'use strict';
    
    // Инициализация валидации формы
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault();
                calculateTotal();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // Функция расчета стоимости
    function calculateTotal() {
        const productSelect = document.getElementById('productSelect');
        const quantityInput = document.getElementById('quantityInput');
        const totalCost = document.getElementById('totalCost');
        
        const price = parseInt(productSelect.value);
        const quantity = parseInt(quantityInput.value);
        
        if (!isNaN(price) && !isNaN(quantity) && quantity > 0) {
            const total = price * quantity;
            totalCost.textContent = total.toLocaleString('ru-RU');
        }
    }

    // Опционально: пересчет при изменении значений
    document.getElementById('productSelect').addEventListener('change', function() {
        const form = document.getElementById('orderForm');
        if (form.classList.contains('was-validated')) {
            calculateTotal();
        }
    });

    document.getElementById('quantityInput').addEventListener('input', function() {
        const form = document.getElementById('orderForm');
        if (form.classList.contains('was-validated')) {
            calculateTotal();
        }
    });
})();