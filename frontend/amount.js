function initializeAmountPage() {

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

async function updateExchangeRateInfo() {
    if (selectedCurrency === "EUR") {
        receiveSection.classList.add("hidden");
        exchangeRateInfo.classList.add("hidden");
        currentRate = 1;
        updateReceiveAmount();
        return;
    }

    try {
        const res = await fetch(
            "http://localhost:8080/api/exchange-rate?fromCurrency=EUR&toCurrency=" + encodeURIComponent(selectedCurrency)
        );

        if (!res.ok) {
            console.error("Fehler vom Server:", res.status);
            exchangeRateInfo.classList.add("hidden");
            return;
        }

        const data = await res.json();
        console.log("Wechselkurs Antwort:", data);

        currentRate = Number(data.rate);

        receiveSection.classList.remove("hidden");
        exchangeRateInfo.classList.remove("hidden");
        exchangeRateText.textContent = `1 EUR = ${currentRate} ${selectedCurrency}`;

        updateReceiveAmount();

    } catch (err) {
        console.error("Fehler beim Laden des Wechselkurses:", err);
    }
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
