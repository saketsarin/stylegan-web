document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded, initializing UI...");

  const generateBtn = document.getElementById("generate");
  const resultImg = document.getElementById("result");
  const loadingDiv = document.getElementById("loading");
  const truncationInput = document.getElementById("truncation");
  const truncationValue = document.getElementById("truncation-value");

  console.log("UI elements initialized");

  // Update truncation value display
  truncationInput.addEventListener("input", function () {
    truncationValue.textContent = this.value;
    console.log("Truncation value updated:", this.value);
  });

  generateBtn.addEventListener("click", async function () {
    console.log("Generate button clicked");

    // Get values from inputs
    const artist = document.getElementById("artist").value;
    const genre = document.getElementById("genre").value;
    const style = document.getElementById("style").value;
    const seed =
      document.getElementById("seed").value ||
      Math.floor(Math.random() * 100000);
    const truncation = truncationInput.value;

    console.log("Parameters:", { artist, genre, style, seed, truncation });

    // Show loading state
    loadingDiv.classList.remove("hidden");
    generateBtn.disabled = true;
    console.log("Loading state shown");

    try {
      console.log("Sending request to server...");
      const response = await fetch("/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artist,
          genre,
          style,
          seed: parseInt(seed),
          truncation: parseFloat(truncation),
        }),
      });

      console.log("Server response received");
      const data = await response.json();
      console.log("Response data:", data);

      if (data.status === "success") {
        console.log("Updating image with new result");
        // Update image with new result
        resultImg.src = data.image_url + "?t=" + new Date().getTime(); // Prevent caching
        // Update seed input if it was randomly generated
        if (!document.getElementById("seed").value) {
          document.getElementById("seed").value = data.seed;
          console.log("Updated seed value:", data.seed);
        }
      } else {
        console.error("Error from server:", data.message);
        alert("Error generating image: " + data.message);
      }
    } catch (error) {
      console.error("Request error:", error);
      alert("Error: " + error.message);
    } finally {
      // Hide loading state
      loadingDiv.classList.add("hidden");
      generateBtn.disabled = false;
      console.log("Loading state hidden");
    }
  });

  console.log("Event listeners set up complete");
});
