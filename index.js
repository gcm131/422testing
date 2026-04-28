let allProperties = [];

window.onload = () => {
    loadTable();

    // Event Listeners for Filters
    document.getElementById("applyFiltersBtn")?.addEventListener("click", applyFilters);
    document.getElementById("resetFiltersBtn")?.addEventListener("click", resetFilters);
    document.getElementById("refreshBtn")?.addEventListener("click", loadTable);
};

async function loadTable() {
    const tableBody = document.getElementById("propertyTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = "<tr><td colspan='9' style='text-align:center;'>Loading properties...</td></tr>";

    try {
        const response = await fetch("http://localhost:3000/properties");
        allProperties = await response.json();
        
        // Initial render with all data
        renderTable(allProperties);

    } catch (err) {
        console.error("Error loading table:", err);
        tableBody.innerHTML = "<tr><td colspan='9' style='text-align:center; color:red;'>Error connecting to server.</td></tr>";
    }
}

// Function to actually draw the rows in the HTML
function renderTable(data) {
    const tableBody = document.getElementById("propertyTableBody");
    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='9' style='text-align:center;'>No matching properties found.</td></tr>";
        return;
    }

    data.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${p.property_id}</td>
            <td>${p.title}</td>
            <td>${p.city || p.location_id}</td>
            <td>${p.property_type}</td>
            <td>${p.bedrooms} / ${p.bathrooms}</td>
            <td>${p.square_feet.toLocaleString()}</td>
            <td>$${p.listing_price.toLocaleString()}</td>
            <td><span class="status-badge ${p.status.toLowerCase()}">${p.status}</span></td>
            <td>
                <button class="btn-sm" onclick="editProperty(${p.property_id})">Edit</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function applyFilters() {
    const cityValue = document.getElementById("filterCity").value.toLowerCase().trim();
    const priceRange = document.getElementById("filterPriceRange").value;
    const typeValue = document.getElementById("filterType").value;
    const statusValue = document.getElementById("filterStatus").value;

    const filtered = allProperties.filter(p => {
        // Filter by City
        const matchCity = !cityValue || (p.city && p.city.toLowerCase().includes(cityValue));

        // Filter by Price Range
        let matchPrice = true;
        if (priceRange) {
            const [min, max] = priceRange.split("-").map(Number);
            matchPrice = p.listing_price >= min && p.listing_price <= max;
        }

        // Filter by Type
        const matchType = !typeValue || p.property_type === typeValue;

        // Filter by Status
        const matchStatus = !statusValue || p.status === statusValue;

        return matchCity && matchPrice && matchType && matchStatus;
    });

    renderTable(filtered);
}

function resetFilters() {
    // Clear all inputs
    document.getElementById("filterCity").value = "";
    document.getElementById("filterPriceRange").value = "";
    document.getElementById("filterType").value = "";
    document.getElementById("filterStatus").value = "";
    
    // Show original data
    renderTable(allProperties);
}

// Placeholder for edit function
function editProperty(id) {
    // Store the ID in localStorage so the edit page knows which property to load
    localStorage.setItem("editPropertyId", id);
    window.location.href = "editproperty.html";
}