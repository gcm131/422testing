window.onload = () => {
    loadTable();

    const refreshBtn = document.getElementById("refreshBtn");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", loadTable);
    }
};

// TABLE VIEW ONLY
async function loadTable() {
    try {
        const response = await fetch("http://localhost:3000/properties");
        const properties = await response.json();

        const tableBody = document.getElementById("propertyTableBody");
        tableBody.innerHTML = "";

        if (!properties.length) {
            tableBody.innerHTML = `
                <tr><td colspan="9" style="text-align:center;">No properties found.</td></tr>
            `;
            return;
        }

        properties.forEach(p => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${p.property_id}</td>
                <td>${p.title}</td>
                <td>${p.location_id}</td>
                <td>${p.property_type}</td>
                <td>${p.bedrooms} / ${p.bathrooms}</td>
                <td>${p.square_feet}</td>
                <td>$${p.listing_price}</td>
                <td>${p.status}</td>
                <td><button class="edit-btn">Edit</button></td>
            `;

            tableBody.appendChild(row);
        });

    } catch (err) {
        console.error("Error loading table:", err);
    }
}
