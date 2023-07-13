const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');

// Create an Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a schema for the product
const productSchema = new mongoose.Schema({
  link: String,
  title: String,
  rating: String,
  price: String,
});

// Create a model for the product
const Product = mongoose.model('Product', productSchema);

// GET request to scrape data from a website
app.get('/scrape', async (req, res) => {
  try {
    fs.readFile('index.html', 'utf8', (err, html) => {
      if (err) {
        console.error(err);
        res.status(500).send('Server error');
        return;
      }
      console.log("success")
      const $ = cheerio.load(html);

      // Select all div elements with the specified class name
      const divs = $('div.sg-col-4-of-24.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.AdHolder.sg-col.s-widget-spacing-small.sg-col-4-of-20');
  
      // Define an array to store the extracted details
      const products = [];
  
      // Iterate over each div and extract the desired information
      divs.each((index, div) => {
        const img = $(div).find('img.s-image').first();
        const link = img.attr('src') || '';
  
        const titleSpan = $(div).find('span.a-size-base-plus.a-color-base.a-text-normal').first();
        const title = titleSpan.text() || '';
  
        const ratingSpan = $(div).find('span.a-icon-alt').first();
        const rating = ratingSpan.text() || '';
  
        const priceSpan = $(div).find('span.a-price-whole').first();
        const price = priceSpan.text() || '';
        products.push({ link, title, rating, price })
      })
      
    })
    
    // const product = new Product(products[0]);

    // // Save the product to the database
    // await product.save();
    // res.status(201).json({ message: 'Product saved successfully' });
    console.log(products)
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to scrape data from the website' });
  }
});

// POST request to save data in MongoDB
app.post('/products', async (req, res) => {
  try {
    // Extract the product data from the request body
   
    // Create a new instance of the Product model
    

   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save product in MongoDB' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
