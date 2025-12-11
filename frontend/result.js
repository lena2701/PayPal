function initializeResultPage() {
    const text = JSON.parse(localStorage.getItem("transactionResult"));
    console.log("TRANSACTION RESULT:", text);
    localStorage.removeItem("transactionResult");

    const title = document.getElementById("title");
    const subtitle = document.getElementById("subtitle");
    const box = document.getElementById("result-box");

    if (!text) {
        box.classList.add("error");
        title.innerText = "Fehler";
        subtitle.innerText = "Es konnten keine Transaktionsinformationen geladen werden.";
        return;
    }

    if (text.status === "COMPLETED") {
        box.classList.add("success");

        const amount = text.amountSender ?? text.amount ?? 0;

        const senderChosenCurrency = text.senderCurrency || "EUR";

        const receiverName = text.receiverName || "dem Empfänger";

        title.textContent =
            `Sie haben ${amount.toFixed(2)} ${senderChosenCurrency} an ${receiverName} gesendet.`;

        subtitle.textContent =
            `${receiverName} erhält ${text.amountReceiver} ${text.receiverCurrency}.`;

        const feeInfo = document.getElementById("fee-info");

        if (text.fee && Number(text.fee) > 0) {
            feeInfo.textContent =
                `Es sind Gebühren in Höhe von ${text.fee} ${senderChosenCurrency} angefallen.`;
            feeInfo.classList.remove("hidden");
        } else {
            feeInfo.classList.add("hidden");
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