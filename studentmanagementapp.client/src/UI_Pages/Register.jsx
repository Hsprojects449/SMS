import React, { useEffect, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../Common/cropImageUtil";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const Register = () => {
    // Crop states
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [rawImage, setRawImage] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Loading and classes
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);

    // Step state
    const [currentStep, setCurrentStep] = useState(1);
    const ALL_STEPS = 4;

    // Form state (unchanged shape for API compatibility)
    const initialFormData = {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        gender: "",
        parentName: "",
        parentPhone: "",
        address: "",
        state: "",
        city: "",
        pinCode: "",
        class: "",
        classID: "",
        dob: "",
        phoneNumber: "",
        qualification: "",
        subjectSpecialization: "",
        requestedAt: new Date().toISOString().split('T')[0],
        experience: "",
        photo: "",
         // ✅ new fields
        bloodGroup: "",
        caste: "",
        religion: "",
        nationality: "",
        aadhaarNo: ""
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    // Role
    const [role, setRole] = useState(() => {
        const r = searchParams.get("role");
        return r == "Teacher" ? "Teacher" : "Student";
    });
    // Store all teacher phone numbers for duplicate check
    const [teacherPhones, setTeacherPhones] = useState([]);

    // Photo states
    const [photoPreview, setPhotoPreview] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);

    // Fetch classes once
    useEffect(() => {
        axios
            .get("https://schoolapi.vsngroups.com/api/Class")
            .then((res) => setClasses(res.data))
            .catch((err) => console.error("Error fetching class data:", err));
        // Fetch all teacher phone numbers for duplicate validation
        axios
            .get("https://schoolapi.vsngroups.com/api/Teacher")
            .then((res) => {
                const phones = res.data.map(t => t.contactPhone).filter(Boolean);
                setTeacherPhones(phones);
            })
            .catch((err) => console.error("Error fetching teacher phone numbers:", err));
    }, []);

    useEffect(() => {
        axios
            .get("https://schoolapi.vsngroups.com/api/Syllabus")
            .then((res) => { 
                // Extract unique subject names
                const uniqueSubjects = Array.from(new Set(res.data.map(s => s.name))).filter(Boolean);
                setSubjects(uniqueSubjects);
            })
            .catch((err) => console.error("Error fetching subjects data:", err));
    }, []);

    // Step fields definition (stable)
    const STEP_FIELDS = useMemo(
        () => ({
            Student: {
                1: ["firstName", "middleName", "lastName", "class"],
                2: ["email", "gender", "address", "state", "city", "pinCode", "bloodGroup", "religion", "nationality", "aadhaarNo"],
                3: ["parentName", "parentPhone", "dob", "caste"],
                4: ["photo"]
            },
            Teacher: {
                1: ["firstName", "middleName", "lastName"],
                2: ["email", "gender", "address", "state", "city", "pinCode","bloodGroup", "religion", "nationality", "aadhaarNo"],
                3: [
                    "phoneNumber",
                    "qualification",
                    "subjectSpecialization",
                    "experience",
                    "dob"
                ],
                4: ["photo"]
            }
        }),
        []
    );

    // Validation (same rules)
    const validate = (fd, r) => {
        let errs = {};
        const nameRegex = /^[A-Za-z ]*$/;
        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
        const phoneRegex = /^\d{10}$/;
        const pinCodeRegex = /^\d{6}$/;

        if (!nameRegex.test(fd.firstName))
            errs.firstName = "First name should contain only letters.";
        if (fd.middleName && !nameRegex.test(fd.middleName))
            errs.middleName = "Middle name should contain only letters.";
        if (!nameRegex.test(fd.lastName))
            errs.lastName = "Last name should contain only letters.";
        if (!emailRegex.test(fd.email)) errs.email = "Invalid email address.";
        if (r == "Student" && !phoneRegex.test(fd.parentPhone))
            errs.parentPhone = "Parent phone must be 10 digits.";
        if (r == "Teacher" && fd.phoneNumber && !phoneRegex.test(fd.phoneNumber))
            errs.phoneNumber = "Phone number must be 10 digits.";
        // Check for duplicate phone number for teachers
        if (r == "Teacher" && fd.phoneNumber && teacherPhones.includes(fd.phoneNumber)) {
            errs.phoneNumber = "This phone number is already registered.";
        }
        if (fd.pinCode && !pinCodeRegex.test(fd.pinCode))
            errs.pinCode = "Pin code must be 6 digits.";
        if (r == "Teacher" && fd.qualification && /[0-9]/.test(fd.qualification))
            errs.qualification = "Qualification should not contain numbers.";
        if (fd.photo == "") errs.photo = "Please upload your Latest Photo";
        if (fd.aadhaarNo && !/^\d{12}$/.test(fd.aadhaarNo)) {
            errs.aadhaarNo = "Aadhaar number must be 12 digits.";
        }
        return errs;
    };



   
    const validateStep = (fd, r, step) => {
        let allErrs = {};
        const allowed = new Set(STEP_FIELDS[r][step]);

        // Friendly names
        const fieldLabels = {
            firstName: "First Name",
            middleName: "Middle Name",
            lastName: "Last Name",
            email: "Email",
            gender: "Gender",
            parentName: "Parent Name",
            parentPhone: "Parent Phone",
            address: "Address",
            state: "State",
            city: "City",
            pinCode: "Pin Code",
            class: "Class",
            dob: "Date of Birth",
            phoneNumber: "Phone Number",
            qualification: "Qualification",
            subjectSpecialization: "Subject Specialization",
            experience: "Experience",
            photo: "Photo"
        };

        // ✅ Check each field in current step
        STEP_FIELDS[r][step].forEach((field) => {
            if (
                (!fd[field] || fd[field].toString().trim() === "") &&
                field !== "middleName" // optional
            ) {
                allErrs[field] = `${fieldLabels[field] || field} is required`;
            }
        });

        // ✅ Additional format checks
        if (fd.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fd.email)) {
            allErrs.email = "Enter a valid email address";
        }

        if (fd.pinCode && !/^\d{6}$/.test(fd.pinCode)) {
            allErrs.pinCode = "Pin Code must be 6 digits";
        }

        if (fd.phoneNumber && !/^\d{10}$/.test(fd.phoneNumber)) {
            allErrs.phoneNumber = "Phone Number must be 10 digits";
        }

        if (fd.parentPhone && !/^\d{10}$/.test(fd.parentPhone)) {
            allErrs.parentPhone = "Parent Phone must be 10 digits";
        }

        return Object.fromEntries(
            Object.entries(allErrs).filter(([k]) => allowed.has(k))
        );
    };





    // Change handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            setErrors(validateStep(updated, role, currentStep));
            return updated;
        });
    };

    const handleClassChange = (e) => {
        const value = e.target.value;
        const selectedClass = classes.find((c) => c.classID == value);
        setFormData((prev) => {
            const updated = {
                ...prev,
                class: selectedClass?.name || "",
                classID: value
            };
            setErrors(validateStep(updated, role, currentStep));
            return updated;
        });
    };

    const handleRoleChange = (e) => {
        const nextRole = e.target.value;
        setRole(nextRole);
        setCurrentStep(1);
        setErrors(validateStep(formData, nextRole, 1));
    };

    // File handler — use File (not FileList) and blob URL for preview
   

    // Navigation
    const nextStep = () => {
        const stepErrs = validateStep(formData, role, currentStep);
        setErrors(stepErrs);
        if (Object.keys(stepErrs).length === 0) {
            setCurrentStep((s) => Math.min(s + 1, ALL_STEPS));
        }
    };
    const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show spinner

        const newErrors = validate(formData, role);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            // Find the first step that contains any of the errored fields
            const stepFields = STEP_FIELDS[role];
            const firstBadStep = [1, 2, 3, 4].find((s) =>
                stepFields[s].some((f) => newErrors[f])
            ) || 1;

            // Show only that step’s errors and move the user there
            const allowed = new Set(stepFields[firstBadStep]);
            const visibleStepErrors = Object.fromEntries(
                Object.entries(newErrors).filter(([k]) => allowed.has(k))
            );

            setErrors(visibleStepErrors);
            setCurrentStep(firstBadStep);
            setLoading(false);
            return;
        }

        // Concatenate name parts
        const fullName = [formData.firstName, formData.middleName, formData.lastName]
            .filter(Boolean)
            .join(" ");

        try {
            const SubmissionFormData = new FormData();
            if (role == "Student") {
                SubmissionFormData.append('name', fullName);
                SubmissionFormData.append('contactEmail', formData.email);
                SubmissionFormData.append('passwordHash', null);
                SubmissionFormData.append('gender', formData.gender);
                SubmissionFormData.append('parentName', formData.parentName);
                SubmissionFormData.append('parentPhone', formData.parentPhone);
                SubmissionFormData.append('address', `${formData.address}, ${formData.city}, ${formData.state}, ${formData.pinCode}`);
                SubmissionFormData.append('medicalRecordPath', "NA");
                SubmissionFormData.append('class', formData.class);
                SubmissionFormData.append('classID', formData.classID);
                SubmissionFormData.append('dob', formData.dob ? new Date(formData.dob).toISOString() : null);
                SubmissionFormData.append('profilePicture', formData.photo);
                SubmissionFormData.append('file', profilePhoto);
                SubmissionFormData.append('bloodGroup', formData.bloodGroup);
                SubmissionFormData.append('religion', formData.religion);
                SubmissionFormData.append('nationality', formData.nationality);
                SubmissionFormData.append('aadhaarNo', formData.aadhaarNo);
                SubmissionFormData.append('caste', formData.caste);
                // for (let pair of SubmissionFormData.entries()) {
                //     console.log(pair[0] + ': ' + pair[1]);
                // }
                await axios.post(
                    "https://schoolapi.vsngroups.com/api/StudentApplicant", SubmissionFormData
                )
                .then(response => {
                    alert("✅ Your registration is pending admin approval.");
                })
                .catch(error => {
                    alert("Registration failed", error);
                });
            } else {
                SubmissionFormData.append('name', fullName);
                SubmissionFormData.append('contactEmail', formData.email);
                SubmissionFormData.append('PasswordHash', null);
                SubmissionFormData.append('ContactPhone', formData.phoneNumber);
                SubmissionFormData.append('qualification', formData.qualification);
                SubmissionFormData.append('subjectSpecialization', formData.subjectSpecialization);
                SubmissionFormData.append('Experience', formData.experience);
                SubmissionFormData.append('address', `${formData.address}, ${formData.city}, ${formData.state}, ${formData.pinCode}`);
                SubmissionFormData.append('gender', formData.gender);
                SubmissionFormData.append('profilePicture', formData.photo);
                SubmissionFormData.append('dob', formData.dob ? new Date(formData.dob).toISOString() : null);
                SubmissionFormData.append('file', profilePhoto);
                SubmissionFormData.append('bloodGroup', formData.bloodGroup);
                SubmissionFormData.append('religion', formData.religion);
                SubmissionFormData.append('nationality', formData.nationality);
                SubmissionFormData.append('aadhaarNo', formData.aadhaarNo);
                // for (let pair of SubmissionFormData.entries()) {
                //     console.log(pair[0] + ': ' + pair[1]);
                // }
                await axios.post(
                    "https://schoolapi.vsngroups.com/api/TeacherApplicant", SubmissionFormData
                )
                .then(response => {
                    alert("✅ Your teacher registration is pending admin approval.");
                })
                .catch(error => {
                    alert("Registration failed", error);
                });
            }
            setFormData(initialFormData);
            setTimeout(() => { // Show spinner for a short time before navigating
                setLoading(false);
                navigate("/login");
            }, 500);
        }  catch (error) {
            if (error.response?.status == 400 && typeof error.response.data == "string") {
                setErrors(prev => ({ ...prev, email: error.response.data }));
            } else {
                console.error(error);
                alert("❌ Error submitting registration request.");
            }
            setLoading(false); // Hide spinner
        }
    };

    //const handleFileChange = (e) => {
    //    const list = e.target?.files;
    //    const file = list && list.length > 0 ? list[0] : null; // ✅ take the first file
    //    if (!file) return;

    //    setProfilePhoto(file);

    //    setFormData((prev) => {
    //        const updated = { ...prev, photo: file.name };
    //        setErrors(validateStep(updated, role, currentStep));
    //        return updated;
    //    });

    //    setPhotoPreview((prevUrl) => {
    //        if (prevUrl) {
    //            try {
    //                URL.revokeObjectURL(prevUrl);
    //            } catch { }
    //        }
    //        return URL.createObjectURL(file); // ✅ now this is a File, not FileList
    //    });
    //};
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        handleChange(e);
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setRawImage(reader.result);
                setCropModalOpen(true);
            };
            reader.readAsDataURL(file);
        } else {
            setPhotoPreview(null);
            setProfilePhoto(null);
        }
    };

    // UI
    const StepHeader = () => (
        <>
            <div className="flex items-center justify-center gap-3 mb-2">
                {[1, 2, 3, 4].map((s) => (
                    <div
                        key={`step-${s}`}
                        className={`h-2 w-16 rounded-full ${currentStep >= s ? "bg-orange-400" : "bg-orange-200"
                            }`}
                    />
                ))}
            </div>
            <p className="text-center text-sm text-gray-600 mb-6">
                {role === "Student"
                    ? [
                        "Who are you?",
                        "Contact & address",
                        "Parent & DOB",
                        "Photo & review"
                    ][currentStep - 1]
                    : [
                        "Who are you?",
                        "Contact & address",
                        "Teacher details",
                        "Photo & review"
                    ][currentStep - 1]}
            </p>
        </>
    );

    return (
        <div
            className="min-h-screen bg-orange-100 flex items-center justify-center px-4 sm:px-6 lg:px-8"
            style={{ position: "relative" }}
        >
            {loading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded z-50">
                    <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin shadow-[0_0_10px_3px_rgba(255,165,0,0.5)]" />
                </div>
            )}

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 absolute top-4">
                <button
                    type="button"
                    className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-600 transition font-bold text-2xl bg-transparent border-0"
                    style={{ cursor: "pointer", outline: "none" }}
                    onClick={() => {
                        setLoading(true);
                        setTimeout(() => navigate("/"), 500);
                    }}
                >
                    <img src="/sms-logo.png" alt="Logo" className="h-8" />
                    <span>SMS</span>
                </button>
            </div>

            <div className="backdrop-blur-md bg-white/90 border-orange-300 shadow-2xl hover:shadow-orange-400 rounded-2xl mx-auto py-16 px-8 w-full max-w-3xl my-12 animate-fade-in">
                <h2 className="text-4xl font-bold text-center mb-2 tracking-wide relative pb-4 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent animate-fade-in">
                    <span className="typing-wrapper p-2">
                        <span className="text-black font-bold">Sign </span>
                        <span className="text-orange-400 font-bold">Up</span>
                    </span>
                </h2>

                <StepHeader />

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Step 1 */}
                    <div style={{ display: currentStep === 1 ? "contents" : "none" }}>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">I am a</label>
                            <select
                                name="role"
                                value={role}
                                onChange={handleRoleChange}
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
                            >
                                <option>Student</option>
                                <option>Teacher</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                            <input
                                name="firstName"
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter your first name"
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                            />
                            {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Middle Name</label>
                            <input
                                name="middleName"
                                type="text"
                                value={formData.middleName}
                                onChange={handleChange}
                                placeholder="(Optional)"
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                            />
                            {errors.middleName && <p className="text-red-600 text-xs mt-1">{errors.middleName}</p>}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                            <input
                                name="lastName"
                                type="text"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter your last name"
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                            />
                            {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
                        </div>

                        {role == "Student" && (
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Class</label>
                                <select
                                    name="class"
                                    value={formData.classID}
                                    onChange={handleClassChange}
                                    required
                                    className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
                                >
                                    <option value="">-- Select Class --</option>
                                    {classes.map((c) => (
                                        <option key={c.classID} value={c.classID}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.class && <p className="text-red-600 text-xs mt-1">{errors.class}</p>}
                            </div>
                        )}
                    </div>

                    {/* Step 2 */}
                    <div style={{ display: currentStep === 2 ? "contents" : "none" }}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                            />
                            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.gender && <p className="text-red-600 text-xs mt-1">{errors.gender}</p>}

                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                            <input
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Street/Area/House No."
                                required
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                            />
                            {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                            <input
                                name="state"
                                type="text"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                            />
                            {errors.state && <p className="text-red-600 text-xs mt-1">{errors.state}</p>}

                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                            <input
                                name="city"
                                type="text"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                            />
                            {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}

                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Pin Code</label>
                            <input
                                name="pinCode"
                                type="text"
                                value={formData.pinCode}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                            />
                            {errors.pinCode && <p className="text-red-600 text-xs mt-1">{errors.pinCode}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Blood Group</label>
                            <select
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg"
                            >
                                <option value="">-- Select Blood Group --</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                            {errors.bloodGroup && <p className="text-red-600 text-xs mt-1">{errors.bloodGroup}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Religion</label>
                            <select
                                name="religion"
                                value={formData.religion}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg"
                            >
                                <option value="">-- Select Religion --</option>
                                <option value="Hindu">Hindu</option>
                                <option value="Muslim">Muslim</option>
                                <option value="Christian">Christian</option>
                                <option value="Jewish">Jewish</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.religion && <p className="text-red-600 text-xs mt-1">{errors.religion}</p>}
                        </div>


                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Nationality</label>
                            <select
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg"
                            >
                                <option value="">-- Select Nationality --</option>
                                <option value="Indian">Indian</option>
                                <option value="Non-Indian">Non-Indian</option>
                            </select>
                            {errors.nationality && <p className="text-red-600 text-xs mt-1">{errors.nationality}</p>}
                        </div>


                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Aadhaar Number</label>
                            <input
                                name="aadhaarNo"
                                type="text"
                                value={formData.aadhaarNo}
                                onChange={handleChange}
                                placeholder="12-digit Aadhaar No."
                                className="w-full px-4 py-2 border border-orange-300 rounded-lg"
                            />
                            {errors.aadhaarNo && <p className="text-red-600 text-xs mt-1">{errors.aadhaarNo}</p>}
                        </div>

                    </div>

                    {/* Step 3 */}
                    <div style={{ display: currentStep === 3 ? "contents" : "none" }}>
                        {role == "Student" && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Parent Name</label>
                                    <input
                                        name="parentName"
                                        type="text"
                                        required
                                        value={formData.parentName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                                    />
                                    {errors.parentName && <p className="text-red-600 text-xs mt-1">{errors.parentName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Parent Phone</label>
                                    <input
                                        name="parentPhone"
                                        type="text"
                                        required
                                        value={formData.parentPhone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                                    />
                                    {errors.parentPhone && <p className="text-red-600 text-xs mt-1">{errors.parentPhone}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                                    <input
                                        name="dob"
                                        type="date"
                                        required
                                        value={formData.dob}
                                        onChange={handleChange}
                                        max={new Date().toISOString().split("T")}
                                        className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                                    />
                                    {errors.dob && <p className="text-red-600 text-xs mt-1">{errors.dob}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Caste</label>
                                    <select
                                        name="caste"
                                        value={formData.caste}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-orange-300 rounded-lg"
                                    >
                                        <option value="">-- Select Caste --</option>
                                        <option value="General">General</option>
                                        <option value="SC">SC</option>
                                        <option value="OBC">OBC</option>
                                        <option value="ST">ST</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.caste && <p className="text-red-600 text-xs mt-1">{errors.caste}</p>}
                                </div>

                            </>
                        )}

                        {role == "Teacher" && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                                    <input
                                        name="dob"
                                        type="date"
                                        required
                                        value={formData.dob}
                                        onChange={handleChange}
                                        max={new Date().toISOString().split("T")}
                                        className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                                    />
                                    {errors.dob && <p className="text-red-600 text-xs mt-1">{errors.dob}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        name="phoneNumber"
                                        type="text"
                                        required
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                                    />
                                    {errors.phoneNumber && <p className="text-red-600 text-xs mt-1">{errors.phoneNumber}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Qualification</label>
                                    <input
                                        name="qualification"
                                        type="text"
                                        required
                                        value={formData.qualification}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                                    />
                                    {errors.qualification && <p className="text-red-600 text-xs mt-1">{errors.qualification}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Subject Specialization</label>
                                    <select
                                        name="subjectSpecialization"
                                        value={formData.subjectSpecialization}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
                                    >
                                        <option value="">-- Select Subject --</option>
                                        {subjects.map((subj, idx) => (
                                            <option key={idx} value={subj}>{subj}</option>
                                        ))}
                                    </select>
                                    {errors.subjectSpecialization && <p className="text-red-600 text-xs mt-1">{errors.subjectSpecialization}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Experience (In Years)</label>
                                    <input
                                        name="experience"
                                        type="text"
                                        required
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-orange-300 rounded-lg bg-white bg-opacity-50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-500 transition duration-200"
                                    />
                                    {errors.experience && <p className="text-red-600 text-xs mt-1">{errors.experience}</p>}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Step 4 */}
                    <div style={{ display: currentStep === 4 ? "contents" : "none" }}>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Photo</label>
                            <div className="flex items-center space-x-4">
                                <div className="w-24 h-24 rounded-lg border border-gray-300 bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-gray-400 text-xs">No Image</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        name="photo"
                                        type="file"
                                        accept=".jpeg, .jpg, .png"
                                        onChange={handleFileChange}
                                        required
                                        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-400 file:text-white hover:file:bg-orange-500"
                                    />
                                </div>
                            </div>
                            {errors.photo && <p className="text-red-600 text-xs mt-1">{errors.photo}</p>}
                        </div>                   
                     </div>

                    {/* Navigation */}
                    <div className="sm:col-span-2 flex items-center justify-between mt-4">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 1 || loading}
                            className="px-6 py-2 rounded-lg border border-orange-300 text-orange-600 bg-white hover:bg-orange-50 disabled:opacity-50"
                        >
                            Back
                        </button>

                        {currentStep < ALL_STEPS ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white font-semibold py-2 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 cursor-pointer"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white font-semibold py-2 px-12 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 cursor-pointer"
                                disabled={Object.keys(errors).length > 0 || loading}
                            >
                                Register
                            </button>
                        )}
                    </div>

                    {/* Back to Login */}
                    <div className="sm:col-span-2 text-center text-sm text-orange-600 mt-2">
                        <button
                            type="button"
                            className="hover:underline text-orange-600 bg-transparent border-0 p-0 m-0 text-sm cursor-pointer"
                            onClick={() => {
                                setLoading(true);
                                setTimeout(() => navigate(-1), 500);
                            }}
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            {/* Crop Modal */}
            {cropModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 shadow-2xl relative w-[350px] h-[400px] flex flex-col items-center">
                        <h3 className="text-lg font-semibold mb-2 text-orange-500">Crop Profile Photo</h3>
                        <div className="relative w-[300px] h-[300px] bg-gray-100">
                            <Cropper
                                image={rawImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
                            />
                        </div>
                        <div className="flex gap-4 mt-4">
                            <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={e => setZoom(Number(e.target.value))} />
                        </div>
                        <div className="flex gap-4 mt-4">
                            <button
                                type="button"
                                className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500"
                                onClick={async () => {
                                    const cropped = await getCroppedImg(rawImage, croppedAreaPixels);
                                    setPhotoPreview(cropped);
                                    // Convert base64 to blob for upload
                                    const arr = cropped.split(",")[1];
                                    const mime = cropped.split(",")[0].match(/:(.*?);/)[1];
                                    const bstr = atob(arr);
                                    let n = bstr.length;
                                    const u8arr = new Uint8Array(n);
                                    while (n--) u8arr[n] = bstr.charCodeAt(n);
                                    const blob = new Blob([u8arr], { type: mime });
                                    setProfilePhoto(blob);
                                    setCropModalOpen(false);
                                }}
                            >
                                Crop & Save
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                                onClick={() => {
                                    setCropModalOpen(false);
                                    setRawImage(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default Register;