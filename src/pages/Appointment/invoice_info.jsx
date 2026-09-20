/* eslint-disable react-hooks/exhaustive-deps */
import { getTax, updateField } from "../../common/general.jsx";
import { Textbox, Select, Badge,  Button, Tooltip } from "../../controls/index.jsx"
import { PriceFormat } from "../../common/validate.jsx"
import { useEffect, useMemo,  useState } from "react";
import {  useOutletContext } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import { calculateCouponDiscount, validateSelectedCoupon } from "./validation.jsx";
import { IsLoading } from "../../common/isLoading.jsx";

const InvoiceInfo = ({ form, setForm,prevForm, isEdit}) => {
      const [isLoading, setIsLoading] = useState(false);
     const { getAppointment, getCompany, getCustomer, getDiscount, getInventory } = useOutletContext();
   
    const [appointmentList, setAppointmentList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [inventoryList, setInventoryList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [couponList, setCouponList] = useState([]);
    
    useEffect(() => {
        Init();
    }, [])

    const Init = async () => {
        setIsLoading(true);

        const [
            AppointmentResponse,
            CompanyResponse,
            CustomerResponse,
            InventoryResponse,
            CouponResponse
        ] = await Promise.all([
            getAppointment(),
            getCompany(),
            getCustomer(),
            getInventory(),
            getDiscount()
        ]);

        setAppointmentList(AppointmentResponse);
        setCompanyList(CompanyResponse);
        setCustomerList(CustomerResponse);
        setInventoryList(InventoryResponse);
        setCouponList(CouponResponse);
        setIsLoading(false);
    };
    const [validateCoupon, setValidateCoupon] = useState({status:true,message:''})
     const totalReceived = form.payments.reduce(
        (sum, payment) => sum + (parseFloat(payment.amount) || 0),
        0
    );
    const discountTypes = [
        { id: 1, value: 'coupon', search: 'coupon', label: 'Coupon' },
        { id: 2, value: 'giftcard', search: 'giftcard', label: "Gift Card" },
        { id: 3, value: 'flatdiscount', search: 'flatdiscount', label: "Flat Discount" }
    ];

    const productIds = form.products?.map(p => Number(p.id)) || [];
    const productOptions = inventoryList
        .filter(i =>
            Number(i.stock) > 0 ||
            (isEdit && productIds.includes(Number(i.id)))
        )
        .map(o => ({
            id: o.id,
            label: `${o.name} (${o.stock})`,
            unit:o.stock,
            name: o.name,
            value: o.id,
            price: o.sellprice,
        }));

    const getProductOptions = (currentIndex) => {
        const selectedIds = form.products
            .filter((_, index) => index !== currentIndex)
            .map((p) => Number(p.id));

        return inventoryList
            .filter(
                (i) =>
                    (Number(i.stock) > 0 ||
                        (isEdit && productIds.includes(Number(i.id)))) &&
                    !selectedIds.includes(Number(i.id))
            )
            .map((o) => ({
                id: o.id,
                label: `${o.name} (${o.stock})`,
                unit: o.stock,
                name: o.name,
                value: o.id,
                price: o.sellprice,
            }));
    };

    const getUnitOptions = (currentIndex) => {
        const productId = Number(form.products[currentIndex]?.id);

        if (!productId) return [];

        const product = inventoryList.find(
            (i) => Number(i.id) === productId
        );

        if (!product) return [];

        const prevUnit = prevForm.products.find(
            (item) => Number(item.id) === productId
        );

        const maxStock = Number(product.stock) + Number(prevUnit?.unit || 0);

        return Array.from({ length: maxStock }, (_, index) => ({
            id: index + 1,
            label: `${index + 1}`,
            value: index + 1,
        }));
    };

     const couponOptions = couponList.filter(i =>
            i.status === "Live" ||
            (isEdit && i.coupon === form.coupon)
        ).map((o) => ({
        ...o,
        value:o.coupon,
        label: <Badge color={o.status === "Live"? "green":"red"} text={`${o.discounttype}${o.discount} : ${o.name} `} />,
    }));

    const customer = customerList.find((item) => item.cell === form.cell);
    const giftcardOptions = (customer?.giftcard || [])
        .filter(i =>
            Number(i.balance > 0) ||
            (isEdit && i.id === form.coupon)
        )
        .map(o => ({
            id: o.id,
            label: `${o.name} ($${o.balance})`,
            name: o.name,
            value: o.id,
            balance: o.balance,
        }));

    useMemo(() => {
        const service_price= form.services.reduce((sum, service) => sum + (Number(service.price) || 0),0);
        const product_price= form.products.reduce((sum, o) => sum + (Number(o.sellprice) || 0),0); 
        const result = (Number(service_price) || 0)+ (Number(product_price) || 0)
        updateField("subtotal", PriceFormat(result.toString()), setForm);
    }, [form.services,form.products]);  

    useMemo(() => {
        const address = companyList?.addressinfo?.[0];

        if (!address) return 0;

        const province = address.province;
        const taxList = getTax(province); 
        const subtotal = (Number(form.subtotal) || 0)  - (Number(form.discount) || 0)
        const tax= (subtotal * taxList.tax) / 100;
        if (form.istax) {
            updateField("taxpercentage", taxList.tax, setForm);
            updateField("tax", tax, setForm);
        }
        else {
            updateField("taxpercentage", 0, setForm);
            updateField("tax", 0, setForm);
        }
    }, [form.subtotal,form.discount,form.products, companyList,form.istax]);

    useEffect(() => {
        const total =
            (Number(form.subtotal) || 0) -
            (Number(form.discount) || 0) +
            (Number(form.tax) || 0);

        updateField("total", total, setForm);
        const balance = totalReceived < total ? total - totalReceived : 0;
        updateField("paymentstatus", balance > 0 ? 'Unpaid' : 'Paid', setForm);
      
    }, [
        form.subtotal,
        form.discount,
        form.tax
    ]);
    
    useEffect(() => {
        if (form.discounttype === "giftcard")
            handleGiftcard(form.coupon)
    }, [form.subtotal]);

    const handleProductChange = (index, productId) => {

        const selectedProduct = productOptions.find(
            (item) => item.id === productId
        );

        if (!selectedProduct) return;


        const products = [...form.products];

        products[index] = {
            ...products[index],
            id: selectedProduct.id,
            unit:1,
            value: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            sellprice: selectedProduct.price,
        };

        updateField(
            "products",
            products,
            setForm
        );
    };

    const handleUnitChange = (index, unit) => {
        const products = [...form.products];

        products[index] = {
            ...products[index],
            unit: Number(unit),
            sellprice: Number(unit) * (Number(products[index].price) || 0),
        };

        updateField("products", products, setForm);
    };

    const updateProduct = (index, field, value) => {

        const products = [...form.products];

        products[index] = {
            ...products[index],
            [field]: value
        };

        updateField(
            "products",
            products,
            setForm
        );
    };

    const handleCoupon = (coupon) => {
         const selected = couponOptions.find(
            (item) => item.coupon === coupon
        );

        if (!selected) return;

        updateField("coupon",coupon, setForm);
        const validate = validateSelectedCoupon({
            discount:selected,
            customerCell:form.cell,
            customerList,
            appointmentList
        })
        setValidateCoupon(validate)

        if(!validate.status)
            updateField("discount", "0", setForm);
        else
        {
            const calculation = calculateCouponDiscount({ coupon: selected, services: form.services });
            setValidateCoupon(calculation);
            if(calculation.status)
                updateField("discount", calculation.discount, setForm);
            else
                updateField("discount", "0", setForm);
        }
    }
    
    const handleGiftcard = (giftcode) => {
        const selected = giftcardOptions.find(
            (item) => item.id === giftcode
        );

        if (!selected) return;

        updateField("coupon", giftcode, setForm);
        const giftCardBalance = Number(selected.balance);
        const total =
            (Number(form.subtotal) || 0) +
            (Number(form.tax) || 0);

        const discount = Number(Math.min(giftCardBalance, total)).toFixed(2);

        updateField("discount", discount.toString(), setForm);
    }
    
    const renderDiscountField = () => {
    switch (form.discounttype) {
        case "flatdiscount":
            return (
                <Textbox
                    label=""
                    value={form.discount}
                    setValue={(e) =>
                        updateField("discount", PriceFormat(e), setForm)
                    }
                />
            );

        case "coupon":
            return (
                <Select
                    label=""
                    value={form.coupon}
                    onChange={(e) => handleCoupon(e)}
                    options={couponOptions}
                    isSearch={false}
                />
            );

        case "giftcard":
            return (
                <Select
                    label=""
                    value={form.coupon}
                    onChange={(e) => handleGiftcard(e)}
                    options={giftcardOptions}
                    isSearch={false}
                />
            );

        default:
            return null;
    }
};
    return (
        <IsLoading isLoading={isLoading} rows={10} input={
        <>
        <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

            {/* Header */}
            <div className="border-b bg-gray-50 px-5 py-3">
                <h3 className="text-lg font-semibold text-gray-800">
                    Invoice Summary
                </h3>
            </div>

            {/* Services */}
            <div className="divide-y">
                {form.services.length === 0 ? (
                    <div className="px-5 py-6 text-center text-sm text-gray-500">
                        No services selected
                    </div>
                ) : (
                    form.services.map((service, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between px-5 py-3"
                        >
                            <div>
                                <p className="font-medium text-gray-800">
                                    {service.name}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {service.minutes} minutes
                                </p>
                            </div>

                            <p className="font-medium text-gray-700">
                                ${Number(service.price).toFixed(2)}
                            </p>
                        </div>
                    ))
                )}

                {/* Products */}
                    {form.products.map((item, index) => (
                        <div key={index} className="flex items-center justify-between px-5 py-3">
                            <div className="inline-flex gap-2 w-full md:w-1/2">
                                <Tooltip title="Remove Product " placement="right" >
                                    <Button variant="danger" shape='circle' icon={Minus}
                                        onClick={() => {
                                            const products = form.products.filter((_, i) => i !== index);
                                            updateField("products", products, setForm);
                                        }} />
                                </Tooltip>
                                <Select label="" value={item.value} onChange={(e) => handleProductChange(index, e)} options={getProductOptions(index)} />
                                <Select label="" value={item.unit} onChange={(e) => handleUnitChange(index, e)} options={getUnitOptions(index)} />
                                </div>
                            <p className="font-medium text-gray-700">
                                ${Number(item.sellprice).toFixed(2)}
                            </p>
                        </div>
                    ))}

                    <div className="flex p-2 justify-end items-center">
                        <Button variant="primary" icon={Plus} label="Add Product " onClick={() => updateField("products",[...form.products,
                            {
                                id: null,
                                label:"",
                                name: "",
                                value:null,
                                unit: 0,     
                                price:0,                      
                                sellprice: 0,
                            }
                        ], setForm)} />
                    </div>

                    {/* Discount */}
                    {!form.isdiscount ? <div className="flex p-2 justify-end items-center">
                        <Button variant="primary" icon={Plus} label="Apply Coupon / GiftCard / Discount " 
                        onClick={() => {updateField("isdiscount", true, setForm)}} />
                    </div>
                        : <div>
                            <div className="flex  items-center justify-between px-5 py-3">
                                <div className="flex flex-row items-center gap-2  md:w-2/3">
                                    <Tooltip title="Remove Coupon / Gift Card " placement="right" >
                                        <Button variant="danger" shape='circle' icon={Minus}
                                            onClick={() => {
                                                updateField("isdiscount", false, setForm);
                                                updateField("coupon", "", setForm);
                                                updateField("discounttype", "coupon", setForm);
                                                updateField("discount", "0", setForm);
                                            }} />
                                    </Tooltip>
                                    <Select label="" value={form.discounttype}
                                        onChange={(e) => {
                                            updateField("discounttype", e, setForm);
                                            if(e === "flatdiscount") {setValidateCoupon({ status: true, message: '' }); updateField("coupon", "", setForm)}
                                        }} 
                                        options={discountTypes} isSearch={false} />
                                    {renderDiscountField()}
                                </div>
                                <p className="font-medium text-red-600">
                                    -${Number(form.discount).toFixed(2)}
                                </p>
                            </div>
                            {!validateCoupon.status && <span className="text-sm  px-5 text-red-600"> {`${validateCoupon.message}`} </span> }
                        </div>
                    }

                    {/* Tax */}
                    {!form.istax ? <div className="flex p-2 justify-end items-center">
                        <Button variant="primary" icon={Plus} label="Apply Tax " onClick={() => updateField("istax", true, setForm)} />
                    </div>
                    :<div className="flex items-center justify-between px-5 py-3">
                        <div className="inline-flex gap-2 items-center w-full md:w-1/3">
                            <Tooltip title="Remove Tax " placement="right" >
                                <Button variant="danger" shape='circle' icon={Minus} 
                                onClick={() => updateField("istax", false, setForm)} />
                            </Tooltip>
                            <p className="font-medium text-gray-800">
                                {`Tax ( ${form.taxpercentage}% )`}
                            </p>
                        </div>

                        <p className="font-medium text-gray-700">
                            ${Number(form.tax).toFixed(2)}
                        </p>
                    </div>
                    }

                    
            </div>


            {/* Totals */}
            <div className="border-t bg-gray-50 px-5 py-4">

                    <div className="ml-auto max-w-sm space-y-2">

                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>${Number(form.subtotal).toFixed(2)}</span>
                        </div>

                         <div className="flex justify-between items-center text-sm text-red-600">
                            <span>Discount</span>
                            <span>-${Number(form.discount).toFixed(2)}</span>
                        </div>

                        {form.istax &&
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tax</span>
                                <span>
                                    ${Number(form.tax).toFixed(2)}
                                </span>
                            </div>
                        }


                        <div className="my-2 border-t" />


                        <div className={`flex justify-between text-lg font-bold text-gray-900 ${form.total<0 && "text-red-600"}`}>
                            <span>Total</span>
                            <span>
                                ${Number(form.total).toFixed(2)}
                            </span>
                        </div>

                    </div>

            </div>

        </div>
        </>} />
    )
}

export default InvoiceInfo