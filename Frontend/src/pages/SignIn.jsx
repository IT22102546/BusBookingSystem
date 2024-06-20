import { useState } from "react";
import { Button, Label, TextInput, Spinner, Alert } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import { useDispatch, useSelector } from 'react-redux';
import OAuthenticate from "../components/OAuthenticate";

export default function SignIn() {
    const [formData, setFormData] = useState({});
    const { loading, error } = useSelector((state) => state.user);
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            dispatch(signInFailure("Please fill all fields"));
            return;
        }
        try {
            dispatch(signInStart());
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            });

            const data = await res.json();
            console.log("Response Data:", data);

            if (!data.success) {
                dispatch(signInFailure(data.message));
                return;
            }
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            dispatch(signInFailure(error.message));
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
            <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-20">
                {/* left */}
                <div className="flex-1 w-full screen mt-35 relative" style={{
                    backgroundImage: `url('/img/signfromBG.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                    <div className="p-5 border border-gray-300 rounded-lg shadow-lg animate-fadeIn bg-white bg-opacity-75 w-50">
                        <h2 className="text-xl font-bold mb-4 animate-slideIn font-cinzel">About Us</h2>
                        <p className="mb-4 animate-slideIn">Learn more about our mission and values.</p>
                        <Button className="bg-green-500 font-cinzel">
                            <Link to="#">About Us</Link>
                        </Button>
                    </div>
                </div>
                {/* right */}
                <div className="flex-1">
                    <p className="text-center text-2xl font-cinzel font-semibold">Sign In</p>
                    <form className="flex flex-col gap-4 mt-5" onSubmit={handleSubmit}>
                        <div>
                            <Label value="User Name (NIC or Passport Number)" />
                            <TextInput type="text" placeholder="User name" id="username" className="rounded-md" onChange={handleChange} />
                        </div>
                        <div>
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
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15a7 7 0 01-7-7M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <Button disabled={loading} className="bg-green-500 font-cinzel" type="submit">
                            {loading ? (
                                <>
                                    <Spinner size='sm' />
                                    <span className="pl-3">Loading</span>
                                </>
                            ) : 'Sign In'}
                        </Button>
                        <OAuthenticate/>
                    </form>
                    <div className="flex gap-2 text-sm mt-5">
                        <span className="font-bold"> Dont Have an Account?</span>
                        <Link to='/signup' className="text-red-500 font-semibold">Sign Up</Link>
                    </div>
                    {error && (
                        <Alert className="mt-5" color='failure'>
                            {error} 
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}
