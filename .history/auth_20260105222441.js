// Authentication Manager
const AuthManager = {
  API_URL: "https://websocket.lixitet.top/api",

  // Login
  async login(email, password) {
    const response = await fetch(`${this.API_URL}/user/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Check for error in response body even if HTTP 200
    if (
      !response.ok ||
      data.success === false ||
      data.error ||
      (data.message && data.message.includes("không tìm thấy"))
    ) {
      throw new Error(data.message || data.error || "Đăng nhập thất bại");
    }

    // Handle token or access_token
    const token = data.token || data.access_token;
    if (!token) {
      throw new Error("Không nhận được token");
    }

    this.setToken(token);

    // If access_token (JWT), decode to get user ID and fetch details
    if (data.access_token) {
      const userId = this.decodeJWT(data.access_token);
      if (userId) {
        try {
          const userRes = await fetch(
            `${this.API_URL}/user/get-details-user/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const userData = await userRes.json();
          if (userData.success && userData.data) {
            this.setUser(userData.data);
            return userData.data;
          }
        } catch (e) {
          console.warn("Could not fetch user details by ID, trying /user/me");
        }
      }
    }

    // Fallback: try to get user from /user/me
    try {
      const meRes = await fetch(`${this.API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const meData = await meRes.json();
      if (meData.success && meData.data) {
        this.setUser(meData.data);
        return meData.data;
      }
    } catch (e) {
      console.warn("Could not fetch from /user/me");
    }

    return { token };
  },

  // Decode JWT payload (client-side)
  decodeJWT(token) {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload.id || payload._id || payload.sub;
    } catch (e) {
      return null;
    }
  },

  // Store token
  setToken(token) {
    localStorage.setItem("token", token);
  },

  // Get token
  getToken() {
    return localStorage.getItem("token");
  },

  // Store user
  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  },

  // Get user
  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Check if logged in
  isLoggedIn() {
    return !!this.getToken();
  },

  // Logout
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    updateAuthUI();
    window.location.href = "/";
  },
};

// Update header based on auth state
function updateAuthUI() {
  const token = AuthManager.getToken();
  const user = AuthManager.getUser();
  const authButtons = document.querySelector(".auth-buttons");
  const userMenu = document.querySelector(".user-menu");

  if (token || user) {
    // Show user menu
    if (authButtons) authButtons.classList.add("hidden");
    if (userMenu) {
      userMenu.classList.remove("hidden");
      const userName = userMenu.querySelector(".user-name");
      const userAvatar = userMenu.querySelector(".user-avatar");
      if (userName && user)
        userName.textContent = user.name || user.email || "User";
      if (userAvatar && user) {
        userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.name || user.email
        )}&background=EF4444&color=fff`;
      }
    }
  } else {
    // Show login/register buttons
    if (authButtons) authButtons.classList.remove("hidden");
    if (userMenu) userMenu.classList.add("hidden");
  }
}
