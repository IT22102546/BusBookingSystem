import { useState } from 'react';
import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar } from "flowbite-react";
import { Link , useNavigate } from "react-router-dom";
import { HiUser } from 'react-icons/hi';
import { useSelector , useDispatch } from 'react-redux';
import { signOut } from "../redux/user/userSlice";

export default function Header() {
    const [showModal, setShowModal] = useState(false);
    const { currentUser } = useSelector((state) => state.user); 
    const navigate = useNavigate(); 
    const dispatch = useDispatch();

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleSignOut = async () => {
        try {
            await fetch('/api/user/signout');
            dispatch(signOut());
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Navbar className="border-b-2 relative z-50">
            <div className="flex flex-col md:flex-row md:gap-2 md:order-2 w-full md:w-auto">
                <div className="flex flex-wrap justify-center md:justify-start w-full md:w-auto">
                    <Link to="/" className="self-center whitespace-nowrap text-3xl font-semibold font-tangerine ml-0 md:ml-16">
                        <img src="/img/logo2.jpg" alt="Logo" style={{ width: '100px', height: '50px' }} className='mr-2'/>
                    </Link>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start w-full md:w-auto">
                    <Link to='' className="text-slate-600 ml-7 flex items-center mt-4 md:mt-0" onClick={openModal}>
                        <img src="/img/airplane-mode.png" className="w-5 h-5 mr-2"/>
                        Flights
                    </Link>
                    <Link to='' className="text-slate-600 flex items-center ml-7 mt-4 md:mt-0" onClick={openModal}>
                        <img src="/img/train.png" className="w-5 h-5 mr-2"/>
                        Trains
                    </Link>
                    <Link to='' className="text-slate-600 flex items-center ml-7 mt-4 md:mt-0" onClick={openModal}>
                        <img src="/img/bus.png" className="w-5 h-5 mr-2"/>
                        Busses
                    </Link>
                    <Link to='' className="text-slate-600 flex items-center ml-7 mt-4 md:mt-0">
                        <img src="/img/hotel.png" className="w-5 h-5 mr-2"/>
                        Hotels
                    </Link>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2 md:order-3 w-full md:w-auto mt-4 md:mt-0">
                <div className="flex flex-wrap justify-center md:justify-end w-full md:w-auto">
                    <Link to='' className="text-slate-600 mr-7 md:mr-10 flex items-center">
                        <img src="/img/offers.png" className="w-5 h-5 mr-2"/>
                        Offers
                    </Link>
                    <Link to='' className="text-slate-600 mr-7 md:mr-10 flex items-center mt-4 md:mt-0">
                        <img src="/img/ticket.png" className="w-5 h-5 mr-2"/>
                        Track Ticket
                    </Link>
                    {currentUser ? (
                    <Dropdown arrowIcon={false} inline label={
                        <Avatar alt="user" img={currentUser.profilePicture} rounded />
                    }>
                        <DropdownHeader>
                            <span className="block text-sm">{currentUser.username}</span>
                            <span className="block text-sm font-medium truncate">{currentUser.email}</span>
                        </DropdownHeader>
                        <Link to={'/dashboard?tab=profile'}>
                            <DropdownItem>Profile</DropdownItem>
                        </Link>
                        <DropdownDivider/>
                        <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
                    </Dropdown>
                ) : (
                    <Link to='/signin' className="text-orange-500 flex items-center mt-4 md:mt-0">
                        <HiUser className="mr-1" style={{ fontSize: '24px' }} />
                        Login/SignUp
                    </Link>
                )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg text-center">
                        <h2 className="text-2xl font-bold mb-4">Coming Soon!</h2>
                        <p className="text-gray-600">Please Stay Calm We Will Arrive Soon</p>
                        <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-500" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </Navbar>
    );
}
