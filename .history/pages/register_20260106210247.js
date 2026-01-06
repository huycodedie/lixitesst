(function () {
  async function handleRegisterClick() {
    if (typeof AuthManager === 'undefined') {
      alert('AuthManager không khả dụng.');
      return;
    }

    const fullnameEl = document.getElementById('fullname');
    const emailEl = document.getElementById('email');
    const passwordEl = document.getElementById('password');
    const confEl = document.getElementById('confirmpassword');
    const termsEl = document.getElementById('terms');
    const btn = document.getElementById('registerBtn');

    const fullname = fullnameEl ? fullnameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const password = passwordEl ? passwordEl.value : '';
    const conf = confEl ? confEl.value : '';
    const terms = termsEl ? termsEl.checked : false;

    if (!email || !password) {
      alert('Vui lòng nhập email và mật khẩu.');
      return;
    }

    if (password.length < 8) {
      alert('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }

    if (password !== conf) {
      alert('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    if (!terms) {
      alert('Vui lòng đồng ý với điều khoản sử dụng.');
      return;
    }

    if (!btn) return;
    const original = btn.innerHTML;
    btn.innerHTML = '<span class="truncate">Đang xử lý...</span>';
    btn.disabled = true;

    try {
      const res = await AuthManager.register({ email, password, fullname });

      if (res && (res.success === false || res.message)) {
        const msg = res.message || 'Đăng ký không thành công';
        alert(msg);
        btn.innerHTML = original;
        btn.disabled = false;
        return;
      }

      alert('Đăng ký thành công. Vui lòng đăng nhập.');
      window.location.href = './login.html';
    } catch (err) {
      alert('Lỗi: ' + (err.message || 'Không thể đăng ký'));
      btn.innerHTML = original;
      btn.disabled = false;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('registerBtn');
    if (btn) btn.addEventListener('click', handleRegisterClick);
  });
})();
