window.onload = () => {
    loadTransactions();
};

async function loadTransactions() {
    const tableBody = document.getElementById("transactionBody");
    if (!tableBody) return;

    tableBody.innerHTML = "<tr><td colspan='7'>Loading transactions...</td></tr>";

    try {
        const response = await fetch("http://localhost:3000/transactions");
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='7'>No transactions found.</td></tr>";
            return;
        }

        data.forEach(t => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${t.transaction_id}</td>
                <td>${t.property_title || 'N/A'}</td>
                <td>${t.buyer_name || 'N/A'}</td>
                <td>${t.seller_name || 'N/A'}</td>
                <td>$${Number(t.sale_price).toLocaleString()}</td>
                <td>${new Date(t.transaction_date).toLocaleDateString()}</td>
                <td>${t.payment_method}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        console.error("Fetch Error:", err);
        tableBody.innerHTML = `<tr><td colspan='7'>Error: ${err.message}</td></tr>`;
    }
}