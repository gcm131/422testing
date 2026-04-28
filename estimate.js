async function fetchProperties() {
    const res = await fetch("http://localhost:3000/properties");
    if (!res.ok) throw new Error("Failed to fetch properties");
    return await res.json();
}

async function calculateEstimate() {
    const cityInput = document.getElementById("estCity").value.trim();
    const city = cityInput.toLowerCase();
    const type = document.getElementById("estType").value;
    const sqft = parseFloat(document.getElementById("estSqft").value);
    const beds = parseInt(document.getElementById("estBeds").value);
    const baths = parseFloat(document.getElementById("estBaths").value);

    const resultBox = document.getElementById("estimateResult");

    if (!city || isNaN(sqft) || isNaN(beds) || isNaN(baths)) {
        resultBox.innerHTML = "<p style='color: red;'>Please fill out all fields correctly.</p>";
        return;
    }

    resultBox.innerHTML = "<p>Analyzing market data...</p>";

    try {
        const properties = await fetchProperties();

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

        // Score each comp by similarity (Difference in Sqft, Beds, Baths)
        const scored = comps.map(p => {
            let score = 0;
            score += 1 / (1 + Math.abs((p.square_feet || 0) - sqft));
            score += 1 / (1 + Math.abs((p.bedrooms || 0) - beds));
            score += 1 / (1 + Math.abs((p.bathrooms || 0) - baths));
            return { ...p, score };
        });

        // Sort by best match (highest score)
        scored.sort((a, b) => b.score - a.score);

        // Take top 5 best matches
        const topComps = scored.slice(0, 5);

        // Average their listing_price
        const estimate = Math.round(
            topComps.reduce((sum, p) => sum + (p.listing_price || 0), 0) / topComps.length
        );

        // Display result
        resultBox.innerHTML = `
            <div style="padding: 15px; background: #f0f7ff; border-radius: 8px; border-left: 5px solid #007bff;">
                <h3 style="margin-top:0;">Estimated Price:</h3>
                <h2 style="color: #007bff; margin: 10px 0;">$${estimate.toLocaleString()}</h2>
                <p style="font-size: 0.9em; color: #666;">Based on ${topComps.length} similar properties in ${cityInput}.</p>
            </div>
        `;

        addToHistory(cityInput, type, sqft, beds, baths, estimate);

    } catch (err) {
        console.error("Estimation Error:", err);
        resultBox.innerHTML = "<p style='color: red;'>Error connecting to server. Make sure server.js is running.</p>";
    }
}

function addToHistory(city, type, sqft, beds, baths, estimate) {
    const list = document.getElementById("estimateHistoryList");
    if (!list) return;

    const li = document.createElement("li");
    li.style.marginBottom = "10px";
    li.style.borderBottom = "1px solid #eee";
    li.style.paddingBottom = "5px";
    li.innerHTML = `
        <strong>${city}</strong> — ${type}, ${sqft} sqft<br>
        <span style="color: #28a745; font-weight: bold;">$${estimate.toLocaleString()}</span>
    `;

    list.prepend(li);
}

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("calculateEstimateBtn");
    if (btn) btn.addEventListener("click", calculateEstimate);
});