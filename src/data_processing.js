
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


function create_and_show_ip_data(container, title, bin_network_ip, mask, as_binary, show_bin_button) {
    let network_ip = process_ipv4(bin_network_ip, as_binary, false);

    let subtitle = document.createElement("p");
    subtitle.textContent = title;
    subtitle.className = "my-1 ml-4 text-lg md:text-xl font-bold";

    let html_network_ip = create_div_content("Dirección de red:", network_ip, "text-blue-600 dark:text-rose-600");
    let value;
    if (!as_binary) {
        let ip_split = network_ip.split(".");
        ip_split[ip_split.length - 1] = parseInt(ip_split[ip_split.length - 1]) + 1;
        value = ip_split.join(".");
    } else
        value = network_ip.replace(/[01]$/, "1");

    let html_first_ip = create_div_content("Primer host:", value, "text-sky-600 dark:text-pink-600");

    let last_host_broadcast = calculate_last_host_and_broadcast(bin_network_ip, mask, as_binary);
    let html_last_ip = create_div_content("Último host:", last_host_broadcast[0], "text-sky-600 dark:text-pink-600");
    let html_broadcast = create_div_content("Broadcast:", last_host_broadcast[1], "text-indigo-500 dark:text-rose-500");

    [subtitle, html_network_ip, html_first_ip, html_last_ip, html_broadcast].forEach((e) => {
        container.appendChild(e);
    });

    if (show_bin_button) {
        value = Math.pow(2, 32 - mask) - 2;
        let html_hosts = create_div_content("Cantidad de hosts:", as_binary ? value.toString(2) : value, "text-violet-700 dark:text-pink-400", "");
        container.appendChild(html_hosts);

        let button = document.createElement("button");
        button.textContent = "Ver en " + (as_binary ? "decimal" : "binario");
        button.className = "w-40 font-sans hidden md:block m-1 p-1 bg-body-0 dark:bg-body-1 duration-150 border border-dim-0 dark:border-dim-1 rounded-lg "
            + (as_binary ? "bg-sky-500 dark:bg-pink-600 text-[#FFF] transition-[background] hover:bg-sky-600 dark:hover:bg-pink-700" : "transition-[border] hover:border-sky-500 dark:hover:border-pink-600");
        button.id = "data_toggle";
        button.onclick = () => {
            create_and_fill_address_props_div(bin_network_ip, mask, !as_binary);
            let html_ip = document.getElementById("user_ip");
            html_ip.textContent = process_ipv4(html_ip.textContent.split("/")[0], !as_binary, false) + (as_binary ? "/" + mask : "");

            document.getElementById("user_mask").textContent = number_to_mask_ip(mask, !as_binary, false) + (as_binary ? " = " + mask : "");
        };
        container.appendChild(button);
    }
}


function create_and_fill_address_props_div(network_address, mask, as_binary) {
    let div = document.createElement("div");
    div.className = "p-2 md:p-4 mt-2 bg-sidebar-0 dark:bg-sidebar-1 rounded-lg font-mono";
    div.setAttribute("id", "address_information");

    document.getElementById("address_information").replaceWith(div);

    create_and_show_ip_data(div, "Propiedades", network_address, mask, as_binary, true);
}


function create_address_sub_netting_div() {
    let div = document.createElement("div");
    div.className = "p-2 md:p-4 mt-4 bg-sidebar-0 dark:bg-sidebar-1 rounded-lg font-mono hidden";
    div.setAttribute("id", "sub_netting_data");

    document.getElementById("sub_netting_data").replaceWith(div);
}


function update_network_address(address, mask, padding, id) {
    id = id.toString(2).padStart(padding, "0");

    let address_as_array = address.split("");

    let i = mask + Math.floor(mask / 8);
    for (let j = 0; i < address_as_array.length && j < id.length; i++) {
        if (address_as_array[i] === ".")
            continue;

        address_as_array[i] = id.charAt(j);
        j++;
    }

    return address_as_array.join("");
}


function calculate_sub_nets(container, network_address, mask, bits_for_sub_netting) {
    let new_mask = mask + bits_for_sub_netting;

    let sub_networks = Math.pow(2, bits_for_sub_netting);
    let host_amount = Math.pow(2, 32 - mask) - 2 * sub_networks;

    if (new_mask === 32) {
        container.appendChild(
            create_error_div("Programa finalizado... Es posible calcular las subredes requeridas pero cada una tendría una dirección...")
        );
        return;
    }

    if (host_amount === 0) {
        container.appendChild(
            create_error_div("Programa finalizado... Es posible calcular las subredes requeridas pero cada una 'tendría' dos hosts, dirección de red y multicast...")
        );
        return;
    }

    container.appendChild(create_div_content("Máscara:", number_to_mask_ip(new_mask, false, false) + " = " + new_mask, "", "tracking-tight md:text-lg"));

    let i;
    for (i = 0; i < sub_networks && i < max_sub_networks; i++)
        create_and_show_ip_data(
            container, i + 1, update_network_address(network_address, mask, bits_for_sub_netting, i), new_mask, false, false
        );

    if (i === max_sub_networks && i < sub_networks - 1) {
        container.appendChild(create_error_div("Programa finalizado... Se visualizan " + (max_sub_networks + (i < sub_networks - 1 ? 1 : 0)) + " subredes"));

        create_and_show_ip_data(
            container, sub_networks, update_network_address(network_address, mask, bits_for_sub_netting, sub_networks - 1), new_mask, false, false
        );
    }

    container.appendChild(create_div_content("Cantidad de subredes:", sub_networks, "text-sky-500 dark:text-red-600", "pt-8 font-bold"));
    container.appendChild(create_div_content("Cantidad de hosts:", host_amount, "text-indigo-700 dark:text-pink-700", "font-bold"));
    container.appendChild(create_div_content("Cantidad de hosts por subred:", Math.pow(2, 32 - new_mask), "text-violet-700 dark:text-rose-500", "font-bold"));
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

    if (selected_optional_datatype === OptionalDataType.HOST_BITS) {
        bits_for_hosts = optional_data;
        optional_data = 32 - (mask + optional_data);
    }

    if (selected_optional_datatype === OptionalDataType.HOST_PER_SUB_NET) {
        bits_for_hosts = optional_data < 2 ? 1 : Math.ceil(Math.log2(optional_data));
        optional_data = 32 - mask - bits_for_hosts;
    }

    if (mask + optional_data <= 32 && optional_data > 0) {
        subtitle.textContent += " - " + optional_data + " bits";
        calculate_sub_nets(container, network_address, mask, optional_data);
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

    let ip = ip_field.value.trim();
    let mask = mask_field.value.trim();
    let optional = optional_field.value.trim();

    mask = validate_data(ip, mask, optional);
    if (mask === null)
        return;

    if (mask < 1 || mask > 32) {
        set_data_error_msg("El valor en máscara de red está fuera del rango [1 - 32]");
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
