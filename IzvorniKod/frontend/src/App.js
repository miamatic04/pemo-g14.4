import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Start from './Start';
import UserHome from './UserHome';
import Register from './Register'
import AddShop from './AddShop'
import OwnerHome from "./OwnerHome";
import MyShops from "./MyShops";
import ProductDetails from "./ProductDetails";
import Events from "./Events";
import ShopsList from "./ShopsList";
import Review from "./Review";
import PurchaseHistory from "./PurchaseHistory";
import AboutEvent from "./AboutEvent";
import District from './District';
import ShopDetails from './ShopDetails';
import UserProfile from "./UserProfile";
import Payment from "./Payment";
import Cart from "./Cart";
import ReportedReviews from './ReportedReviews';
import ReportedProducts from './ReportedProducts';
import ReportedShops from './ReportedShops';
import ReportedUsers from './ReportedUsers';
import ModeratorHome from './Navigation';
import PurchaseDetails from './PurchaseDetails';
import Forum from './Forum';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Start/>}/>
                <Route path="/userhome" element={<UserHome/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/addShop" element={<AddShop/>}/>
                <Route path="/ownerhome" element={<OwnerHome/>}/>
                <Route path="/myShops" element={<MyShops/>}/>
                <Route path="/product" element={<ProductDetails/>}/>
                <Route path="/events" element={<Events/>}/>
                <Route path="/aboutEvent" element={<AboutEvent/>}/>
                <Route path="/shopsList" element={<ShopsList/>}/>
                <Route path="/review" element={<Review/>}/>
                <Route path="/purchaseHistory" element={<PurchaseHistory/>}/>
                <Route path="/purchaseDetails" element={<PurchaseDetails/>}/>
                <Route path="/district" element={<District/>}/>
                <Route path="/shop" element={<ShopDetails />} />
                <Route path="/userProfile" element={<UserProfile/>}/>
                <Route path="/Payment" element={<Payment/>}/>
                <Route path="/cart" element={<Cart/>}></Route>
                <Route path="/moderatorhome" element={<ModeratorHome/>}></Route>
                <Route path="/reportedReviews" element={<ReportedReviews/>} />
                <Route path="/reportedProducts" element={<ReportedProducts/>} />
                <Route path="/reportedShops" element={<ReportedShops/>} />
                <Route path="/reportedUsers" element={<ReportedUsers/>} />
                <Route path="/forum" element={<Forum/>} />
            </Routes>
        </Router>
    );
};

export default App;
