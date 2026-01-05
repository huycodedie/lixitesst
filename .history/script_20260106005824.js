const API_URL = "https://websocket.lixitet.top/api/envelope/getall";

fetch(API_URL)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu");
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);

    const status = document.getElementById("status");
    const table = document.getElementById("envelopeTable");
    const tbody = document.getElementById("tableBody");

    status.style.display = "none";
    table.style.display = "table";

    // Nếu API trả về dạng { data: [...] }
    const envelopes = data.data || data;

    envelopes.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.className = "border-b border-yellow-200 hover:bg-yellow-50";

      tr.innerHTML = `
        <td class="px-4 py-2 text-center border border-yellow-200">${
          index + 1
        }</td>
        <td class="px-4 py-2 text-center border border-yellow-200">${
          item._id || ""
        }</td>
        <td class="px-4 py-2 text-center border border-yellow-200">${
          item.name || item.title || "Không có tên"
        }</td>
        <td class="px-4 py-2 text-center border border-yellow-200 text-red-600 font-semibold">${
          item.amount ? item.amount.toLocaleString() : 0
        } ₫</td>
        <td class="px-4 py-2 text-center border border-yellow-200">${
          item.createdAt ? new Date(item.createdAt).toLocaleString() : ""
        }</td>
      `;

      tbody.appendChild(tr);
    });
  })
  .catch((error) => {
    document.getElementById(
      "status"
    ).innerHTML = `<div class="text-red-500 font-semibold">❌ Lỗi: ${error.message}</div>`;
<<<<<<< HEAD
  });
