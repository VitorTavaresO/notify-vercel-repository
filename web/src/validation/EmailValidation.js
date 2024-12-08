function EmailValidation(email) {
    if(!email){
        return false;
    }

    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
export default EmailValidation;

