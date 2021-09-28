function send() {
    var email_details = {
        full_name: $("#fname").val(),
        email: $("#email").val(),
        phone: $("#phone").val(),
        massage: $("#message").val(),
        date: formatYmd(new Date()),
        time: new Date().getTime()
    }

    var is_valid = is_valid_email_details(email_details)

    if (is_valid) {
        firebase.database().
            ref("massages").
            child(email_details.date).
            child(email_details.time).
            set(email_details)

        var unread_nassages = localStorage.getItem("massages");
        console.log(unread_nassages + 1)
        if (unread_nassages == null) {
            localStorage.setItem("massages", 1)
        } else {
            localStorage.setItem("massages", Number(unread_nassages) + 1)
            // localStorage.setItem("massages", JSON.stringify(unread_nassages + 1))
        }
        // show_recieve_massage();
    }
}


function is_valid_email_details(email_details) {
    var re_10_digit_phone = /^\d{10}$/
    if (email_details.full_name == "") {
        return false;
    }
    if (email_details.email == "") {
        return false;
    }
    if (email_details.phone == "") {
        return false;
    }
    if (email_details.massage == "") {
        return false;
    }
    if (!is_valid_email(email_details.email)) {
        return false;
    }

    if (!re_10_digit_phone.test(email_details.phone)) {
        alert("please put valid product phone")
        return false;
    }
    return true;
}

const formatYmd = date => date.toISOString().slice(0, 10);

function is_valid_email(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}