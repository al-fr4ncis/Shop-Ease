# Shop Ease - Minimalist E-Commerce Website

## Overview

**Shop Ease** is a minimalist e-commerce platform focused on simplicity and ease of use. It features a clean product catalog and a responsive design optimized for a smooth user experience.

## Features

- **Product Catalog**: Display a variety of products with images, descriptions, and prices.
- **Shopping Cart**: Users can add products to their cart, view the cart, and remove items.
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices.
- **Pagination**: Efficiently manage and display large sets of product data.
- **Product Search**: Users can search for products by name or keyword.
- **Product Categories**: Filter products by categories for better navigation.

## Technologies Used

- **Frontend**:
  - Vue.js (Composition API)
  - Pinia (State Management)
  - Vue Router (Client-Side Routing)
  - SCSS (Styling)
  - Fetch API (for handling REST API requests)

- **Backend**:
  - REST API powered by [DummyJSON](https://dummyjson.com/):
  
    _DummyJSON provides a mock REST API with JSON data._

- **Build Tools**:
  - Vite

- **Development Tools**:
  - Autoprefixer

- **Linting and Formatting**:
  - ESLint
  - Prettier

- **Deployment**:
  - Vercel

## API Integration
This project uses the [DummyJSON](https://dummyjson.com) REST API, which provides fake JSON data for development purposes. Key API endpoints include:

- **Products**: `https://dummyjson.com/products`
- **Product Details**: `https://dummyjson.com/products/{id}`
- **Search Products**: `https://dummyjson.com/products/search?q=phone`
- **Get products by a category**: `https://dummyjson.com/products/category/smartphones`