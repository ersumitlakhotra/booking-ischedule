/* eslint-disable react-hooks/exhaustive-deps */
import { useOutletContext } from "react-router-dom";
import { updateField } from "../../common/general.jsx";
import { CellFormat } from "../../common/validate.jsx";
import { Textbox,   Textarea } from "../../controls/index.jsx"
import { useEffect,  useState } from "react";
import { CheckCircle2, Mail, Phone, User } from "lucide-react";
import { IsLoading } from "../../common/isLoading.jsx";

const CustomerInfo = ({ form, setForm }) => {
    const {customerList, getCustomer } = useOutletContext();
    const [customers, setCustomers] = useState([]);
    const [referralCell, setReferralCell] = useState('');
    const [referralName, setReferralName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        Init();
    }, [])

    const Init = async () => {
        setIsLoading(true);
        const [CustomerResponse] = await Promise.all([getCustomer()]);
        setCustomers(CustomerResponse);
        if (form.referral && Number(form.referral) > 0) {
            const referralDetail = CustomerResponse.find(
                o => Number(o.id) === Number(form.referral)
            );

            setReferralCell(referralDetail?.cell || "");
            setReferralName(referralDetail?.name || "")
        } else {
            setReferralCell("");
            setReferralName("");
        }

        if(form.name.trim() === "")
            updateField("name", customerList?.name || "", setForm) 
        
        if(form.cell.trim() === "")
            updateField("cell", customerList?.cell || "", setForm) 
        
        if(form.email.trim() === "")
            updateField("email", customerList?.email || "", setForm)


        setIsLoading(false);
    };

    const handleReferral = (e) => {
        const cell = CellFormat(e);

        setReferralCell(cell);
        setReferralName("")

        if (cell?.length === 12) {
            const referralDetail = customers.find(
                o => o.cell === cell
            );

            if (referralDetail) {
                updateField("referral", referralDetail.id, setForm);
                setReferralName(referralDetail.name)
            } else {
                updateField("referral", 0, setForm);
            }
        } else {
            updateField("referral", 0, setForm);
        }
    };

    return (
        <IsLoading isLoading={isLoading} rows={10} input={
            <>
            <div class=' mt-3 flex flex-col gap-5  md:flex-row'>
                <Textbox required icon={User} label="Full Name" placeholder="Enter fullname " value={form.name} setValue={(e) => updateField("name", e, setForm)} />
                <Textbox required icon={Phone} label="Phone Number" placeholder="(e.g., 416-555-1234)" value={form.cell} setValue={(e) => updateField("cell", CellFormat(e), setForm)} />
                <Textbox icon={Mail} label="E-Mail" placeholder="Enter e-mail" value={form.email} setValue={(e) => updateField("email", e, setForm)} />
            </div>
            <Textbox icon={Phone} label="Referred By" placeholder="(e.g., 416-555-1234)" value={referralCell} setValue={(e) => handleReferral(e)}
                helperText={
                    referralCell?.length === 12 &&
                    (Number(form.referral === 0) ? "We couldn’t find a customer associated with this referral number. Please verify the number and try again." :
                        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                            <CheckCircle2 size={18} className="shrink-0 text-green-600" />
                            <span>
                                Referral customer verified: <span className="font-semibold">{referralName}</span>
                            </span>
                        </div>
                    )} />
            <Textarea label="Notes" value={form.notes} setValue={(e) => updateField("notes", e, setForm)} placeholder="(Optional)" />
       </>}/>
    )
}

export default CustomerInfo
