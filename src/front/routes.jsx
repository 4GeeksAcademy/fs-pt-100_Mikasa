// Import necessary components and functions from react-router-dom.

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { RegisterPage } from "./pages/RegisterPage";
import { JoinPage } from "./pages/JoinPage";
import { LoginPage } from "./pages/LoginPage";
import { HogarPage } from "./pages/HogarPage";
import { ComidaPage } from "./pages/ComidaPage";
import { OcioPage } from "./pages/OcioPage";
import { Register } from "./components/register";
import { Login } from "./components/login";
import {Tareas} from "./components/tareas";
import { Card } from "./components/card";
import Finanzas from "./pages/Finanzas"
import { Detalle } from "./components/Detalle";
import { DetalleReceta } from "./components/DetalleReceta";
import { Profile } from "./pages/Profile";
import { ResetPassword } from "./pages/resetPassword"


export const router = createBrowserRouter(
    createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

      // Root Route: All navigation will start from here.
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

        {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
        <Route path= "/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tareas" element={<Tareas />} />
        <Route path="/comida" element={<ComidaPage />} />
        <Route path="/card" element={<Card />} />
        <Route path="finanzas" element={<Finanzas />} />
        <Route path="profile" element={<Profile />} />
        <Route path="hogar" element={<HogarPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path ="/ocio" element={<OcioPage />} />
        <Route path="/detalle/:id" element={<Detalle />} />
        <Route path="/comida/:id" element={<DetalleReceta />} />
        <Route path="/login" element={<Login />} />

        <Route path ="/register" element ={<Register />} />
        <Route path ="/private" element ={<Private />} />
        <Route path="/reset" element={<ResetPassword />} />  


        
      </Route>
    ),
    {
      future: {
        v7_startTransition:    true,
        v7_relativeSplatPath:  true,
      },
    }
);