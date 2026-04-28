document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addPropertyForm");
    
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Gather data from inputs
            const propertyData = {
                title: document.getElementById("title").value,
                city: document.getElementById("city").value,
                state: document.getElementById("state").value,
                zipCode: document.getElementById("zipCode").value,
                propertyType: document.getElementById("propertyType").value,
                bedrooms: parseInt(document.getElementById("bedrooms").value),
                bathrooms: parseFloat(document.getElementById("bathrooms").value),
                squareFeet: parseInt(document.getElementById("squareFeet").value),
                yearBuilt: parseInt(document.getElementById("yearBuilt").value),
                listingPrice: parseFloat(document.getElementById("listingPrice").value),
                status: document.getElementById("status").value,
                description: document.getElementById("description").value
            };

            try {
                const response = await fetch("http://localhost:3000/properties", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(propertyData)
                });

                if (response.ok) {
                    alert("Property added successfully!");
                    window.location.href = "index.html"; // Redirect to list
                } else {
                    const err = await response.json();
                    alert("Error: " + err.error);
                }
            } catch (err) {
                console.error("Submission error:", err);
                alert("Could not connect to server.");
            }
        });
    }

    // Cancel button
    document.getElementById("cancelBtn")?.addEventListener("click", () => {
        window.location.href = "index.html";
    });
});