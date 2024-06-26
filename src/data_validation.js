
// Class blueprint: https://stackoverflow.com/questions/44447847/enums-in-javascript-with-es6
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


function process_ipv4(str_ipv4, to_bin) {
    let ip_array = str_ipv4.split(".");
    let ip_int_array = [];

    for (let i = 0; i < ip_array.length; i++) {
        let is_bin = ip_array[i].replace(/[01]{8}/, "") === "";
        if (to_bin && is_bin) {
            ip_int_array[i] = ip_array[i].padStart(8, "0");
            continue;
        }

        ip_int_array[i] = parseInt(ip_array[i], is_bin ? 2 : 10);

        if (to_bin)
            ip_int_array[i] = ip_int_array[i].toString(2).padStart(8, "0");
    }

    return ip_int_array.join(".");
}


function number_to_mask_ip(number, to_bin) {
    let ip = "1".repeat(number).padEnd(32, "0");

    let bin_ip = ip.match(/[01]{8}/g).join(".");
    if (to_bin)
        return bin_ip;

    return process_ipv4(bin_ip, false);
}


function is_number(value) {
    value = "" + value;
    if (value.trim().length === 0)
        return NumberValidationResult.EMPTY;

    if (value.replace(/-?\d+/, "") === "")
        return NumberValidationResult.INTEGER;

    return value.replace(/-?\d+\.?\d*/, "") === "" ? NumberValidationResult.FLOAT : NumberValidationResult.MALFORMED;
}


function validate_data(ip, mask, optional) {
    set_data_error_msg("");

    let valid_mask = false;
    let use_optional_data = optional.trim() !== "";

    let mask_test_result = is_number(mask);
    let ip_mask_test_result = is_ipv4(mask);
    if (mask_test_result !== NumberValidationResult.INTEGER && ip_mask_test_result !== IPv4ValidationResult.VALID) {
        set_data_error_msg(
            mask_test_result === NumberValidationResult.EMPTY && ip_mask_test_result === IPv4ValidationResult.EMPTY ? "El campo de máscara no puede estar vacío" :
            ip_mask_test_result === IPv4ValidationResult.INVALID_RANGE ? "El rango de un octeto en la máscara está fuera del rango [0 - 255]" :
            mask_test_result === NumberValidationResult.FLOAT ? "El valor en 'máscara de red' no puede ser un número decimal" :
                "El valor en 'máscara de red' es inválido"
        );
        return null;
    } else
        valid_mask = true;

    if (ip_mask_test_result === IPv4ValidationResult.VALID) {
        let ipv4_mask = process_ipv4(mask, true);
        ipv4_mask = ipv4_mask.replaceAll(".", "");
        ipv4_mask = ipv4_mask.replace(/^1+/, "");
        if (ipv4_mask.includes("1")) {
            set_data_error_msg("La máscara IPv4 no es válida");
            return null;
        }

        mask = 32 - ipv4_mask.length;
    } else
        mask = parseInt(mask);


    if (use_optional_data) {
        let optional_test_result = is_number(optional);
        if (optional_test_result !== NumberValidationResult.INTEGER) {
            set_data_error_msg(
                optional_test_result === NumberValidationResult.MALFORMED ? "El valor en el campo 'opcional' es inválido" :
                    "El valor en el campo 'opcional' debe ser un número entero positivo"
            );
            return null;
        } else if (parseInt(optional) < 0) {
            set_data_error_msg("El valor en el campo 'opcional' no puede ser negativo");
            return null;
        }
    }


    let ipv4_test_result = is_ipv4(ip);
    if (valid_mask && !use_optional_data && ipv4_test_result === IPv4ValidationResult.EMPTY)
        return mask;

    if (ipv4_test_result !== IPv4ValidationResult.VALID) {
        set_data_error_msg(
            ipv4_test_result === IPv4ValidationResult.EMPTY ? "El campo de IP no puede estar vacío" :
            ipv4_test_result === IPv4ValidationResult.MALFORMED ? "La IP ingresada no es válida" :
                "El rango de un octeto en la IP está fuera del rango [0 - 255]"
        );
        return null;
    }

    return mask;
}


function get_network_address(ip, mask_bit_amount) {
    let bin_str_ip = process_ipv4(ip, true);
    let bin_str_mask = number_to_mask_ip(mask_bit_amount, true);

    let network_address = "";
    for (let i = 0; i < bin_str_mask.length; i++) {
        if (bin_str_mask.charAt(i) === '.') {
            network_address += ".";
            continue;
        }

        network_address += bin_str_mask.charAt(i) === '1' ? bin_str_ip.charAt(i) : '0';
    }

    return network_address;
}
