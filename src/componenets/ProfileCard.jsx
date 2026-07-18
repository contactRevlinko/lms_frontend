import { UserCircle, Save } from "lucide-react";
import React, { useState } from "react";
import CustomDropDown from "./CustomDropDown";
import toast from "react-hot-toast";
import { validateEmail, validatePassword } from "../utils/validation";

const BASE_URL = import.meta.env.VITE_API_URL;

const businessTypes = [
    "Wholesaler",
    "Retailer",
    "Distributor",
    "Manufacturer",
    "Supplier",
    "Trader",
    "Importer",
    "Exporter",
    "Dealer",
    "Service Provider",
    "Agency",
    "Franchise",
    "Consultant",
    "Freelancer",
    "Startup",
    "Other",
];

const ProfileCard = () => {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        businessType: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const updateProfile = async () => {
        if (!validateEmail(form.email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        if (!validatePassword(form.password)) {
            toast.error(
                "Password must contain 8+ characters, uppercase, lowercase, number and special character"
            )}
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${BASE_URL}/auth/update-profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const result = await res.json();

            if (result.success) {
                localStorage.setItem("user", JSON.stringify(result.data));
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6 lg:p-8">

            {/* Header */}
            <div className="flex items-center gap-3 lg:gap-4 mb-5 lg:mb-8">
                <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-indigo-100 flex items-center justify-center">
                    <UserCircle className="w-6 h-6 lg:w-8 lg:h-8 text-indigo-600" />
                </div>

                <div>
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-800">
                        Profile Information
                    </h3>

                    <p className="text-xs lg:text-sm text-gray-500">
                        Update your personal account details
                    </p>
                </div>
            </div>


            <form autoComplete="off">
                <input type="text" name="fake_user" autoComplete="username" className="hidden" />
                <input type="password" name="fake_pass" autoComplete="current-password" className="hidden" />

                <div className="flex flex-col gap-4 lg:gap-5">
                    <div>
                        <label className="font-medium mb-1 block text-gray-600 text-xs lg:text-sm">
                            Full Name
                        </label>

                        <input
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                            name="field_839201"
                            type="text"
                            autoComplete="new-password"
                            autoCorrect="off"
                            spellCheck={false}
                            placeholder="Enter your full name"
                            className="outline-none border border-gray-300 text-sm    rounded-xl px-2 py-2 w-full"
                        />
                    </div>

                    <div>
                        <label className="font-medium mb-1 block text-gray-600 text-xs lg:text-sm">
                            Phone Number
                        </label>

                        <input
                            value={form.phone}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    phone: e.target.value.replace(/\D/g, ""),
                                })
                            }
                            name="field_839202"
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            autoComplete="new-password"
                            placeholder="Mobile number"
                            className="outline-none border border-gray-300 text-sm    rounded-xl px-2 py-2 w-full"                        />
                    </div>

                    <div>
                        <label className="font-medium mb-1 block text-gray-600 text-xs lg:text-sm">
                            Work Email
                        </label>

                        <input
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            name="field_839203"
                            type="email"
                            inputMode="email"
                            autoComplete="new-password"
                            autoCorrect="off"
                            spellCheck={false}
                            placeholder="username123@gmail.com"
                            className="outline-none border border-gray-300 text-sm    rounded-xl px-2 py-2 w-full"                        />
                    </div>

                    <div>
                        <label className="font-medium mb-1 block text-gray-600 text-xs lg:text-sm">
                            Business Type
                        </label>

                        <CustomDropDown
                            value={form.businessType}
                            options={businessTypes}
                            onChange={(value) =>
                                setForm({
                                    ...form,
                                    businessType: value,
                                })
                            }
                        />
                    </div>
                </div>

                <div className="mt-6 lg:mt-8 flex justify-center">
                    <button
                        type="button"
                        onClick={updateProfile}
                        className="bg-indigo-600 hover:bg-indigo-700 inline-flex justify-center items-center gap-2 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200"
                    >
                        <Save size={18} />
                        Update Profile
                    </button>
                </div>
            </form>

        </div>
    );
};

export default ProfileCard;