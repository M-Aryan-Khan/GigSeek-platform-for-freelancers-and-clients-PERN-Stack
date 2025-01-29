import Home from "./components/homeComponents/Home";
import Login from "./components/authComponents/Login";
import Signup from "./components/authComponents/Signup";
import FreelancerHomePage from "./components/freelancer/FreelancerHomePage";
import ClientHomePage from "./components/client/ClientHomePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FreelancerPostGig from "./components/freelancer/FreelancerPostJob";
import ClientGigView from "./components/client/ClientGigView";
import FreelancerProfile from "./components/freelancer/FreelancerProfile";
import ClientProfile from "./components/client/ClientProfile";
import ClientCardInfo from "./components/client/ClientCardInfo";
import FreelancerCardInfo from "./components/freelancer/FreelancerCardInfo";
import ClientMyOrders from "./components/client/ClientMyOrders";
import ClientPastOrders from "./components/client/ClientPastOrders";
import ClientOrderDetails from "./components/client/ClientOrderDetails";
import FreelancerOrders from "./components/freelancer/FreelancerOrders";
import FreelancerOrderDetails from "./components/freelancer/FreelancerOrderDetails";
import FreelancerPastOrders from "./components/freelancer/FreelancerPastOrders";
import ClientCompletedOrders from "./components/client/ClientCompletedOrders";

const browserRouter = createBrowserRouter([
  /*{
    path:"/",
    element:<Mainlayout/>,
    children:[
      {
        path:"/",
        element: <Home/>
      }
    ]
  },*/
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/freelancer/dashboard",
    element: <FreelancerHomePage />,
  },
  {
    path: "/freelancer/gig/post",
    element: <FreelancerPostGig />,
  },
  {
    path: "/freelancer/gig/edit/:gig_id",
    element: <FreelancerPostGig />,
  },
  {
    path: "/freelancer/profile",
    element: <FreelancerProfile />,
  },
  {
    path: "/freelancer/balance",
    element: <FreelancerCardInfo />,
  },
  {
    path: "/freelancer/current-orders",
    element: <FreelancerOrders/>,
  },
  {
    path: "/freelancer/order/:orderId",
    element: <FreelancerOrderDetails/>,
  },
  {
    path: "/freelancer/orders-history",
    element: <FreelancerPastOrders/>,
  },
  {
    path: "/client/dashboard",
    element: <ClientHomePage />,
  },
  {
    path: "/gig/view/:gig_id",
    element: <ClientGigView />,
  },
  {
    path: "/client/profile",
    element: <ClientProfile />,
  },
  {
    path: "/client/balance",
    element: <ClientCardInfo />,
  },
  {
    path: "/client/my-orders",
    element: <ClientMyOrders/>,
  },
  {
    path: "/client/completed-orders",
    element: <ClientCompletedOrders/>,
  },
  {
    path: "/client/order/:orderId",
    element: <ClientOrderDetails/>,
  },
  {
    path: "/client/orders-history",
    element: <ClientPastOrders/>,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
