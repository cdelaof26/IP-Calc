document.addEventListener("DOMContentLoaded", () => {
    set_field_type(0);

    document.getElementById("ip_address").value = "192.168.100.1";
    document.getElementById("mask").value = "19";

    ["ip_address", "mask", "optional_data"].forEach((e) => {
        document.getElementById(e).addEventListener("keyup", (e) => {
            if (e.key === "Enter")
                validate_ip_field();
        });
    });
});


class IPv4ValidationResult {
    static #_EMPTY = 0;
    static #_MALFORMED = 1;
    static #_INVALID_RANGE = 2;
    static #_VALID = 3;

    static get EMPTY() { return this.#_EMPTY; }
    static get MALFORMED() { return this.#_MALFORMED; }
    static get INVALID_RANGE() { return this.#_INVALID_RANGE; }
    static get VALID() { return this.#_VALID; }
}


class NumberValidationResult {
    static #_EMPTY = 0;
    static #_MALFORMED = 1;
    static #_INTEGER = 2;
    static #_FLOAT = 3;

    static get EMPTY() { return this.#_EMPTY; }
    static get MALFORMED() { return this.#_MALFORMED; }
    static get INTEGER() { return this.#_INTEGER; }
    static get FLOAT() { return this.#_FLOAT; }
}


function set_error(error_data) {
    let error_label = document.getElementById("error_label");

    if (error_data !== "") {
        if (error_label.classList.contains("hidden"))
            error_label.classList.remove("hidden");
    } else if (!error_label.classList.contains("hidden"))
        error_label.classList.add("hidden");

    error_label.children[0].textContent = error_data;
}


function set_field_type(id_type) {
    if (typeof id_type !== "number") {
        set_error("Internal error");
        throw TypeError("El id '" + id_type + "' no es válido");
    }

    for (let i = 0; i < 3; i++) {
        let button = document.getElementById("b" + i);
        button.classList.remove("border-sky-500");
        button.classList.remove("dark:border-sky-500");
    }

    document.getElementById("b" + id_type).classList.add("border-sky-500");
    document.getElementById("b" + id_type).classList.add("dark:border-sky-500");

    let label = document.getElementById("optional_field");
    if (id_type === 0)
        label.textContent = "Bits para subredes [Opcional]";
    else if (id_type === 1)
        label.textContent = "Cantidad de subredes [Opcional]";
    else if (id_type === 2)
        label.textContent = "Cantidad de hosts por subred [Opcional]";
    else
        set_error("Internal error");
}


function is_ipv4(ipv4) {
    ipv4 = "" + ipv4;
    if (ipv4.trim().length === 0)
        return IPv4ValidationResult.EMPTY;

    if (ipv4.replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, "") !== "")
        return IPv4ValidationResult.MALFORMED;

    let valid_ip_range = true;
    ipv4.split(".").forEach((oct) => {
        oct = parseInt(oct);
        valid_ip_range = valid_ip_range && oct > -1 && oct < 256;
    });

    return valid_ip_range ? IPv4ValidationResult.VALID : IPv4ValidationResult.INVALID_RANGE;
}


function is_number(value) {
    value = "" + value;
    if (value.trim().length === 0)
        return NumberValidationResult.EMPTY;

    if (value.replace(/-?\d+/, "") === "")
        return NumberValidationResult.INTEGER;

    return value.replace(/-?\d+\.?\d*/, "") === "" ? NumberValidationResult.FLOAT : NumberValidationResult.MALFORMED;
}


function validate_ip_field() {
    let ip_field = document.getElementById("ip_address");
    let mask_field = document.getElementById("mask");

    let ip = ip_field.value;
    let mask = mask_field.value;

    set_error("");

    let ipv4_test_result = is_ipv4(ip);
    if (ipv4_test_result !== IPv4ValidationResult.VALID) {
        set_error(
            ipv4_test_result === IPv4ValidationResult.EMPTY ? "El campo de IP no puede estar vacío":
            ipv4_test_result === IPv4ValidationResult.MALFORMED ? "La IP ingresada no es válida":
                "El rango de un octeto en la IP está fuera del rango [0 - 255]"
        );
        return;
    }

    let mask_test_result = is_number(mask);
    let ip_mask_test_result = is_ipv4(mask);
    if (mask_test_result !== NumberValidationResult.INTEGER && ip_mask_test_result !== IPv4ValidationResult.VALID) {
        set_error(
            ip_mask_test_result === IPv4ValidationResult.INVALID_RANGE ? "El rango de un octeto en la máscara está fuera del rango [0 - 255]":
            mask_test_result === NumberValidationResult.FLOAT ? "El valor en máscara de red no puede ser un número decimal":
                "El valor en máscara de red es inválido"
        );
        return;
    } else if (mask_test_result === NumberValidationResult.INTEGER) {
        mask = parseInt(mask);
        if (mask < 1 || mask > 32) {
            set_error("El valor en máscara de red está fuera del rango [1 - 32]");
            return;
        }
    }

    console.log("IP and mask test passed successfully!");
    console.log("IP:", ip);
    console.log("Mask:", mask);
}


function scroll_to_top() {
    const user_agent = window.navigator.userAgent;

    if (user_agent.match(/iPad/i) || user_agent.match(/iPhone/i))
        // https://stackoverflow.com/questions/24616322/mobile-safari-why-is-window-scrollto0-0-not-scrolling-to-0-0
        setTimeout(() => {
            window.scroll({top: -1, left: 0, behavior: "smooth"});
        }, 10);
    else
        document.getElementById('main_container').scroll({ top: 0, behavior: 'smooth' });
}


function toggle_error_notification_visibility(hide) {
    if (hide)
        document.getElementById("error_popup").classList.add("hidden");
    else
        document.getElementById("error_popup").classList.remove("hidden");
}


function get_width() {
    // Function extracted from: https://stackoverflow.com/questions/1038727/how-to-get-browser-width-using-javascript-code
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}


function toggle_sidebar_button_visibility(hide) {
    let sidebar_button_toggle = document.getElementById("sidebar_button_toggle");

    if (get_width() >= 1000) {
        if (!sidebar_button_toggle.classList.contains("hidden"))
            sidebar_button_toggle.classList.add("hidden");
        return;
    }

    if (hide && !sidebar_button_toggle.classList.contains("hidden"))
        sidebar_button_toggle.classList.add("hidden");
    else if (!hide)
        sidebar_button_toggle.classList.remove("hidden");
}


function toggle_sidebar_visibility(hide) {
    let sidebar = document.getElementById("sidebar");
    if (hide && !sidebar.classList.contains("-translate-x-full"))
        sidebar.classList.add("-translate-x-full");
    else if (!hide)
        sidebar.classList.remove("-translate-x-full");
}
