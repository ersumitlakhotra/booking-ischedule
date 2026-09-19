export const validateSelectedCoupon = ({
    discount,
    customerCell,
    appointmentList = [],
    customerList = [],
}) => {
    
    // New customer only
    if (discount.newcustomer) {
        const isNewCustomer = customerList.find((o) => o.cell === customerCell);

        if (isNewCustomer) {
            return {
                status:false,
                message:"This coupon is only available for new customers."
            }
        }
    }

    // One-time per customer
    if (discount.onetime) {
        const alreadyUsed = appointmentList.some(
            (u) =>
                u.coupon === discount.coupon &&
                u.cell === customerCell &&
                (u.status === "Pending" || u.status === "Completed")
        );

        if (alreadyUsed) {
            return {
                status:false,
                message:"You have already used this coupon."
            }
        }
    }

    // Customer limit
    if (Number(discount.upto) > 0) {
        const uniqueCustomers = new Set(
            appointmentList
                .filter(
                    (u) =>
                        u.coupon === discount.coupon &&
                        (u.status === "Pending" || u.status === "Completed")
                )
                .map((u) => u.cell)
        );

        if (
            !uniqueCustomers.has(customerCell) &&
            uniqueCustomers.size >= Number(discount.upto)
        ) {
             return {
                status:false,
                message:"This coupon has reached its customer limit."
            }
        }
    }

    return {
        status: true,
        message: ""
    };
};

export const calculateCouponDiscount = ({
    coupon,
    services = [],
}) => {
    // services = [
    //   { id: 1, amount: 50 },
    //   { id: 2, amount: 30 }
    // ]

    let eligibleAmount = 0;

    // All services
    if ((coupon.services).length === 0) {
        eligibleAmount = services.reduce(
            (sum, service) => sum + Number(service.price || 0),
            0
        );
    }
    // Selected services only
    else {
        eligibleAmount = services
            .filter((service) =>
                coupon.services.some(
                    (s) => Number(s.id) === Number(service.id)
                )
            )
            .reduce(
                (sum, service) => sum + Number(service.price || 0),
                0
            );
    }

    if (eligibleAmount <= 0) {
        return {
            status:false,
            eligibleAmount: 0,
            discount: 0,
            total: services.reduce(
                (sum, service) => sum + Number(service.price || 0),
                0
            ),
            message: "Coupon is not applicable to the selected services.",
        };
    }

    let discount = 0;

    // Percentage discount
    if (coupon.discounttype === "%") {
        discount = eligibleAmount * (Number(coupon.discount) / 100);
    }
    // Fixed dollar discount
    else {
        discount = Number(coupon.discount);
    }

    // Never discount more than the eligible amount
    discount = Math.min(discount, eligibleAmount);

    const total = services.reduce(
        (sum, service) => sum + Number(service.price || 0),
        0
    );

    return {
        status: true,
        eligibleAmount,
        discount,
        total,
        finalTotal: total - discount,
        message: ''
    };
};