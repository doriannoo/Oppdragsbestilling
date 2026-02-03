# Project Y – Digital Order Request Platform (Oppdrag 2026)

Project Y is a digital solution developed for **IM Elvebakken** to improve the way users submit task and assignment requests.  
The goal of the project is to create a structured and user-friendly platform where all necessary information is collected the first time, reducing unclear requests and inefficient follow-up.

This project combines **frontend development**, **backend integration**, and **database storage** into one complete system.

---

##  Main Purpose

The platform is designed to make it easier for:

- External customers  
- Students  
- Employees  

to submit structured order requests in a clear and professional way.

At the same time, it provides IM Elvebakken with better control and overview of incoming assignments.

---

## Features

###  Landing Page + Submission Form
Users can submit an order request through a modern landing page that includes:

- Full name  
- Email address  
- Optional phone number  
- Detailed task description  
- Desired deadline  

The form includes input validation to ensure correct and complete information.

---

### Backend + API Integration
The project includes a backend built with **Node.js and Express**.

When a user submits the form:

1. The data is sent as JSON using a **POST request**
2. The backend receives the request through the API endpoint:

