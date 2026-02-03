# Project Y – Digital Order Request Platform

Project Y is a digital solution made for IM Elvebakken to improve how students, staff, or customers can send in task and assignment requests.

The goal is to create a structured system where all important information is collected in one place, making follow-up easier and more efficient.

---

## What the Website Does

Users can submit an order request through a simple form including:

- Name  
- Email  
- Optional phone number  
- Task description  
- Deadline  

The form validates the input and sends the data to the backend using a POST request.

---

## How It Works

1. The user fills out the form on the landing page  
2. The request is sent to the backend API (`/api/orders`)  
3. The backend stores the order in a database (SQLite)  
4. Orders can be viewed and managed through an admin page  

---

## Admin Page

The project includes an admin dashboard where orders are displayed in a clean list.

Admins can:

- View all submitted orders  
- Delete orders if needed  

---

## Technologies Used

Frontend:

- HTML  
- CSS  
- JavaScript  

Backend:

- Node.js + Express  

Database:

- SQLite  

---

## How to Run the Project

1. Open the Backend folder in terminal:

```bash
cd Backend
npm install
npm start
