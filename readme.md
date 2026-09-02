# 🏞️ Natours - Tour Booking Application

A full-stack web application built with **Node.js, Express, MongoDB, and Pug**.  
Users can explore tours, book tours, leave reviews, and manage their accounts.

---

## 🚀 Live Demo

👉 [Click here to view the live demo](https://natours-zyht.onrender.com/)

---

## 📚 API Documentation

👉 [View Swagger API Documentation](https://natours-zyht.onrender.com/api-docs)

---

## 📌 Features

- 🔐 User Authentication & Authorization using JWT and secure cookies
- 👥 Role-based access control for **Users and Admins**
- 🌍 Browse and explore available tours
- 🗺️ Interactive tour maps using Mapbox
- 📅 Book tours directly through the application
- ⭐ Add reviews and ratings for tours
- 👤 Manage account information and profile photo
- 📷 Image uploads using Cloudinary
- 📧 Email functionality using Nodemailer
- 🛡️ Protected routes and authentication middleware
- 📚 Interactive API documentation with Swagger
- 📄 Server-side rendered pages using Pug
- 📱 Responsive user interface

---

## 🛠️ Tech Stack

### Backend

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **Pug**

### Authentication & Security

- **JWT (JSON Web Tokens)**
- **bcrypt**
- **HTTP-only Cookies**
- **Role-Based Authorization**

### APIs & Services

- **Mapbox** – Interactive maps and geolocation
- **Cloudinary** – Image storage and uploads
- **Nodemailer** – Email services
- **Swagger / OpenAPI** – API documentation

### File Uploads

- **Multer**
- **Multer Storage Cloudinary**

### Other Tools

- **dotenv** – Environment variable management
- **Morgan** – HTTP request logging
- **Helmet** – Security headers
- **CORS** – Cross-Origin Resource Sharing
- **Express Rate Limit** – API rate limiting

### Frontend

- **Pug Templates**
- **CSS**
- **Vanilla JavaScript**
- **Axios**

---

## 📂 Project Structure

```text
Natours/
├── controllers/
├── models/
├── routes/
├── views/
├── public/
├── utils/
├── config/
├── app.js
├── server.js
└── package.json
