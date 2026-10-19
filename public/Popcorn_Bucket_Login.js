// Get the login and registration forms
const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");

// Open a modal
function openModal(id) {
    const modal = document.getElementById(id);

    if (modal) {
        modal.hidden = false;

        const firstInput = modal.querySelector("input");

        if (firstInput) {
            firstInput.focus();
        }
    }
}

// Close a modal
function closeModal(id) {
    const modal = document.getElementById(id);

    if (modal) {
        modal.hidden = true;
    }
}

// Open Login or Register when the main buttons are clicked
document.querySelectorAll("[data-open]").forEach((button) => {
    button.addEventListener("click", () => {
        openModal(button.dataset.open);
    });
});

// Close a modal using the X button
document.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", () => {
        closeModal(button.dataset.close);
    });
});

// Switch between Login and Register
document.querySelectorAll("[data-switch]").forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".modal").forEach((modal) => {
            modal.hidden = true;
        });

        openModal(button.dataset.switch);
    });
});

// Close a modal when clicking outside its content
document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.hidden = true;
        }
    });
});

// Close modals when Escape is pressed
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        document.querySelectorAll(".modal").forEach((modal) => {
            modal.hidden = true;
        });
    }
});

// LOGIN
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = document.querySelector("#loginMessage");
    const submitButton = loginForm.querySelector('button[type="submit"]');

    message.textContent = "";
    message.className = "form-message";

    // Collect username and password
    const formData = new FormData(loginForm);

    const payload = {
        username: String(formData.get("username") || "").trim(),
        password: String(formData.get("password") || "")
    };

    submitButton.disabled = true;
    submitButton.textContent = "Logging in...";

    try {
        // Send the login information to the Express backend
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        // Show an error if the credentials are incorrect
        if (!response.ok || !data.success) {
            message.textContent =
                data.message || "Login failed. Please try again.";

            message.classList.add("error");
            return;
        }

        // Login was successful
        message.textContent = "Login successful!";
        message.classList.add("success");

        // Change this to your actual destination page when it exists
        // This page must be created in your public folder
        window.location.href = "temp.html";

    } catch (error) {
        console.error("Login error:", error);

        message.textContent =
            "Could not connect to the server. Please try again.";

        message.classList.add("error");

    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Login";
    }
});

// REGISTER
registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = document.querySelector("#registerMessage");
    const submitButton = registerForm.querySelector('button[type="submit"]');

    message.textContent = "";
    message.className = "form-message";

    // Collect username, email, and password
    const formData = new FormData(registerForm);

    const payload = {
        username: String(formData.get("username") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        password: String(formData.get("password") || "")
    };

    // Check the password length
    if (payload.password.length < 8) {
        message.textContent =
            "Password must be at least 8 characters long.";

        message.classList.add("error");
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Creating account...";

    try {
        // Send the registration information to the backend
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        // Display an error if registration failed
        if (!response.ok || !data.success) {
            message.textContent =
                data.message || "Registration failed. Please try again.";

            message.classList.add("error");
            return;
        }

        // Account was created successfully
        message.textContent =
            "Account created! You can now log in.";

        message.classList.add("success");

        registerForm.reset();

    } catch (error) {
        console.error("Registration error:", error);

        message.textContent =
            "Could not connect to the server. Please try again.";

        message.classList.add("error");

    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Create Account";
    }
});