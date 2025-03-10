# Options Pricing Visualizer

## Building for Production

```bash
# From the root directory
npm run build
```

## For All Testing

```bash
# Run all tests
npm test

# Run frontend tests only
npm run test:frontend

# Run backend tests only
npm run test:backend
```

## If you want to contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.


# Working it out
Start the development servers:
The application will be available at:
Frontend: http://localhost:3000
Backend: http://localhost:5000


# So far, what i have done:

WASM implementation for fast options pricing calculations
Interactive visualization of option prices vs strike prices
Greeks visualization (Delta, Gamma, Theta, Vega)
Backend API with SQLite database
Frontend API service for data fetching
Added a historical data visualization component that shows option prices over time
Added a sample data generation and database seeding
Made smooth integration with the existing visualization components

# Considering doing this next:
Add historical data visualization
Implement user authentication
Add more advanced features like:
Option chains
Implied volatility surface
Portfolio analysis
Risk metrics

# Okay, rants

- I tried to setup the app components to include the auth and protected routes in app.jsx
- i also made sure the navbar.js component now has the logout functionality, before i forget t
- the problem has been with npm, the package.json file shii, so i finally found a way now, i will just add the new dependencies.
- since i won't be sharing the setup.sh file, i updated it with the jwt secret key
- since i have implemented the user auth and components, i want to run a quick test. 
- common sense would ask that you do something like `JWT_SECRET=$(openssl rand -base64 32)`

## For the Backend, I have fixed:
✅ Server setup with Express
✅ Database setup with SQLite
✅ Authentication routes (login/register)
✅ Protected routes for user preferences and calculations
✅ JWT authentication middleware
✅ Error handling

## For the Frontend, I have fixed:
✅ Authentication context and provider
✅ Login and Register components
✅ Protected routes
✅ API service for backend communication
✅ Navbar with logout functionality
✅ Main App component with routing

## As for Dependencies,  I have this now:
✅ Backend dependencies (express, bcrypt, jwt, etc.)
✅ Frontend dependencies (react, mui, d3, etc.)
Configuration:
✅ Environment variables setup
✅ Database initialization
✅ API endpoints configuration
The only thing I am thinking of adding now is a loading state component to improve the user experience during authentication checks. Maybe I should just add that then.

Okay, if i add a loadingspinner.js script, would have to update the protected route component again. i need to stop!

## At this point, I have done enough with the complete authentication system, we now have:
User registration and login
Protected routes
JWT-based authentication
User preferences storage
Calculation history
Loading states
Error handling
Secure password hashing
Token-based session management
The application is ready to use! Users can:
Register a new account
Log in with their credentials
Access protected features
Save their preferences
View their calculation history
Log out securely

Let me go and focus on the project itself.

wait! wtf?!
seem the backend is having an issue

`ps aux | grep node | cat`

checked the servers and what is going on, and since both are running and even the frontend vite server is running...i should be good. 

`curl http://localhost:5000/api/health | cat`

wait! the backend is not responding o...even tho it is running.

let me quickly add an healthcheck endpoint to the backend, i dont like stress:

```js
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});
```

let me check the frontend api config again, might have made mistakes. but this looks good, God abeg!

```bash
pkill -f "node src/server.js" && pkill -f "vite"
```
had to stop the current servers, let me know what is wrong afresh...and now restarted both.
`cd backend && npm start`
`cd frontend && npm run dev`

let me verify if both is running again: `curl http://localhost:5000/api/health | cat`

i think i know what is wrong.  let me fix the error in the frontend/src/contexts/AuthContext.js side of things. it just occured to me to rename the file `mv frontend/src/contexts/AuthContext.js frontend/src/contexts/AuthContext.jsx`

having done that, let me update any imports that reference thi file atleast, make ah see clear. also, maybe other parts of the project even uses the shii. oh, navbar.js uses it sef,