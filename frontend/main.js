document.addEventListener('DOMContentLoaded', function () {
    const page = window.location.pathname;

    if (page.endsWith('search-user.html')) {
        initializeSearchUserPage();
    }

    if (page.endsWith('amount.html')) {
        initializeAmountPage();
    }

    if (page.endsWith('result.html')) {
        initializeResultPage();
    }
});

