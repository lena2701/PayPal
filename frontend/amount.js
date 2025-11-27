function initializeAmountPage() {
    const params = new URLSearchParams(window.location.search);

    const name = params.get('name');
    const initials = params.get('initials');

    const nameElement = document.querySelector('.user-name');
    const bubbleElement = document.querySelector('.user-bubble');

    if (name && initials && nameElement && bubbleElement) {
        nameElement.textContent = name;
        bubbleElement.textContent = initials;
    }

    console.log("Empfänger:", name, initials);

    const open = document.querySelector('.currency-button');
    const dropdown = document.querySelector('.currency-dropdown');
    const close = document.querySelector('.currency-close');
    const list = document.querySelector('.currency-list');

    if (!open || !dropdown || !close || !list) {
        console.error("Currency HTML fehlt!");
        return;
    }

    const currencies = [
        { code: "EUR", name: "Euro", flag: "https://flagcdn.com/w40/eu.png" },
        { code: "USD", name: "US-Dollar", flag: "https://flagcdn.com/w40/us.png" },
        { code: "JPY", name: "Japanischer Jen", flag: "https://flagcdn.com/w40/jp.png" },
        { code: "GBP", name: "Britisches Pfund", flag: "https://flagcdn.com/w40/gb.png" }
    ];

    function renderCurrencyList() {
        list.innerHTML = "";

        currencies.forEach(curr => {
            const div = document.createElement('div');
            div.classList.add('currency-item');

            div.innerHTML = `
                <img src="${curr.flag}" class="currency-flag">
                <div class="currency-text">
                    <strong>${curr.name}</strong><br>
                    <span>${curr.code}</span>
                </div>
            `;

            div.addEventListener('click', () => {
                open.innerHTML = `${curr.code} <i class="fa-solid fa-chevron-down"></i>`;
                dropdown.classList.add('hidden');
            });

            list.appendChild(div);
        });
    }

    open.addEventListener('click', () => {
        renderCurrencyList();
        dropdown.classList.remove('hidden');
    });

    close.addEventListener('click', () => {
        dropdown.classList.add('hidden');
    });

    const textarea = document.getElementById('msg');
    const counter = document.getElementById('counter');

    if (textarea && counter) {
        textarea.addEventListener('input', () => {
            const currentLength = textarea.value.length;
           counter.textContent = `${currentLength}/280`;
        });
    }   

    const searchInput = document.getElementById('currency-search');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const filter = searchInput.value.toLowerCase();
            const currencyItems = Array.from(list.getElementsByClassName('currency-item'));
              currencyItems.forEach(item => {
                const currencyName = item.textContent.toLowerCase();
                item.style.display = currencyName.includes(filter) ? 'flex' : 'none';
            });
        });
    }
}
