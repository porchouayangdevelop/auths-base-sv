# 🚀 ระบบสมาชิกและเข้าสู่ระบบแบบเรียลไทม์

ระบบสมาชิกครบครันที่สร้างด้วย **FastifyJS** และ **MariaDB** พร้อมฟีเจอร์การแจ้งเตือนแบบเรียลไทม์ผ่าน **WebSocket**

## ✨ ฟีเจอร์หลัก

### 🔐 ระบบยืนยันตัวตน
- **ลงทะเบียนผู้ใช้** - รองรับ username, email, เบอร์โทรศัพท์
- **เข้าสู่ระบบ** - สามารถใช้ username, email หรือเบอร์โทรศัพท์ในการเข้าสู่ระบบ
- **JWT Authentication** - ระบบ token ที่ปลอดภัย
- **การเข้ารหัสรหัสผ่าน** - ใช้ bcrypt สำหรับความปลอดภัย

### 👤 การจัดการโปรไฟล์
- **อัปโหลดรูปภาพโปรไฟล์** - รองรับไฟล์ JPEG, PNG, GIF, WEBP
- **ปรับขนาดรูปภาพอัตโนมัติ** - สร้าง thumbnail และปรับขนาดรูปหลัก
- **แก้ไขข้อมูลส่วนตัว** - username, email, เบอร์โทรศัพท์
- **เปลี่ยนรหัสผ่าน** - ระบบเปลี่ยนรหัสผ่านที่ปลอดภัย

### 👑 ระบบสิทธิ์และบทบาท
- **บทบาทผู้ใช้** - Admin, Moderator, User
- **ระบบสิทธิ์** - กำหนดสิทธิ์ละเอียดสำหรับแต่ละบทบาท
- **ประวัติการเปลี่ยนแปลงสิทธิ์** - บันทึกการเปลี่ยนแปลงทั้งหมด
- **การจัดการผู้ใช้** - เปิด/ปิดการใช้งานผู้ใช้

### ⚡ ระบบเรียลไทม์
- **WebSocket Connection** - การเชื่อมต่อแบบเรียลไทม์
- **การติดตามสถานะ** - แสดงผู้ใช้ที่ออนไลน์/ออฟไลน์
- **การแจ้งเตือน** - ระบบแจ้งเตือนแบบทันที
- **การส่งข้อความ** - แชทแบบเรียลไทม์

### 📊 การจัดการและรายงาน
- **ประวัติการเข้าสู่ระบบ** - บันทึก IP และ User-Agent
- **รายงานผู้ใช้** - ข้อมูลผู้ใช้ทั้งหมดพร้อมการค้นหา
- **การตรวจสอบสุขภาพระบบ** - ตรวจสอบสถานะของระบบ

## 🛠️ เทคโนโลยีที่ใช้

- **Backend**: FastifyJS (Node.js Framework)
- **Database**: MariaDB
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: WebSocket (@fastify/websocket)
- **File Processing**: Sharp (Image Processing)
- **Validation**: Joi
- **Password Hashing**: bcrypt
- **Frontend**: HTML, CSS, Vanilla JavaScript

## 📋 ข้อกำหนดระบบ

- Node.js >= 16.0.0
- MariaDB >= 10.5
- npm หรือ yarn

## ⚙️ การติดตั้ง

### 1. Clone โปรเจค
```bash
git clone <repository-url>
cd realtime-auth-api
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables
สร้างไฟล์ `.env` และกำหนดค่าต่อไปนี้:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=realtime_auth_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=86400
WEBSOCKET_PATH=/ws
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5
```

### 4. สร้างฐานข้อมูล
```sql
CREATE DATABASE realtime_auth_db;
```

### 5. เริ่มต้นเซิร์ฟเวอร์
```bash
# Development
npm run dev

# Production
npm start
```

เซิร์ฟเวอร์จะเริ่มที่ `http://localhost:3000`

## 📡 API Endpoints

### Authentication
```
POST /api/users/register      # ลงทะเบียนผู้ใช้
POST /api/users/login         # เข้าสู่ระบบ
POST /api/users/logout        # ออกจากระบบ
```

### Profile Management
```
GET  /api/users/profile       # ดูโปรไฟล์
PUT  /api/users/profile       # แก้ไขโปรไฟล์
PUT  /api/users/change-password # เปลี่ยนรหัสผ่าน
```

### File Upload
```
POST   /api/users/profile-picture    # อัปโหลดรูปโปรไฟล์
DELETE /api/users/profile-picture    # ลบรูปโปรไฟล์
GET    /api/users/profile-picture/:userId # ดูรูปโปรไฟล์
```

### Role & Permission Management (Admin Only)
```
GET    /api/users/roles              # ดูบทบาททั้งหมด
POST   /api/users/roles              # สร้างบทบาทใหม่
PUT    /api/users/roles/:id          # แก้ไขบทบาท
DELETE /api/users/roles/:id          # ลบบทบาท

GET    /api/users/permissions        # ดูสิทธิ์ทั้งหมด
POST   /api/users/permissions        # สร้างสิทธิ์ใหม่
PUT    /api/users/permissions/:id    # แก้ไขสิทธิ์
DELETE /api/users/permissions/:id    # ลบสิทธิ์

PUT    /api/users/:userId/role       # เปลี่ยนบทบาทผู้ใช้
GET    /api/users/:userId/role-history # ประวัติการเปลี่ยนบทบาท
```

### User Management (Admin/Moderator)
```
GET /api/users/all                   # ดูผู้ใช้ทั้งหมด
GET /api/users/:userId               # ดูข้อมูลผู้ใช้
PUT /api/users/:userId/status        # เปิด/ปิดการใช้งาน
```

### Real-time Features
```
GET /api/users/online-users          # ผู้ใช้ที่ออนไลน์
GET /api/users/notifications         # การแจ้งเตือน
PUT /api/users/notifications/:id/read # อ่านการแจ้งเตือน
POST /api/users/notification         # ส่งการแจ้งเตือน
POST /api/users/broadcast-notification # แจ้งเตือนทุกคน
```

### System
```
GET /health                          # ตรวจสอบสุขภาพระบบ
```

## 🔌 WebSocket Events

### Client → Server
```javascript
{
  "type": "message",
  "content": "Hello World",
  "recipientId": 123  // optional, for private message
}

{
  "type": "update_status",
  "status": "online" | "offline" | "away"
}

{
  "type": "get_notifications"
}

{
  "type": "mark_notification_read",
  "notificationId": 456
}
```

### Server → Client
```javascript
{
  "type": "connected",
  "user": { "id": 1, "username": "user1" }
}

{
  "type": "online_users",
  "users": [...]
}

{
  "type": "user_status_change",
  "data": {
    "userId": 1,
    "username": "user1",
    "status": "online",
    "timestamp": "2025-01-01T00:00:00Z"
  }
}

{
  "type": "message",
  "data": {
    "senderId": 1,
    "senderName": "user1",
    "message": "Hello",
    "timestamp": "2025-01-01T00:00:00Z"
  }
}

{
  "type": "notification",
  "data": {
    "title": "แจ้งเตือน",
    "message": "ข้อความแจ้งเตือน",
    "timestamp": "2025-01-01T00:00:00Z"
  }
}
```

## 🗄️ โครงสร้างฐานข้อมูล

### ตารางหลัก
- **users** - ข้อมูลผู้ใช้
- **roles** - บทบาทผู้ใช้
- **permissions** - สิทธิ์ของระบบ
- **role_permissions** - ความสัมพันธ์ระหว่างบทบาทและสิทธิ์
- **user_status** - สถานะการออนไลน์ของผู้ใช้
- **notifications** - การแจ้งเตือน
- **login_history** - ประวัติการเข้าสู่ระบบ
- **permission_history** - ประวัติการเปลี่ยนแปลงสิทธิ์

## 🎯 การใช้งาน

### 1. เปิดเว็บไซต์
ไปที่ `http://localhost:3000/public/` เพื่อดูหน้าเว็บตัวอย่าง

### 2. ลงทะเบียนผู้ใช้
- กรอกข้อมูล username, email, เบอร์โทรศัพท์, รหัสผ่าน
- ระบบจะสร้างผู้ใช้ด้วยบทบาท "user" เป็นค่าเริ่มต้น

### 3. เข้าสู่ระบบ
- ใช้ username, email หรือเบอร์โทรศัพท์ในการเข้าสู่ระบบ
- รับ JWT token สำหรับการยืนยันตัวตน

### 4. จัดการโปรไฟล์
- แก้ไขข้อมูลส่วนตัว
- อัปโหลดรูปภาพโปรไฟล์
- เปลี่ยนรหัสผ่าน

### 5. ใช้งานฟีเจอร์เรียลไทม์
- เชื่อมต่อ WebSocket
- ดูผู้ใช้ที่ออนไลน์
- ส่งข้อความแบบเรียลไทม์
- รับการแจ้งเตือน

## 🔒 ระบบสิทธิ์

### บทบาทเริ่มต้น
1. **Admin** - สิทธิ์ทั้งหมด
2. **Moderator** - สิทธิ์อ่านและส่งการแจ้งเตือน
3. **User** - สิทธิ์อ่านพื้นฐาน

### สิทธิ์เริ่มต้น
- `user:read` - อ่านข้อมูลผู้ใช้
- `user:write` - แก้ไขข้อมูลผู้ใช้
- `user:delete` - ลบผู้ใช้
- `role:manage` - จัดการบทบาทและสิทธิ์
- `notification:send` - ส่งการแจ้งเตือน
- `report:view` - ดูรายงาน

## 📁 โครงสร้างไฟล์

```
realtime-auth-api/
├── src/
│   ├── app.js                     # จุดเริ่มต้นแอปพลิเคชัน
│   ├── config/
│   │   └── database.js            # การกำหนดค่าฐานข้อมูล
│   ├── controllers/
│   │   ├── userController.js      # ตัวควบคุมผู้ใช้
│   │   ├── profileController.js   # ตัวควบคุมโปรไฟล์
│   │   └── rolePermissionController.js # ตัวควบคุมสิทธิ์
│   ├── models/
│   │   ├── userModel.js           # โมเดลผู้ใช้
│   │   ├── userStatusModel.js     # โมเดลสถานะผู้ใช้
│   │   └── rolePermissionModel.js # โมเดลสิทธิ์
│   ├── routes/
│   │   └── userRoutes.js          # เส้นทาง API
│   ├── services/
│   │   ├── authService.js         # บริการยืนยันตัวตน
│   │   ├── notificationService.js # บริการแจ้งเตือน
│   │   └── fileUploadService.js   # บริการอัปโหลดไฟล์
│   ├── websocket/
│   │   └── handlers.js            # ตัวจัดการ WebSocket
│   └── utils/
│       ├── jwtUtils.js            # ยูทิลิตี้ JWT
│       └── passwordUtils.js       # ยูทิลิตี้รหัสผ่าน
├── public/
│   └── index.html                 # หน้าเว็บตัวอย่าง
├── uploads/                       # ไดเรกทอรีไฟล์อัปโหลด
├── .env.example                   # ตัวอย่างไฟล์ environment
├── package.json
└── README.md
```

## 🐛 การแก้ไขปัญหา

### ปัญหาการเชื่อมต่อฐานข้อมูล
```bash
# ตรวจสอบว่า MariaDB ทำงานอยู่
sudo systemctl status mariadb

# ตรวจสอบการเชื่อมต่อ
mysql -u root -p -h localhost -P 3306
```

### ปัญหา WebSocket
- ตรวจสอบว่า token ถูกต้อง
- ตรวจสอบ CORS settings
- ดู Console ใน Developer Tools

### ปัญหาการอัปโหลดไฟล์
- ตรวจสอบขนาดไฟล์ (ค่าเริ่มต้น 5MB)
- ตรวจสอบประเภทไฟล์ที่รองรับ
- ตรวจสอบสิทธิ์ในการเขียนไฟล์

## 📈 การพัฒนาต่อ

### ฟีเจอร์ที่สามารถเพิ่มได้
- [ ] ระบบ Email Verification
- [ ] Two-Factor Authentication (2FA)
- [ ] Social Media Login
- [ ] File Storage ใน Cloud (AWS S3, Google Cloud)
- [ ] Rate Limiting
- [ ] API Documentation (Swagger)
- [ ] Unit Tests
- [ ] Docker Support
- [ ] Logging System
- [ ] Performance Monitoring

### การเพิ่มประสิทธิภาพ
- Database Indexing
- Connection Pooling
- Caching (Redis)
- CDN สำหรับไฟล์ Static
- Load Balancing

## 🤝 การสนับสนุน

หากพบปัญหาหรือต้องการสอบถาม:
1. เปิด Issue ใน GitHub
2. ตรวจสอบ Logs ใน Console
3. ตรวจสอบไฟล์ `.env` ว่าถูกต้อง

## 📄 License

MIT License - ดูรายละเอียดในไฟล์ LICENSE