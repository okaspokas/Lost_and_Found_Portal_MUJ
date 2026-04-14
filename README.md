# 🔍 Lost & Found Portal — Manipal University Jaipur

A modern full-stack web application that helps students at **Manipal University Jaipur (MUJ)** report, browse, and recover lost items on campus efficiently.

Designed with a clean UI, smart filtering, and optional backend support for real-time persistence.

---

## 🚀 Features

* 📌 Report lost & found items with detailed descriptions
* 🏫 MUJ-specific location tagging (AB1, AB2, LHC, Dome, etc.)
* 🔍 Advanced search, filtering & sorting
* 🖼️ Image upload with preview & compression
* 📱 Fully responsive (mobile + desktop)
* 🌙 Dark mode support
* ⚡ Offline fallback (works without backend)
* 🔗 Backend integration for persistent storage

---

## 🏗️ Tech Stack

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript

### Backend

* Node.js
* Express.js
* Multer (file uploads)
* Sharp (image optimization)
* JSON file storage

---

## 🧠 How It Works

* Users submit lost/found items via a form
* Data is stored:

  * **With backend:** in `data.json`
  * **Without backend:** in local fallback memory
* Items are dynamically rendered on the UI
* Users can:

  * Search by keywords
  * Filter by category/type
  * Sort by date

---

## 📂 Project Structure

```
Lost_and_found_portal/
├── index.html          # UI structure
├── style.css           # Styling (MUJ theme)
├── script.js           # Frontend logic
├── server.js           # Backend server
├── data.json           # Stored items
├── uploads/            # Uploaded images
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```
git clone <your-repo-link>
cd Lost_and_found_portal
```

### 2. Install dependencies

```
npm install
```

### 3. Start the server

```
node server.js
```

Server will run at:

```
http://localhost:3000
```

---

## 💡 Usage

1. Open the app in your browser
2. Click **Report Lost Item** or **Report Found Item**
3. Fill in details (name, category, location, date, contact)
4. Upload image (optional)
5. Submit → item appears instantly

To find items:

* Use search bar
* Apply filters (category/type)
* Sort by recent/oldest

Click any item to view contact details.

---

## ⚠️ Important Notes

* Backend OFF → data is temporary
* Backend ON → data persists in `data.json`
* Max image upload size: **5MB**
* Images are automatically optimized

---

## 🎯 Future Enhancements

* 🔐 User authentication
* 📩 Real-time notifications
* 🗄️ Database integration (MongoDB/Firebase)
* 🛠️ Admin panel
* ✅ Claim verification system

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a pull request.

---

## 📄 License

Open-source project for educational and campus use.

---

## ❤️ Built for MUJ Students

Helping students reconnect with their lost belongings — one item at a time.
