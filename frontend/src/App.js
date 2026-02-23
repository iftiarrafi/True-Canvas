import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from "./pages/Home.jsx"
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Private from './pages/private/Private.jsx'
import Posts from "./pages/Posts.jsx"
import Myprofile from "./pages/Profile.jsx"
import SinglePost from './pages/SinglePost.jsx'
import CreatePost from './pages/CreatePost.jsx'
import About from './pages/About.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Navbar from './components/Navbar.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/about' element={<About />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/post/:postId' element={<SinglePost />} />
        <Route path='/private' element={<Private />}>
          <Route path='posts' element={<Posts />} />
          <Route path='profile' element={<Myprofile />} />
          <Route path='create' element={<CreatePost />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App