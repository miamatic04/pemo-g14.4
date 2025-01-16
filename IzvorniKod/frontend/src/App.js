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
                <Route path="/district" element={<District/>}/>
                <Route path="/shop" element={<ShopDetails />} />
                <Route path="/userProfile" element={<UserProfile/>}/>
                <Route path="/Payment" element={<Payment/>}/>
            </Routes>
        </Router>
    );
};

export default App;
