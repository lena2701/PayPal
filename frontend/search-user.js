function initializeSearchUserPage() {

    console.log("Neue SEARCH USER JS geladen (mit Weiter-Button Logik)");

    const searchInput = document.getElementById('user-search');
    const dropdown = document.getElementById('search-dropdown');
    const nextButton = document.getElementById('next-btn');

    let selectedUser = null; 

    if (!searchInput || !dropdown || !nextButton) {
        console.error("Suchelemente nicht gefunden!");
        return;
    }

    function updateNextButtonState() {
        const enabled = !!selectedUser;
        nextButton.disabled = !enabled;
        nextButton.style.cursor = enabled ? "pointer" : "not-allowed";
    }

    async function fetchUsers(name) {
        try {
            const url = "http://localhost:8080/api/users/search?name=" + encodeURIComponent(name);
            const res = await fetch(url);

            if (!res.ok) return [];
            return await res.json();
        } catch (err) {
            console.error("Fehler beim Laden der Nutzer:", err);
            return [];
        }
    }

    const hiddenUsers = [
        "Lisa Steinert",
        "PayPal Fee System",
        "PayPal Funding System"
    ];

    searchInput.addEventListener("input", async () => {
        const value = searchInput.value.trim();

        dropdown.innerHTML = "";
        selectedUser = null;
        updateNextButtonState();

        if (!value) {
            dropdown.classList.add("d-none");
            return;
        }

        let users = await fetchUsers(value);
        users = users.filter(u => !hiddenUsers.includes(u.fullName));

        if (users.length === 0) {
            dropdown.classList.add("d-none");
            return;
        }

        dropdown.classList.remove("d-none");

        users.forEach(user => {
            const item = document.createElement("button");
            item.className =
                "list-group-item list-group-item-action d-flex align-items-center gap-3 search-result";

            item.innerHTML = `
                <div class="pp-bubble">${user.initials}</div>
                <span class="fw-semibold">${user.fullName}</span>
            `;

            item.addEventListener("click", () => {
                selectedUser = user; 
                searchInput.value = user.fullName;
                dropdown.classList.add("d-none"); 
                updateNextButtonState(); 
            });

            dropdown.appendChild(item);
        });
    });

    document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target) && e.target !== searchInput) {
            dropdown.classList.add("d-none");
        }
    });

    nextButton.addEventListener("click", () => {
        if (!selectedUser) {
            alert("Bitte wählen Sie einen Empfänger aus.");
            return;
        }

        const ziel =
            `amount.html?name=${encodeURIComponent(selectedUser.fullName)}&initials=${encodeURIComponent(selectedUser.initials)}&paypalId=${encodeURIComponent(selectedUser.paypalUserId)}`;

        window.location.href = ziel;
    });

    updateNextButtonState();
}
