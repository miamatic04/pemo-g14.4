import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Start from './Start';
import UserHome from './User&Owner/UserHome';
import Register from './Register'
import AddShop from './User&Owner/AddShop'
import OwnerHome from "./User&Owner/OwnerHome";
import MyShops from "./User&Owner/MyShops";
import ProductDetails from "./User&Owner/ProductDetails";
import Events from "./User&Owner/Events";
import ShopsList from "./User&Owner/ShopsList";
import Review from "./User&Owner/Review";
import PurchaseHistory from "./User&Owner/PurchaseHistory";
import District from './User&Owner/District';
import ShopDetails from './User&Owner/ShopDetails';
import UserProfile from "./UserProfile";
import Payment from "./User&Owner/Payment";
import Cart from "./User&Owner/Cart";
import ReportedReviews from './Moderator/ReportedReviews';
import ReportedProducts from './Moderator/ReportedProducts';
import ReportedShops from './Moderator/ReportedShops';
import ReportedUsers from './Moderator/ReportedUsers';
import ModeratorHome from './Moderator/Navigation';
import PurchaseDetails from './User&Owner/PurchaseDetails';
import Forum from './User&Owner/Forum';
import NewDiscussion from './User&Owner/newDiscussion';
import DiscussionDetails from './User&Owner/DiscussionDetails';
import AdminPanel from './Admin/AdminPanel';
import ShopsMap from './User&Owner/ShopsMap';
import ModeratorActivity from './Admin/ModeratorActivity';
import UserActivity from './Admin/UserActivity';
import AssignDisciplinaryMeasure from './Admin/AssignDisciplinaryMeasure';
import AssignRole from "./Admin/AssignRole";
import AddProduct from './User&Owner/AddProduct';
import AddEvent from './User&Owner/AddEvent';
import EditShop from './User&Owner/EditShop';
import AddPlatformProduct from './Admin/AddPlatformProduct';
import AccountRequests from './Moderator/AccountRequest';
import EditEvent from './User&Owner/EditEvent';
import EditProduct from './User&Owner/EditProduct';
import MyDiscounts from './User&Owner/MyDiscounts';
import AddDiscount from './User&Owner/addDiscount';
import MyEvents from './User&Owner/myEvents';

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
                <Route path="/adminhome" element={<AdminPanel/>} />
                <Route path="/forum" element={<Forum/>} />
                <Route path="/newDiscussion" element={<NewDiscussion/>} />
                <Route path="/map" element={<ShopsMap/>} />
                <Route path="/moderatorActivity" element={<ModeratorActivity/>} />
                <Route path="/userActivity" element={<UserActivity/>} />
                <Route path="/assignDisciplinaryMeasure" element={<AssignDisciplinaryMeasure/>} />
                <Route path="/assignRole" element={<AssignRole/>} />
                <Route path="/discussionDetails" element={<DiscussionDetails/>} />
                <Route path="/addProduct" element={<AddProduct/>}/>
                <Route path="/addEvent" element={<AddEvent/>}/>
                <Route path="/edit-shop" element={<EditShop/>}/>
                <Route path="/addPlatformProduct" element={<AddPlatformProduct/>}/>
                <Route path="/accountRequests" element={<AccountRequests/>}/>
                <Route path="/editEvent" element={<EditEvent/>}/>
                <Route path="/editProduct" element={<EditProduct/>}/>
                <Route path="/MyDiscounts" element={<MyDiscounts/>}/>
                <Route path="/addDiscount" element={<AddDiscount/>}/>
                <Route path="/myEvents" element={<MyEvents/>}/>
            </Routes>
        </Router>
    );
};

export default App;
