(() => {
    const pet = document.querySelector('[data-page-pet]');
    const message = pet?.querySelector('[data-pet-message]');

    if (!pet || !message) return;

    let greetingTimer;

    pet.addEventListener('click', () => {
        window.clearTimeout(greetingTimer);
        message.textContent = pet.dataset.greeting;
        pet.classList.add('is-greeting');

        greetingTimer = window.setTimeout(() => {
            pet.classList.remove('is-greeting');
            message.textContent = 'click me';
        }, 1800);
    });
})();
