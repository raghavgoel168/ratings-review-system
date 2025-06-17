// const multer = require('multer');
// const path = require('path');

// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');

// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(express.json());

// // MySQL connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',              // replace with your MySQL username
//   password: 'Rg29@Rs16', // replace with your MySQL password
//   database: 'rating_system'  // name of the DB you created
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = Date.now() + ext;
//     cb(null, name);
//   }
// });

// const upload = multer({ storage: storage });
// app.use('/uploads', express.static('uploads')); // serve static images


// db.connect(err => {
//   if (err) {
//     console.error('❌ Error connecting to DB:', err);
//     return;
//   }
//   console.log('✅ Connected to MySQL DB!');
// });


// // Sample API: Get all products
// app.get('/api/products', (req, res) => {
//   db.query('SELECT * FROM products', (err, results) => {
//     if (err) return res.status(500).json(err);
//     res.json(results);
//   });
// });

// // Submit a review (rating, review text, optional image)
// app.post('/api/reviews', (req, res) => {
//   const { user_id, product_id, rating, review, image_url } = req.body;

//   // Basic validations
//   if (!user_id || !product_id || (!rating && !review)) {
//     return res.status(400).json({ error: 'Rating or review required.' });
//   }

//   const query = `
//     INSERT INTO reviews (user_id, product_id, rating, review, image_url)
//     VALUES (?, ?, ?, ?, ?)
//   `;

//   db.query(query, [user_id, product_id, rating || null, review || null, image_url || null], (err, result) => {
//     if (err) {
//       if (err.code === 'ER_DUP_ENTRY') {
//         return res.status(409).json({ error: 'You have already reviewed this product.' });
//       }
//       return res.status(500).json({ error: 'Database error', details: err });
//     }
//     res.status(201).json({ message: 'Review submitted successfully.' });
//   });
// });

// // Get all reviews for a product
// app.get('/api/products/:id/reviews', (req, res) => {
//   const productId = req.params.id;

//   const query = `
//     SELECT r.id, r.rating, r.review, r.image_url, r.created_at, u.username
//     FROM reviews r
//     JOIN users u ON r.user_id = u.id
//     WHERE r.product_id = ?
//     ORDER BY r.created_at DESC
//   `;

//   db.query(query, [productId], (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: 'Database error', details: err });
//     }
//     res.json(results);
//   });
// });

// const stopwords = new Set([
//   'the', 'is', 'and', 'this', 'that', 'it', 'was', 'with', 'for', 'a', 'an', 'of', 'in', 'to', 'i', 'my', 'we', 'our', 'on', 'very'
// ]);

// app.get('/api/products/:id/tags', async (req, res) => {
//   const productId = req.params.id;
//   console.log("Product ID:", productId);

//   try {
//     const [rows, fields] = await db.execute(
//       'SELECT review FROM reviews WHERE product_id = ?',
//       [productId]
//     );

//     console.log("Fetched Reviews:", rows);

//     const stopwords = new Set([
//       'the', 'is', 'and', 'this', 'that', 'it', 'was', 'with', 'for',
//       'a', 'an', 'of', 'in', 'to', 'i', 'my', 'we', 'our', 'on', 'very'
//     ]);

//     const wordCounts = {};

//     for (const row of rows) {
//       if (!row.review) continue;
//       const words = row.review
//         .toLowerCase()
//         .replace(/[^\w\s]/g, '')
//         .split(/\s+/)
//         .filter(word => word && !stopwords.has(word));

//       for (const word of words) {
//         wordCounts[word] = (wordCounts[word] || 0) + 1;
//       }
//     }

//     const sortedWords = Object.entries(wordCounts)
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, 5);

//     const tags = sortedWords.map(([word]) => word);
//     res.json({ tags });

//   } catch (err) {
//     console.error("Full error:", err);
//     res.status(500).json({ error: 'Error extracting tags' });
//   }
// });

// app.get('/api/products/:id/rating', (req, res) => {
//   const productId = req.params.id;

//   const query = `
//     SELECT 
//       COUNT(*) AS total_reviews,
//       ROUND(AVG(rating), 2) AS average_rating
//     FROM reviews
//     WHERE product_id = ?
//   `;

//   db.query(query, [productId], (err, results) => {
//     if (err) return res.status(500).json(err);
//     res.json(results[0]);
//   });
// });

// // Image upload route
// app.post('/api/upload', upload.single('image'), (req, res) => {
//   console.log('🧪 /api/upload route hit');
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }
//   const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
//   res.json({ imageUrl });
// });


// app.listen(port, () => {
//   console.log(`🚀 Server running at http://localhost:${port}`);
// });


const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve uploaded images

// MySQL connection
let db;
(async () => {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Rg29@Rs16',
      database: 'rating_system'
    });
    console.log('✅ Connected to MySQL DB!');
  } catch (err) {
    console.error('❌ DB Connection Error:', err);
  }
})();

// Image upload setup with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// === ROUTES ===

// 1. Get all products
app.get('/api/products', async (req, res) => {
  try {
    const [products] = await db.execute('SELECT * FROM products');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
});

// 2. Submit a review (rating, review, image URL)
app.post('/api/reviews', async (req, res) => {
  const { user_id, product_id, rating, review, image_url } = req.body;

  if (!user_id || !product_id || (!rating && !review)) {
    return res.status(400).json({ error: 'Rating or review required.' });
  }

  try {
    const query = `
      INSERT INTO reviews (user_id, product_id, rating, review, image_url)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.execute(query, [
      user_id,
      product_id,
      rating || null,
      review || null,
      image_url || null
    ]);
    res.status(201).json({ message: 'Review submitted successfully.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'You have already reviewed this product.' });
    }
    res.status(500).json({ error: 'Database error', details: err });
  }
});

// 3. Get all reviews for a product
app.get('/api/products/:id/reviews', async (req, res) => {
  const productId = req.params.id;
  try {
    const [reviews] = await db.execute(`
      SELECT r.id, r.rating, r.review, r.image_url, r.created_at, u.username
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `, [productId]);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
});

// 4. Get average rating for a product
app.get('/api/products/:id/rating', async (req, res) => {
  const productId = req.params.id;
  try {
    const [results] = await db.execute(`
      SELECT 
        COUNT(*) AS total_reviews,
        ROUND(AVG(rating), 2) AS average_rating
      FROM reviews
      WHERE product_id = ?
    `, [productId]);
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
});

// 5. Get top tags from review text
app.get('/api/products/:id/tags', async (req, res) => {
  const productId = req.params.id;
  try {
    const [rows] = await db.execute('SELECT review FROM reviews WHERE product_id = ?', [productId]);

    const stopwords = new Set([
      'the', 'is', 'and', 'this', 'that', 'it', 'was', 'with', 'for',
      'a', 'an', 'of', 'in', 'to', 'i', 'my', 'we', 'our', 'on', 'very'
    ]);

    const wordCounts = {};

    for (const row of rows) {
      if (!row.review) continue;

      const words = row.review
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word && !stopwords.has(word));

      for (const word of words) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    }

    const sortedWords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const tags = sortedWords.map(([word]) => word);
    res.json({ tags });
  } catch (err) {
    console.error('Tag extraction error:', err);
    res.status(500).json({ error: 'Error extracting tags' });
  }
});

// 6. Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
