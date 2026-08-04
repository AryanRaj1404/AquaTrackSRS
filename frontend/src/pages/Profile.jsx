import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    Loader2,
    Save,
    User,
    Mail,
    Phone,
    Home,
    Shield,
    UserCircle2,
    AtSign,
    Edit3,
    Building2,
} from "lucide-react";

import AdminPageShell from "../components/AdminPageShell";
import profileService from "../services/profileService";

function Profile() {

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        mobileNumber: "",
        role: "",
        provider: "",
        apartmentName: "",
        flatNumber: "",
        flatSize: null,
        occupancy: null,
    });

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {

        try {

            setLoading(true);

            const data =
                await profileService.getProfile();

            setProfile(data);

        }

        catch (error) {

            console.error(error);

            toast.error(
                "Unable to load profile."
            );

        }

        finally {

            setLoading(false);

        }

    }

    function handleChange(e) {

        const { name, value } = e.target;

        setProfile(previous => ({
            ...previous,
            [name]: value,
        }));

    }

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            setSaving(true);

            await profileService.updateProfile(
                profile
            );

            toast.success(
                "Profile updated successfully."
            );

        }

        catch (error) {

            console.error(error);

            toast.error(
                "Unable to update profile."
            );

        }

        finally {

            setSaving(false);

        }

    }

    if (loading) {

        return (

            <AdminPageShell
                title="My Profile"
                description="Loading profile..."
            >

                <section className="mg-empty-state">

                    <Loader2
                        size={40}
                        className="animate-spin"
                    />

                    <h3>
                        Loading Profile
                    </h3>

                </section>

            </AdminPageShell>

        );

    }

    const initials =
        `${profile.firstName?.charAt(0) ?? ""}${profile.lastName?.charAt(0) ?? ""}`;

    const roleLabel =
        profile.role === "ADMIN"
            ? "Apartment Administrator"
            : "Resident";

    const providerLabel =
        profile.provider === "LOCAL"
            ? "AquaTrack"
            : "Google";

    return (

        <AdminPageShell

            title="My Profile"

            description="Manage your personal information and account details."

            searchPlaceholder="Search profile"

        >

            <form
                onSubmit={handleSubmit}
                className="space-y-8"
            >

                {/* ===================================================== */}

                {/* PROFILE HEADER */}

                {/* ===================================================== */}

                <section className="mg-panel">

                    <div className="flex items-center gap-8">

                        <div className="flex items-center gap-6">

                            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-cyan-600 to-sky-800 text-5xl font-bold text-white shadow-xl">

                                {initials}

                            </div>

                            <div>

                                <h2 className="text-4xl font-bold text-slate-900">

                                    {profile.firstName} {profile.lastName}

                                </h2>

                                <p className="mt-2 text-slate-500 text-lg">

                                    {profile.email}

                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                  @{profile.username}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-3">

                                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                                      🛡 {roleLabel}
                                    </span>

                                    <span className="inline-flex items-center rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
                                      🔐 {providerLabel}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                {/* ===================================================== */}

                {/* PERSONAL INFORMATION */}

                {/* ===================================================== */}

                <section className="mg-panel">

                    <div className="mb-8 flex items-center gap-3">

                        <div className="rounded-xl bg-cyan-100 p-3">

                            <User
                                size={20}
                                className="text-cyan-700"
                            />

                        </div>

                        <div>

                            <h2 className="text-xl font-bold">

                                Personal Information

                            </h2>

                            <p className="text-sm text-slate-500">

                                Update your editable personal details.

                            </p>

                        </div>

                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        <InputField
                            icon={User}
                            label="First Name"
                            name="firstName"
                            value={profile.firstName}
                            onChange={handleChange}
                        />

                        <InputField
                            icon={User}
                            label="Last Name"
                            name="lastName"
                            value={profile.lastName}
                            onChange={handleChange}
                        />

                        <InputField
                            icon={Phone}
                            label="Mobile Number"
                            name="mobileNumber"
                            value={profile.mobileNumber ?? ""}
                            onChange={handleChange}
                        />

                    </div>

                </section>

                {profile.role === "RESIDENT" && (

    <section className="mg-panel">

        <div className="mb-8 flex items-center gap-3">

    <div className="rounded-xl bg-orange-100 p-3">

        <Building2
            size={20}
            className="text-orange-700"
        />

    </div>

    <div>

        <h2 className="text-xl font-bold">
            Residence Information
        </h2>

        <p className="text-sm text-slate-500">
            Information about your registered residence.
        </p>

    </div>

</div>

        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">

            <InfoRow
                icon={Building2}
                label="Apartment"
                value={profile.apartmentName}
            />

            <InfoRow
                icon={Home}
                label="Flat Number"
                value={profile.flatNumber}
            />

            <InfoRow
                icon={Home}
                label="Flat Size"
                value={`${profile.flatSize} sq.ft.`}
            />

            <InfoRow
                  icon={User}
                  label="Occupancy"
                  value={`${profile.occupancy} ${
                      profile.occupancy === 1 ? "Resident" : "Residents"
                  }`}
              />

        </div>

    </section>

)}

                {/* ===================================================== */}

                {/* ACCOUNT INFORMATION */}

                {/* ===================================================== */}

                <section className="mg-panel">

                    <div className="mb-8 flex items-center gap-3">

                        <div className="rounded-xl bg-indigo-100 p-3">

                            <Shield
                                size={20}
                                className="text-indigo-700"
                            />

                        </div>

                        <div>

                            <h2 className="text-xl font-bold">

                                Account Information

                            </h2>

                            <p className="text-sm text-slate-500">

                                These details are managed by AquaTrack.

                            </p>

                        </div>

                    </div>

                    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">

                        <InfoRow
                            label="Authentication Provider"
                            value={providerLabel}
                        />

                        <InfoRow
                            label="Account Type"
                            value={roleLabel}
                        />

                        <InfoRow
                            label="Username"
                            value={profile.username}
                        />

                        <InfoRow
                            label="Registered Email"
                            value={profile.email}
                        />

                    </div>

                </section>

                {/* ===================================================== */}

                {/* ACTIONS */}

                {/* ===================================================== */}

                <div className="flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={loadProfile}
                        className="mg-secondary-button inline-flex items-center gap-2 whitespace-nowrap"
                    >

                        <Edit3 size={17} />
                        Discard Changes

                    </button>

                    <button
                        type="submit"
                        className="mg-primary-button"
                        disabled={saving}
                    >

                        {saving ? (

                            <Loader2
                                size={18}
                                className="animate-spin"
                            />

                        ) : (

                            <Save size={18} />

                        )}

                        {saving
                            ? "Saving..."
                            : "Save Changes"}

                    </button>

                </div>

            </form>

        </AdminPageShell>

    );

}

/* ========================================================= */

function InputField({

    icon: Icon,

    label,

    name,

    value,

    onChange,

    disabled = false,

}) {

    return (

        <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">

                {label}

            </label>

            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-100">

                <Icon
                    size={18}
                    className="mr-3 text-slate-400"
                />

                <input

                    type="text"

                    name={name}

                    value={value}

                    onChange={onChange}

                    disabled={disabled}

                    className="w-full bg-transparent outline-none disabled:text-slate-500"

                />

            </div>

        </div>

    );

}

/* ========================================================= */

function InfoRow({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="flex items-center justify-between px-6 py-5">

            <div className="flex items-center gap-3">

                {Icon && (
                    <Icon
                        size={18}
                        className="text-slate-500"
                    />
                )}

                <span className="text-slate-500">
                    {label}
                </span>

            </div>

            <span className="font-semibold text-slate-900">
                {value}
            </span>

        </div>
    );
}

/* ========================================================= */

export default Profile;