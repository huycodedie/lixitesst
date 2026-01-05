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

      // Lưu token nếu có (hỗ trợ cả `token` và `access_token`)
      const tokenValue = data.token || data.access_token || null;
      if (tokenValue) {
        localStorage.setItem("token", tokenValue);
      }

      // Lưu thông tin người dùng
      if (data.user || data.data) {
        const user = data.user || data.data;
        this.setUser(user);
        return user;
      }

      // Nếu chỉ có token/access_token, cố gắng lấy thông tin user.
      if (tokenValue) {
        // helper: decode payload của JWT
        function decodeJwtPayload(token) {
          try {
            const parts = token.split(".");
            if (parts.length < 2) return null;
            const payload = parts[1];
            // base64url -> base64
            const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
            const json = decodeURIComponent(
              atob(b64)
                .split("")
                .map(function (c) {
                  return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
            );
            return JSON.parse(json);
          } catch (e) {
            return null;
          }
        }

        try {
          const payload = decodeJwtPayload(tokenValue);
          let userId = null;
          if (payload) {
            userId = payload.id || payload._id || payload.sub || null;
          }

          // Nếu có id trong token, gọi endpoint get-details-user
          if (userId) {
            const detailsResp = await fetch(
              `${this.API_URL}/user/get-details-user/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${tokenValue}`,
                  "Content-Type": "application/json",
                  console.lo
                },
              }
            );

            if (detailsResp.ok) {
              const detailsData = await detailsResp.json();
              const user = detailsData.user || detailsData.data || detailsData;
              if (user) {
                this.setUser(user);
                return user;
              }
            }
          }

          // Nếu không lấy được bằng id từ token, thử endpoint /user/me
          const meResp = await fetch(`${this.API_URL}/user/me`, {
            headers: { Authorization: `Bearer ${tokenValue}` },
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
