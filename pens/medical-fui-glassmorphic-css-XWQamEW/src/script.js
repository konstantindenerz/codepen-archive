(() => {
    const dashboard = document.getElementById('dashboard');
    const detail = document.getElementById('detail');

    document.documentElement.addEventListener('click', () => {
        if (dashboard.classList.contains('show')) {
            dashboard.classList.remove('show');
            detail.classList.remove('show');
            dashboard.classList.add('hide');
            detail.classList.add('hide');
        } else if (dashboard.classList.contains('hide')) {
            dashboard.classList.remove('hide');
            detail.classList.remove('hide');
            dashboard.classList.add('show');
            detail.classList.add('show');
        } else {
            dashboard.classList.add('show');
            detail.classList.add('show');
        }

    })
})();
