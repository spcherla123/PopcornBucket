// Hardcoded credentials for local demonstration purposes
const correctUsername = "admin";
const correctPassword = "password123";

// Get the login button
const loginButton = document.querySelector('#id1 button[type="submit"]');

// Get the username and password inputs
const usernameInput = document.querySelector('input[name="uname"]');
const passwordInput = document.querySelector('input[name="upass"]');

// Create an error message
const errorMessage = document.createElement("p");
errorMessage.id = "errorMessage";
errorMessage.style.color = "crimson";
errorMessage.style.textAlign = "center";

// Put the error message before the Login button
loginButton.parentElement.insertBefore(errorMessage, loginButton);

// When Login is clicked
loginButton.addEventListener("click", function(event) {
    event.preventDefault();

    // Get the values entered by the user
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Clear previous error
    errorMessage.textContent = "";

    // Check username and password
    if (username === correctUsername && password === correctPassword) {
        alert("Login successful!");

        // Redirect after successful login
        window.location.href = "https://example.com";
    }
    else {
        errorMessage.textContent = "Invalid username or password. Please try again.";
    }
});