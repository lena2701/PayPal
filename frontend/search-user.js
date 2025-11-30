function initializeSearchUserPage() {

    console.log("SEARCH USER JS WIRD GELADEN");

    const searchInput = document.getElementById('user-search');
    const searchDropdown = document.getElementById('search-dropdown');

    if (!searchInput || !searchDropdown) {
        console.error("Suchelemente nicht gefunden!");
        return;
    }

    async function fetchUsersFromBackend(name) {
        try {
            const url = "http://localhost:8080/api/users/search?name=" + encodeURIComponent(name);
            const res = await fetch(url);

            if (!res.ok) {
                console.error("Backend Fehler:", res.status);
                return [];
            }

            return await res.json();
        } catch (error) {
            console.error("Fehler beim Laden der Nutzer:", error);
            return [];
        }
    }

    const hiddenUsers = [
        "Lisa Steinert",
        "PayPal Fee System",
        "PayPal Funding System"
    ];

    function getColor(initials) {
        const colors = {
            "TL": "#70C0FF",
            "MH": "#FFB800"
        };
        return colors[initials] || "#003087";
    }

    searchInput.addEventListener('input', async function () {
        const filter = searchInput.value.trim();
        searchDropdown.innerHTML = '';

        if (filter === '') {
            searchDropdown.classList.remove('visible');
            searchDropdown.classList.add('hidden');
            return;
        }

        let users = await fetchUsersFromBackend(filter);

        users = users.filter(u => !hiddenUsers.includes(u.fullName));

        if (users.length === 0) {
            searchDropdown.classList.remove('visible');
            searchDropdown.classList.add('hidden');
            return;
        }

        users.forEach(user => {
            if (!user.fullName || !user.paypalUserId) {
                console.warn("Überspringe Eintrag ohne paypalUserId oder Name", user);
                return;
            }

            const userDiv = document.createElement('div');
            userDiv.classList.add('search-item');

            userDiv.innerHTML = `
                <div class="search-item-inner">
                    <div class="search-bubble" style="background:${getColor(user.initials)}">
                        ${user.initials}
                    </div>
                    <span>${user.fullName}</span>
                </div>
            `;
            userDiv.addEventListener("click", () => {
                const ziel =
                    `amount.html?name=${encodeURIComponent(user.fullName)}&initials=${encodeURIComponent(user.initials)}&paypalId=${encodeURIComponent(user.paypalUserId)}`;

                window.location.href = ziel;
            });

            searchDropdown.appendChild(userDiv);
        });

        searchDropdown.classList.remove('hidden');
        searchDropdown.classList.add('visible');
    });

    document.addEventListener('click', function (event) {
        if (!searchDropdown.contains(event.target) &&
            event.target !== searchInput) {
            searchDropdown.classList.remove('visible');
            searchDropdown.classList.add('hidden');
        }
    });
}
