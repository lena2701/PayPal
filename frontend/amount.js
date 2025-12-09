function initializeAmountPage() {

    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const initials = params.get("initials");
    const receiverPaypalId = params.get("paypalId");

    let senderCurrency = "EUR";
    let receiverCurrency = params.get("receiverCurrency") || params.get("receiverCurrencyCode") || "EUR";
    let activeCurrencyTarget = "send";

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

    const textarea = document.getElementById("msg");
    const counter = document.getElementById("counter");

    const amountInput = document.querySelector(".amount-input");
    amountInput.value = "0,00";

    const currencySymbolEl = document.querySelector(".currency-symbol");

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

    let currentRate = 1;

    if (currencySymbolEl) {
        currencySymbolEl.textContent = currencySymbols[senderCurrency] || senderCurrency;
    }

    sendCurrencyBtn.innerHTML = `${senderCurrency} <i class="fa-solid fa-chevron-down"></i>`;
    receiveCurrencyBtn.innerHTML = `${receiverCurrency} <i class="fa-solid fa-chevron-down"></i>`;


    function formatEuro(rawDigits) {
        const num = Number(rawDigits || "0");
        return (num / 100).toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function updateReceiveAmount() {
        if (receiverCurrency === senderCurrency) {
            receiveSection.classList.add("hidden");
            exchangeRateInfo.classList.add("hidden");
            receiveAmountEl.textContent = "";
            return;
        }

        let raw = amountInput.value.replace(/\D/g, "");
        if (!raw) raw = "0";

        const senderAmount = Number(raw) / 100;
        const converted = senderAmount * currentRate;

        const symbol = currencySymbols[receiverCurrency] || receiverCurrency;

        receiveAmountEl.textContent =
            `${symbol} ${converted.toLocaleString("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
    }

    async function updateExchangeRateInfo() {

        if (receiverCurrency === senderCurrency) {
            currentRate = 1;
            receiveSection.classList.add("hidden");
            exchangeRateInfo.classList.add("hidden");
            updateReceiveAmount();
            return;
        }

        try {
            const res = await fetch(
                "http://localhost:8080/api/exchange-rate?fromCurrency=" +
                encodeURIComponent(senderCurrency) +
                "&toCurrency=" +
                encodeURIComponent(receiverCurrency)
            );

            if (!res.ok) {
                console.error("Fehler vom Server:", res.status);
                exchangeRateInfo.classList.add("hidden");
                return;
            }

            const data = await res.json();
            console.log("Wechselkurs Antwort:", data);

            currentRate = Number(data.rate) || 1;

            receiveSection.classList.remove("hidden");
            exchangeRateInfo.classList.remove("hidden");
            exchangeRateText.textContent =
                `1 ${senderCurrency} = ${currentRate} ${receiverCurrency}`;

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

                if (activeCurrencyTarget === "receive") {
                    // User ändert die Zielwährung ↓↓↓
                    receiverCurrency = c.code;
                    receiveCurrencyBtn.innerHTML = `${receiverCurrency} <i class="fa-solid fa-chevron-down"></i>`;
                } else {
                    // Sender ist IMMER EUR ↓↓↓
                    senderCurrency = "EUR";
                    sendCurrencyBtn.innerHTML = `${senderCurrency} <i class="fa-solid fa-chevron-down"></i>`;
                }

                dropdown.classList.add("hidden");

                updateExchangeRateInfo();
                updateReceiveAmount();
            });

            list.appendChild(div);
        });
    }

    function openDropdown(target) {
        activeCurrencyTarget = target;
        renderCurrencyList();
        dropdown.classList.remove("hidden");
        searchInput.value = "";
        searchInput.focus();
    }

    function validateAmount() {
        const raw = amountInput.value.replace(/\D/g, "");
        const amount = Number(raw || "0") / 100;

        if (amount > 0) {
            sendBtn.disabled = false;
            sendBtn.classList.remove("disabled");
        } else {
            sendBtn.disabled = true;
            sendBtn.classList.add("disabled");
        }
    }

    textarea.addEventListener("input", () => {
        counter.textContent = `${textarea.value.length}/280`;
    });

    amountInput.addEventListener("input", () => {
        let raw = amountInput.value.replace(/\D/g, "");
        amountInput.value = formatEuro(raw);
        validateAmount();
        updateReceiveAmount();
    });

    sendCurrencyBtn.addEventListener("click", () => openDropdown("receive"));
    receiveCurrencyBtn.addEventListener("click", () => openDropdown("send"));

    closeDropdown.addEventListener("click", () => {
        dropdown.classList.add("hidden");
    });

    searchInput.addEventListener("input", () => {
        renderCurrencyList(searchInput.value);
    });


    updateExchangeRateInfo();

    document.querySelector(".send").addEventListener("click", async () => {
        const senderPaypalId = params.get("senderPaypalId") || "Lisa_Steinert";
        const receiverId = receiverPaypalId || params.get("receiverPaypalId");
        const amountRaw = amountInput.value.replace(/\D/g, "");
        const amount = Number(amountRaw || "0") / 100;
        const description = textarea.value;

        if (!receiverId) {
            alert("Empfänger konnte nicht ermittelt werden. Bitte erneut einen Empfänger auswählen.");
            return;
        }

        const payload = {
            senderPaypalId: senderPaypalId,
            receiverPaypalId: receiverId,
            amount: amount,

            senderCurrencyCode: receiverCurrency,
            receiverCurrencyCode: receiverCurrency,

            description: description
        };

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
}
