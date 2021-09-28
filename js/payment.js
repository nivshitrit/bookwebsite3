var queryString = window.location.search.substring(1);
var total_price = queryString.split("=")[1]
$(".total_price").val(total_price + "$")

console.log(total_price)
$(".fas").css("display", "block")

var client = localStorage.getItem("client");
if (client != null) {
    $("#email").val(client)
    add_discount_row_if_client_deserve()
    total_price = get_price_after_discount(total_price, 10)
}

var order = JSON.parse(localStorage.getItem("order"));

function pay_now() {

    var card_details = {
        name: $("#name").val(),
        email: $("#email").val(),
        number: $("#cr_no").val(),
        month: $("#month").val(),
        year: $("#year").val(),
        cvv: $("#cvv").val(),
        price: total_price,
        receipt_number: get_receipt_number(),
        date: formatYmd(new Date())
    }

    var valid_card_details = is_valid_card_details(card_details);

    if (valid_card_details) {
        prepare_client_receipt(card_details.email, card_details.receipt_number)
        decrease_quantity_item_from_db()
        add_order_details_to_db(card_details, card_details.receipt_number)
        delete_order_from_local_storage()
        $("#payment_form").hide()
        $(".receipt").show()
    }
}

function prepare_client_receipt(email, receipt_number) {

    Object.entries(order).forEach(([category, values]) => {
        Object.entries(values).forEach(([id, quantity]) => {
            firebase.database().
                ref(category).
                child(id).
                once('value').
                then(snap => {
                    var db_product = snap.val();
                    console.log(db_product)
                    add_item_row_to_receipt(db_product.name, quantity, db_product.price_after_discount)
                });
        });
    });

    $("#total").text(total_price + "$");
    $(".receipt_number").text(receipt_number);
    $(".client_email").text("Email : " + email);
}

function add_discount_row_if_client_deserve() {
    if (client != null) {
        var name = client.substring(0, client.lastIndexOf("@"))
        console.log(name)
        firebase.
            database().
            ref("users").
            child(name).
            once('value').
            then(snap => {
                var user = snap.val();
                if (Number(user.discount) > 0 && user.discount != null) {
                    add_discount_row()
                    remove_user_discount(name)
                }
            })
    }
}

function add_discount_row() {
    var $row =
        $('<tr class="product_name">' +
            '<td class="tableitem">' +
            '<p class="itemtext"><b>NEW REGISTER DISCOUNT<b></p>' +
            '</td>' +
            '<td class="tableitem">' +
            '<p class="itemtext"></p>' +
            ' </td>' +
            '<td class="tableitem">' +
            '<p class="itemtext"><b>10%<b></p>' +
            '</td>' +
            '</tr>'
        );

    $($row).insertAfter($(".first_row").closest("tr"));
}

function remove_user_discount(name) {
    firebase.
        database().
        ref("users").
        child(name).
        update({ discount: 0 })
}

function add_item_row_to_receipt(name, quantity, price) {
    var sub_price = quantity * price;

    var $row =
        $('<tr class="product_name">' +
            '<td class="tableitem">' +
            '<p class="itemtext">' + name + '</p>' +
            '</td>' +
            '<td class="tableitem">' +
            '<p class="itemtext">' + quantity + '</p>' +
            ' </td>' +
            '<td class="tableitem">' +
            '<p class="itemtext">' + sub_price + '$</p>' +
            '</td>' +
            '</tr>'
        );

    $($row).insertAfter($(".first_row").closest("tr"));
}

function back_to_main_page() {
    var url = '/jewlery_website/customer/shop.html?category=rings';
    window.location.href = url;
}

function delete_order_from_local_storage() {
    var categories = ["rings", "necklaces", "pendants", "earrings", "watches", "bracelets", "diamonds"]
    for (let value of categories) {
        localStorage.removeItem(value)
    }
    localStorage.removeItem("order");
    localStorage.setItem("cart", "0");
}

function add_order_details_to_db(card_details, receipt_number) {
    var full_order = order
    full_order["order"] = card_details;

    Object.entries(full_order).forEach(([key, value]) => {
        if (Object.keys(value).length === 0) {
            delete full_order[key]
        }
    })

    firebase.
        database().
        ref("orders").
        child(order["order"].date).
        child(receipt_number).
        set(order)
}


function decrease_quantity_item_from_db() {
    Object.entries(order).forEach(([category, values]) => {
        Object.entries(values).forEach(([id, quantity]) => {
            firebase.database().ref(category).
                child(id).
                once('value').
                then(snap => {
                    var db_product = snap.val();
                    firebase.database().
                        ref(category).
                        child(id).
                        update({ "quantity": Number(db_product.quantity) - Number(quantity) })
                });
        });
    });
}


function get_receipt_number() {
    var now = new Date();

    timestamp = now.getFullYear().toString(); // 2011
    timestamp += (now.getMonth < 9 ? '0' : '') + now.getMonth().toString(); // JS months are 0-based, so +1 and pad with 0's
    timestamp += ((now.getDate < 10) ? '0' : '') + now.getDate().toString();
    timestamp += ((now.getDate < 10) ? '0' : '') + now.getHours().toString();
    timestamp += ((now.getDate < 10) ? '0' : '') + now.getMinutes().toString();
    timestamp += ((now.getDate < 10) ? '0' : '') + now.getSeconds().toString();
    timestamp += ((now.getDate < 10) ? '0' : '') + now.getMilliseconds().toString();
    return timestamp;
}


function is_valid_card_details(card_details) {
    var re_19_digit_number = /^\d{19}$/
    var re_3_digit_cvv = /^\d{3}$/

    if (card_details.name == "") {
        alert("you forgot to fill your name");
        return false;
    }
    if (!is_valid_email(card_details.email)) {
        alert("your email is not valid");
        return false;
    }
    if (!(re_19_digit_number.test(card_details.number))) {
        alert("your credit card number is not valid ");
        return false;
    }
    if (card_details.month == "Month") {
        alert("please fill expired month")
        return false;
    }
    if (card_details.year == "Year") {
        alert("please fill expired year")
        return false;
    }
    if (!(re_3_digit_cvv.test(card_details.cvv))) {
        alert("your credit card cvv is not valid");
        return false;
    }

    return true;
}


function is_valid_email(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const formatYmd = date => date.toISOString().slice(0, 10);

function get_price_after_discount(price, discount) {
    return Number(price) - (price * Number(discount)) / 100
}