async function loadTransactions() {
    const body = document.getElementById("transactionBody");
    body.innerHTML = "<tr><td colspan='7'>Loading...</td></tr>";

    try {
        // Updated URL
        const res = await fetch("http://localhost:3000/api/transactions");
        
        if (!res.ok) throw new Error("Backend returned 404/500");

        const data = await res.json();
        body.innerHTML = "";

        if (data.length === 0) {
            body.innerHTML = "<tr><td colspan='7'>No transactions found in DB.</td></tr>";
            return;
        }

        data.forEach(t => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${t.transaction_id}</td>
                <td>${t.property_title}</td>
                <td>${t.buyer_name}</td>
                <td>${t.seller_name}</td>
                <td>$${Number(t.sale_price).toLocaleString()}</td>
                <td>${new Date(t.transaction_date).toLocaleDateString()}</td>
                <td>${t.payment_method}</td>
            `;
            body.appendChild(row);
        });
    } catch (err) {
        console.error("FETCH ERROR:", err);
        body.innerHTML = "<tr><td colspan='7'>Error: Route not found or SQL failed.</td></tr>";
    }
}

// Make sure your simulation uses the IDs that exist (6-10)
async function simulateSale() {
    const sample = {
        property_id: 6, 
        buyer_id: 3,
        seller_id: 1,
        sale_price: 318000,
        payment_method: "Cash"
    };

    await fetch("http://localhost:3000/api/transactions/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sample)
    });
    loadTransactions();
}