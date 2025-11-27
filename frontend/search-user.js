function initializeSearchUserPage() {

    const users = document.querySelectorAll('.user');
    const searchInput = document.getElementById('user-search');
    const searchDropdown = document.getElementById('search-dropdown');

    const userList = [
        { name: "Tom Lichtenstein", initials: "TL" },
        { name: "Finn Blautal", initials: "FB" },
        { name: "Melissa Hempel", initials: "MH" },
        { name: "Frank Wellenstein", initials: "FW" },
    ];

    users.forEach(function (user) {
        user.addEventListener('click', function () {
            const name = user.dataset.name;
            const initials = user.dataset.initials;

            const ziel = `amount.html?name=${encodeURIComponent(name)}&initials=${encodeURIComponent(initials)}`;
            window.location.href = ziel;
        });
    });

    searchInput.addEventListener('input', function () {
        const filter = searchInput.value.toLowerCase();
        searchDropdown.innerHTML = '';

        if (filter.trim() === '') {
            searchDropdown.classList.remove('visible');
            return;
        }

        const filteredUsers = userList.filter(user =>
            user.name.toLowerCase().includes(filter)
        );

        if (filteredUsers.length === 0) {
            searchDropdown.classList.remove('visible');
            return;
        }

        filteredUsers.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.classList.add('search-item');

            userDiv.innerHTML = `
                <div class="search-item-inner">
                    <div class="search-bubble">${user.initials}</div>
                    <span>${user.name}</span>
                </div>
            `;

            userDiv.addEventListener('click', function () {
                const ziel = `amount.html?name=${encodeURIComponent(user.name)}&initials=${encodeURIComponent(user.initials)}`;
                window.location.href = ziel;
            });

            searchDropdown.appendChild(userDiv);
        });

        searchDropdown.classList.add('visible');
    });
    document.addEventListener('click', function (event) {
        if (!searchDropdown.contains(event.target) && event.target !== searchInput) {
            searchDropdown.classList.remove('visible');
        }
    });
}
