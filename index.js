document.addEventListener("DOMContentLoaded", () => {
    set_field_type(0);

    ["ip-address-0", "ip-address-1", "ip-address-2", "ip-address-3", "mask", "optional_data"].forEach((e) => {
        document.getElementById(e).addEventListener("keyup", (e) => {
            if (e.key === "Enter")
                perform_operation();
        });
    });

    console.log("    Hi!");
    console.log("Use 'max_sub_networks = value' to set the maximum amount of sub-networks to be shown");
    console.log("  Keep in mind that setting it too high might be memory consuming!");

    // Debug
    /*
    document.getElementById("ip-address-0").value = "10";
    document.getElementById("ip-address-1").value = "0";
    document.getElementById("ip-address-2").value = "0";
    document.getElementById("ip-address-3").value = "1";
    document.getElementById("mask").value = "4";
    document.getElementById("optional_data").value = "16";
    perform_operation();
    */
});


let max_sub_networks = 128;


class OptionalDataType {
    static #_SUB_NETTING_BITS = 0;
    static #_SUB_NETWORKS_AMOUNT = 1;
    static #_HOST_BITS = 2;
    static #_IP_ADDRESSES_AMOUNT = 3;

    static get SUB_NETTING_BITS() { return this.#_SUB_NETTING_BITS; }
    static get SUB_NETWORKS_AMOUNT() { return this.#_SUB_NETWORKS_AMOUNT; }
    static get HOST_BITS() { return this.#_HOST_BITS; }
    static get IP_ADDRESSES_AMOUNT() { return this.#_IP_ADDRESSES_AMOUNT; }
}


let selected_optional_datatype;


function set_data_error_msg(error_data) {
    let error_label = document.getElementById("error_label");

    if (error_data !== "") {
        if (error_label.classList.contains("hidden"))
            error_label.classList.remove("hidden");
    } else if (!error_label.classList.contains("hidden"))
        error_label.classList.add("hidden");

    document.getElementById("error_msg").textContent = error_data;
}


function set_field_type(id_type) {
    if (typeof id_type !== "number") {
        set_data_error_msg("Internal error");
        throw TypeError("El id '" + id_type + "' no es válido");
    }

    selected_optional_datatype = id_type;

    let properties = [
        "transition-[border]", "bg-indigo-600",
        "text-white", "dark:bg-pink-600", "transition-[background]",
        "hover:bg-indigo-800", "hover:dark:bg-pink-700", "dark:border-transparent"
    ];

    for (let i = 0; i < 4; i++) {
        let button = document.getElementById("b" + i);

        for (let j = 0; j < properties.length; j++)
            if (j < 1)
                button.classList.add(properties[j]);
            else
                button.classList.remove(properties[j]);
    }

    let b = document.getElementById("b" + id_type);

    for (let j = 0; j < properties.length; j++)
        if (j < 1)
            b.classList.remove(properties[j]);
        else
            b.classList.add(properties[j]);

    let label = document.getElementById("optional_field");
    if (id_type === OptionalDataType.SUB_NETTING_BITS)
        label.textContent = "Bits para subredes [Opcional]";
    else if (id_type === OptionalDataType.SUB_NETWORKS_AMOUNT)
        label.textContent = "Cantidad de subredes [Opcional]";
    else if (id_type === OptionalDataType.HOST_BITS)
        label.textContent = "Bits para hosts [Opcional]";
    else if (id_type === OptionalDataType.IP_ADDRESSES_AMOUNT)
        label.textContent = "Cantidad de hosts [Opcional]";
    else {
        set_data_error_msg("Internal error");
        throw TypeError("Invalid id_type: '" + id_type + "'");
    }
}


function create_error_div(error_msg, add_margin) {
    let div = document.createElement("div");
    div.className = "p-2 bg-red-100 dark:bg-red-950 rounded-lg " + (add_margin ? "my-6" : "");
    let p = document.createElement("p");
    p.className = "border-l-4 border-red-500 pl-4";
    p.textContent = error_msg;
    div.appendChild(p);
    return div;
}


function create_div_content(label, value, value_classes, div_classes) {
    let div = document.createElement("div");
    div.className = "flex justify-between bg-body-0 dark:bg-body-1 " + div_classes;
    let html_label = document.createElement("p");
    let html_value = document.createElement("p");

    html_label.textContent = label;
    html_label.className = "mr-2 self-center"
    html_value.className = value_classes;
    html_value.textContent = value;
    div.appendChild(html_label);
    div.appendChild(html_value);

    return div;
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


function toggle_navbar_visibility() {
    const navbar = document.getElementById("navbar");

    if (!navbar.classList.contains("-translate-x-full"))
        navbar.classList.add("-translate-x-full");
    else
        navbar.classList.remove("-translate-x-full");
}
