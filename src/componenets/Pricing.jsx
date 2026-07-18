import React, { useEffect, useState } from "react";
import { IndianRupee, CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
const BASE_URL = import.meta.env.VITE_API_URL;
import toast from "react-hot-toast";

const Pricing = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const pendingUser = location.state;

    const getAllPackages = async () => {
        try {
            const res = await fetch(`${BASE_URL}/package/all-package`);
            const result = await res.json();

            if (result.success) {
                setPackages(result.data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNow = async (pkg) => {
        try {
            const res = await fetch(`${BASE_URL}/razorpay-setting/create-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: pkg.price,
                    packageId: pkg._id,
                    userId: pendingUser.userId,
                }),
            });

            const result = await res.json();

            if (!result.success) {
                toast.error(result.message || "Order creation failed");
                return;
            }

            if (!window.Razorpay) {
                toast.error("Razorpay SDK not loaded");
                return;
            }


            const options = {
                key: result.key,
                amount: result.order.amount,
                currency: result.order.currency,
                name: "Lead Management Software",
                description: pkg.packageName,
                order_id: result.order.id,

                prefill: {
                    name: pendingUser.name || "",
                    email: pendingUser.email || "",
                    contact: pendingUser.phone || "",
                },

                theme: {
                    color: "#4f46e5",
                },

                handler: async function (response) {
                    try {
                        const verifyRes = await fetch(`${BASE_URL}/payment/verify-payment`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                userId: pendingUser.userId,
                                packageId: pkg._id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const verifyResult = await verifyRes.json();

                        if (!verifyResult.success) {
                            toast.error(verifyResult.message || "Payment verification failed");
                            return;
                        }

                        toast.success("Payment successful");

                        navigate("/login", { replace: true });
                    } catch (err) {
                        console.log(err);
                        toast.error("Payment verify error");
                    }
                },

            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        }
    };


    useEffect(() => {
        if (!pendingUser?.userId) {
            toast.error("Please login first");
            navigate("/login", { replace: true });
            return;
        }

        getAllPackages();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-10">
            <div className="max-w-7xl mx-auto">

                <div className="flex justify-baseline mt-10">
                    <button
                        onClick={() => navigate("/login")}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200 shadow-md"
                    >
                        ← Back To Login
                    </button>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
                        Choose Your Plan
                    </h1>
                    <p className="text-gray-500 mt-3 text-sm md:text-base">
                        Select the best package and start using your CRM
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-60">
                        <Loader2 className="animate-spin text-indigo-600" size={40} />
                    </div>
                ) : packages.length === 0 ? (
                    <div className="text-center bg-white rounded-3xl border border-slate-200/80 p-10 shadow-sm">
                        <p className="text-gray-500">No packages available</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                        {packages.map((pkg, index) => (
                            <div
                                key={pkg._id || index}
                                className="relative flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 hover:shadow-md transition-all duration-300"
                            >
                                {/* {index === 1 && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                                        Popular
                                    </span>
                                )} */}

                                <div className="border-b border-slate-100 pb-5">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {pkg.packageName}
                                    </h2>

                                    <p className="text-gray-500 text-sm mt-1">
                                        {pkg.duration}
                                    </p>

                                    <div className="flex items-center mt-5 text-indigo-700">
                                        <IndianRupee size={22} />
                                        <h1 className="text-4xl font-bold">{pkg.price}</h1>
                                    </div>
                                </div>

                                <div className="flex-1 mt-6 space-y-3">
                                    {pkg.description?.split(",").map((item, index) => (
                                        <div key={index} className="flex gap-3 text-sm text-gray-600">
                                            <CheckCircle
                                                size={18}
                                                className="text-green-500 shrink-0 mt-0.5"
                                            />
                                            <span>{item.trim()}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleBuyNow(pkg)}
                                    className="mt-8 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300">
                                    Buy Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>





        </div>
    );
};

export default Pricing;