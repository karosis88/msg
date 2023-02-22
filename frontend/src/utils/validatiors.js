

export function validatePassword(element) {
    let value = element.value
    if (value.length < 8) {
        return "Password must be at least 8 characters"
    }
    if (element.getAttribute('rg') === "reg") {
        const [pass1, pass2] = document.querySelectorAll('[rg="reg"][type="password"]')
        if (pass1.value !== pass2.value) {
            return "Passwords must be same"
        }
    }
    return ""
}

export function validateUsername(element) {
    let value = element.value
    if (value.length < 8) {
        return "Username must be at least 8 characters"
    }
    return ""
}