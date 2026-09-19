export const CellFormat =(value) => {
    let phoneNumber = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (phoneNumber.length > 3) {
        phoneNumber = phoneNumber.substring(0, 3) + '-' + phoneNumber.substring(3);
    }
    if (phoneNumber.length > 7) {
        phoneNumber = phoneNumber.substring(0, 7) + '-' + phoneNumber.substring(7);
    }
    if (phoneNumber.length < 13)
        return phoneNumber;
    else
        return phoneNumber.substring(0, 12);
}

export const PriceFormat = (value) => {
  const num = value.replace(/[^0-9.]/g, "");

  const match = num.match(/^(\d+)(\.\d{0,2})?/);
  return match ? match[0] : "";
};

export const NumberFormat = (value) => {
  return String(value).replace(/\D/g, "");
};

export const EmailFormat= (email)=> {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};