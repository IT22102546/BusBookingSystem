import { useState } from "react";
import { Button, Label, TextInput, Spinner, Alert } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import OAuthenticate from "../components/OAuthenticate";

export default function SignUp() {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        mobile: '',
        password: '',
        confirmpassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.username || !formData.email  || !formData.mobile || !formData.password || !formData.confirmpassword) {
            return setError('Please Fill all Fields');
        }

        try {
            setLoading(true);
            setError(false);
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
           
            setLoading(false);
            if(data.success === false) {
                setError(data.message);
                return;
            }
            navigate('/signin');
        } catch(error) {
            setLoading(false);
            setError(error.message);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center" style={{
            backgroundImage: `url('/img/signfromBG.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}>
            <div className="flex p-3 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-20">
                <div className="flex-1 w-full screen mt-35 relative" style={{
                    backgroundImage: `url('/img/signfromBG.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                    <div className="p-5 border border-gray-300 rounded-lg shadow-lg animate-fadeIn bg-white bg-opacity-75 w-50">
                        <h2 className="text-xl font-bold mb-4 animate-slideIn font-cinzel">About Us</h2>
                        <p className="mb-4 animate-slideIn">Learn more about our mission and values.</p>
                        <Button className="bg-green-500">
                            <Link to="#" className="font-cinzel">About Us</Link>
                        </Button>
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-center text-2xl font-cinzel font-semibold">Sign Up</p>
                    <form className="flex flex-col gap-4 mt-5" onSubmit={handleSubmit}>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1">
                                <Label value="First Name" />
                                <TextInput type="text" placeholder="First name" id="firstname" className="rounded-md" onChange={handleChange} />
                            </div>
                            <div className="">
                                <Label value="Last Name" />
                                <TextInput type="text" placeholder="Last name" id="lastname" className="rounded-md" onChange={handleChange} />
                            </div>
                            <div className="">
                                <Label value="User Name (NIC or Passport Number)" />
                                <TextInput type="text" placeholder="User name" id="username" className="rounded-md" onChange={handleChange} />
                            </div>
                            <div className="">
                                <Label value="Email" />
                                <TextInput type="email" placeholder="name@company.com" id="email" className="rounded-md" onChange={handleChange} />
                            </div>
                            <div className="flex-1">
                                <Label value="Mobile number" />
                                <TextInput type="text" placeholder="Mobile Number" id="mobile" className="rounded-md" onChange={handleChange} />
                            </div>
                            <div className="">
                                <Label value="Password" />
                                <div className="relative">
                                    <TextInput type={showPassword ? "text" : "password"} placeholder="Password" id="password" className="rounded-md" onChange={handleChange} />
                                    <button type="button" className="absolute top-2 right-3 focus:outline-none" onClick={togglePasswordVisibility}>
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.818 8.818a4 4 0 0 1 0 6.364M5.636 8.818a4 4 0 0 1 0 6.364M11.998 5.996v.01" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.1V12a3.999 3.999 0 0 1 3.999-4 3.999 3.999 0 0 1 3.999 4v6.1c0 2.21-1.791 4-3.999 4a3.999 3.999 0 0 1-3.999-4z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.015.048-.03.094-.046.141m-3.495 1.313C16.509 13.518 14.345 13 12 13s-4.509.518-6 1.454m13.464 2.096C17.268 19.057 13.477 22 9 22c-4.477 0-8.268-2.943-9.542-7 .015-.048.03-.094.046-.141M12 9v3m0 4h.01" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="">
                                <Label value="Confirm Password" />
                                <div className="relative">
                                    <TextInput type={showPassword ? "text" : "password"} placeholder="Confirm Password" id="confirmpassword" className="rounded-md" onChange={handleChange} />
                                    <button type="button" className="absolute top-2 right-3 focus:outline-none" onClick={togglePasswordVisibility}>
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.818 8.818a4 4 0 0 1 0 6.364M5.636 8.818a4 4 0 0 1 0 6.364M11.998 5.996v.01" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.1V12a3.999 3.999 0 0 1 3.999-4 3.999 3.999 0 0 1 3.999 4v6.1c0 2.21-1.791 4-3.999 4a3.999 3.999 0 0 1-3.999-4z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.015.048-.03.094-.046.141m-3.495 1.313C16.509 13.518 14.345 13 12 13s-4.509.518-6 1.454m13.464 2.096C17.268 19.057 13.477 22 9 22c-4.477 0-8.268-2.943-9.542-7 .015-.048.03-.094.046-.141M12 9v3m0 4h.01" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Button disabled={loading} className="bg-green-500 font-cinzel" type="submit">
                            {loading ? (
                                <>
                                    <Spinner size='sm' />
                                    <span className="pl-3">Loading</span>
                                </>
                            ) : 'Sign Up'}
                       </Button>
                       <OAuthenticate/>
                        {error && (
                            <Alert color="failure" className="text-center">
                                {error}
                            </Alert>
                        )}
                    </form>
                    <p className="mt-5">
                        Already have an account?{' '}
                        <Link to="/signin" className="text-green-950 text-bold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
