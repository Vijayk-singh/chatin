// import React from 'react';
// import { Route, Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Access authentication status

// const AuthRoute = ({ element: Component, ...rest }) => {
//   const { isLoggedIn } = useAuth(); // Access authentication status

//   return (
//     <Route
//       {...rest}
//       element={isLoggedIn ? Component : <Navigate to="/login" />} // If not logged in, redirect to login
//     />
//   );
// };

// export default AuthRoute;
