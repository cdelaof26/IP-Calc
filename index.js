document.addEventListener("DOMContentLoaded", () => {
    set_field_type(0);

    ["ip_address", "mask", "optional_data"].forEach((e) => {
        document.getElementById(e).addEventListener("keyup", (e) => {
            if (e.key === "Enter")
                perform_operation();
        });
    });

    // Debug
    /*document.getElementById("ip_address").value = "172.100.85.64";
    document.getElementById("mask").value = "255.255.224.0";
    perform_operation();*/
});

let selected_optional_datatype;


function set_error(error_data) {
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
        set_error("Internal error");
        throw TypeError("El id '" + id_type + "' no es válido");
    }

    selected_optional_datatype = id_type;

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


function create_div_content(label, value, value_classes) {
    let div = document.createElement("div");
    div.className = "flex justify-between";
    let html_label = document.createElement("p");
    let html_value = document.createElement("p");

    html_label.textContent = label;
    html_label.className = "mr-2"
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


function toggle_navbar_visibility() {
    let navbar = document.getElementById("navbar");
    if (!navbar.classList.contains("-translate-x-full"))
        navbar.classList.add("-translate-x-full");
    else
        navbar.classList.remove("-translate-x-full");
}
