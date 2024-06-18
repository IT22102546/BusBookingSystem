/* eslint-disable react/prop-types */
import { Button,Select} from "flowbite-react";
import { useEffect, useState, useRef  } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Link,  useNavigate } from "react-router-dom";




// eslint-disable-next-line react/prop-types
const FAQItem = ({ question, intro, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <div className="border-l-2 border-gray-300 h-full mr-4"> </div>
          <div className="flex justify-between items-center w-full px-4 py-2 rounded-lg cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            
            <div className="font-semibold">{question}
            
            </div>
           
            <div>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</div>
          </div>
        </div>
        {isOpen && (
          <div className="mt-2 px-4 py-2  rounded-lg ml-16 text-slate-500">
            {intro && <div className="mb-2 ">{intro}</div>}
            {Array.isArray(answer) ? (
              <ul className="list-disc list-inside">
                {answer.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
                
              </ul>
            ) : (
              <div className="ml-16 text-slate-500">{answer}</div>
            )}
            <hr className="my-2 border-gray-300" />
          </div>
        )}
      </div>
    );
  };

 

  
  

export default function Home() {

    const [slideIndex, setSlideIndex] = useState(0);
    const [showNavButtons, setShowNavButtons] = useState(false);
    const [isFirstSlide, setIsFirstSlide] = useState(true);
    const [isLastSlide, setIsLastSlide] = useState(false);
    const carouselRef = useRef(null);
    const navigate = useNavigate(); 

    const [sideBarData, setSideBarData] = useState({
        startStation: "Gova",
        toStation: "Hyderabad",
       
      });
    
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setSideBarData((prevData) => ({
          ...prevData,
          date: today,
        }));
      }, []);
    
      const handleChange = (e) => {
        const { id, value } = e.target;
        setSideBarData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
      };
    
      const handleSearch = (e) => {
        e.preventDefault();
        const { startStation, toStation } = sideBarData;
        navigate(`/search?startStation=${startStation}&toStation=${toStation}`);
    };

    const moveCarousel = (n) => {
        const carousel = carouselRef.current;
        const cardWidth = carousel.children[0].offsetWidth + 6; // Adjusted width including margin
        const numVisibleCards = Math.floor(carousel.clientWidth / cardWidth);

        let newIndex = slideIndex + n;
        newIndex = Math.min(Math.max(newIndex, 0), carousel.children.length - numVisibleCards);

        setSlideIndex(newIndex);
        setIsFirstSlide(newIndex === 0);
        setIsLastSlide(newIndex >= carousel.children.length - numVisibleCards);

        carousel.style.transform = `translateX(${-newIndex * cardWidth}px)`;
    };

    useEffect(() => {
        const carousel = carouselRef.current;
        const cardWidth = carousel.children[0].offsetWidth + 6; // Adjusted width including margin
        const numVisibleCards = Math.floor(carousel.clientWidth / cardWidth);

        if (carousel.children.length > numVisibleCards) {
            setShowNavButtons(true);
        } else {
            setShowNavButtons(false);
        }

        // Check initial slide positions
        const slideIndex = Math.round(carousel.scrollLeft / cardWidth);
        setSlideIndex(slideIndex);
        setIsFirstSlide(slideIndex === 0);
        setIsLastSlide(slideIndex >= carousel.children.length - numVisibleCards);

        // Listen for scroll events to update slide positions dynamically
        const handleScroll = () => {
            const newIndex = Math.round(carousel.scrollLeft / cardWidth);
            setSlideIndex(newIndex);
            setIsFirstSlide(newIndex === 0);
            setIsLastSlide(newIndex >= carousel.children.length - numVisibleCards);
        };

        carousel.addEventListener('scroll', handleScroll);

        return () => {
            carousel.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <div className="flex flex-col w-full">
        
          <div className="min-h-screen w-full flex flex-col" style={{
                backgroundImage: `url('/img/bgg.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100%',
                minHeight: '70vh'}}>

                <div className="text-4xl text-center mt-6">
                    Book Bus Tickets
                </div>
                <div className="flex items-center justify-center mt-6 w-full px-4 md:px-0">
                <form className="flex flex-col md:flex-row bg-white h-auto md:h-28 w-full max-w-5xl rounded-md items-center p-4 shadow-md" onSubmit={handleSearch}>
                    <div className="flex-1 p-2 w-full">
                    <Select
                        id="startStation"
                        value={sideBarData.startStation}
                        onChange={handleChange}
                    >
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Gova">Goa</option>
                    </Select>
                    </div>
                    <div className="flex-1 p-2 w-full">
                    <select
                        id="toStation"
                        className="rounded-md w-full"
                        value={sideBarData.toStation}
                        onChange={handleChange}
                    >
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Gova">Goa</option>
                    </select>
                    </div>
                    <div className="flex-1 p-2 w-full">
                    <input
                        type="date"
                        id="date"
                        className="rounded-md w-full"
                        value={sideBarData.date}
                        onChange={handleChange}
                    />
                    </div>
                    <div className="p-2 w-full md:w-auto">
                    <Button type="submit" className="bg-orange-500 w-full">
                        Search
                    </Button>
                    </div>
          </form>
                </div>
            </div>
            
            <div className="flex-1 flex flex-col items-left justify-left">
                <div className="text-2xl ml-4 md:ml-16 px-4 md:px-20 py-8 font-semibold">Bus Booking Discount Offers</div>
                <div className="ml-10 px-4 md:px-20 pb-8 w-full">
                    <div className="relative overflow-hidden">
                        <div ref={carouselRef} className="carousel flex transition-transform duration-500 ease-in-out overflow-hidden">
                            <div className="card flex-none mr-6">
                                <Link to="">
                                    <img src="/img/dis1.jpg" alt="Offer 1" className="w-full h-44 rounded-md shadow-md" />
                                </Link>
                            </div>
                            <div className="card flex-none mr-6">
                                <Link to="">
                                    <img src="/img/dis1.jpg" alt="Offer 2" className="w-full h-44 rounded-md shadow-md" />
                                </Link>
                            </div>
                            <div className="card flex-none mr-6">
                                <Link to="">
                                    <img src="/img/dis1.jpg" alt="Offer 3" className="w-full h-44 rounded-md shadow-md" />
                                </Link>
                            </div>
                            <div className="card flex-none mr-6">
                                <Link to="">
                                    <img src="/img/dis1.jpg" alt="Offer 4" className="w-full h-44 rounded-md shadow-md" />
                                </Link>
                            </div>
                            <div className="card flex-none mr-6">
                                <Link to="">
                                    <img src="/img/dis1.jpg" alt="Offer 5" className="w-full h-44 rounded-md shadow-md" />
                                </Link>
                            </div>
                            <div className="card flex-none mr-6">
                                <Link to="">
                                    <img src="/img/dis1.jpg" alt="Offer 6" className="w-full h-44 rounded-md shadow-md" />
                                </Link>
                            </div>
                            <div className="card flex-none mr-6">
                                <Link to="">
                                    <img src="/img/dis1.jpg" alt="Offer 7" className="w-full h-44 rounded-md shadow-md" />
                                </Link>
                            </div>
                            <div className="card flex-none mr-6">
                                <Link to="">
                                    <img src="/img/dis1.jpg" alt="Offer 8" className="w-full h-44 rounded-md shadow-md" />
                                </Link>
                            </div>
                            <div className="card flex-none mr-6">
                                <Link to="">
                                    <img src="/img/dis1.jpg" alt="Offer 9" className="w-full h-44 rounded-md shadow-md" />
                                </Link>
                            </div>
                            <div className="card flex-none mr-6">
                                <Link to="">
                                    <img src="/img/dis11.jpg" alt="Offer 10" className="w-full h-44 rounded-md shadow-md" />
                                </Link>
                            </div>
                            {/* Add more cards as needed */}
                        </div>
                        {/* Conditionally render navigation buttons */}
                        {showNavButtons && (
                            <>
                                {!isFirstSlide && (
                                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                                        <button
                                            className="bg-white bg-opacity-25 text-orange-500 text-xl flex items-center justify-center px-2 py-4 focus:outline-none"
                                            onClick={() => moveCarousel(-1)}
                                        >
                                            ❮
                                        </button>
                                    </div>
                                )}
                                {!isLastSlide && (
                                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                                        <button
                                            className="bg-white bg-opacity-25 text-orange-500 text-xl flex items-center justify-center px-2 py-4 focus:outline-none"
                                            onClick={() => moveCarousel(1)}
                                        >
                                            ❯
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="flex-1 flex flex-col items-left justify-left pb-5">
                <div className="text-2xl ml-4 md:ml-16 px-4 md:px-20  font-semibold">Why choose ixigo For Bus Ticket Booking</div>
                <div className="text-sm ml-4 md:ml-16 px-4 md:px-20 pt-2 ">
                  <p>ixigo Bus Booking is powered by AbhiBus which is India’s fastest growing online ticket booking platform. AbhiBus is the official ticketing partner of several State Road Transport Corporation (SRTC) operators and over 3500+ private bus partners covering more than 100,000 bus routes</p>
                </div>
                
            </div>

            <div className="flex-1 flex flex-col items-left justify-left bg-slate-200">
                <div className="text-2xl ml-4 md:ml-16 px-4 md:px-20 py-8 font-semibold pt-3">SRTC (State Road Transport Corporation) Bus Tickets Booking</div>
            </div>
            <div className="flex-1 flex flex-col items-left justify-left bg-blue-200 ">
                <div className="text-2xl ml-4 md:ml-16 px-4 md:px-20 py-8 font-semibold pt-3">SRTC (State Road Transport Corporation) Bus Tickets Booking</div>
            </div>
            <div className="flex-1 flex flex-col items-left justify-left pt-10">
                <div className="text-2xl ml-4 md:ml-16 mr-4 md:mr-16 px-4 md:px-20 py-8 font-semibold pt-3 bg-slate-100 rounded-lg ">Book Your Bus Tickets on ixigo
                
                  <p className="text-sm mt-2 text-slate-500">Welcome to ixigo, your one-stop destination for all your bus travel needs in India! ixigo is here to make your bus travel experience more comfortable, convenient, and hassle-free.</p>
                  <p className="text-sm mt-2 text-slate-500">Travellers can quickly search for buses and book bus tickets to various destinations across India by using the ixigo’s user-friendly bus ticketing platform. Powered by AbhiBus, ixigo now offers a wide range of bus services for online ticket booking. Users can now choose both government state road transportation buses and private bus services.</p>
                  <p className="text-sm mt-2 text-slate-500">ixigo platform is intended to offer you an easy way to book bus tickets online. With ixigo, travellers can quickly search for buses based on their travel date, destination, and preferred bus route. ixigo provides you with detailed information about each bus operator, including their routes, schedules, amenities, and customer reviews, allowing you to compare and choose the best option for your journey. ixigo offers a number of bus alternatives, including premium, semi-luxury, and economy buses, to accommodate your preferences and affordable budget for your journey.</p>
                
                </div>
                
            </div>

            <div className="flex-1 flex flex-col items-left justify-left pt-8">
                <div className="text-2xl ml-4 md:ml-16 mr-4 md:mr-16 px-4 md:px-20 py-8 font-semibold pt-3 bg-slate-100 rounded-lg ">Why Book Bus Tickets Online Through ixigo
                
                  <p className="text-sm mt-2 text-slate-500">Being the no.1 platform for Train ticket bookings in India, ixigo is committed to bring the best booking experience for its users. With bus ticket bookings, ixigo is now the one stop solution for all your travel needs. Users can choose from trains or flights along with bus ticket booking. Additionally, ixigo platform enables users to book hotel stays and cab services making it the best booking platform for all travel needs.</p>
        
                </div>
                
            </div>

            <div className="flex-1 flex flex-col items-left justify-left pt-8">
                <div className="text-2xl ml-4 md:ml-16 mr-4 md:mr-16 px-4 md:px-20 py-8 font-semibold pt-3 bg-slate-100 rounded-lg ">LiveBus Tracking
                
                  <p className="text-sm mt-2 text-slate-500">Travellers can track their bus in real-time using a bus tracking tool, guaranteeing that travellers don't miss their bus. In order to provide you peace of mind and make your bus journey hassle-free, AbhiBus live bus tracking feature regularly updates you on the live location of your bus, arrival time, and delays of your bus details. When you're going to a new destination or when you need to board the bus at the right location, this <Link to ="#"className="text-orange-500">live bus tracking</Link> feature is quite helpful.</p>
        
                </div>
                
            </div>

            <div className="flex-1 flex flex-col items-left justify-left pt-8">
                <div className="text-2xl ml-4 md:ml-16 mr-4 md:mr-16 px-4 md:px-20 py-8 font-semibold pt-3 bg-slate-100 rounded-lg ">Free Cancellation of Bus Tickets Policy
                
                  <p className="text-sm mt-2 text-slate-500">ixigo understands that last-minute changes can be challenging, and that's why we offer flexible cancellation policies. On ixigo platform, it's simple to cancel your bus reservation, get the instant refund into the wallet and you can re-book your bus ticket instantly without having to wait for the payment process.</p>
                  <p className="text-sm mt-2 text-slate-500">ixigo offers free cancellations on all bus tickets starting at Rs.9 per seat. You can choose to cancel your trip for free and get a refund if you change your travel plans. Either the ixigo website or the Mobile App can be used to submit a ticket cancellation request.</p>
        
                </div>
                
            </div>

            <div className="flex-1 flex flex-col items-left justify-left pt-8">
                <div className="text-2xl ml-4 md:ml-16 mr-4 md:mr-16 px-4 md:px-20 py-8 font-semibold pt-3 bg-slate-100 rounded-lg ">ixigo 24/7 Customer Support
                
                  <p className="text-sm mt-2 text-slate-500">At ixigo in partnership with Abhibus, we are dedicated to providing you with a smooth bus booking experience. ixigo bus ticketing platform is built to meet your needs, with features like simple payment choices, safe ticket booking online, and 24-hour customer service. You can use the help section below and chat with us to resolve your queries. ixigo customer support team is always there to assist you with any questions or concerns you may have related to bus ticket booking online, and providing a stress-free and pleasurable trip.</p>
        
                </div>
                
            </div>

            <div className="flex-1 flex flex-col items-left justify-left pt-8">
                <div className="text-2xl ml-4 md:ml-16 mr-4 md:mr-16 px-4 md:px-20 py-8 font-semibold pt-3 bg-slate-100 rounded-lg ">Top Tourist Bus Routes
                
                  <p className="text-sm mt-2 text-slate-500">AbhiBus is one of India's top bus reservation ticket platforms and has recently been acquired by ixigo. You can find here a list of top bus routes of AbhiBus. Travellers can reserve <Link to ="#" className="text-orange-500">bus booking</Link> online quickly and easily with AbhiBus portal or Mobile App.</p>
                  <p className="text-sm mt-2 text-black font-bold pb-2">Here’s a some of the list of top bus routes:</p>

                  <div className="flex flex-col md:flex-row">

                        <div className="ml-4 md:ml-16 px-4 md:px-20  w-full flex-1">
                                <ul className="list-disc list-inside">
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Delhi To Shimla Bus</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Goa To Mumbai Bus</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Bangalore To Goa Bus</Link></li>
                                </ul>
                        </div>
                        <div className="ml-4 md:ml-16 px-4 md:px-20 w-full flex-1">
                                <ul className="list-disc list-inside">
                                            <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Bangalore To Ooty Bus</Link></li>
                                            <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Pune To Goa Bus</Link></li>
                                            <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Chennai To Coimbatore Bus</Link></li>
                                </ul>
                        </div>

                        <div className="ml-4 md:ml-16 px-4 md:px-20 pb-8 w-full flex-1">
                               <ul className="list-disc list-inside">
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Delhi To Nainital Bus</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Delhi To Manali Bus</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Chandigarh To Manali Bus</Link></li>
                                </ul>
                        </div>

                        <div className="ml-4 md:ml-16 px-4 md:px-20 pb-8 w-full flex-1">
                               <ul className="list-disc list-inside">
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Surat To Ahmedabad Bus</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Manali To Delhi Bus</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Delhi To Dharamshala Bus</Link></li>
                                </ul>
                        </div>

                  </div>

                  
                    
                 </div>
                
            </div>


            <div className="flex-1 flex flex-col items-left justify-left pt-8">
                <div className="text-2xl ml-4 md:ml-16 mr-4 md:mr-16 px-4 md:px-20 py-8 font-semibold pt-3 bg-slate-100 rounded-lg ">Top Pilgrimage Bus Routes
                
                  <p className="text-sm mt-2 text-slate-500">India is known for its rich long tradition of spirituality and pilgrimage, and there are numerous pilgrimage bus routes that cover the religious travelers. Do you want to visit your preferred pilgrimage destination or any? Then you are at the right place to choose your destination, select the bus, reserve your favorite seat with ixigo.</p>
                  <p className="text-sm mt-2 text-black font-bold pb-2">Here are some of the top pilgrimage bus routes in India:</p>

                  <div className="flex flex-col md:flex-row">

                        <div className="ml-4 md:ml-16 px-4 md:px-20  w-full flex-1">
                                <ul className="list-disc list-inside">
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Delhi To Haridwar Bus</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Delhi To Rishikesh Bus</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Agra To Jaipur Bus</Link></li>
                                </ul>
                        </div>
                        <div className="ml-4 md:ml-16 px-4 md:px-20 w-full flex-1">
                                <ul className="list-disc list-inside">
                                            <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Delhi To Katra Bus</Link></li>
                                            <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Bangalore To Tirupati Bus</Link></li>
                                            <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Delhi To Amritsar Bus</Link></li>
                                </ul>
                        </div>

                        <div className="ml-4 md:ml-16 px-4 md:px-20 pb-8 w-full flex-1">
                               <ul className="list-disc list-inside">
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Delhi To Jammu Bus</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Chennai To Tirupati Bus</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Jaipur To Bikaner Bus</Link></li>
                                </ul>
                        </div>

                        <div className="ml-4 md:ml-16 px-4 md:px-20 pb-8 w-full flex-1">
                               <ul className="list-disc list-inside">
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Mumbai To Shirdi Bus</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Kolkata To Digha Bus</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Hyderabad To Tirupati Bus</Link></li>
                                </ul>
                        </div>

                  </div>

                  
                    
                 </div>
                
            </div>


            <div className="flex-1 flex flex-col items-left justify-left pt-8">
                <div className="text-2xl ml-4 md:ml-16 mr-4 md:mr-16 px-4 md:px-20 py-8 font-semibold pt-3 bg-slate-100 rounded-lg ">Popular Bus Routes in India
                
                  <p className="text-sm mt-2 text-slate-500">India has a vast network of bus routes that connect various cities, towns and villages across India. If you are planning to travel popular routes in India, travelers can find various available buses to book tickets online at ixigo.</p>
                  <p className="text-sm mt-2 text-black font-bold pb-2">Travellers can find here some of the most popular bus routes in India are:</p>

                  <div className="flex flex-col md:flex-row">

                        <div className="ml-4 md:ml-16 px-4 md:px-20  w-full flex-1">
                                <ul className="list-disc list-inside">
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Bangalore To Chennai Bus</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Mumbai To Pune Bus</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Delhi To Jaipur Bus</Link></li>
                                </ul>
                        </div>
                        <div className="ml-4 md:ml-16 px-4 md:px-20 w-full flex-1">
                                <ul className="list-disc list-inside">
                                            <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Chennai To Bangalore Bus</Link></li>
                                            <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Jaipur To Delhi Bus</Link></li>
                                            <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Delhi To Chandigarh Bus</Link></li>
                                </ul>
                        </div>

                        <div className="ml-4 md:ml-16 px-4 md:px-20 pb-8 w-full flex-1">
                               <ul className="list-disc list-inside">
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Mumbai To Goa Bus</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Hyderabad To Goa Bus</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Chandigarh To Delhi Bus</Link></li>
                                </ul>
                        </div>

                        <div className="ml-4 md:ml-16 px-4 md:px-20 pb-8 w-full flex-1">
                               <ul className="list-disc list-inside">
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Indore To Bhopal Bus</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Hyderabad To Chennai Bus</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Pune To Hyderabad Bus</Link></li>
                                </ul>
                        </div>

                  </div>

                  
                    
                 </div>
                
            </div>


            <div className="flex-1 flex flex-col items-left justify-left pt-10">
                <div className="text-2xl ml-4 md:ml-16 mr-4 md:mr-16 px-4 md:px-20 py-8 font-semibold pt-3 bg-slate-100 rounded-lg ">Online Bus Booking in India
                
                  <p className="text-sm mt-2 text-slate-500">It's easy, simple and affordable to book your bus tickets online in India when you use the ixigo portal. Travellers can select their bus route and check schedules, choose their favorite bus seat, then pay using a number of payment online methods and avail discounts. ixigo will send a booking confirmation details and e-ticket to your registered email address and cellphone number after making a successful payment. You must have your e-ticket while boarding the bus.</p>
                  <p className="text-sm mt-2 text-slate-500">ixigo advises to book your tickets in advance to secure the lowest ticket prices and reserve your bus seat for a trouble-free trip.</p>
                  <p className="text-sm mt-2 text-slate-500">Travelllers can find various types of buses available to book tickets online using ixigo or AbhiBus.</p>

                  <ul className="list-disc list-inside ml-16">
                                    <li className="text-slate-500 text-sm">AC Buses</li>
                                    <li className="text-slate-500 text-sm">Non-AC Buses</li>
                                    <li className="text-slate-500 text-sm">Volvo AC Seater Bus</li>
                                    <li className="text-slate-500 text-sm">Volvo AC Bus</li>
                                    <li className="text-slate-500 text-sm">AC Sleeper Bus</li>
                                    <li className="text-slate-500 text-sm">Sleeper Seater Bus</li>
                                    <li className="text-slate-500 text-sm">Super Luxury AC Buses</li>
                                    <li className="text-slate-500 text-sm">Deluxe Bus</li>
                                    <li className="text-slate-500 text-sm">Sleeper Buses</li>
                                    <li className="text-slate-500 text-sm">Express Buses</li>
                                    <li className="text-slate-500 text-sm">Ordinary Buses</li>
                                    <li className="text-slate-500 text-sm">Super Luxury (Non-AC Seater)</li>
                                    

                                   
                    </ul>
                
                </div>
                
            </div>


            <div className="flex-1 flex flex-col items-left justify-left pt-8">
                <div className="text-2xl ml-4 md:ml-16 mr-4 md:mr-16 px-4 md:px-20 py-8 font-semibold pt-3 bg-slate-100 rounded-lg ">Bus Ticket Confirmation

                
                               <ul className="list-disc list-inside ml-16 pt-3">
                                    <li className="text-slate-700 text-sm">M-Ticket: <span className="text-slate-500">M-Ticket is short for Mobile Ticket and is sent as an SMS to your mobile once you book a bus ticket. It is a confirmation of your reservation and serves as a ticket. When you board the bus, show your M-ticket to the bus crew.</span></li>
                                    <li className="text-slate-700 text-sm">E-Ticket: <span className="text-slate-500">E-Ticket stands for Electronic Ticket. The E-ticket is issued and sent to your email after you make an online bus booking. It is a confirmation of your reservation, and you can show it to the bus staff when you board the bus.</span></li>
                                    <li className="text-slate-700 text-sm">Counter-Ticket: <span className="text-slate-500"> A counter ticket is a hard copy of your bus ticket which is shown to the bus staff on boarding the bus. These can be bought physically from ticket booths or even on the bus right before your journey.</span></li>
                                   
                                </ul>
               
                
                  <p className="text-sm mt-2 text-slate-500">Passengers can use the AbhiBus live bus tracker tool to find the live location of your booked bus.</p>
        
                </div>
                
            </div>


            <div className="flex-1 flex flex-col items-left justify-left pt-8">
                <div className="text-2xl ml-4 md:ml-16 mr-4 md:mr-16 px-4 md:px-20 py-8 font-semibold pt-3 bg-slate-100 rounded-lg ">Bus Booking Offers on ixigo
                
                  <p className="text-sm mt-2 text-slate-500">Are you looking to save money on bus ticket fares while securing your bus seat online? If so, you’re on the right track to save money on bus bookings through ixigo. Travellers can take advantage of various exclusive <Link className="text-orange-500">bus booking offers</Link> and discount coupon codes to reduce expenses when reserving bus tickets online.</p>
        
                </div>
                
            </div>


            <div className="flex-1 flex flex-col items-left justify-left pt-8">
                <div className="text-2xl ml-4 md:ml-16 mr-4 md:mr-16 px-4 md:px-20 py-8 font-semibold pt-3 bg-slate-100 rounded-lg ">Top Bus Operators
                
                  <p className="text-sm mt-2 text-slate-500">With ixigo, travellers can book SRTC and private travel ticket booking. You may compare types of buses, ticket rates, travel durations, and facilities provided by various state road transport corporations and private road transport service providers. When booking bus tickets with ixigo, travellers can save money on ticket prices.</p>
                  <p className="text-sm mt-2 text-slate-500">You can find here some of the ixigo partnered with AbhiBus SRTC and private operators source links where travellers can directly book bus tickets on AbhiBus.</p>
                  <p className="text-sm mt-2 text-black font-bold pb-2">Top State Owned Road Transport Corporation in India</p>

                  <div className="flex flex-col md:flex-row">

                        <div className="ml-4 md:ml-16 px-4 md:px-20  w-full flex-1">
                                <ul className="list-disc list-inside">
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">APSRTC</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">TSRTC</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">DGSRTC</Link></li>
                                </ul>
                        </div>
                        <div className="ml-4 md:ml-16 px-4 md:px-20 w-full flex-1">
                                <ul className="list-disc list-inside">
                                            <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Kerala RTC</Link></li>
                                            <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">HRTC</Link></li>
                                            <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">BSRTC</Link></li>
                                </ul>
                        </div>

                        <div className="ml-4 md:ml-16 px-4 md:px-20 pb-8 w-full flex-1">
                               <ul className="list-disc list-inside">
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">TNSTC</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">RSRTC</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">MSRTC</Link></li>
                                </ul>
                        </div>

                        <div className="ml-4 md:ml-16 px-4 md:px-20 pb-8 w-full flex-1">
                               <ul className="list-disc list-inside">
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">OSRTC</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Karnataka RTC</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">UPSRTC</Link></li>
                                </ul>
                        </div>

                        <div className="ml-4 md:ml-16 px-4 md:px-20 pb-8 w-full flex-1">
                               <ul className="list-disc list-inside">
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">PRTC</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">JKSRTC</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">WBTC</Link></li>
                                </ul>
                        </div>

                  </div>

                  <p className="text-sm mt-2 text-black font-bold pb-2">Private Bus Operators:</p>

                  <div className="flex flex-col md:flex-row">

                        <div className="ml-4 md:ml-16 px-4 md:px-20  w-full flex-1">
                                <ul className="list-disc list-inside">
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">VRL Travels</Link></li>
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">SRS Travels</Link></li>
                                 
                                </ul>
                        </div>
                        <div className="ml-4 md:ml-16 px-4 md:px-20 w-full flex-1">
                                <ul className="list-disc list-inside">
                                            <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Parveen Travels</Link></li>
                                            <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Kaveri Travels</Link></li>
                                         
                                </ul>
                        </div>

                        <div className="ml-4 md:ml-16 px-4 md:px-20 pb-8 w-full flex-1">
                               <ul className="list-disc list-inside">
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">KPN Travels</Link></li>
                                   
                                </ul>
                        </div>

                      

                        <div className="ml-4 md:ml-16 px-4 md:px-20 pb-8 w-full flex-1">
                               <ul className="list-disc list-inside">
                                    <li className="text-slate-500 text-sm"><Link to="#" className="text-orange-500 text-sm">Morning Star Travels</Link></li>
                                </ul>
                        </div>

                  </div>

                  
                    
                 </div>
                
            </div>

            <div className="text-2xl ml-4 md:ml-16 mr-4 md:mr-16 px-4 md:px-20 py-8 font-semibold pt-3 bg-slate-100 rounded-lg mb-3 mt-5">
                Online Bus Booking FAQ’s
                <div>
                    <form className="border border-gray-400 rounded-lg text-sm mt-3 p-4">
                        <FAQItem
                            question="Q. Can I cancel the tickets once booked?" 
                            answer="A: Yes, you can cancel a booked bus ticket via ixigo 3 hours prior to the departure of the bus. This ticket cancellation may vary depending on the operator."
                        />
                        <FAQItem 
                            question="Q. What are the payment options available for booking?" 
                            intro="A: Choose any of the following payment options for your bus ticket booking via ixigo:"
                            answer={[
                                "Credit/Debit Card",
                                "Net banking (SBI, ICICI, HDFC, Axis, Kotak, PNB & many more banks)",
                                "Wallets (Amazon Pay, Mobikwik, Free Charge, PayU)",
                                "UPI (Unified Payment Interface)"
                            ]}
                        />
                        <FAQItem
                            question="Q. Do I need a printout of the bus ticket?" 
                            answer="A: Most of the bus operators accept SMS or email confirmation as your ticket. Despite this, in order to avoid hassles during the bus journey, we would recommend taking a printout of the e-ticket."
                        />
                    </form>
                </div>
            </div>
           




            <div className="flex flex-col md:flex-row md:gap-2 md:order-2 w-full md:w-auto bg-orange-900 rounded-md">
                <div className="py-4 flex-1 md:text-left text-center">
                    <Link to="#" className="text-white text-sm ml-2 md:ml-4">
                        AbhiBus | ixigo | ConfirmTkt
                    </Link>
                </div>
                <div className="py-4 flex-1 md:text-right text-center">
                    <Link to="#" className="text-white text-sm ml-2 md:ml-auto">
                        Copyright @ faITe Technology Ltd. All Rights Reserved
                    </Link>
                </div>
            </div>
        </div>
    );
}
