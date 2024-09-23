# Customer Management System

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Description

The **Customer Management System** is a comprehensive web application designed to streamline the management of customers, orders, appointments, and more for businesses in the beauty industry. Built with React for the frontend and Supabase for the backend, this system offers a seamless and responsive user experience across all devices.

Additionally, a company details page is included in the CMS, allowing clients to share important business information with their users. To ensure security, the system is locked and requires login credentials. You can log in with admin@gmail.com and password admin1234 to access the details page.

- **Customer Management**: Add, view, edit, and delete customer information.
- **Order Management**: Create and manage orders, including services and products.
- **Appointment Scheduling**: Schedule and view appointments with an interactive calendar.
- **Dashboard**: Comprehensive dashboards for sales, invoices, and settings.
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices.
- **Real-time Notifications**: Receive instant feedback and alerts using toast notifications.
- **Secure Authentication**: User authentication and authorization powered by Supabase.
- **File Uploads**: Easily upload and manage customer photos and order-related files.
- **Interactive Charts**: Visualize sales and other metrics with integrated Chart.js.

## Technologies Used

### Frontend

- **React**: JavaScript library for building user interfaces.
- **React Router DOM**: Declarative routing for React applications.
- **TailwindCSS**: Utility-first CSS framework for styling.
- **Bootstrap & React-Bootstrap**: Frontend component library for responsive design.
- **Chart.js & React-Chartjs-2**: Library for creating interactive charts.
- **React Calendar**: Interactive calendar component.
- **React Dropzone**: File upload component.
- **React Icons & Heroicons**: Icon libraries for enhancing UI.
- **React Toastify**: Notification library for React.
- **Swiper**: Touch slider component for mobile devices.
- **UUID**: Library for generating unique IDs.
- **Moment.js & Date-fns**: Libraries for date manipulation.
- **SweetAlert2 & React-SweetAlert2**: Libraries for beautiful alerts and modals.

### Backend

- **Supabase**: Open-source Firebase alternative for database, authentication, and real-time features.

### Deployment

- **Vercel**: Platform for deploying frontend applications with seamless integration.

### Development Tools

- **Axios**: Promise-based HTTP client for making API requests.
- **React Scripts**: Scripts and configuration used by Create React App.
- **Testing Libraries**: Jest, React Testing Library for unit and integration testing.

## Installation

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. [Download Node.js](https://nodejs.org/)
- **npm or Yarn**: Package manager for installing dependencies.

### Steps

1. Clone the Repository:

   ```bash
   git clone https://github.com/your-username/customer-management-system.git
   cd customer-management-system


2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure your `.env` file with database credentials:
    ```env
    REACT_APP_SUPABASE_URL=your-supabase-url
    REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```
    Replace your-supabase-url and your-supabase-anon-key with your actual Supabase project credentials.

4. Start the backend server:
    ```bash
    npm start
    ```

### Frontend

1. Navigate to the frontend directory:
    ```bash
    cd client
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the frontend application:
    ```bash
    npm start
    ```

## Usage

1. Open your browser and go to `http://localhost:3000` to access the frontend.
2. Use the customer management interface to add, edit, view, and delete customer information.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
**For any questions or suggestions, feel free to reach out:**

Christine Ng
Email: chrisng219@gmail.com

## Acknowledgments

- Special thanks to the open-source community for their contributions to the tools and libraries used in this project.
- Inspiration from various React and Node.js tutorials and resources.

