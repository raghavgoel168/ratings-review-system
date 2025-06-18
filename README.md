# ⭐ Ratings & Review System

A full-stack web application for users to rate and review products with optional images. It displays all products, their average ratings, and associated reviews, including the most used keywords (tags) from user feedback.

---

## 🧱 Tech Stack

- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Node.js, Express.js  
- **Database**: MySQL  
- **File Uploads**: Multer  
- **API**: RESTful APIs using Express  
- **Others**: CORS, MySQL2, multer for handling multipart image uploads

---

## 📁 Project Structure

```plaintext
project-root/
├── backend/
│   └── server.js           # Express server with routes and DB integration
├── db/
│   └── schema.sql          # SQL script to create database and tables
├── uploads/                # Folder for uploaded review images
├── frontend/
│   ├── index.html          # Product listing and rating summary page
│   └── product.html        # Review and rating page for a single product
```
---

## ⚙️ Setup Instructions

### 1. 📦 Install Backend Dependencies

Make sure you have Node.js and npm installed.

```bash
cd backend
npm install express mysql2 multer cors
```

### 2. 🛠️ Set Up MySQL Database

Ensure MySQL is running. Then execute the 'schema.sql' using MySQL CLI:

```bash
SOURCE /path/to/db/schema.sql;
```

This will:

- Create the rating_system database

- Create users, products, and reviews tables

### 3. 🔐 Database Password Setup
In `backend/server.js`, replace:
```bash
password: 'enter_password',
```
with your actual MySQL root password before running the server.

### 4. 🚀 Start the Backend Server

```bash
cd backend
node server.js
```

You should see:

```bash
✅ Connected to MySQL DB!
🚀 Server running at http://localhost:3000
```

### 4. 🌐 Frontend Setup

Open these files directly in your browser or serve using Live Server:

- `frontend/index.html` : Lists all products and their ratings
- `frontend/product.html?id=PRODUCT_ID` : Shows and allows posting reviews for a selected product

Ensure your backend is running at http://localhost:3000 .

---

## 🧪 API Endpoints

- Products
  
  `GET /api/products`  -> Get all products.
  

- Reviews
  
  `GET /api/products/:id/reviews`  -> Get all reviews for a product.

  `POST /api/reviews`  -> Submit a review.

  **Request Body (JSON):**
  
  ```bash
  {
    "user_id": 1,
    "product_id": 2,
    "rating": 5,
    "review": "Great product!",
    "image_url": "http://localhost:3000/uploads/example.jpg"
  }
  ```

  `GET /api/products/:id/rating`  -> Returns average rating and total number of reviews.

- Tags
  
  `GET /api/products/:id/tags`  -> Returns top 5 keywords from reviews for the product.

- Upload Image

  `POST /api/upload`  -> Upload image using 'multipart/form-data'.

  Form field: image
  **Returns:**

  ```bash
  {
  "imageUrl": "http://localhost:3000/uploads/<filename>.jpg"
  }
  ```

## 📷 Screenshots

### 🏠 Home Page – Product Listing
![Home Page](./assets/ScreenShot.png)

### 📄 Product Page – Submit Review
![Product Page](./assets/demo2.png)

## 🧪 Testing Tips

- Open `index.html` and click on a product to view or post reviews.
- Use tools like **Postman** to test endpoints manually.
- Try uploading a review image and confirm it's stored under `/uploads/`.

---

## 🔐 Important Notes

- ✅ One review **per product per user** is enforced in the database.
- ✅ The server filters common stopwords like `"the"`, `"is"`, etc., while generating tags.
- ✅ Review submission accepts **either a rating, a review, or both**.

---

## ✨ Features Summary

- ✅ Product list with average ratings  
- ✅ Review submission with optional image  
- ✅ Unique review per user-product combo  
- ✅ Keyword (tag) extraction from reviews  
- ✅ Responsive API with error handling  
- ✅ Image uploads via Multer  

---

## 📦 Future Enhancements

- 🔐 User login/signup system  
- 📃 Pagination for large review lists  
- 🎨 UI design upgrades  
- 🛠️ Admin panel for product management  
- 🐳 Docker containerization  

---

## 👨‍💻 Author

**Raghav Goel**  
📧 [raghavgoel168@gmail.com](mailto:raghavgoel168@gmail.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/raghavgoel29)  