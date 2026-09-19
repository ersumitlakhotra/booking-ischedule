/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate,useParams } from "react-router-dom";
import { useAlert } from "../controls/AlertProvider.jsx";
import { LoaderCircle } from "lucide-react";
import { Modal } from "../controls/modal.jsx";
import { HeaderModal } from "../common/index.jsx";
import FetchData from "../hook/fetchData";
import { get_Date, get_lastDaysDate, LocalDate } from "../common/localDate";

import SaveData from "../hook/saveData";
import { getDateRangeStatus, getWeekDates} from '../common/general.jsx'

import { useIdleTimer } from 'react-idle-timer';
import { getStorage } from "../common/localStorage.js";

const ProtectedLayout = () => {
    const ranOnce = useRef(false);
    const ref = useRef();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { showAlert } = useAlert();
    
    const [apptDate, setApptDate] = useState(LocalDate());
    const [calenderDate, setCalenderDate] = useState(LocalDate());
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [activeSettingTab, setActiveSettingTab] = useState(1);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [refresh, setRefresh] = useState(0);

    const [isAdmin, setIsAdmin] = useState(false);
    const [uid, setUid] = useState(0);
    const [expired, setExpired] = useState(false);
    const [isSetupComplete, setIsSetupComplete] = useState(true);
    const [isPaymentPending, setIsPaymentPending] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
   

    /*  Lists */
    const [companyList, setCompanyList] = useState(null);
    const [userList, setUserList] = useState([]);
    const [serviceList, setServiceList] = useState([]);
    const [notificationList, setNotificationList] = useState([]);

    const userCell = localStorage.getItem("cell") || '';
    const [customerList, setCustomerList] = useState([]);
   const [step, setStep] = useState(1);
     const { storeId } = useParams();
{/*
    const onIdle = () => {
        window.location.replace(`${process.env.REACT_APP_DOMAIN}/book-appointment?store=${storeId}`);
    };

    useIdleTimer({
        onIdle,
        timeout: 1000 * 60 * 5, // 10 minutes in milliseconds
        promptTimeout: 0, // No warning prompt
        crossTab: true, // Optional: Sync state across browser tabs
    });
*/}
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);

    useEffect(() => {
       init()
    }, []);

    const init = async () => {
        await Promise.all([getCompany(),getCustomer()]);     
    }

    useEffect(() => {

        if(!companyList) return;
        
        
       {/* if (companyList.length !== 0) {
            setIsLoading(true)
            const checkPlan = checkPlanStatus(companyList.plan, companyList.createdat)
            setExpired(pathname === '/setting' ? false : checkPlan.expired)
            setIsSetupComplete(companyList.issetupcomplete);

            const checkInvoice = billingList.filter(items => items.status.toLowerCase() === 'unpaid')
            let isDue = checkInvoice.length > 0 && checkIfPastOrToday(checkInvoice[0].duedate) === 'past';
            setIsPaymentPending(pathname === '/setting' ? false : isDue)

            setIsDisabled(checkPlan.expired || isDue)

            setIsLoading(false)
        }*/}
        
    }, [companyList]);


     const getCompany = async () => {
        const localStorage = await getStorage();

        const response = await FetchData({
            endPoint: 'company',
            id: localStorage.cid
        })
        setCompanyList(response.data[0]);
        return response.data;
    }

    const getAppointment = async (start = null, end = null) => {
        const response = await FetchData({
            endPoint: 'appointment',
            query: {
                orderBy: 'order_no',
                orderDir: 'DESC',
                ...(start !== null && end !== null && {
                    filters: JSON.stringify({
                        trndate: {
                            operator: "BETWEEN",
                            value: [start, end],
                        },
                    }),
                }),
            }
        })
        return response.data;
    } 

    const getUserAppointment = async () => {
        const response = await FetchData({
            endPoint: 'appointment',
            query: {
                orderBy: 'order_no',
                orderDir: 'DESC',
                filters: JSON.stringify({
                    cell: {
                        operator: "=",
                        value: userCell,
                    },
                }),
            }
        })
        return response.data;
    } 
  
   const getCustomer = async () => {
        const response = await FetchData({
            endPoint: 'customers',
             query: {
                orderBy: 'name',
                orderDir: 'ASC', 
            }
        })
        const userDetails = response.data.find(o => o.cell === userCell);
        setCustomerList(userDetails || [])
        return response.data;
    }

    const getDiscount = async () => {
        const response = await FetchData({
            endPoint: 'discount',
             query: {
                orderBy: 'startdate',
                orderDir: 'DESC',
            }
        })
        const responseData=response.data.map(item => ({ ...item,
            status: getDateRangeStatus(item.startdate, item.enddate)
        }))
        return responseData;
    }   

    const getAttendance = async (start,end) => {    
        const response = await FetchData({
            endPoint: 'attendance',
            query: {
                orderBy: 'trndate',
                orderDir: 'DESC',
                filters: JSON.stringify({
                    trndate: {
                        operator: "BETWEEN",
                        value: [start, end],
                    },
                }),
            }
        })
        return response.data;
    }
    
    const getService = async () => {
        const response = await FetchData({
            endPoint: 'services',
                query: {
                orderBy: 'name',
                orderDir: 'ASC',
            }
        })
setServiceList(response.data)
        return response.data;
    }
    

    const getUser = async (activeOnly=true) => {
        const response = await FetchData({
            endPoint: 'user',
            query: {
                orderBy: 'fullname',
                orderDir: 'ASC',
                 ...(activeOnly && {
                    filters: JSON.stringify({
                        status: {
                            operator: "=",
                            value: 'Active',
                        },
                    }),
                }),
            }
        })
        setUserList(response.data);
        return response.data;
    }
     const getInventory = async () => {
        const response = await FetchData({
            endPoint: 'inventory',
             query: {
                orderBy: 'name',
                orderDir: 'ASC',
            }
        })
        return response.data;
    }
  
    const saveData = async ({ label, method='POST', endPoint, id = null, body = null, notify = true, email = false }) => {
        setIsLoading(true)
        const res = await SaveData({
            label: label,
            method: method,
            endPoint: endPoint,
            id: id,
            body: body
        })
        
        setIsLoading(false)

        if (res.isSuccess) {
            notify && showAlert({
                type: "success",
                message: res.message,
                duration: 5000,
            });
            setRefresh(prev => prev + 1);
        }
        else
            notify && showAlert({
                type: "error",
                message: res.message,
                duration: 5000,
            });

        return res;
    }

    return (
        <div class='min-h-screen w-full flex flex-col  '>
             <main class="flex-1 scroll-auto ">
                <Outlet context={{
                    saveData, refresh, setRefresh, localStorage ,                                                  
                    getAppointment,getUserAppointment,apptDate, setApptDate,
                    userCell,step,setStep,companyList,
                    getAttendance, 
                    customerList, getCustomer,
                    getCompany,        
                    getDiscount,
                    getInventory,
                   serviceList, getService,
                   userList, getUser                   
                }} />
            </main>
            {isLoading &&
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999, // Ensure it's on top
                    }}
                >
                  <LoaderCircle className="h-12 w-12 animate-spin " />
                </div>
            }
           
    

        </div>
    );
};

export default ProtectedLayout;