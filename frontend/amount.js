function initializeAmountPage() {

    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const initials = params.get("initials");
    const receiverPaypalId = params.get("paypalId");
    // Receiver's own currency (expected from previous page), default EUR
    const receiverCurrency = params.get("receiverCurrency") || params.get("receiverCurrencyCode") || "EUR";
    // If sender currency was chosen on a previous page, preserve it; else default EUR
    const presetSenderCurrency = params.get("senderCurrency") || params.get("currency") || "EUR";

    document.querySelector(".user-name").textContent = name || "";
    document.querySelector(".user-bubble").textContent = initials || "";

    const sendCurrencyBtn = document.getElementById("send-currency");
    const receiveCurrencyBtn = document.getElementById("receive-currency");
    const dropdown = document.getElementById("currency-dropdown");
    const closeDropdown = document.getElementById("close-currency-dropdown");
    const list = document.getElementById("currency-list");
    const searchInput = document.getElementById("currency-search");
    const sendBtn = document.getElementById("send-money-button");

    const receiveSection = document.getElementById("receive-section");
    const receiveAmountEl = document.getElementById("receive-amount");

    const exchangeRateInfo = document.getElementById("exchange-rate-info");
    const exchangeRateText = document.getElementById("exchange-rate");

    // Currency the sender chooses to pay with
    let selectedCurrency = presetSenderCurrency;
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
        // Display the amount the receiver will get, in their currency
        const symbol = currencySymbols[receiverCurrency] || "";

        let raw = amountInput.value.replace(/\D/g, "");
        if (!raw) raw = "0";

        const senderValue = Number(raw) / 100;

        // Convert sender amount into receiver currency using currentRate
        const converted = senderValue * currentRate;

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
        validateAmount();
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
        if (selectedCurrency === receiverCurrency) {
            receiveSection.classList.add("hidden");
            exchangeRateInfo.classList.add("hidden");
            currentRate = 1;
            updateReceiveAmount();
            return;
        }

        try {
            const res = await fetch(
                "http://localhost:8080/api/exchange-rate?fromCurrency=" + encodeURIComponent(selectedCurrency) +
                "&toCurrency=" + encodeURIComponent(receiverCurrency)
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
            exchangeRateText.textContent = `1 ${selectedCurrency} = ${currentRate} ${receiverCurrency}`;

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

    // Show sender and receiver currencies on the UI
    sendCurrencyBtn.innerHTML = `${selectedCurrency} <i class=\"fa-solid fa-chevron-down\"></i>`;
    receiveCurrencyBtn.innerHTML = `${receiverCurrency} <i class="fa-solid fa-chevron-down"></i>`;

    updateExchangeRateInfo();

    document.querySelector(".send").addEventListener("click", async () => {
        const senderPaypalId = params.get("senderPaypalId") || "Lisa_Steinert";
        const receiverId = receiverPaypalId || params.get("receiverPaypalId");
        const amountRaw = amountInput.value.replace(/\D/g, "");
        const amount = Number(amountRaw) / 100;
        const description = textarea.value;

        if (!receiverId) {
            alert("Empfänger konnte nicht ermittelt werden. Bitte erneut einen Empfänger auswählen.");
            return;
        }

        const payload = {
            senderPaypalId: senderPaypalId,
            receiverPaypalId: receiverId,
            amount: amount,
            senderCurrencyCode: selectedCurrency,
            receiverCurrencyCode: receiverCurrency,
            description: description
        };

        console.log("SENDE TRANSAKTION", payload);
        try {
            const response = await fetch("http://localhost:8080/api/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            localStorage.setItem("transactionResult", JSON.stringify(data));
            window.location.href = "result.html";

        } catch (err) {
            console.error("Fehler beim Senden der Transaktion:", err);

            localStorage.setItem("transactionResult", JSON.stringify({
                status: "FAILED",
                message: "Fehler beim Senden der Transaktion. Bitte versuchen Sie es später erneut."
            }));

            window.location.href = "result.html";
        }

    });

    function validateAmount() {
        const raw = amountInput.value.replace(/\D/g, "");
        const amount = Number(raw) / 100;
        
        if (amount > 0) {
            sendBtn.disabled = false;
            sendBtn.classList.remove("disabled");
        } else {
            sendBtn.disabled = true;
            sendBtn.classList.add("disabled");
        }
    }
}
