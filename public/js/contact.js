const contactForm = document.getElementById("contact_form");
const responseArea = document.getElementById("form_response");

function showMessage(message, isSuccess) {
  const className = isSuccess ? "success-message" : "error-message";
  responseArea.innerHTML = `<div class="${className}">${message}</div>`;
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message")
  };

  try {
    const response = await fetch("/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || "Something went wrong.", false);
      return;
    }

    showMessage(data.message || "Form submitted successfully.", true);
    contactForm.reset();
  } catch (error) {
    showMessage("Unable to submit right now. Please try again.", false);
  }
});
