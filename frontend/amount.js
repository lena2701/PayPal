function initializeAmountPage() {

    async function fetchRate(from, to) {
    try {
        const response = await fetch(`/api/exchange-rate?from=${from}&to=${to}`);
        const data = await response.json();
        return data.rate;
    } catch (error) {
        console.error("Fehler beim Fetchen des Wechselkurses:", error);
        return null;
    }
}

    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const initials = params.get("initials");

    document.querySelector(".user-name").textContent = name || "";
    document.querySelector(".user-bubble").textContent = initials || "";

    const sendCurrencyBtn = document.getElementById("send-currency");
    const receiveCurrencyBtn = document.getElementById("receive-currency");
    const dropdown = document.getElementById("currency-dropdown");
    const closeDropdown = document.getElementById("close-currency-dropdown");
    const list = document.getElementById("currency-list");
    const searchInput = document.getElementById("currency-search");

    const receiveSection = document.getElementById("receive-section");
    const receiveAmountEl = document.getElementById("receive-amount");

    const exchangeRateInfo = document.getElementById("exchange-rate-info");
    const exchangeRateText = document.getElementById("exchange-rate");

    let selectedCurrency = "EUR";
    let currentRate = 1;

    const currencies = [
        { code: "EUR", name: "Euro", flag: "https://flagcdn.com/w40/eu.png" },
        { code: "USD", name: "US-Dollar", flag: "https://flagcdn.com/w40/us.png" },
        { code: "JPY", name: "Japanischer Yen", flag: "https://flagcdn.com/w40/jp.png" },
        { code: "GBP", name: "Britisches Pfund", flag: "https://flagcdn.com/w40/gb.png" }
    ];

    const currencySymbols = {
    EUR: "€",
    USD: "$",
    JPY: "¥",
    GBP: "£"
};

    const fxRates = {
        USD: 1.12,
        JPY: 160.0,
        GBP: 0.86
    };

    function formatEuro(rawDigits) {
        const num = Number(rawDigits);
        return (num / 100).toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    const amountInput = document.querySelector(".amount-input");
    amountInput.value = "0,00";

function updateReceiveAmount() {
    const symbol = currencySymbols[selectedCurrency] || "";

    let raw = amountInput.value.replace(/\D/g, "");
    if (!raw) raw = "0";

    const eurValue = Number(raw) / 100;

    const converted = eurValue * currentRate;

    receiveAmountEl.textContent =
        `${symbol} ${converted.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
}

    const textarea = document.getElementById("msg");
    const counter = document.getElementById("counter");

    textarea.addEventListener("input", () => {
        counter.textContent = `${textarea.value.length}/280`;
    });

    amountInput.addEventListener("input", () => {
        let raw = amountInput.value.replace(/\D/g, "");
        amountInput.value = formatEuro(raw);
        updateReceiveAmount();
    });

    function openDropdown() {
        renderCurrencyList();
        dropdown.classList.remove("hidden");
        searchInput.value = "";
        searchInput.focus();
    }

    sendCurrencyBtn.addEventListener("click", openDropdown);
    receiveCurrencyBtn.addEventListener("click", openDropdown);

    closeDropdown.addEventListener("click", () => {
        dropdown.classList.add("hidden");
    });

    function updateExchangeRateInfo() {
        if (selectedCurrency === "EUR") {
            receiveSection.classList.add("hidden");
            exchangeRateInfo.classList.add("hidden");
            currentRate = 1;
            return;
        }

        currentRate = fxRates[selectedCurrency];
        receiveSection.classList.remove("hidden");
        exchangeRateInfo.classList.remove("hidden");

        exchangeRateText.textContent = `1 EUR = ${currentRate} ${selectedCurrency}`;

        updateReceiveAmount();
    }

    function renderCurrencyList(filter = "") {
        const search = filter.toLowerCase();
        list.innerHTML = "";

        currencies.forEach(c => {
            const label = (c.name + " " + c.code).toLowerCase();
            if (search && !label.includes(search)) return;

            const div = document.createElement("div");
            div.classList.add("currency-item");

            div.innerHTML = `
                <img src="${c.flag}" class="currency-flag">
                <div>
                    <strong>${c.name}</strong><br>
                    <span>${c.code}</span>
                </div>
            `;

            div.addEventListener("click", () => {
                selectedCurrency = c.code;
                sendCurrencyBtn.innerHTML = `${c.code} <i class="fa-solid fa-chevron-down"></i>`;
                receiveCurrencyBtn.innerHTML = `${c.code} <i class="fa-solid fa-chevron-down"></i>`;
                dropdown.classList.add("hidden");
                updateExchangeRateInfo();
                updateReceiveAmount();

            });

            list.appendChild(div);
        });
    }

    searchInput.addEventListener("input", () => {
        renderCurrencyList(searchInput.value);
    });

    updateExchangeRateInfo();
}