
# ShopEase — Software Requirements Specification

## 1. Project Overview

Project Name: ShopEase
Project Type: Full-Stack E-commerce Web Application
Frontend: React, JavaScript, CSS
Backend: Node.js, Express.js
Database: MongoDB
Version: 1.0

## 2. Purpose

ShopEase will allow customers to browse products, search
and filter products, manage a shopping cart, register or
log in, and place orders through a user-friendly interface.

An administrator will manage products and customer orders.

## 3. User Roles

### 3.1 Guest
- Browse available products.
- Search and filter products.
- View product details.
- Add products to a temporary shopping cart.
- Register or log in.

### 3.2 Registered Customer
- Perform guest activities.
- Maintain a shopping cart.
- Update product quantities and remove items.
- Place orders.
- View order history.
- Manage account information.

### 3.3 Administrator
- Access a protected admin dashboard.
- Create, view, update, and delete products.
- Manage inventory and product availability.
- View and update order statuses.
- View customer information when necessary.

## 4. Functional Requirements

FR-01: The system shall display a product listing.

FR-02: The system shall provide product search and category
filters.

FR-03: The system shall display individual product details.

FR-04: The system shall allow customers to add products
to their shopping cart.

FR-05: The system shall allow customers to change quantities
and remove cart items.

FR-06: The system shall calculate cart subtotals correctly.

FR-07: The system shall support customer registration
and login.

FR-08: The system shall securely store user credentials.

FR-09: The system shall save orders in the database.

FR-10: The system shall allow customers to view their orders.

FR-11: The system shall provide protected administrator
functions for managing products and orders.

FR-12: The system shall validate user input and display
useful error messages.

## 5. Non-Functional Requirements

NFR-01: The interface shall be responsive on desktop,
tablet, and mobile devices.

NFR-02: Passwords shall be hashed before database storage.

NFR-03: Protected APIs shall enforce authentication
and role-based authorization.

NFR-04: The application shall validate input on both
frontend and backend where appropriate.

NFR-05: Secrets and database credentials shall be stored
in environment variables, not committed to GitHub.

NFR-06: Errors shall be handled without exposing sensitive
server or database information.

NFR-07: The application shall use a consistent visual
design and provide clear user feedback.

## 6. Proposed Database Collections

- Users
- Products
- Carts (if persistent cart storage is implemented)
- Orders

## 7. Scope

Included:
- Product catalogue and product details
- Search and category filtering
- Shopping cart
- Registration and login
- Order creation and order history
- Administrator product and order management
- Responsive user interface

Not included in the initial version:
- Real payment gateway integration
- Live courier tracking
- Advanced recommendation algorithms

## 8. Acceptance Criteria

- Product data can be retrieved from the database.
- Search and filters return correct products.
- Cart quantities and totals are calculated correctly.
- User authentication works with secure password storage.
- Users cannot access another customer's private orders.
- Only authorized administrators can manage products.
- Valid orders are saved and can be retrieved.
- Main pages work on desktop and mobile.