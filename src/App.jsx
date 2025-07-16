import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import BlackBoardLogin from './components/BlackBoardLogin.jsx'
import Callback from './components/Callback.jsx'
import Home from './components/Home.jsx'
import Login from './components/Login';
import Course from './components/Course.jsx';
import Student from './components/Student.jsx';



const router =  createBrowserRouter([
  {
    path:'/',
    element: <Login/>,
    errorElement: <div>Error 404</div>
  },
  {
    path:'/blackboardLogin',
    element: <BlackBoardLogin/>,
    errorElement: <div>Error 404</div>
  },
  {
    path:'/callback',
    element: <Callback/>,
    errorElement: <div>Error 404</div>
  },
  {
    path:'/home',
    element: <Home/>,
    errorElement: <div>Error 404</div>
  },
  {
    path:'/course',
    element: <Course/>,
    errorElement: <div>Error 404</div>
  },
  {
    path:'/student',
    element: <Student/>,
    errorElement: <div>Error 404</div>
  }
]);


function App() {
  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App
