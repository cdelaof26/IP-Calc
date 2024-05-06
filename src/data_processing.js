
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


function process_ipv4(str_ipv4, to_bin, return_as_array) {
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

    if (!return_as_array)
        return ip_int_array.join(".");

    return ip_int_array;
}


function number_to_mask_ip(number, to_bin, return_as_array) {
    let ip = "1".repeat(number).padEnd(32, "0");
    let bin_array = ip.match(/[01]{8}/g);

    if (to_bin && return_as_array)
        return bin_array;

    let bin_ip = bin_array.join(".");
    if (to_bin)
        return bin_ip;

    return process_ipv4(bin_ip, false, return_as_array);
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
    set_error("");

    let ipv4_test_result = is_ipv4(ip);
    if (ipv4_test_result !== IPv4ValidationResult.VALID) {
        set_error(
            ipv4_test_result === IPv4ValidationResult.EMPTY ? "El campo de IP no puede estar vacío":
                ipv4_test_result === IPv4ValidationResult.MALFORMED ? "La IP ingresada no es válida":
                    "El rango de un octeto en la IP está fuera del rango [0 - 255]"
        );
        return null;
    }

    let mask_test_result = is_number(mask);
    let ip_mask_test_result = is_ipv4(mask);
    if (mask_test_result !== NumberValidationResult.INTEGER && ip_mask_test_result !== IPv4ValidationResult.VALID) {
        set_error(
            mask_test_result === NumberValidationResult.EMPTY && ip_mask_test_result === IPv4ValidationResult.EMPTY ? "El campo de máscara no puede estar vacío":
                ip_mask_test_result === IPv4ValidationResult.INVALID_RANGE ? "El rango de un octeto en la máscara está fuera del rango [0 - 255]":
                    mask_test_result === NumberValidationResult.FLOAT ? "El valor en máscara de red no puede ser un número decimal":
                        "El valor en máscara de red es inválido"
        );
        return null;
    }

    if (ip_mask_test_result === IPv4ValidationResult.VALID) {
        let ipv4_mask = process_ipv4(mask, true, false);
        ipv4_mask = ipv4_mask.replaceAll(".", "");
        ipv4_mask = ipv4_mask.replace(/^1+/, "");
        if (ipv4_mask.includes("1")) {
            set_error("La máscara IPv4 no es válida");
            return null;
        }

        mask = 32 - ipv4_mask.length;
    } else
        mask = parseInt(mask);

    if (optional.trim() !== "") {
        let optional_test_result = is_number(optional);
        if (optional_test_result !== NumberValidationResult.INTEGER) {
            set_error(
                optional_test_result === NumberValidationResult.MALFORMED ? "El valor en el campo 'opcional' es inválido" :
                "El valor en el campo 'opcional' debe ser un número entero positivo"
            );
            return null;
        } else if (parseInt(optional) < 0) {
            set_error("El valor en el campo 'opcional' no puede ser negativo");
            return null;
        }
    }

    return mask;
}


function is_network_address(ip, mask_bit_amount) {
    let bin_str_ip = process_ipv4(ip, true, false);
    let bin_str_mask = number_to_mask_ip(mask_bit_amount, true, false);

    let network_address = "";
    for (let i = 0; i < bin_str_mask.length; i++) {
        if (bin_str_mask.charAt(i) === '.') {
            network_address += ".";
            continue;
        }

        network_address += bin_str_mask.charAt(i) === '1' ? bin_str_ip.charAt(i) : '0';
    }

    return [bin_str_ip === network_address, network_address];
}


function calculate_last_host_and_broadcast(bin_network_ip, mask, as_binary) {
    let bin_network_array = bin_network_ip.split("");
    let i = mask + Math.floor(mask / 8);
    for (; i < bin_network_array.length - 1; i++) {
        if (bin_network_array[i] === ".")
            continue;

        bin_network_array[i] = "1";
    }

    let last_host = bin_network_array.join("");

    bin_network_array[bin_network_array.length - 1] = "1";
    let broadcast = bin_network_array.join("");

    return [process_ipv4(last_host, as_binary, false), process_ipv4(broadcast, as_binary, false)];
}


function create_and_show_ip_data(container, bin_network_ip, mask, as_binary) {
    let network_ip = process_ipv4(bin_network_ip, as_binary, false);

    let subtitle = document.createElement("p");
    subtitle.textContent = "Propiedades";
    subtitle.className = "my-1 ml-4 text-lg md:text-xl font-bold";

    let html_network_ip = create_div_content("Dirección de red:", network_ip, "text-blue-600");

    let value = network_ip.replace(!as_binary ? /\d{1,3}$/ : /[01]{8}$/, "1".padStart(as_binary ? 8 : 0, "0"));
    let html_first_ip = create_div_content("Primer host:", value, "text-sky-600");

    let last_host_broadcast = calculate_last_host_and_broadcast(bin_network_ip, mask, as_binary);
    let html_last_ip = create_div_content("Último host:", last_host_broadcast[0], "text-sky-600");
    let html_broadcast = create_div_content("Broadcast:", last_host_broadcast[1], "text-indigo-500");

    value = Math.pow(2, 32 - mask) - 2;
    let html_hosts = create_div_content("Cantidad de hosts:", as_binary ? value.toString(2) : value, "text-violet-600");

    let button = document.createElement("button");
    button.textContent = "Ver en " + (as_binary ? "decimal" : "binario");
    button.className = "w-40 font-sans hidden md:block m-1 p-1 bg-body-0 dark:bg-body-1 duration-150 border border-dim-0 dark:border-dim-1 rounded-lg " + (as_binary ? "bg-sky-500 text-[#FFF] transition-[background] hover:bg-sky-600" : "transition-[border] hover:border-sky-500");
    button.id = "data_toggle";
    button.onclick = () => {
        create_and_fill_address_props_div(bin_network_ip, mask, !as_binary);
        let html_ip = document.getElementById("user_ip");
        html_ip.textContent = process_ipv4(html_ip.textContent.split("/")[0], !as_binary, false) + (as_binary ? "/" + mask : "");

        document.getElementById("user_mask").textContent = number_to_mask_ip(mask, !as_binary, false) + (as_binary ? " = " + mask : "");
    };

    [subtitle, html_network_ip, html_first_ip, html_last_ip, html_broadcast, html_hosts, button].forEach((e) => {
        container.appendChild(e);
    });
}


function create_and_fill_address_props_div(network_address, mask, as_binary) {
    let div = document.createElement("div");
    div.className = "p-2 md:p-4 mt-2 bg-sidebar-0 dark:bg-sidebar-1 rounded-lg font-mono";
    div.setAttribute("id", "address_information");

    document.getElementById("address_information").replaceWith(div);

    create_and_show_ip_data(div, network_address, mask, as_binary);
}


function create_address_sub_netting_div() {
    let div = document.createElement("div");
    div.className = "p-2 md:p-4 mt-2 bg-sidebar-0 dark:bg-sidebar-1 rounded-lg font-mono hidden";
    div.setAttribute("id", "sub_netting_data");

    document.getElementById("sub_netting_data").replaceWith(div);
}


function create_error_div(error_msg) {
    let div = document.createElement("div");
    div.className = "p-2 bg-red-100 dark:bg-red-950 rounded-lg";
    let p = document.createElement("p");
    p.className = "border-l-4 border-red-500 pl-4";
    p.textContent = error_msg;
    div.appendChild(p);
    return div;
}


function fill_address_sub_netting_div(network_address, mask, optional_data) {
    let container = document.getElementById("sub_netting_data");
    container.classList.remove("hidden");

    let subtitle = document.createElement("p");
    subtitle.textContent = "Subredes";
    subtitle.className = "my-1 ml-4 text-lg md:text-xl font-bold";
    container.appendChild(subtitle);

    let bits_for_hosts = 0;

    if (selected_optional_datatype === OptionalDataType.SUB_NETWORKS_AMOUNT)
        optional_data = Math.ceil(Math.log2(optional_data));

    if (selected_optional_datatype === OptionalDataType.HOST_PER_SUB_NET) {
        optional_data += 2;
        bits_for_hosts = optional_data < 2 ? 1 : Math.ceil(Math.log2(optional_data));
        optional_data = 32 - mask - bits_for_hosts;
    }

    if (mask + optional_data <= 32 && optional_data > 0) {
        subtitle.textContent += " - bits a utilizar: " + optional_data;

    } else
        container.appendChild(
            create_error_div(
                "No hay suficientes bits para realizar la operación. " +
                "bits_requeridos = " + (optional_data  > 0 ? optional_data : bits_for_hosts) + " y bits_disponibles = " + (32 - mask)
            )
        );
}


function perform_operation() {
    let ip_field = document.getElementById("ip_address");
    let mask_field = document.getElementById("mask");
    let optional_field = document.getElementById("optional_data");

    let ip = ip_field.value;
    let mask = mask_field.value;
    let optional = optional_field.value;

    mask = validate_data(ip, mask, optional);
    if (mask === null)
        return;

    if (mask < 1 || mask > 32) {
        set_error("El valor en máscara de red está fuera del rango [1 - 32]");
        return;
    }

    toggle_navbar_visibility();

    let network_address = is_network_address(ip, mask);
    create_and_fill_address_props_div(network_address[1], mask, false);
    create_address_sub_netting_div();

    document.getElementById("calc_button").focus({ focusVisible: true });
    document.getElementById("user_ip").textContent = ip + "/" + mask;
    document.getElementById("user_mask").textContent = number_to_mask_ip(mask, false, false) + " = " + mask;

    if (optional !== "" && optional !== "0")  // An address was given with optional parameter
        fill_address_sub_netting_div(network_address[1], mask, parseInt(optional));
}
