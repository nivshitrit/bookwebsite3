var sign_type = window.location.search.substring(1);
// var sign_type = queryString.split("=")[1]
console.log(sign_type)
console.log(localStorage.getItem("client"))


if (sign_type == "sign_up") {
    sign_up();
}
if (sign_type == "sign_in") {
    sign_in()
}

function sign_in() {
    if ($('.sign_in').css('display') == 'none') {
        $(".sign_up").hide()
        $("#sliders").hide()
        $(".sign_in").show()
    } else {
        $(".sign_in").hide()
        $("#sliders").show()
    }
}

function sign_up() {

    if ($('.sign_up').css('display') == 'none') {
        $("#sliders").hide()
        $(".sign_in").hide()
        $(".sign_up").show()
    } else {
        $(".sign_up").hide()
        $("#sliders").show()
    }
}

function submit_sign_up() {
    var sign_up_details = {
        email: $("#sign_up_email").val(),
        psw: $("#sign_up_psw").val(),
        confirm_psw: $("#confirm_psw").val(),
    }

    sign_up_details["name"] = sign_up_details.email.substring(0, sign_up_details.email.lastIndexOf("@"))

    console.log(sign_up_details)
    var is_valid = is_valid_sign_up_detail(sign_up_details)
    console.log(is_valid)
    if (is_valid) {
        sign_up_user(sign_up_details)
    }
const em = $("#sign_up_email").val();
const pw = $("#sign_up_psw").val();
auth.createUserWithEmailAndPassword(em, pw);

}

function submit_sign_in() {
    var sign_in_details = {
        email: $("#sign_in_email").val(),
        psw: $("#sign_in_psw").val(),
    }

    var is_admin = is_admin_details(sign_in_details)

    console.log(is_admin)
    sign_in_details["name"] = sign_in_details.email.substring(0, sign_in_details.email.lastIndexOf("@"))

    var is_valid = is_valid_sign_in_detail(sign_in_details);
    if (is_valid && !is_admin) {
        sign_in_user(sign_in_details)
    }
}

function sign_up_user(sign_up_details) {

    sign_up_details["discount"] = "10";

    firebase.database().
        ref("users").
        child(sign_up_details.name).
        once('value').
        then(snap => {
            var user = snap.val();
            console.log(user)
            if (user != null) {
                if (confirm("user already exist, please sign in")) {
                    $(".sign_up").hide();
                    $(".sign_in").show();
                }
            } else {
                firebase.database().
                    ref("users").
                    child(sign_up_details.name).
                    set(sign_up_details).
                    then(() => show_welcome_up(sign_up_details))
            }
        });
}

function show_welcome_up(sign_up_details) {
    localStorage.setItem("client", sign_up_details.email)
    $(".sign_up").hide();
    $(".sign").hide();
    $(".welcome h1").text(`WELCOME ${sign_up_details.email}`);
    $(".welcome h4").text(`YOU JUST GOT ${sign_up_details.discount}% ON THE FIRST PURCHASE`);
    $(".welcome h6").text(`HAVE A PEASANT SHOPPING EXPERIENC`);


    $(".sign").hide();
    $(".sign_up").hide();
    $(".sign_in").hide();
    $("#client").text(sign_up_details.email);
    $("#sign_out").show();
    $("#client").show();
    $(".welcome ").show();
}


function sign_in_user(sign_in_details) {
    firebase.database().
        ref("users").
        child(sign_in_details.name).
        once('value').
        then(snap => {
            var user = snap.val();
            if (user == null) {
                if (confirm("user doesn't exist, please sign up first")) {
                    $(".sign_up").show();
                    $(".sign_in").hide();
                }
            } else {
                if (user.psw == sign_in_details.psw) {

                    localStorage.setItem("client", sign_in_details.email)
                    $(".sign_in").hide();
                    $(".sign").hide();
                    $(".welcome h1").text(`WELCOME BACK ${sign_in_details.email}`);
                    $(".welcome h4").text(`WE HAPPY TO SEE YOU AGAIN`);
                    $(".welcome h6").text(`HAVE A PEASANT SHOPPING EXPERIENC`);

                    $(".client").text(sign_in_details.name);
                    $(".sign").hide();
                    $(".sign_up").hide();
                    $(".sign_in").hide();
                    $("#client").text(sign_in_details.email);
                    $("#sign_out").show();
                    $("#client").show();
                    $(".welcome ").show();
                }
            }
        });
}

function is_admin_details(sign_in_details) {
    admin_emails = ["kobisrvit@gmail.com"];

    if (admin_emails.includes(sign_in_details.email)) {
        if (sign_in_details.psw == "1111") {

            $(".sign_in").hide();
            $(".sign").hide();
            $(".welcome h1").text(`HI ${sign_in_details.email}`);
            $(".welcome h4").text(``);

            if (localStorage.getItem("massages") != null) {
                $(".welcome h6").text(`THERE ARE ${localStorage.getItem("massages")} MASSAGAES FOR YOU`);
            }

            localStorage.setItem("admin", sign_in_details.email)
            $(".welcome ").show();
            $(".sign_up").hide();
            $(".sign_in").hide();
            $(".sign").hide();
            $("#admin").text(sign_in_details.email);
            $("#sign_out").show();
            $("#admin").show();

        } else {
            alert("your password is not correct, please try again!")
        }
        return true;
    }
    return false;
}

function is_valid_sign_up_detail(sign_up_details) {

    if (sign_up_details.email == "") {
        return false;
    }
    if (!is_valid_email(sign_up_details.email)) {
        alert("please insert valid email")
        return false;
    }
    if (sign_up_details.psw == "") {
        return false;
    }
    if (sign_up_details.confirm_psw == "") {
        return false;
    }
    if (sign_up_details.confirm_psw !== sign_up_details.psw) {
        alert("please insert same password")
        return false;
    }
    return true;
}

function is_valid_sign_in_detail(sign_in_details) {
    if (sign_in_details.email == "") {
        return false;
    }
    if (!is_valid_email(sign_in_details.email)) {
        alert("please insert valid email")
        return false;
    }
    if (sign_in_details.psw == "") {
        return false;
    }
    return true;
}


function is_valid_email(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


