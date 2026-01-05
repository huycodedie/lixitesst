// Router system for SPA
const Router = {
  currentRoute: "home",
  app: null,

  // Khởi tạo router
  init() {
    this.app = document.getElementById("app");

    // Lấy route từ URL
    const path = window.location.pathname.split("/").pop() || "index.html";
    const hash = window.location.hash.slice(1);

    // Nếu có hash, sử dụng nó làm route
    if (hash) {
      this.currentRoute = hash;
      history.replaceState({ route: hash }, "", "#" + hash);
    } else {
      this.currentRoute = "home";
      // đảm bảo URL có hash để load đúng view mặc định
      history.replaceState({ route: 'home' }, '', '#home');
    }

    this.render();

    // Lắng nghe hash change
    window.addEventListener("hashchange", () => {
      this.currentRoute = window.location.hash.slice(1);
      this.render();
    });
  },

  // Thay đổi route
  navigate(route) {
    this.currentRoute = route;
    window.location.hash = route;
  },

  // Render view
  async render() {
    const route = this.currentRoute || "home";
    const filePath = `views/${route}.html`;
    try {
      const res = await fetch(filePath, { cache: "no-store" });
      if (!res.ok) throw new Error("View not found");
      const html = await res.text();
      this.app.innerHTML = html;
      // Setup event listeners after view loaded
      this.setupEventListeners();
    } catch (err) {
      // fallback to home if view fails
      if (route !== "home") {
        this.currentRoute = "home";
        return this.render();
      }
      this.app.innerHTML = `<div class="p-6 bg-red-100 rounded">Không thể tải giao diện.</div>`;
    }
  },

  // View: Home
  viewHome() {
    return `
      <div class="relative flex flex-col gap-6 rounded-xl border-2 border-yellow-400 bg-red-600 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div class="absolute inset-0 opacity-10 pointer-events-none">
          <img alt="fireworks" class="absolute -top-10 -left-10 w-40 h-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8JxbV5Lh3UjfpsUZOjms1SI4EU01XSKOf-ssATQQpcDw8clflsPk-2Us_v1M0LdJoLvwB2tfl39hHhA2sKgqNZVbC2doBxqOyCC3hLo7cpMZCB9_fMycSZ_H0LBvQk6fNH3c-b-2YgLke-odmHw5l4EPIgmtbPwvBOsYAWz4DqHWUY38ng3gFLxkS5s0oGoNCr8Nt00AkK6hyb-_UkVWu7X1hWPILlozzmWQVm37RU7MhfMu6t0UlS7Wz9IZYDGdp_lF8TzbPv0Q" />
          <img alt="fireworks" class="absolute -bottom-12 -right-12 w-48 h-48" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlK8dh_Mg28FlU0J_ZjAXM0trek1QYb3dpwMGcB4Pe4a_hagJPz3ZbvQs4m7spGZtbmMVDqvELfrZKoKP3hw3DEcr7i1eNgNVagIOyLySHC-MkSXoSm8D4MqVETkoXCGCHQikwKBegUvyso-BtR67LoDNJk_xZZHirRQObNAui3zaRiXYUxZ0Xrf0zMTUzVYAxLMgCs2F2LnYKkIiR6J0X2YxWdxRx3VuGewhE6MiA-dbKk0GyaQi18HN6KxJewg6ucDnYWfCG2wc" />
        </div>
        <div class="absolute -top-2 -left-2 w-16 h-16">
          <img alt="mai flower corner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7KAHFcUhv7ghGtsHMTqbE5q10dc--H8aG3FlJfpjRWP9gahdY8voqJjdcG0urmLCILvizrBieo90taSH6C-D7gvT40LlayguGgQM2otfxrvqQ8u1yT-H6x5BJdhWxnz_ycRZcOPCJVovBH_deppCnAanuycZqy1ptAuOhvE73KdA79UzRionPFtljNm4igQDvlTsuvgF6fFFfso0eEx9_HFco3C1R9NvnUlKSp0jbSFO2dIJfkidNAYNxvDF3R1_fpBXSYDLAIoo" />
        </div>
        <div class="absolute -bottom-2 -right-2 w-16 h-16 transform scale-x-[-1]">
          <img alt="mai flower corner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtG4sjgAxPpCvMtDC7HEOZ2K75Rqh7PW718ZI9Y-jc6OerPn380hANJtrEkw4vMHAcYWAiRZXWF8eVzngwdvZxI9usdL849M1ge4JC72kmn4A3lQQAE5RijJNlS36UoUBcibeUnirQHJwlQrWBZHACa_GoRfRebQiDbRy5Ox9ZRgduK8elH_PqSInqB9hFRZPLBWExU6KXNHeocTFCrbTqWBHYgIQy28GGrkCctcZGDXmVOTZX4hWXfFVCfP9x3EUFrnwOx9fVyxY" />
        </div>
        
        <div class="flex flex-col gap-3 text-center z-10">
          <h1 class="text-yellow-300 text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em] drop-shadow-md">
            📩 Danh sách Envelope
          </h1>
          <div id="status" class="text-yellow-100 text-base sm:text-lg font-normal leading-normal">
            Đang tải dữ liệu...
          </div>
          <table id="envelopeTable" style="display: none" class="w-full border-collapse bg-white mt-5 rounded-lg overflow-hidden">
            <thead>
              <tr class="bg-yellow-400">
                <th class="px-4 py-2 text-red-800 font-bold text-center border border-yellow-300">#</th>
                <th class="px-4 py-2 text-red-800 font-bold text-center border border-yellow-300">ID</th>
                <th class="px-4 py-2 text-red-800 font-bold text-center border border-yellow-300">Tên</th>
                <th class="px-4 py-2 text-red-800 font-bold text-center border border-yellow-300">Số tiền</th>
                <th class="px-4 py-2 text-red-800 font-bold text-center border border-yellow-300">Ngày tạo</th>
              </tr>
            </thead>
            <tbody id="tableBody" class="bg-white"></tbody>
          </table>
        </div>
        
        <div class="flex justify-center gap-3 pt-2 z-10">
          <button onclick="Router.navigate('create')" class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-yellow-400 hover:bg-yellow-300 transition-colors text-red-800 text-base font-bold leading-normal tracking-[0.015em] shadow-lg">
            <span class="truncate">➕ Tạo Mới</span>
          </button>
        </div>
      </div>
    `;
  },

  // View: Create Envelope
  viewCreate() {
    return `
      <div class="relative flex flex-col gap-6 rounded-xl border-2 border-yellow-400 bg-red-600 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div class="absolute inset-0 opacity-10 pointer-events-none">
          <img alt="fireworks" class="absolute -top-10 -left-10 w-40 h-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8JxbV5Lh3UjfpsUZOjms1SI4EU01XSKOf-ssATQQpcDw8clflsPk-2Us_v1M0LdJoLvwB2tfl39hHhA2sKgqNZVbC2doBxqOyCC3hLo7cpMZCB9_fMycSZ_H0LBvQk6fNH3c-b-2YgLke-odmHw5l4EPIgmtbPwvBOsYAWz4DqHWUY38ng3gFLxkS5s0oGoNCr8Nt00AkK6hyb-_UkVWu7X1hWPILlozzmWQVm37RU7MhfMu6t0UlS7Wz9IZYDGdp_lF8TzbPv0Q" />
          <img alt="fireworks" class="absolute -bottom-12 -right-12 w-48 h-48" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlK8dh_Mg28FlU0J_ZjAXM0trek1QYb3dpwMGcB4Pe4a_hagJPz3ZbvQs4m7spGZtbmMVDqvELfrZKoKP3hw3DEcr7i1eNgNVagIOyLySHC-MkSXoSm8D4MqVETkoXCGCHQikwKBegUvyso-BtR67LoDNJk_xZZHirRQObNAui3zaRiXYUxZ0Xrf0zMTUzVYAxLMgCs2F2LnYKkIiR6J0X2YxWdxRx3VuGewhE6MiA-dbKk0GyaQi18HN6KxJewg6ucDnYWfCG2wc" />
        </div>
        <div class="absolute -top-2 -left-2 w-16 h-16">
          <img alt="mai flower corner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7KAHFcUhv7ghGtsHMTqbE5q10dc--H8aG3FlJfpjRWP9gahdY8voqJjdcG0urmLCILvizrBieo90taSH6C-D7gvT40LlayguGgQM2otfxrvqQ8u1yT-H6x5BJdhWxnz_ycRZcOPCJVovBH_deppCnAanuycZqy1ptAuOhvE73KdA79UzRionPFtljNm4igQDvlTsuvgF6fFFfso0eEx9_HFco3C1R9NvnUlKSp0jbSFO2dIJfkidNAYNxvDF3R1_fpBXSYDLAIoo" />
        </div>
        <div class="absolute -bottom-2 -right-2 w-16 h-16 transform scale-x-[-1]">
          <img alt="mai flower corner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtG4sjgAxPpCvMtDC7HEOZ2K75Rqh7PW718ZI9Y-jc6OerPn380hANJtrEkw4vMHAcYWAiRZXWF8eVzngwdvZxI9usdL849M1ge4JC72kmn4A3lQQAE5RijJNlS36UoUBcibeUnirQHJwlQrWBZHACa_GoRfRebQiDbRy5Ox9ZRgduK8elH_PqSInqB9hFRZPLBWExU6KXNHeocTFCrbTqWBHYgIQy28GGrkCctcZGDXmVOTZX4hWXfFVCfP9x3EUFrnwOx9fVyxY" />
        </div>
        
        <div class="flex flex-col gap-2 text-center z-10">
          <h1 class="text-yellow-300 text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em] drop-shadow-md">
            🎁 Tạo Phong Bì Mới
          </h1>
          <p class="text-yellow-100 text-base font-normal leading-normal">
            Tạo một phong bì tết để gửi lời chúc tốt đẹp đến người thân yêu
          </p>
        </div>

        <form id="createEnvelopeForm" class="relative z-10 flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label for="recipientName" class="text-white text-sm font-bold leading-normal">👤 Tên người nhận</label>
            <input type="text" id="recipientName" placeholder="Nhập tên người nhận" class="block w-full rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 placeholder:text-gray-500" required />
          </div>

          <div class="flex flex-col gap-2">
            <label for="amount" class="text-white text-sm font-bold leading-normal">💰 Số tiền (VNĐ)</label>
            <input type="number" id="amount" placeholder="Nhập số tiền" min="10000" step="10000" class="block w-full rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 placeholder:text-gray-500" required />
          </div>

          <div class="flex flex-col gap-2">
            <label for="message" class="text-white text-sm font-bold leading-normal">💌 Lời chúc</label>
            <textarea id="message" placeholder="Nhập lời chúc (tối đa 200 ký tự)" maxlength="200" rows="4" class="block w-full rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 placeholder:text-gray-500 resize-none"></textarea>
            <div class="text-yellow-100 text-xs font-normal"><span id="charCount">0</span>/200 ký tự</div>
          </div>

          <div class="flex flex-col gap-2">
            <label for="template" class="text-white text-sm font-bold leading-normal">🎨 Mẫu phong bì</label>
            <select id="template" class="block w-full rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2.5 text-sm text-gray-900 focus:border-yellow-400 focus:ring-yellow-400">
              <option value="classic">🎊 Cổ điển</option>
              <option value="modern">✨ Hiện đại</option>
              <option value="elegant">🌟 Sang trọng</option>
              <option value="colorful">🌈 Sặc sỡ</option>
            </select>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="submit" class="flex flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-yellow-400 hover:bg-yellow-300 transition-colors text-red-800 text-sm font-bold leading-normal tracking-[0.015em] shadow-lg">
              <span class="truncate">📬 Tạo Phong Bì</span>
            </button>
            <button type="button" onclick="Router.navigate('list')" class="flex flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-yellow-100 hover:bg-yellow-200 transition-colors text-red-800 text-sm font-bold leading-normal tracking-[0.015em]">
              <span class="truncate">📋 Xem Danh Sách</span>
            </button>
          </div>

          <div id="formMessage" class="hidden text-center text-sm font-medium p-3 rounded-lg"></div>
        </form>
      </div>
    `;
  },

  // View: List Envelopes
  viewList() {
    return `
      <div class="relative flex flex-col gap-6 rounded-xl border-2 border-yellow-400 bg-red-600 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div class="absolute inset-0 opacity-10 pointer-events-none">
          <img alt="fireworks" class="absolute -top-10 -left-10 w-40 h-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8JxbV5Lh3UjfpsUZOjms1SI4EU01XSKOf-ssATQQpcDw8clflsPk-2Us_v1M0LdJoLvwB2tfl39hHhA2sKgqNZVbC2doBxqOyCC3hLo7cpMZCB9_fMycSZ_H0LBvQk6fNH3c-b-2YgLke-odmHw5l4EPIgmtbPwvBOsYAWz4DqHWUY38ng3gFLxkS5s0oGoNCr8Nt00AkK6hyb-_UkVWu7X1hWPILlozzmWQVm37RU7MhfMu6t0UlS7Wz9IZYDGdp_lF8TzbPv0Q" />
          <img alt="fireworks" class="absolute -bottom-12 -right-12 w-48 h-48" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlK8dh_Mg28FlU0J_ZjAXM0trek1QYb3dpwMGcB4Pe4a_hagJPz3ZbvQs4m7spGZtbmMVDqvELfrZKoKP3hw3DEcr7i1eNgNVagIOyLySHC-MkSXoSm8D4MqVETkoXCGCHQikwKBegUvyso-BtR67LoDNJk_xZZHirRQObNAui3zaRiXYUxZ0Xrf0zMTUzVYAxLMgCs2F2LnYKkIiR6J0X2YxWdxRx3VuGewhE6MiA-dbKk0GyaQi18HN6KxJewg6ucDnYWfCG2wc" />
        </div>
        <div class="absolute -top-2 -left-2 w-16 h-16">
          <img alt="mai flower corner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7KAHFcUhv7ghGtsHMTqbE5q10dc--H8aG3FlJfpjRWP9gahdY8voqJjdcG0urmLCILvizrBieo90taSH6C-D7gvT40LlayguGgQM2otfxrvqQ8u1yT-H6x5BJdhWxnz_ycRZcOPCJVovBH_deppCnAanuycZqy1ptAuOhvE73KdA79UzRionPFtljNm4igQDvlTsuvgF6fFFfso0eEx9_HFco3C1R9NvnUlKSp0jbSFO2dIJfkidNAYNxvDF3R1_fpBXSYDLAIoo" />
        </div>
        <div class="absolute -bottom-2 -right-2 w-16 h-16 transform scale-x-[-1]">
          <img alt="mai flower corner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtG4sjgAxPpCvMtDC7HEOZ2K75Rqh7PW718ZI9Y-jc6OerPn380hANJtrEkw4vMHAcYWAiRZXWF8eVzngwdvZxI9usdL849M1ge4JC72kmn4A3lQQAE5RijJNlS36UoUBcibeUnirQHJwlQrWBZHACa_GoRfRebQiDbRy5Ox9ZRgduK8elH_PqSInqB9hFRZPLBWExU6KXNHeocTFCrbTqWBHYgIQy28GGrkCctcZGDXmVOTZX4hWXfFVCfP9x3EUFrnwOx9fVyxY" />
        </div>
        
        <div class="flex flex-col gap-3 text-center z-10">
          <h1 class="text-yellow-300 text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em] drop-shadow-md">
            📋 Phong Bì Của Tôi
          </h1>
          <div id="listStatus" class="text-yellow-100 text-base font-normal leading-normal">
            Đang tải danh sách...
          </div>
          <div id="envelopeList" class="mt-5 space-y-3"></div>
        </div>
        
        <div class="flex justify-center gap-3 pt-2 z-10">
          <button onclick="Router.navigate('create')" class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-yellow-400 hover:bg-yellow-300 transition-colors text-red-800 text-base font-bold leading-normal tracking-[0.015em] shadow-lg">
            <span class="truncate">➕ Tạo Mới</span>
          </button>
          <button onclick="Router.navigate('home')" class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-yellow-100 hover:bg-yellow-200 transition-colors text-red-800 text-base font-bold leading-normal tracking-[0.015em]">
            <span class="truncate">🏠 Trang Chủ</span>
          </button>
        </div>
      </div>
    `;
  },

  // View: Settings
  viewSettings() {
    return `
      <div class="relative flex flex-col gap-6 rounded-xl border-2 border-yellow-400 bg-red-600 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div class="absolute -top-2 -left-2 w-16 h-16">
          <img alt="mai flower corner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7KAHFcUhv7ghGtsHMTqbE5q10dc--H8aG3FlJfpjRWP9gahdY8voqJjdcG0urmLCILvizrBieo90taSH6C-D7gvT40LlayguGgQM2otfxrvqQ8u1yT-H6x5BJdhWxnz_ycRZcOPCJVovBH_deppCnAanuycZqy1ptAuOhvE73KdA79UzRionPFtljNm4igQDvlTsuvgF6fFFfso0eEx9_HFco3C1R9NvnUlKSp0jbSFO2dIJfkidNAYNxvDF3R1_fpBXSYDLAIoo" />
        </div>
        <div class="absolute -bottom-2 -right-2 w-16 h-16 transform scale-x-[-1]">
          <img alt="mai flower corner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtG4sjgAxPpCvMtDC7HEOZ2K75Rqh7PW718ZI9Y-jc6OerPn380hANJtrEkw4vMHAcYWAiRZXWF8eVzngwdvZxI9usdL849M1ge4JC72kmn4A3lQQAE5RijJNlS36UoUBcibeUnirQHJwlQrWBZHACa_GoRfRebQiDbRy5Ox9ZRgduK8elH_PqSInqB9hFRZPLBWExU6KXNHeocTFCrbTqWBHYgIQy28GGrkCctcZGDXmVOTZX4hWXfFVCfP9x3EUFrnwOx9fVyxY" />
        </div>
        
        <div class="flex flex-col gap-3 text-center z-10">
          <h1 class="text-yellow-300 text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em] drop-shadow-md">
            ⚙️ Cài Đặt
          </h1>
          <p class="text-yellow-100 text-base font-normal">
            Quản lý cài đặt tài khoản của bạn
          </p>
        </div>

        <div class="relative z-10 flex flex-col gap-4">
          <div class="bg-yellow-100 rounded-lg p-4">
            <h3 class="text-red-800 font-bold mb-2">👤 Thông tin tài khoản</h3>
            <p class="text-gray-700 text-sm">Tên: <span id="settingsUserName">Đang tải...</span></p>
            <p class="text-gray-700 text-sm">Email: <span id="settingsUserEmail">Đang tải...</span></p>
          </div>

          <div class="bg-yellow-100 rounded-lg p-4">
            <h3 class="text-red-800 font-bold mb-2">🔒 Bảo mật</h3>
            <button onclick="alert('Sắp ra mắt')" class="bg-yellow-400 hover:bg-yellow-300 text-red-800 font-bold py-2 px-4 rounded-lg w-full transition">
              Đổi mật khẩu
            </button>
          </div>

          <div class="bg-yellow-100 rounded-lg p-4">
            <h3 class="text-red-800 font-bold mb-2">📢 Thông báo</h3>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked class="w-4 h-4">
              <span class="text-gray-700">Nhận thông báo qua email</span>
            </label>
          </div>
        </div>

        <div class="flex justify-center pt-2 z-10">
          <button onclick="Router.navigate('home')" class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-yellow-400 hover:bg-yellow-300 transition-colors text-red-800 text-base font-bold leading-normal tracking-[0.015em] shadow-lg">
            <span class="truncate">🏠 Quay Lại</span>
          </button>
        </div>
      </div>
    `;
  },

  // Setup event listeners
  setupEventListeners() {
    if (this.currentRoute === "create") {
      this.setupCreateForm();
    } else if (this.currentRoute === "list") {
      this.loadEnvelopes();
    } else if (this.currentRoute === "settings") {
      this.loadSettings();
    } else if (this.currentRoute === "home") {
      this.loadHomeEnvelopes();
    }
  },

  // Setup create form
  setupCreateForm() {
    const form = document.getElementById("createEnvelopeForm");
    const messageInput = document.getElementById("message");
    const charCount = document.getElementById("charCount");

    if (messageInput) {
      messageInput.addEventListener("input", function () {
        charCount.textContent = this.value.length;
      });
    }

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.createEnvelope();
      });
    }
  },

  // Create envelope
  async createEnvelope() {
    const recipientName = document.getElementById("recipientName").value.trim();
    const amount = document.getElementById("amount").value;
    const message = document.getElementById("message").value.trim();
    const template = document.getElementById("template").value;

    if (!recipientName || !amount) {
      this.showMessage("Vui lòng điền đầy đủ thông tin!", "error");
      return;
    }

    if (amount < 10000) {
      this.showMessage("Số tiền tối thiểu là 10,000 VNĐ!", "error");
      return;
    }

    try {
      const token = AuthManager.getToken();
      if (!token) {
        this.showMessage("Vui lòng đăng nhập để tạo phong bì!", "error");
        return;
      }

      const response = await fetch(`${AuthManager.API_URL}/envelope/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientName,
          amount: parseInt(amount),
          message: message || "",
          template,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Lỗi khi tạo phong bì");
      }

      this.showMessage("✅ Phong bì được tạo thành công!", "success");
      setTimeout(() => this.navigate("list"), 1500);
    } catch (error) {
      this.showMessage("❌ " + error.message, "error");
    }
  },

  // Load home envelopes
  async loadHomeEnvelopes() {
    // TODO: Load envelopes from API
  },

  // Load envelopes list
  async loadEnvelopes() {
    const listContainer = document.getElementById("envelopeList");
    const status = document.getElementById("listStatus");

    try {
      const token = AuthManager.getToken();
      if (!token) {
        status.textContent = "⚠️ Vui lòng đăng nhập để xem danh sách phong bì";
        return;
      }

      status.textContent = "Đang tải...";

      const response = await fetch(`${AuthManager.API_URL}/envelope/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Lỗi khi tải danh sách");
      }

      const envelopes = data.data || [];

      if (envelopes.length === 0) {
        status.textContent = "📭 Bạn chưa tạo phong bì nào";
        listContainer.innerHTML = "";
      } else {
        status.textContent = `📬 Bạn có ${envelopes.length} phong bì`;
        listContainer.innerHTML = envelopes
          .map(
            (env) => `
          <div class="bg-yellow-100 rounded-lg p-4 text-gray-800">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-bold">👤 ${env.recipientName}</p>
                <p class="text-sm">💰 ${env.amount.toLocaleString()} VNĐ</p>
                <p class="text-xs text-gray-600">📅 ${new Date(
                  env.createdAt
                ).toLocaleDateString("vi-VN")}</p>
              </div>
            </div>
          </div>
        `
          )
          .join("");
      }
    } catch (error) {
      status.textContent = "❌ " + error.message;
      listContainer.innerHTML = "";
    }
  },

  // Load settings
  loadSettings() {
    const user = AuthManager.getUser();
    document.getElementById("settingsUserName").textContent =
      user?.name || "Không có tên";
    document.getElementById("settingsUserEmail").textContent =
      user?.email || "Không có email";
  },

  // Show message
  showMessage(message, type) {
    const messageDiv = document.getElementById("formMessage");
    messageDiv.textContent = message;
    messageDiv.className = `${
      type === "success"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800"
    } text-center text-sm font-medium p-3 rounded-lg`;
    messageDiv.classList.remove("hidden");

    setTimeout(() => {
      messageDiv.classList.add("hidden");
    }, 3000);
  },
};
