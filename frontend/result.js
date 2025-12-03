
function initializeResultPage(){
    const text = JSON.parse(localStorage.getItem("transactionResult"));
    console.log("TRANSACTION RESULT:", text);
    localStorage.removeItem("transactionResult");
 

    const title = document.getElementById("title");
    const subtitle  = document.getElementById("subtitle");
    const box = document.getElementById("result-box");

    if (!text) {
        title.innerText = "Fehler";
        subtitle.innerText = "Es konnten keine Transaktionsinformationen geladen werden.";
        box.classList.add("error");
        return;
    }

   else if (text.status === "COMPLETED") {
    box.classList.add("success");

    const amount = text.amountSender ?? text.amount ?? 0;
    const currency = text.senderCurrency ?? "EUR";
    const receiverName = text.receiverName || "dem Empfänger";
    const rate = text.exchangeRate;
    const fee = text.fee ?? 0;

    title.textContent = `Sie haben ${amount.toFixed(2)} ${currency} an ${receiverName} gesendet.`;
    subtitle.textContent = `Wir sagen ${receiverName} Bescheid, dass Sie Geld gesendet haben.`;

     } else {
        box.classList.add("error");
        title.textContent = "Transaktion fehlgeschlagen";
        subtitle.textContent = text.message || "Es ist ein Fehler bei der Verarbeitung Ihrer Transaktion aufgetreten. Bitte versuchen Sie es später erneut.";
    }
    document.getElementById("send-again").onclick = () => {
    window.location.href = "search-user.html";
};
}

