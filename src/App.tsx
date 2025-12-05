import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public pages
import Landing from "./pages/Landing";
import RegisterType from "./pages/RegisterType";
import Register from "./pages/Register";
import Login from "./pages/Login";

// Client pages
import ClientHome from "./pages/client/Home";
import ClientDashboard from "./pages/client/Dashboard";
import ClientProfile from "./pages/client/Profile";
import ClientFavorites from "./pages/client/Favorites";
import ClientBookings from "./pages/client/Bookings";
import Barbershops from "./pages/client/Barbershops";
import BarbershopDetail from "./pages/client/BarbershopDetail";

// Booking flow
import SelectService from "./pages/booking/SelectService";
import SelectBarber from "./pages/booking/SelectBarber";
import SelectTime from "./pages/booking/SelectTime";
import BookingConfirm from "./pages/booking/Confirm";

// Barber pages
import BarberHome from "./pages/barber/Home";
import BarberDashboard from "./pages/barber/Dashboard";
import BarberAgenda from "./pages/barber/Agenda";
import BarberProfile from "./pages/barber/Profile";

// Owner pages
import OwnerOnboarding from "./pages/owner/Onboarding";
import OwnerDashboard from "./pages/owner/Dashboard";
import BarbershopEdit from "./pages/owner/BarbershopEdit";
import OwnerServices from "./pages/owner/Services";
import OwnerCategories from "./pages/owner/Categories";
import OwnerTeam from "./pages/owner/Team";
import OwnerFinance from "./pages/owner/Finance";
import OwnerAvailability from "./pages/owner/Availability";

// Errors
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>

          {/** PUBLIC ROUTES */}
          <Route path="/" element={<Landing />} />
          <Route path="/register-type" element={<RegisterType />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/** CLIENT ROUTES */}
          <Route path="/client/home" element={<ClientHome />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/profile" element={<ClientProfile />} />
          <Route path="/client/favorites" element={<ClientFavorites />} />
          <Route path="/client/bookings" element={<ClientBookings />} />
          <Route path="/barbershops" element={<Barbershops />} />
          <Route path="/barbershops/:id" element={<BarbershopDetail />} />

          {/** BOOKING FLOW */}
          <Route path="/booking/select-service" element={<SelectService />} />
          <Route path="/booking/select-barber" element={<SelectBarber />} />
          <Route path="/booking/select-time" element={<SelectTime />} />
          <Route path="/booking/confirm" element={<BookingConfirm />} />

          {/** BARBER ROUTES */}
          <Route path="/barber/home" element={<BarberHome />} />
          <Route path="/barber/dashboard" element={<BarberDashboard />} />
          <Route path="/barber/agenda" element={<BarberAgenda />} />
          <Route path="/barber/profile" element={<BarberProfile />} />

          {/** OWNER ROUTES */}
          <Route path="/owner/onboarding" element={<OwnerOnboarding />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/barbershop/edit" element={<BarbershopEdit />} />
          <Route path="/owner/services" element={<OwnerServices />} />
          <Route path="/owner/categories" element={<OwnerCategories />} />
          <Route path="/owner/team" element={<OwnerTeam />} />
          <Route path="/owner/finance" element={<OwnerFinance />} />
          <Route path="/owner/availability" element={<OwnerAvailability />} />

          {/** NOT FOUND */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
