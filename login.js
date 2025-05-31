function login() {
  const username = document.getElementById("username").value.trim();
  const errorElem = document.getElementById("loginError");

  if (!username) {
    errorElem.textContent = "Please enter your name.";
    return;
  }

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("loginTime", Date.now());
        window.location.href = "index.html";
      } else {
        errorElem.textContent = "Login failed.";
      }
    })
    .catch(() => {
      errorElem.textContent = "Error connecting to server.";
    });
}
