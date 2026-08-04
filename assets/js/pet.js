(() => {
    const pet = document.querySelector('[data-page-pet]');
    const message = pet?.querySelector('[data-pet-message]');

    if (!pet || !message) return;

    let greetingTimer;
    let resizeTimer;
    const randomX = Math.random();
    const randomY = Math.random();

    const placePet = () => {
        const gutter = 12;
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = window.innerHeight;
        const profile = document.querySelector('.profile_inner');
        const petWidth = pet.offsetWidth;
        const petHeight = pet.offsetHeight;
        const profileBottom = profile?.getBoundingClientRect().bottom ?? viewportHeight * 0.55;
        const maxX = Math.max(gutter, viewportWidth - petWidth - gutter);
        const maxY = Math.max(gutter, viewportHeight - petHeight - gutter);
        const minY = Math.min(Math.max(profileBottom + 20, viewportHeight * 0.58), maxY);
        const x = gutter + randomX * (maxX - gutter);
        const y = minY + randomY * (maxY - minY);

        pet.style.setProperty('--pet-x', `${Math.round(x)}px`);
        pet.style.setProperty('--pet-y', `${Math.round(y)}px`);
        pet.classList.add('is-placed');
    };

    pet.hidden = false;
    window.requestAnimationFrame(placePet);

    window.addEventListener('resize', () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(placePet, 120);
    });

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
