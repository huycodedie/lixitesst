// Simple hash router for pages: home, create, received
(function () {
  const app = document.getElementById('app');
  if (!app) return;

  // Save current main content as home template
  const templates = {
    home: app.innerHTML,
    create: `
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-center">
          <div class="w-full max-w-2xl">
            <div class="relative flex flex-col gap-6 rounded-xl border-2 border-yellow-400 bg-white p-6 sm:p-8 shadow-2xl">
              <h1 class="text-red-700 text-2xl font-bold">➕ Tạo phong bao</h1>
              <form id="createEnvelopeForm" class="flex flex-col gap-4">
                <input id="envName" class="border p-2 rounded" placeholder="Tên phong bao" />
                <input id="envAmount" type="number" class="border p-2 rounded" placeholder="Số tiền" />
                <button type="submit" class="px-4 py-2 bg-red-500 text-white rounded">Tạo</button>
              </form>
              <div id="createStatus" class="text-sm text-gray-600"></div>
            </div>
          </div>
        </div>
      </div>
    `,
    received: `
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-center">
          <div class="w-full max-w-2xl">
            <div class="relative flex flex-col gap-6 rounded-xl border-2 border-yellow-400 bg-white p-6 sm:p-8 shadow-2xl">
              <h1 class="text-red-700 text-2xl font-bold">📬 Phong bao đã nhận</h1>
              <div id="receivedList" class="mt-4 text-gray-800">Chưa có phong bao nhận.</div>
            </div>
          </div>
        </div>
      </div>
    `,
  };

  function render(route) {
    route = route || 'home';
    if (route === 'home') {
      app.innerHTML = templates.home;
    } else if (route === 'create') {
      app.innerHTML = templates.create;
      attachCreateHandlers();
    } else if (route === 'received') {
      app.innerHTML = templates.received;
      // could fetch received list here
    } else {
      app.innerHTML = templates.home;
    }
  }

  function parseHash() {
    const hash = location.hash || '#/home';
    const parts = hash.replace(/^#\/?/, '').split('/');
    return parts[0] || 'home';
  }

  function onHashChange() {
    const route = parseHash();
    render(route);
  }

  function attachCreateHandlers() {
    const form = document.getElementById('createEnvelopeForm');
    const status = document.getElementById('createStatus');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('envName').value.trim();
      const amount = document.getElementById('envAmount').value.trim();
      status.textContent = 'Đang tạo...';
      // placeholder: no backend wired here
      setTimeout(() => {
        status.textContent = `Đã tạo phong bao "${name}" với số tiền ${amount}`;
      }, 600);
    });
  }

  // initialize
  window.addEventListener('hashchange', onHashChange);
  document.addEventListener('DOMContentLoaded', function () {
    // render initial route
    const route = parseHash();
    render(route);

    // if hash is empty, ensure #/home
    if (!location.hash) location.replace('#/home');
  });
})();
