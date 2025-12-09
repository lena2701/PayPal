function initializeResultPage() {
    const text = JSON.parse(localStorage.getItem("transactionResult"));
    console.log("TRANSACTION RESULT:", text);
    localStorage.removeItem("transactionResult");

    const title    = document.getElementById("title");
    const subtitle = document.getElementById("subtitle");
    const box      = document.getElementById("result-box");

    if (!text) {
        box.classList.add("error");
        title.innerText    = "Fehler";
        subtitle.innerText = "Es konnten keine Transaktionsinformationen geladen werden.";
        return;
    }

    if (text.status === "COMPLETED") {
        box.classList.add("success");

        // Betrag, den DU gesendet hast (aus der DB)
        const amount = text.amountSender ?? text.amount ?? 0;

        // Jetzt: die im Dropdown gewählte Währung kommt als senderCurrency aus dem Backend
        const senderChosenCurrency = text.senderCurrency || "EUR";

        const receiverName = text.receiverName || "dem Empfänger";

        // -> hier steht jetzt IMMER die gewählte Währung (z.B. USD, GBP, JPY)
        title.textContent =
            `Sie haben ${amount.toFixed(2)} ${senderChosenCurrency} an ${receiverName} gesendet.`;

        // Optional: anzeigen, was der Empfänger tatsächlich bekommt
        if (text.amountReceiver && text.receiverCurrency) {
            subtitle.textContent =
                `Der Empfänger erhält ${text.amountReceiver} ${text.receiverCurrency}.`;
        } else {
            subtitle.textContent =
                `Wir sagen ${receiverName} Bescheid, dass Sie Geld gesendet haben.`;
        }

    } else {
        box.classList.add("error");
        title.textContent = "Transaktion fehlgeschlagen";
        subtitle.textContent =
            text.message ||
            "Es ist ein Fehler bei der Verarbeitung Ihrer Transaktion aufgetreten. Bitte versuchen Sie es später erneut.";
    }

    document.getElementById("send-again").onclick = () => {
        window.location.href = "search-user.html";
    };
}