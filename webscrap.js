const fs = require('fs');
const cheerio = require('cheerio');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const scrapServer = express();
scrapServer.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.thghzu2.mongodb.net/<database>${process.env.DBNAME}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increased timeout value
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Define the schema for the "products" collection
const productSchema = new mongoose.Schema({
  link: String,
  title: String,
  rating: String,
  price: String,
});

// Define the model for the "products" collection
const Product = mongoose.model('Product', productSchema);

scrapServer.get('/', (req, res) => {
  // Read the index.html file
  fs.readFile('index.html', 'utf8', (err, html) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
      return;
    }

    // Load the HTML content into Cheerio
    const $ = cheerio.load(html);

    // Select all div elements with the specified class name
    const divs = $('div.sg-col-4-of-24.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.AdHolder.sg-col.s-widget-spacing-small.sg-col-4-of-20');

    // Define an array to store the extracted details
    const result = [];

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

      // Create a new product document
      const product = new Product({
        link,
        title,
        rating,
        price,
      });

      // Save the product document to MongoDB
      product.save()
        .then(() => {
          console.log('Product saved:', product);
        })
        .catch((error) => {
          console.error('Error saving product:', error);
        });

      // Push the product details to the result array
      result.push({
        link,
        title,
        rating,
        price,
      });
    });

    // Send the result array as the response
    res.status(200).json(result);
  });
});

module.exports = scrapServer;
