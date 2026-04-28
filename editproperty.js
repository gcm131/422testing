document.addEventListener("DOMContentLoaded", async () => {
    const propertyId = localStorage.getItem("editPropertyId");
    if (!propertyId) {
        alert("No property selected for editing.");
        window.location.href = "index.html";
        return;
    }

    // Load existing data into the form
    try {
        const response = await fetch(`http://localhost:3000/properties/${propertyId}`);
        const p = await response.json();

        if (p) {
            document.getElementById("propertyId").value = p.property_id;
            document.getElementById("title").value = p.title;
            document.getElementById("city").value = p.city || "";
            document.getElementById("state").value = p.state || "";
            document.getElementById("zipCode").value = p.zip_code || "";
            document.getElementById("propertyType").value = p.property_type;
            document.getElementById("bedrooms").value = p.bedrooms;
            document.getElementById("bathrooms").value = p.bathrooms;
            document.getElementById("squareFeet").value = p.square_feet;
            document.getElementById("yearBuilt").value = p.year_built;
            document.getElementById("listingPrice").value = p.listing_price;
            document.getElementById("status").value = p.status;
            document.getElementById("description").value = p.description || "";
        }
    } catch (err) {
        console.error("Error loading property:", err);
    }

    // Handle Form Submission
    const form = document.getElementById("editPropertyForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const updatedData = {
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
            const res = await fetch(`http://localhost:3000/properties/${propertyId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData)
            });

            if (res.ok) {
                alert("Property updated successfully!");
                window.location.href = "index.html";
            }
        } catch (err) {
            alert("Error saving changes.");
        }
    });

    // Cancel Button
    document.getElementById("cancelBtn").addEventListener("click", () => {
        window.location.href = "index.html";
    });
});