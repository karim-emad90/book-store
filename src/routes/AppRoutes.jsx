
import { Route,Routes } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import MainLyout from '../layouts/MainLyout'
import ForgetPassword from '../pages/ForgetPassword'
import AddCode from '../pages/AddCode'
import ResetPassword from '../pages/ResetPassword'
import LoginLayout from '../layouts/LoginLayout'
import BeforeLogin from '../pages/BeforeLogin'
import AfterLoginLayout from '../layouts/AfterLoginLayout'
import AfterLogin from '../pages/AfterLogin'
import ProfileLayout from '../layouts/ProfileLayout'
import ProfilePage from '../pages/ProfilePage'
import BooksLyout from '../layouts/BooksLyout'
import Books from '../pages/Books'
import Product from '../pages/Product'
import CustomerReview from '../pages/CustomerReview'
import RecommendedBooks from '../pages/RecommendedBooks'
import BeforeLoginHeader from '../components/BeforeLoginHeader'
import AboutLayout from '../layouts/AboutLayout'
import AboutPage from '../pages/AboutPage'

export default function AppRoutes() {
  return (
    <div>
      <Routes>
        
        <Route element={<LoginLayout/>}>
           <Route path='/login' element={<LoginPage/>}></Route>
           <Route path='/signup' element={<SignupPage/>}></Route>
           <Route path='/forget' element={<ForgetPassword/>}></Route>
           <Route path='/code' element={<AddCode/>}></Route>
           <Route path='/reset' element={<ResetPassword/>}></Route>
           </Route>
        <Route element={<MainLyout/>}>
           <Route path='/' element={<BeforeLogin/>}></Route>
           <Route path='/beforelogin' element={<BeforeLogin/>}></Route>

        </Route>

         <Route element={<AfterLoginLayout/>}>
           <Route path='/afterlogin' element={<AfterLogin/>}></Route>

        </Route>

        <Route element={<ProfileLayout/>}>
           <Route path='/profile' element={<ProfilePage/>}></Route>

        </Route>

        <Route element={<AboutLayout/>}>
           <Route path='/about' element={<AboutPage/>}></Route>

        </Route>

        <Route element={<BooksLyout/>}>
           <Route path='/books' element={<Books/>}></Route>
           <Route path='/bookdetails' element={<Product/>}></Route>
           <Route path='/review' element={<CustomerReview/>}></Route>
           <Route path='/recommended' element={<RecommendedBooks/>}></Route>

        </Route>
      
     </Routes>
     

    </div>
    
    
  )
}
