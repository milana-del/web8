class FeedbackForm {
    constructor() {
        this.modal = null;
        this.form = null;
        this.isOpen = false;
        this.storageKey = 'feedbackFormData';
        this.init();
    }

    init() {
        // Инициализация после загрузки DOM
        document.addEventListener('DOMContentLoaded', () => {
            this.setupModal();
            this.setupEventListeners();
            this.restoreFormData();
        });
    }

    setupModal() {
        this.modal = new bootstrap.Modal(document.getElementById('feedback-modal'));
        this.form = document.getElementById('feedback-form-modal');
        
        // Обработчики событий модального окна
        document.getElementById('feedback-modal').addEventListener('hidden.bs.modal', () => {
            this.handleModalClose();
        });
    }

    setupEventListeners() {
        // Открытие формы
        document.getElementById('open-feedback-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.openForm();
        });

        // Закрытие формы
        document.getElementById('close-feedback-btn').addEventListener('click', () => {
            this.closeForm();
        });

        // Отправка формы
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Сохранение данных при изменении
        this.form.addEventListener('input', () => {
            this.saveFormData();
        });

        // Обработка кнопки "Назад" в браузере
        window.addEventListener('popstate', (e) => {
            if (this.isOpen && !e.state?.modalOpen) {
                this.closeForm();
            }
        });
    }

    openForm() {
        this.isOpen = true;
        this.modal.show();
        
        // Изменение URL с помощью History API
        const newUrl = window.location.origin + window.location.pathname + '#feedback';
        history.pushState({ modalOpen: true }, '', newUrl);
        
        // Восстановление данных
        this.restoreFormData();
    }

    closeForm() {
        this.isOpen = false;
        this.modal.hide();
        
        // Возврат к исходному URL
        if (history.state?.modalOpen) {
            history.back();
        }
    }

    handleModalClose() {
        this.isOpen = false;
        if (history.state?.modalOpen) {
            history.back();
        }
    }

    saveFormData() {
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('femail').value,
            phone: document.getElementById('fphone').value,
            organization: document.getElementById('organization').value,
            message: document.getElementById('message').value,
            agree: document.getElementById('agree').checked
        };
        
        localStorage.setItem(this.storageKey, JSON.stringify(formData));
    }

    restoreFormData() {
        const savedData = localStorage.getItem(this.storageKey);
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                document.getElementById('fullName').value = formData.fullName || '';
                document.getElementById('femail').value = formData.email || '';
                document.getElementById('fphone').value = formData.phone || '';
                document.getElementById('organization').value = formData.organization || '';
                document.getElementById('message').value = formData.message || '';
                document.getElementById('agree').checked = formData.agree || false;
            } catch (e) {
                console.error('Error restoring form data:', e);
            }
        }
    }

    clearFormData() {
        localStorage.removeItem(this.storageKey);
        this.form.reset();
    }

    showMessage(message, type = 'success') {
        const messageEl = document.getElementById('form-message');
        messageEl.textContent = message;
        messageEl.className = `alert alert-${type} mt-3`;
        messageEl.classList.remove('d-none');
        
        // Автоматическое скрытие сообщения
        setTimeout(() => {
            messageEl.classList.add('d-none');
        }, 5000);
    }

    async handleSubmit() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            // Показать состояние загрузки
            submitButton.textContent = 'Отправка...';
            submitButton.disabled = true;

            // Сбор данных формы
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());

            // Валидация
            if (!this.validateForm(data)) {
                return;
            }

            // Отправка на сервер 
            const response = await fetch('https://formcarry.com/s/AJYK7wadVOb', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.code === 200) {
                this.showMessage('Сообщение успешно отправлено!', 'success');
                this.clearFormData();
                setTimeout(() => {
                    this.closeForm();
                }, 2000);
            } else {
                throw new Error(result.message || 'Ошибка отправки');
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            this.showMessage('Ошибка при отправке формы. Попробуйте еще раз.', 'danger');
        } finally {
            // Восстановить кнопку
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    validateForm(data) {
        // Простая валидация
        if (!data.fullName || !data.email || !data.phone || !data.message || !data.agree) {
            this.showMessage('Пожалуйста, заполните все обязательные поля', 'danger');
            return false;
        }

        if (!this.isValidEmail(data.email)) {
            this.showMessage('Введите корректный email адрес', 'danger');
            return false;
        }

        if (!this.isValidPhone(data.phone)) {
            this.showMessage('Введите корректный номер телефона', 'danger');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Простая валидация телефона (можно улучшить)
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
}

// Инициализация формы
new FeedbackForm();