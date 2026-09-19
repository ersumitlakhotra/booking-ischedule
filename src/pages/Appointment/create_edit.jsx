/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { FooterModal, HeaderModal, IsLoading } from "../../common/index.jsx";
import { Modal } from "../../controls/index.jsx";
import { useAlert } from "../../controls/AlertProvider.jsx";
import { useEffect, useRef, useState } from "react";
import { decryptId, updateField } from "../../common/general.jsx";
import {  Users,  Receipt, NotepadText,  Sparkles } from "lucide-react";
import { get_Date, LocalDate } from "../../common/localDate.js";
import EmployeesInfo from "../Employee/employee_info.jsx";
import ServicesInfo from "../Services/service_info.jsx";
import SlotsInfo from "./slots_info.jsx";
import CustomerInfo from "./customer_info.jsx";
import SummaryInfo from "./summary_info.jsx";
import FetchData from "../../hook/fetchData.js";
import { EMAIL_STATUS } from "../..//common/enum.jsx";

export const CreateEditCancel = () => {
    const navigate = useNavigate();
    const initialEditRef = useRef(null);
    const {saveData, serviceList, companyList,getCustomer } = useOutletContext()
    const location = useLocation();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const { Id } = useParams();
    const id = decryptId(Id);
    const isEdit = !!id;
    const contentRef = useRef(null);
    const { type,value } = location.state || {};
    const [selectedDayOpen, setSelectedDayOpen] = useState(true);
    const date = LocalDate();

    const isAutoAccept = companyList?.autoaccept || false;

    const [form, setForm] = useState({
        id: null,
        cid: null,
        status:isAutoAccept ? "Pending" : "Awaiting",
        order_no: "0",
        trndate: date,
        slot: "",
        starttime: "",
        endtime: "",
        uid: 0,
        services: [],
        products: [],
        subtotal: 0,

        coupon: "",
        isdiscount: false,
        discounttype: "coupon",
        discount: "0",

        istax: true,
        tax: 0,
        taxpercentage: 0,

        total: 0,
        tip: 0,
        bookedvia: "Appointment",


        custid: 0,
        name: "",
        cell: "",
        email: "",
        reason: "",
        notes: "",
        additionalnotes: "",

        payments: [],
        logs: [],
        paymentstatus: 'Unpaid',

        referral: 0,
        isnewcustomer: false,
        points: 0,
        referralpoints: 0,
        punchpoints: 0,
        badgepoints: 0,
        pointsused: 0,
        createdat: null,
        modifiedat: null,
    });
  
    const [prevSlot, setPrevSlot] = useState({
        trndate: date,
        slot: "",
    });
    useEffect(() => {
        const Init = async () => {
            setIsLoading(true);
            const CustomerResponse = await getCustomer();
            setCustomerList(CustomerResponse);
            setIsLoading(false);
        }
        Init();
    }, [])

    useEffect(() => {
        if(!type) return;

        if (type === 'service') {
            const service = serviceList.find(o => o.id.toString() === decryptId(value));
            if (!service) return;

            const serviceData = [{
                id: service.id,
                label: `${service.name} ($${service.price})`,
                name: service.name,
                value: service.id,
                price: service.price,
                minutes: service.minutes,
            }];
             updateField("services", serviceData, setForm);

        }
           

        if(type === 'employee')
            updateField("uid",decryptId(value),setForm)

        if(type === 'discount')
            updateField("coupon",decryptId(value),setForm)

        

    }, [type])

 useEffect(() => {
        if (!isEdit || !id) return;

        const getById = async (id) => {
            try {
                const Response = await FetchData({
                    endPoint: 'appointment',
                    id: id
                });
                if (Response.status === 200) {
                    setForm({
                        ...Response.data,
                        trndate: get_Date(Response.data.trndate, 'YYYY-MM-DD'),
                        status: isAutoAccept ? Response.data.status : "Awaiting",
                    });
                    setPrevSlot({
                         trndate: get_Date(Response.data.trndate, 'YYYY-MM-DD'),
                         slot:Response.data.slot
                    })
                    if (!initialEditRef.current) {
                        initialEditRef.current = {
                            trndate: get_Date(Response.data.trndate, 'YYYY-MM-DD'),
                            uid: Response.data.uid
                        };
                    }
                }
                else {
                    showAlert({
                        type: "error",
                        message: "Not Found",
                        duration: 5000,
                    });
                    navigate(-1);
                }
                // set state here
            } catch (error) {
                showAlert({
                    type: "error",
                    message: error,
                    duration: 5000,
                });
                navigate(-1);
            }
        };
        const loadEdit = async () => {
            setIsLoading(true);
            await getById(id);
            setIsLoading(false);
        };

        loadEdit();
    }, [id, isEdit]);

 
    const [step, setStep] = useState(1);
    const steps = [
        { id: 1, label: "Specialist", icon: Users, content: <EmployeesInfo form={form} setForm={setForm} selectedDayOpen={selectedDayOpen} setSelectedDayOpen={setSelectedDayOpen} /> },
        { id: 2, label: "Services", icon: Sparkles, content: <ServicesInfo form={form} setForm={setForm}/> },
        { id: 3, label: "Slots", icon: NotepadText, content: <SlotsInfo form={form} setForm={setForm} id={id} isEdit={isEdit} initialEditRef={initialEditRef}/>  },
        { id: 4, label: "Customer", icon: Receipt, content: <CustomerInfo form={form} setForm={setForm} /> },        
        { id: 5, label: "Summary", icon: Receipt, content: <SummaryInfo  form={form} setForm={setForm} isEdit={isEdit}/>  },
    ];

    const currentContent = steps.find(item => item.id === step)?.content;

    useEffect(() => {
        contentRef.current?.scrollTo({
            top: 0,
            behavior: "smooth", // optional
        });
    }, [step]);

    const Validate = () => {
        switch (step) {
            case 1: {
                const errors = [];

                if (selectedDayOpen === false)
                    errors.push("The business is closed on the selected date. Please choose another date.");

                if (form.uid === 0)
                    errors.push("Please select employee.");

                if (form.trndate === "")
                    errors.push("Please select an available appointment date.");

                setMessage(errors);
                return errors.length === 0;
            }
            case 2: {
                const errors = [];

                if (form.services.length === 0)
                    errors.push("Please select at least one service to view available appointment slots.");

                setMessage(errors);
                return errors.length === 0;
            }
            case 3: {
                const errors = [];

                if (form.slot === "")
                    errors.push("Please select an available appointment time.");

                setMessage(errors);
                return errors.length === 0;
            }
            case 4: {
                const errors = [];

                 if (!form.name.trim())
                    errors.push("Full Name is required.");

                if (!form.cell.trim())
                    errors.push("Cell Number is required.");

                if (form.cell && form.cell.length !== 12)
                    errors.push("Cell Number must be in the format 123-456-7890.");

                setMessage(errors);
                return errors.length === 0;
            }
           
            default:
                return true;
        }
    };

  const handleCustomerSubmit = async () => {
        const selected = customerList.find((item) => item.cell === form.cell);
        let isnew = !selected;
        let custid = selected?.id || 0;
        if (!selected) {
            const res = await saveData({
                label: "Customers",
                endPoint: "customers",
                id: null,
                body: JSON.stringify({
                    name: form.name,
                    cell: form.cell,
                    email: form.email
                }),
                notify: false
            });

            if (res.isSuccess)
                custid = res.data.id;
        }
        return { custid, isnew };
    }

      const handleNotification = async (res) => {
          const appointment_id = res.data.id || "0";
          const date = get_Date(form.trndate,'dddd, MMM DD, YYYY'); 

         const message = isEdit
    ? form.status === "Awaiting"
        ? `${form.name} has requested changes to their appointment from ${prevSlot.trndate} at ${prevSlot.slot} to ${date} at ${form.slot}.`
        : `${form.name} has rescheduled their appointment from ${prevSlot.trndate} at ${prevSlot.slot} to ${date} at ${form.slot}.`
    : form.status === "Awaiting"
        ? `${form.name} would like to book an appointment on ${date} at ${form.slot}.`
        : `${form.name} booked an appointment on ${date} at ${form.slot}.`;


          await saveData({
              label: "Notification",
              endPoint: "notification",
              id: null,
              body: JSON.stringify({
                  id: null,
                  cid: null,
                  message: message,
                  read: false,
                  option: isEdit ? "Reschedule" : "New",
                  uid: form.uid,
                  oid: appointment_id,
                  unread: false,
                  createdat: null,
                  modifiedat: null,
              }),
              notify: false
          });  
    }

    const handleEmail = async (res) => {

        if (!Boolean(companyList?.emailreminder))
            return;

        const appointment_id = res.data.id || "0";
        const order_no = res.data.order_no || "0";
        const toEmail = res.data.email || "";

        const isRescheduled =
            get_Date(prevSlot?.trndate,"YYYY-MM-DD") !==   get_Date(form?.trndate,"YYYY-MM-DD") ||
            prevSlot?.slot !== form?.slot;

        const emailType = !isEdit
            ? form.status === "Cancelled"
                ? EMAIL_STATUS.CANCELLED
                : form.status === "Rejected"
                    ? EMAIL_STATUS.REJECTED
                    : form.status === "Pending"
                        ? EMAIL_STATUS.CONFIRMED
                        : ""
            : form.status === "Cancelled"
                ? EMAIL_STATUS.CANCELLED
                : form.status === "Rejected"
                    ? EMAIL_STATUS.REJECTED
                    : form.status === "Pending" && isRescheduled
                        ? EMAIL_STATUS.RESCHEDULED
                        : "";

        const emailRes = await FetchData({
            method: "POST",
            endPoint: 'appointment-mail',
            id: null,
            body: JSON.stringify({
                id: appointment_id,
                status: emailType
            })
        });

        if (emailRes?.status === 200 && (emailRes?.data?.accepted || []).length > 0) {
          await saveData({
                label: "Logs",
                endPoint: "logs",
                id: null,
                body: {
                    id: null,
                    cid: null,
                    type: "Email",
                    order_no: order_no,
                    sendfrom: companyList?.emailuser || "",
                    sendto: toEmail,
                    message: `${emailType} E-Mail have been sent successfully.`,
                    status: "Delivered",
                    oid: appointment_id,
                    createdat: null,
                    modifiedat:null
                },
                notify: false,
            });
        }
    }
 const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const customer = await handleCustomerSubmit();

            const res = await saveData({
                label: "Appointment",
                endPoint: "appointment",
                id: isEdit ? id : null,
                body: {
                    ...form,
                    custid: customer.custid,
                    ...(!isEdit && { isnewcustomer: customer.isnew })
                }
            });
            await handleNotification(res);

            await handleEmail(res);

            if (res.isSuccess) {
                navigate(-1);
            }
        } catch (error) {
             showAlert({
                    type: "error",
                    message: `Error saving appointment: ${error}`,
                    duration: 5000,
                });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal open={true} message={message} messageType="error" children={
            <>
                <HeaderModal
                    Title={isEdit ? 'Edit Appointment Detail : ' + form.order_no : `Create New Appointment`}
                    Description={`${isEdit ? "Edit" : "Add"} an appointment with personal details, service details, and scheduling preferences.`}
                    className="border-b border-gray-200 shadow-sm"
                    onClick={() => navigate(-1)}
                />
                <IsLoading isLoading={isLoading} rows={10} input={
                    <>          
                        {/* Scrollable Content */}
                        <div ref={contentRef} className="flex-1 overflow-y-auto px-8 pb-4">
                            <div className="space-y-6 ">
                                {currentContent}
                            </div>
                        </div>

                        <FooterModal
                            step={step}
                            totalSteps={steps.length}
                            onNext={() => {
                                if (Validate())
                                    setStep((prev) => prev + 1);
                            }}
                            onPrevious={() => {
                                setStep((prev) => prev - 1);
                            }}
                            onSkip={() => {
                                setStep((prev) => prev + 1);
                            }}
                            //showSkip={step === 2}
                            completeLabel="Confirm Appointment"
                            onComplete={() => Validate() && handleSubmit()}
                        />
                    </>
                } />
            </>
        } />
    );
}