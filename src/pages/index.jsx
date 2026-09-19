import { useNavigate,  useParams } from "react-router-dom";
import { FooterModal, HeaderModal, IsLoading } from "../common";
import { useEffect, useState } from "react";
import { useAlert } from "../controls/AlertProvider";
import { Image, Modal, Textbox } from "../controls";
import { CircleChevronRight,  Map, Phone } from "lucide-react";
import { CellFormat } from "../common/validate";
import FetchData from "../hook/fetchData";
import { useAuth } from "../auth/authContext";

export const Index = () => {
    const navigate = useNavigate();
    const {login} = useAuth();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [openCell, setOpenCell] = useState(true);
    const [cell, setCell] = useState(localStorage.getItem("cell") || '');

    const [form, setForm] = useState([]);
    const [message, setMessage] = useState([]);

     const option = [
        { key: 1, label: 'Book an appointment', description: '', route:'/Create' },
        { key: 2, label: 'Re-schedule an appointment', description: '', route:'/History'  },
        { key: 3, label: 'Cancel an appointment', description: '', route:'/History'  },
    ]

    const { Id } = useParams();
    const id = Id;
   // const isEdit = !!id;

    useEffect(() => {
        if (openCell) return;

        const getById = async (id) => {
            setIsLoading(true);

            try {
                const res = await FetchData({
                    endPoint: 'booking/company',
                    id: id
                });
                const Response = res.data;
                if (Response) {
                    setForm(Response);
                    if(Response.length === 1)
                        handleSubmit(Response[0].id);              
                }
                else {
                    showAlert({
                        type: "error",
                        message: "Not Found",
                        duration: 5000,
                    });
                }
                // set state here
            } catch (error) {
                showAlert({
                    type: "error",
                    message: error,
                    duration: 5000,
                });
            } finally {
                setIsLoading(false);
            }
        };

        getById(id);
    }, [id, openCell]);

    const handleSubmit = async (cid) => {
        setIsLoading(true);
        const res = await login(cid,id);
        if (res.status)
            navigate("/Main");
        else
            showAlert({
                type: "error",
                message: res.message,
                duration: 5000,
            });

        setIsLoading(false);
    }

    const Validate = () => {
        const errors = [];

        if (cell.trim() === "")
            errors.push("Cell Number is required.");

        if (cell.length !== 12)
            errors.push("Cell Number must be in the format 123-456-7890.");

        setMessage(errors);
        return errors.length === 0;
    };

    const handleContinue = async () => {
        localStorage.setItem('cell', cell);
        setOpenCell(false);
    };

    return (
        <>
            <div className='flex flex-col font-normal gap-3 mt-2 w-full mb-4 p-3 md:px-8 ' >
                <p className='text-2xl font-sans font-bold mb-4'> Choose a location</p>
                <IsLoading isLoading={isLoading} rows={10} input={
                    form.map(item => {
                        const addressInfo = item.addressinfo?.[0] ?? {};
                        const address = [
                            addressInfo.street,
                            addressInfo.city,
                            addressInfo.province,
                            addressInfo.postal,
                            addressInfo.country,
                        ]
                            .filter(Boolean)
                            .join(", ");
                        return (
                            <div key={item.id} className='w-full mb-2 border rounded-md border-gray-200 p-2 flex flex-row gap-3 shadow-md cursor-pointer hover:bg-gray-50'
                                onClick={() => handleSubmit(item.id)}>
                                <Image
                                    src={item?.logo || null}
                                    name={item?.name || 'iSchedule'}
                                    className="flex-shrink-0 rounded-lg"
                                    avatar={false}
                                />

                                <div>
                                    <div className="text-lg font-semibold text-gray-800 leading-tight">
                                        {item?.name || "iSchedule"}
                                    </div>

                                    <div className="text-[11px] text-gray-400">
                                        {item?.category || ''}
                                    </div>

                                    <div className="text-[11px] mt-2 flex flex-row gap-2 items-center ">
                                        <Map size={16} /> {address}
                                    </div>
                                    <div className="text-[11px] mt-2 flex flex-row gap-2 items-center ">
                                        <Phone size={16} /> {item?.cell || ''}
                                    </div>
                                </div>
                            </div>
                        )
                    })} />
            </div>

            <Modal open={openCell} message={message} messageType="error" children={
                <>
                    <HeaderModal
                        Title={`Log In`}
                        Description={`Enter your cell number associated with your account to securely log in and manage your appointments.`}                
                    />
                    <IsLoading isLoading={isLoading} rows={10} input={
                        <>
                            <div  className="flex-1 overflow-y-auto px-8 pb-4">
                                <Textbox label="" icon={Phone} placeholder="(e.g., 416-555-1234)" value={cell} setValue={(e) => setCell(CellFormat(e))} />                          
                            </div>
                            <FooterModal
                                step={1}
                                totalSteps={1}
                                completeLabel="Continue As Guest !"
                                onComplete={() => Validate() && handleContinue()}
                            />
                        </>
                    } />
                </>
            } />

            <Modal open={open} message={[]} messageType="error" children={
                <>
                    <HeaderModal
                        Title={`Choose an option`}
                        Description={`Book a new appointment, reschedule an existing booking, or cancel your appointment.`}
                        className="border-b border-gray-200"
                        onClick={() => setOpen(false)}
                    />
                    <IsLoading isLoading={isLoading} rows={10} input={
                        <>
                            {/* Scrollable Content */}
                            <div  className="flex-1 overflow-y-auto px-8 py-4">
                                <div className="space-y-6 px-8 pb-8 ">
                                    {option.map(item => (
                                        <div key={item.key} class='w-full border rounded-md border-gray-200 p-4 flex flex-row justify-between items-center gap-2 shadow-md cursor-pointer hover:bg-gray-100'
                                        onClick={() => navigate(item.route)}>
                                            <p class='text-sm font-medium text-gray-700'>{item.label}</p>
                                            <CircleChevronRight />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    } />
                </>
            } />
        </>

    )
}