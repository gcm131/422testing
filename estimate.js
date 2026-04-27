// Fetch real properties (with city) from backend
async function fetchProperties() {
    const res = await fetch("http://localhost:3000/properties");
    if (!res.ok) throw new Error("Failed to fetch properties");
    return await res.json();
}

// Calculate estimate using real comparable properties
async function calculateEstimate() {
    const cityInput = document.getElementById("estCity").value.trim();
    const city = cityInput.toLowerCase();
    const type = document.getElementById("estType").value;
    const sqft = parseFloat(document.getElementById("estSqft").value);
    const beds = parseInt(document.getElementById("estBeds").value);
    const baths = parseFloat(document.getElementById("estBaths").value);

    const resultBox = document.getElementById("estimateResult");

    if (!city || !sqft || !beds || !baths) {
        resultBox.innerHTML = "<p>Please fill out all fields.</p>";
        return;
    }

    let properties;
    try {
        properties = await fetchProperties();
    } catch (err) {
        console.error(err);
        resultBox.innerHTML = "<p>Error loading properties.</p>";
        return;
    }

    // Filter comps by city + type
    const comps = properties.filter(p =>
        p.city &&
        p.city.toLowerCase() === city &&
        p.property_type &&
        p.property_type.toLowerCase() === type.toLowerCase()
    );

    if (comps.length === 0) {
        resultBox.innerHTML = "<p>No comparable properties found for that city and type.</p>";
        return;
    }

    // Score each comp by similarity
    const scored = comps.map(p => {
        let score = 0;

        score += 1 / (1 + Math.abs((p.square_feet || 0) - sqft));
        score += 1 / (1 + Math.abs((p.bedrooms || 0) - beds));
        score += 1 / (1 + Math.abs((p.bathrooms || 0) - baths));

        return { ...p, score };
    });

    // Sort by best match
    scored.sort((a, b) => b.score - a.score);

    // Take top 5 comps (or fewer if not enough)
    const topComps = scored.slice(0, Math.min(5, scored.length));

    // Average their listing_price
    const estimate = Math.round(
        topComps.reduce((sum, p) => sum + (p.listing_price || 0), 0) / topComps.length
    );

    // Display result
    resultBox.innerHTML = `
        <h3>Estimated Price:</h3>
        <p class="price-number">$${estimate.toLocaleString()}</p>
        <p>Based on ${topComps.length} similar properties in ${cityInput}.</p>
    `;

    addToHistory(cityInput, type, sqft, beds, baths, estimate);
}

// Add to history list
function addToHistory(city, type, sqft, beds, baths, estimate) {
    const list = document.getElementById("estimateHistoryList");

    const li = document.createElement("li");
    li.innerHTML = `
        <strong>${city}</strong> — ${type}, ${sqft} sqft, ${beds} bd / ${baths} ba
        <br><span class="price-small">$${estimate.toLocaleString()}</span>
    `;

    list.prepend(li);
}

// Attach button event
document
    .getElementById("calculateEstimateBtn")
    .addEventListener("click", calculateEstimate);
