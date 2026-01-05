// Auth utility - Quản lý trạng thái đăng nhập
const AuthManager = {
  API_URL: "https://websocket.lixitet.top/api",

  // Lưu thông tin người dùng
  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  },

  // Lấy thông tin người dùng
  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Kiểm tra xem đã đăng nhập chưa
  isLoggedIn() {
    return this.getUser() !== null;
  },

  // Đăng nhập
  async login(email, password) {
    try {
      const response = await fetch(`${this.API_URL}/user/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Email hoặc mật khẩu không chính xác");
      }

      const data = await response.json();

      // Nếu API trả về lỗi mặc dù response.ok === true
      if (
        data &&
        (data.success === false ||
          data.error ||
          (data.message &&
            typeof data.message === "string" &&
            /error|failed|invalid|không/i.test(data.message)))
      ) {
        const msg = data.message || data.error || "Đăng nhập thất bại";
        throw new Error(msg);
      }

      // Lưu token nếu có
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Lưu thông tin người dùng
      if (data.user || data.data) {
        const user = data.user || data.data;
        this.setUser(user);
        return user;
      }

      // Nếu chỉ có token, cố gắng gọi API lấy thông tin user
      if (data.token) {
        try {
          const token = data.token;
          const meResp = await fetch(`${this.API_URL}/user/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (meResp.ok) {
            const meData = await meResp.json();
            const user = meData.user || meData.data || meData;
            if (user) {
              this.setUser(user);
              return user;
            }
          }
        } catch (err) {
          // Không lấy được profile, tiếp tục trả về data
          console.warn("Không lấy được profile sau khi đăng nhập:", err);
        }
      }

      // Nếu payload có cấu trúc khác nhưng chứa thông tin thành công
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Đăng xuất
  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "index.html";
  },

  // Lấy token
  getToken() {
    return localStorage.getItem("token");
  },
};

// Hàm cập nhật UI dựa trên trạng thái đăng nhập
function updateAuthUI() {
  const isLoggedIn = AuthManager.isLoggedIn();
  const user = AuthManager.getUser();

  const loginButtons = document.querySelector(".auth-buttons");
  const userMenu = document.querySelector(".user-menu");

  if (loginButtons) {
    loginButtons.style.display = isLoggedIn ? "none" : "flex";
  }

  if (userMenu) {
    userMenu.style.display = isLoggedIn ? "flex" : "none";

    if (isLoggedIn && user) {
      const userName = userMenu.querySelector(".user-name");
      const userAvatar = userMenu.querySelector(".user-avatar");

      if (userName) {
        userName.textContent = user.name || user.email || "Người dùng";
      }

      if (userAvatar && user.avatar) {
        userAvatar.src = user.avatar;
      }
    }
  }
}

// Cập nhật UI khi trang tải
document.addEventListener("DOMContentLoaded", updateAuthUI);
