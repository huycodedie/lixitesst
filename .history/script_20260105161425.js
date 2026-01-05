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

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${item._id || ""}</td>
        <td>${item.name || item.title || "Không có tên"}</td>
        <td>${item.amount ? item.amount.toLocaleString() : 0} ₫</td>
        <td>${
          item.createdAt ? new Date(item.createdAt).toLocaleString() : ""
        }</td>
      `;

      tbody.appendChild(tr);
    });
  })
  .catch((error) => {
    document.getElementById(
      "status"
    ).innerHTML = `<div class="error">❌ Lỗi: ${error.message}</div>`;
  });
