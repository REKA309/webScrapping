const fs = require('fs');
const cheerio = require('cheerio');
const express = require("express");
const bodyParser = require("body-parser");

const scrapServer = express();
scrapServer.use(bodyParser.json());

scrapServer.get("/", (req, res) => {
  // Read the index.html file
  fs.readFile('index.html', 'utf8', (err, html) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
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

      // Create an object with the extracted details and push it to the result array
      result.push({
        link,
        title,
        rating,
        price
      });

      console.log(result);
    });

    // Send the result array as the response
    res.status(200).json(result);
  });
});

module.exports = scrapServer;
