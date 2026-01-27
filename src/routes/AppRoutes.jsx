
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import HomePage from '../pages/HomePage'
import MainLyout from '../layouts/MainLyout'

export default function AppRoutes() {
  return (
    <div>
      <Routes>
        <Route element={<MainLyout/>}>
           <Route path='/' element={<HomePage/>}></Route>
           <Route path='/login' element={<LoginPage/>}></Route>
           <Route path='/signup' element={<SignupPage/>}></Route>
           </Route>
      
     </Routes>
     

    </div>
    
    
  )
}
