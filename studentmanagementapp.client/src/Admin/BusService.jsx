import React, { useRef, useState, useEffect } from "react";
import { MdCheckCircle, MdErrorOutline, MdRemoveRedEye } from "react-icons/md";
import {
    PlusCircle,
    Trash2,
    Save,
    Pencil,
    GripVertical,
    X,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Select from "react-select";
import Pagination from "../Common/Pagination";
import axios from 'axios';

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: "#fff",
        borderColor: state.isFocused ? "#fb923c" : "#fdba74",
        color: "#000",
        boxShadow: state.isFocused ? "0 0 0 2px #fdba74" : "none",
        borderRadius: 8,
        minHeight: 38,
        '&:hover': {
            borderColor: "#fb923c",
        },
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: "#fff",
        color: "#000",
        border: "1px solid #fdba74",
        borderRadius: 8,
        boxShadow: "0 4px 16px 0 rgba(251,146,60,0.10)",
        marginTop: 2,
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? "#ffedd5" : "#fff",
        color: "#000",
        cursor: "pointer",
        '&:hover': {
            backgroundColor: "#ffedd5",
        },
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: "#fdba74",
        color: "#000",
        borderRadius: 6,
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: "#000",
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: "#fff",
        backgroundColor: "#fb923c",
        borderRadius: 6,
        ':hover': {
            backgroundColor: "#f87171",
            color: "#fff",
        },
    }),
    input: (provided) => ({
        ...provided,
        color: "#000",
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "#fb923c",
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "#000",
    }),
};

const BusService = () => {
    const [buses, setBuses] = useState([]);
    const [viewStops, setViewStops] = useState(null);
    const [viewUsers, setViewUsers] = useState(null);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState("success");
    const [currentPage, setCurrentPage] = useState(1);
    const [removedUsers, setRemovedUsers] = useState([]);
    const busesPerPage = 5;
    const topRef = useRef(null);
    const [highlightedBusFields, setHighlightedBusFields] = useState({});
    const [highlightedStopFields, setHighlightedStopFields] = useState({});
    const [allUserOptions, setAllUserOptions] = useState([]);
    const indexOfLast = currentPage * busesPerPage;
    const indexOfFirst = indexOfLast - busesPerPage;
    const currentBuses = buses.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(buses.length / busesPerPage);

    const showMessage = (text, type = "success") => {
        setMessage(text);
        setMessageType(type);
        topRef.current?.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => setMessage(null), 3000);
    };

    useEffect(() => {
        axios.get('https://schoolapi.vsngroups.com/api/Bus')
        .then(response => {
            setBuses(response.data?.map(bus => ({
                ...bus,
                stops: JSON.parse(bus.stops),
                assignedUsers: JSON.parse(bus.assignedUsers)
              })))
        })
        .catch(error => {
            console.error('Error fetching Buses Details:', error);
        });

        axios.get('https://schoolapi.vsngroups.com/api/Student')
        .then(response => {
            axios.get('https://schoolapi.vsngroups.com/api/Teacher')
            .then(response1 => {
                const combined = [...response.data, ...response1.data];
                    const transformed = combined.map(user => {
                        const id = user.studentID || user.teacherID;
                        let label = user.name;
                        if (user.studentID && user.class) {
                            label += ` (Class ${user.class})`;
                        }
                        return {
                            value: id,
                            label
                        };
                    });
                    setAllUserOptions(transformed);
            })
        })
        .catch(error => {
            console.error('Error fetching Assigned User Details:', error);
        });
    }, []);

    const handleAddBus = () => {
        setBuses((prev) => [
            ...prev,
            {
                route: "",
                busNo: "",
                driver: "",
                contact: "",
                stops: [],
                assignedUsers: [],
                editable: true,
                new: true
            },
        ]);
    };

    const handleEditToggle = (index) => {
        const bus = buses[index];
        if (bus.editable) {
            // Validation
            let busFields = [];
            let stopFields = {};

            if (!bus.route) busFields.push("route");
            if (!bus.busNo) busFields.push("busNo");
            if (!bus.driver) busFields.push("driver");
            if (!bus.contact) busFields.push("contact");

            if (bus.stops.length == 0) {
                showMessage("At least one stop is required.", "error");
                setHighlightedBusFields({ [index]: busFields });
                setHighlightedStopFields({
                    [index]: [
                        { idx: 0, field: "name" },
                        { idx: 0, field: "time" },
                    ],
                });
                return;
            }

            bus.stops.forEach((stop, stopIdx) => {
                if (!stop.name || !stop.time) {
                    if (!stopFields[index]) stopFields[index] = [];
                    if (!stop.name)
                        stopFields[index].push({ idx: stopIdx, field: "name" });
                    if (!stop.time)
                        stopFields[index].push({ idx: stopIdx, field: "time" });
                }
            });

            setHighlightedBusFields({ [index]: busFields });
            setHighlightedStopFields(stopFields);

            if (busFields.length > 0 || Object.keys(stopFields).length > 0) {
                showMessage(
                    "All fields (Route, Bus No, Driver, Contact, Stops) are required.",
                    "error"
                );
                return;
            }
            const updatedBus = {...bus, stops: JSON.stringify(bus.stops), assignedUsers: JSON.stringify(bus.assignedUsers)}
            bus.new ? 
            axios.post(`https://schoolapi.vsngroups.com/api/Bus`, updatedBus)
            .then(res=>{
                setBuses((prev) =>
                    prev.map((bus, i) =>
                        i == index ? { ...bus, busID: res.data.busID } : bus
                    )
                );
            }) 
            : 
            axios.put(`https://schoolapi.vsngroups.com/api/Bus/${bus.busID}`, {...updatedBus, removedUsers: JSON.stringify(removedUsers)})
            .then(res=>{setRemovedUsers('')})
        }
        setHighlightedBusFields({});
        setHighlightedStopFields({});
        setBuses((prev) =>
            prev.map((bus, i) =>
                i == index ? { ...bus, editable: !bus.editable } : bus
            )
        );
    };

    const handleUpdateBus = (index, field, value) => {
        const updated = [...buses];
        updated[index][field] = value;
        setBuses(updated);
        // Remove highlight as soon as user fills the field
        setHighlightedBusFields((prev) => {
            const copy = { ...prev };
            if (copy[index]) {
                copy[index] = copy[index].filter((f) => f != field);
                if (copy[index].length == 0) delete copy[index];
            }
            return copy;
        });
    };

    const handleDeleteBus = (id) => {

        axios.delete(`https://schoolapi.vsngroups.com/api/Bus/${id}`)

        setBuses((prev) => prev.filter((bus) => bus.busID != id));
        showMessage("Bus removed successfully.");
    };

    const handleAddStop = (index) => {
        const updated = [...buses];
        updated[index].stops.push({
            id: Date.now().toString(),
            name: "",
            time: "",
        });
        setBuses(updated);
    };

    const handleRemoveStop = (busIndex, stopId) => {
        const updated = [...buses];
        updated[busIndex].stops = updated[busIndex].stops.filter(
            (stop) => stop.id != stopId
        );
        setBuses(updated);
    };

    const handleStopChange = (busIndex, stopId, field, value) => {
        const updated = [...buses];
        updated[busIndex].stops = updated[busIndex].stops?.map((stop) =>
            stop.id == stopId ? { ...stop, [field]: value } : stop
        );
        setBuses(updated);
        // Remove highlight as soon as user fills the field
        setHighlightedStopFields((prev) => {
            const copy = { ...prev };
            if (copy[busIndex]) {
                const stopIdx = updated[busIndex].stops.findIndex(
                    (s) => s.id == stopId
                );
                copy[busIndex] = copy[busIndex].filter(
                    (f) => !(f.idx == stopIdx && f.field == field)
                );
                if (copy[busIndex].length == 0) delete copy[busIndex];
            }
            return copy;
        });
    };
    
    const getAssignedUserIds = () => {
        const seen = new Set();
        const assignedUserIds = [];
        buses.forEach(bus => {
            bus.assignedUsers.forEach(userId => {
                if (!seen.has(userId)) {
                    seen.add(userId);
                    assignedUserIds.push(userId);
                }
            });
        });
    
        return assignedUserIds;
    };

    const handleDragEnd = (result, busIndex) => {
        if (!result.destination) return;
        const updated = [...buses];
        const stops = Array.from(updated[busIndex].stops);
        const [moved] = stops.splice(result.source.index, 1);
        stops.splice(result.destination.index, 0, moved);
        updated[busIndex].stops = stops;
        setBuses(updated);
    };

    return (
        <div>
            <h2 className="relative text-2xl font-bold text-black mb-4 flex items-center gap-2 drop-shadow-lg">
                Manage Bus Service
                <span className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded"></span>
            </h2>
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAddBus}
                    className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:brightness-110 text-white px-4 py-2 rounded flex items-center gap-2 shadow cursor-pointer"
                >
                    <PlusCircle size={18} /> Add Bus
                </button>
            </div>

            {message && (
                <div
                    ref={topRef}
                    className={`mb-4 flex items-center gap-3 px-4 py-3 rounded-md shadow-md text-white text-sm font-medium ${messageType == "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                >
                    {messageType == "success" ? (
                        <MdCheckCircle className="text-xl" />
                    ) : (
                        <MdErrorOutline className="text-xl" />
                    )}
                    <span>{message}</span>
                </div>
            )}

            <div className="bg-white text-black border border-orange-300 rounded-lg p-4 shadow">
                <div className="overflow-x-auto border border-orange-300 rounded-lg">
                <table className="min-w-full text-left rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-orange-100">
                            <th className="p-2">Route</th>
                            <th className="p-2">Bus No</th>
                            <th className="p-2">Driver</th>
                            <th className="p-2">Contact</th>
                            <th className="p-2">Stops</th>
                            <th className="p-2">Users</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBuses.map((bus, i) => (
                            <tr key={bus.busID} className="border-t border-orange-300 align-top">
                                <td className="p-2">
                                    {bus.editable ? (
                                        <input
                                            placeholder="Route Name"
                                            value={bus.route}
                                            onChange={(e) =>
                                                handleUpdateBus(
                                                    indexOfFirst + i,
                                                    "route",
                                                    e.target.value
                                                )
                                            }
                                            className={`bg-orange-100 text-black border border-orange-300 px-2 py-1 rounded w-full ${highlightedBusFields[indexOfFirst + i]?.includes(
                                                "route"
                                            )
                                                    ? "border-2 border-red-500"
                                                    : ""
                                                }`}
                                        />
                                    ) : (
                                        bus.route
                                    )}
                                </td>
                                <td className="p-2">
                                    {bus.editable ? (
                                        <input
                                            placeholder="AP--EY----"
                                            value={bus.busNo}
                                            onChange={(e) =>
                                                handleUpdateBus(
                                                    indexOfFirst + i,
                                                    "busNo",
                                                    e.target.value
                                                )
                                            }
                                            className={`bg-orange-100 text-black border border-orange-300 px-2 py-1 rounded w-full ${highlightedBusFields[indexOfFirst + i]?.includes(
                                                "busNo"
                                            )
                                                    ? "border-2 border-red-500"
                                                    : ""
                                                }`}
                                        />
                                    ) : (
                                        bus.busNo
                                    )}
                                </td>
                                <td className="p-2">
                                    {bus.editable ? (
                                        <input
                                            placeholder="Diver Name"
                                            value={bus.driver}
                                            onChange={(e) =>
                                                handleUpdateBus(
                                                    indexOfFirst + i,
                                                    "driver",
                                                    e.target.value
                                                )
                                            }
                                            className={`bg-orange-100 text-black border border-orange-300 px-2 py-1 rounded w-full ${highlightedBusFields[indexOfFirst + i]?.includes(
                                                "driver"
                                            )
                                                    ? "border-2 border-red-500"
                                                    : ""
                                                }`}
                                        />
                                    ) : (
                                        bus.driver
                                    )}
                                </td>
                                <td className="p-2">
                                    {bus.editable ? (
                                        <input
                                            placeholder="Driver Contact"
                                            value={bus.contact}
                                            onChange={(e) =>
                                                handleUpdateBus(
                                                    indexOfFirst + i,
                                                    "contact",
                                                    e.target.value
                                                )
                                            }
                                            className={`bg-orange-100 text-black border border-orange-300 px-2 py-1 rounded w-full ${highlightedBusFields[indexOfFirst + i]?.includes(
                                                "contact"
                                            )
                                                    ? "border-2 border-red-500"
                                                    : ""
                                                }`}
                                        />
                                    ) : (
                                        bus.contact
                                    )}
                                </td>
                                <td className="p-2">
                                    {bus.editable ? (
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                            <DragDropContext
                                                onDragEnd={(result) =>
                                                    handleDragEnd(result, indexOfFirst + i)
                                                }
                                            >
                                                <Droppable droppableId={`stops-${i}`}>
                                                    {(provided) => (
                                                        <div
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                        >
                                                            {bus.stops?.map((stop, stopIdx) => (
                                                                <Draggable
                                                                    key={stop.id}
                                                                    draggableId={stop.id}
                                                                    index={stopIdx}
                                                                >
                                                                    {(provided) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            className="flex items-center gap-2 bg-orange-50 text-black border border-orange-300 p-2 rounded mb-1"
                                                                        >
                                                                            <GripVertical
                                                                                size={14}
                                                                                className="text-gray-400 cursor-pointer"
                                                                            />
                                                                            <input
                                                                                value={stop.name}
                                                                                onChange={(e) =>
                                                                                    handleStopChange(
                                                                                        indexOfFirst + i,
                                                                                        stop.id,
                                                                                        "name",
                                                                                        e.target.value
                                                                                    )
                                                                                }
                                                                                placeholder="Stop Name"
                                                                                className={`bg-orange-100 text-black border border-orange-300 px-2 py-1 rounded w-28 ${highlightedStopFields[
                                                                                        indexOfFirst + i
                                                                                    ]?.some(
                                                                                        (f) =>
                                                                                            f.idx == stopIdx &&
                                                                                            f.field == "name"
                                                                                    )
                                                                                        ? "border-2 border-red-500"
                                                                                        : ""
                                                                                    }`}
                                                                            />
                                                                            <input
                                                                                type="time"
                                                                                value={stop.time}
                                                                                onChange={(e) =>
                                                                                    handleStopChange(
                                                                                        indexOfFirst + i,
                                                                                        stop.id,
                                                                                        "time",
                                                                                        e.target.value
                                                                                    )
                                                                                }
                                                                                className={`bg-orange-100 text-black border border-orange-300 px-2 py-1 rounded w-24 mr-1 [color-scheme:light] ${highlightedStopFields[
                                                                                        indexOfFirst + i
                                                                                    ]?.some(
                                                                                        (f) =>
                                                                                            f.idx == stopIdx &&
                                                                                            f.field == "time"
                                                                                    )
                                                                                        ? "border-2 border-red-500"
                                                                                        : ""
                                                                                    }`}
                                                                            />
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleRemoveStop(
                                                                                        indexOfFirst + i,
                                                                                        stop.id
                                                                                    )
                                                                                }
                                                                                className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded cursor-pointer"
                                                                                title="Delete Stop"
                                                                            >
                                                                                <Trash2 size={14} />
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </DragDropContext>
                                            <button
                                                onClick={() => handleAddStop(indexOfFirst + i)}
                                                className="text-sm text-orange-400 underline hover:text-black cursor-pointer flex items-center gap-2 transition"
                                            >
                                                + Add Stop
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setViewStops(bus)}
                                            title="View Stops"
                                            className="bg-sky-600 hover:bg-sky-700 text-white p-2 rounded cursor-pointer"
                                        >
                                            <MdRemoveRedEye size={14} />
                                        </button>
                                    )}
                                </td>
                                <td className="p-2">
                                    {bus.editable ? (
                                        <Select
                                            styles={{
                                                ...customStyles,
                                                placeholder: (provided) => ({
                                                    ...provided,
                                                    color: "#000",
                                                    fontSize: 14,
                                                    fontWeight: 400,
                                                }),
                                                menuPortal: (base) => ({
                                                    ...base,
                                                    zIndex: 9999,
                                                }),
                                            }}
                                            className="text-sm text-black"
                                            options={allUserOptions}
                                            isMulti
                                            value={allUserOptions.filter((opt) =>
                                                bus.assignedUsers.includes(opt.value)
                                            )}
                                            onChange={(selectedOptions) => {
                                                const newValues = selectedOptions?.map(s => s.value) || [];
                                                const previousValues = bus.assignedUsers || [];
                                                const removedUsers = previousValues.filter(
                                                    (user) => !newValues.includes(user)
                                                );
                                                const result = getAssignedUserIds().filter(id => !previousValues.includes(id));
                                                const lastValue = newValues[Object.keys(newValues).length - 1];
                                                const isPresent = result.includes(lastValue);
                                                isPresent &&showMessage("The User is already mapped to another bus please remove the user to the other bus First", "error");
                                                !isPresent && setRemovedUsers(prev => [...prev,...removedUsers])
                                                !isPresent && handleUpdateBus(indexOfFirst + i, "assignedUsers", newValues);
                                            }}
                                            placeholder="Assign Students/Teachers"
                                            isClearable
                                            menuPortalTarget={typeof window !== 'undefined' ? window.document.body : null}
                                            menuPosition="fixed"
                                        />
                                    ) : (
                                        <button
                                            onClick={() => setViewUsers(bus)}
                                            title="View Users"
                                            className="bg-sky-600 hover:bg-sky-700 text-white p-2 rounded cursor-pointer"
                                        >
                                            <MdRemoveRedEye size={14} />
                                        </button>
                                    )}
                                </td>
                                <td className="p-2">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditToggle(indexOfFirst + i)}
                                            className={`${bus.editable ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"} text-white p-2 rounded cursor-pointer`}
                                            title={bus.editable ? "Save" : "Edit"}
                                        >
                                            {bus.editable ? <Save size={14} /> : <Pencil size={14} />}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBus(bus.busID)}
                                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded cursor-pointer"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>

                {buses.length > busesPerPage && (
                    <div className="mt-4">
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>

            {/* Stops Modal */}
            {viewStops && (
                <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center">
                    <div className="relative bg-white text-black border border-orange-300 p-6 rounded-xl shadow-2xl w-96 max-h-[80vh] overflow-y-auto">
                        <button
                            onClick={() => setViewStops(null)}
                            className="absolute top-2 right-2 text-black hover:text-red-500 cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                        <h3 className="text-lg font-semibold mb-4 text-orange-500">
                            Bus Stops for {viewStops.route}
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {viewStops.stops?.map((stop, i) => (
                                <li key={i}>
                                    {stop.name} ({stop.time})
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Users Modal */}
            {viewUsers && (
                <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center">
                    <div className="relative bg-white text-black border border-orange-300 p-6 rounded-xl shadow-2xl w-96 max-h-[80vh] overflow-y-auto">
                        <button
                            onClick={() => setViewUsers(null)}
                            className="absolute top-2 right-2 text-black hover:text-red-500 cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                        <h3 className="text-lg font-semibold mb-4 text-orange-500">
                            Assigned Users for {viewUsers.route}
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {viewUsers.assignedUsers?.map((uid, i) => {
                                const label =
                                    allUserOptions.find((opt) => opt.value == uid)?.label || uid;
                                return <li key={i}>{label}</li>;
                            })}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusService;