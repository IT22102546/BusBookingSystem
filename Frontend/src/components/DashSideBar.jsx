import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmRight, HiHome, HiTicket, HiUser } from 'react-icons/hi';
import { useDispatch, useSelector} from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function DashSideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const location = useLocation();
  const [tab, setTab] = useState();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      await fetch('/api/user/signout');
      dispatch(signOut());
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items >
        <Sidebar.ItemGroup >
        <Link to='/dashboard?tab=profile' key="profile">
            <Sidebar.Item 
              active={tab === 'profile'} 
              icon={HiUser} 
              label={currentUser?.isAdmin ? 'Admin' : 'User'} 
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Link to='/dashboard?tab=tickets' key="tickets">
            <Sidebar.Item
              active={tab === 'tickets'}
              icon={HiTicket}
              as='div'
             
            >
              My Tickets
            </Sidebar.Item>
          </Link>
          {currentUser?.isAdmin && (
            <>
              <Link to='/dashboard?tab=buses' key="buses">
                <Sidebar.Item
                  active={tab === 'buses'}
                  
                  as='div'
                >
                  Buses
                </Sidebar.Item>
              </Link>
            </>  )}
          <Link to='/' key="">
            <Sidebar.Item
              active={tab === 'home'}
              icon={HiHome}
              as='div'
             
            >
              Home
            </Sidebar.Item>
          </Link>
          <Sidebar.Item 
            icon={HiArrowSmRight} 
            className="cursor-pointer mt-0" 
            onClick={handleSignOut}
            key="signout"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
