
# 🔗 LinkBio — Link-in-Bio Web Application

LinkBio is a full-stack **Link-in-Bio web application** built using the **MERN stack**. It allows users to create a personalized profile, manage multiple links, customize their profile appearance, and share their public profile through a unique username-based URL.
-

## 🚀 Features

### 🔐 Authentication
- User signup and login
- Secure password hashing
- JWT-based authentication
- HTTP-only authentication cookies
- Protected dashboard routes
- Logout functionality

### 👤 Profile Management
- Update name
- Change username
- Edit bio
- Add profile/avatar image
- Username-based public profile URL

### 🔗 Link Management
- Add new links
- Edit existing links
- Delete links
- Enable/disable links
- Drag-and-drop link reordering
- Preview links
- Open links in a new tab

### 🎨 Profile Customization
- Change background color
- Light and dark themes
- Multiple button styles
  - Square
  - Rounded
  - Pill
- Live mobile profile preview

### 🌐 Public Profile
Each user gets a public profile based on their username:

```text
http://localhost:5173/username
````

The public profile displays:

* Profile image
* Name
* Bio
* Active links
* Selected customization settings

### 📱 Responsive UI

The application is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile devices

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Axios
* Lucide React
* @dnd-kit for drag-and-drop
* CSS3

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Cookie Parser
* CORS
* dotenv

---

## 📁 Project Structure

```text
link-in-bio/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BackButton.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Links.jsx
│   │   │   ├── Customize.jsx
│   │   │   └── PublicProfile.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── profileService.js
│   │   │   └── linkService.js
│   │   │
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   ├── Auth.css
│   │   │   ├── Signup.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Profile.css
│   │   │   ├── Links.css
│   │   │   ├── Customize.css
│   │   │   ├── PublicProfile.css
│   │   │   └── BackButton.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

Navigate into the project:

```bash
cd link-in-bio
```

---

## 📦 Install Dependencies

### Install frontend dependencies

```bash
cd client
npm install
```

### Install backend dependencies

Open another terminal and run:

```bash
cd server
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

### Example

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/linkbio
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```

> ⚠️ Never commit your `.env` file to GitHub.

Make sure `.gitignore` contains:

```gitignore
node_modules/
.env
.env.local
dist/
```

---

## ▶️ Running the Application

You need to run both the frontend and backend.

### Start the backend

```bash
cd server
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## 🔄 Application Flow

```text
User
 │
 ▼
Signup / Login
 │
 ▼
Authentication
 │
 ▼
Dashboard
 │
 ├── Edit Profile
 │
 ├── Manage Links
 │      ├── Add
 │      ├── Edit
 │      ├── Delete
 │      ├── Enable / Disable
 │      └── Reorder
 │
 └── Customize Profile
        ├── Theme
        ├── Background Color
        └── Button Style
 │
 ▼
Public Profile
 │
 ▼
/username
```

---

## 🔌 API Overview

### Authentication

| Method | Endpoint           | Description            |
| ------ | ------------------ | ---------------------- |
| POST   | `/api/auth/signup` | Create a new account   |
| POST   | `/api/auth/login`  | Login user             |
| POST   | `/api/auth/logout` | Logout user            |
| GET    | `/api/auth/me`     | Get authenticated user |

### Profile

| Method | Endpoint               | Description                |
| ------ | ---------------------- | -------------------------- |
| GET    | `/api/users/me`        | Get current user's profile |
| PUT    | `/api/users/me`        | Update profile             |
| GET    | `/api/users/:username` | Get public profile         |

### Links

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| GET    | `/api/links`         | Get user's links |
| POST   | `/api/links`         | Create a link    |
| PUT    | `/api/links/:id`     | Update a link    |
| DELETE | `/api/links/:id`     | Delete a link    |
| PUT    | `/api/links/reorder` | Reorder links    |

---

## 🖥️ Main Pages

### Login

Users can securely sign in to their account.

### Signup

New users can create an account with:

* Name
* Username
* Email
* Password

### Dashboard

The dashboard provides quick access to:

* Profile management
* Link management
* Profile customization
* Public profile

### Profile

Users can manage their:

* Name
* Username
* Bio
* Avatar

### Links

Users can:

* Create links
* Edit links
* Delete links
* Toggle visibility
* Reorder links using drag and drop

### Customize

Users can personalize their public profile using:

* Background colors
* Themes
* Button styles

### Public Profile

A user's public profile can be accessed through:

```text
/:username
```

Example:

```text
http://localhost:5173/johndoe
```

---

## 🔒 Security

The application includes several security measures:

* Password hashing using `bcryptjs`
* JWT authentication
* HTTP-only cookies
* Protected API routes
* Protected frontend routes
* Input validation
* Unique usernames and email addresses
* Environment variables for sensitive configuration

---

## 🎯 Future Improvements

Some possible future enhancements:

* [ ] Image upload using Cloudinary
* [ ] Social media icons for links
* [ ] Link click analytics
* [ ] Profile view analytics
* [ ] QR code generation
* [ ] Custom fonts
* [ ] More themes
* [ ] Custom button colors
* [ ] Custom domain support
* [ ] Forgot password functionality
* [ ] Email verification
* [ ] Social login
* [ ] Profile sharing tools
* [ ] Production deployment

---

## 📸 Screenshots

Add screenshots of your application here after completing the UI.

Example:

```markdown
## Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Profile
![Profile](screenshots/profile.png)

### Link Management
![Links](screenshots/links.png)

### Customization
![Customize](screenshots/customize.png)

### Public Profile
![Public Profile](screenshots/public-profile.png)
```

---

## 🧪 Development

For development, run the frontend and backend separately.

### Frontend

```bash
cd client
npm run dev
```

### Backend

```bash
cd server
npm run dev
```

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/your-feature
```

3. Make your changes
4. Commit your changes

```bash
git add .
git commit -m "Add your feature"
```

5. Push the branch

```bash
git push origin feature/your-feature
```

6. Open a Pull Request

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

**Your Name**

Built with ❤️ using the MERN stack.

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!

````

### Before pushing to GitHub

Run these commands from your project root:

```bash
git add README.md
git commit -m "docs: add project README"
git push origin main
````

Replace `YOUR_USERNAME/YOUR_REPOSITORY` and `Your Name` in the README with your actual GitHub details.
