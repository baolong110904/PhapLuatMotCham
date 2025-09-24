# PhapLuatMotCham
Dự án Website hỗ trợ người cao tuổi tiếp cận pháp luật theo cách ngắn gọn, trực quan, dễ thao tác. Thay vì phải đọc những văn bản rắc rối, người dùng sẽ được dẫn dắt qua hình ảnh minh họa và giọng đọc tự động để dễ dàng được nắm các bước thực hiện những thủ tục pháp lý cơ bản như sao y, công chứng, cấp lại CCCD, cấp lại giấy đăng ký kết hôn,...

## Local testing - No-login Meeting (WebRTC)

This project now includes a lightweight WebSocket signaling server (backend) and a client WebRTC implementation (frontend) that allow creating/joining meeting rooms without any login or external API.

Run backend (from project root):

```powershell
cd d:\PhapLuatMotCham\backend
npm install
npm run dev
```

Run frontend:

```powershell
cd d:\PhapLuatMotCham\frontend
npm install
npm run dev
```

Open `http://localhost:3000/meeting/people` and use `Tạo phòng riêng & Tham gia` to create a private room and share the generated link with others. No login required.

