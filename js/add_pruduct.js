$("#id").val(get_id_number());


console.log("my")

function add() {
    var product_details = {
        company: $("#company").val(),
        id: $("#id").val(),
        name: $("#name").val(),
        category: $("#category").val(),
        price: $("#price").val(),
        discount: $("#discount").val(),
        quantity: $("#quantity").val(),
        description: $("#description").val(),
        image: $("#img").val(),
        price_after_discount: get_price_after_discount($("#price").val(), $("#discount").val())
    }

    console.log(product_details)

    var is_valid = is_valid_product_details(product_details);
    if (is_valid) {
        add_product_to_db(product_details)
    }
}

function add_product_to_db(product_details) {
    console.log(product_details)
    firebase.database().
        ref(product_details.category).
        child(product_details.id).
        set({
            company: product_details.company,
            id: product_details.id,
            name: product_details.name,
            category: product_details.category,
            price: product_details.price,
            discount: product_details.discount,
            quantity: product_details.quantity,
            description: product_details.description,
            image: product_details.image,
            price_after_discount: product_details.price_after_discount
        })
}

function is_valid_product_details(product_details) {
    var re_4_digit_price = /^\d{1,4}$/
    if (product_details.company == "") {
        return false;
    }
    if (product_details.name == "") {
        return false;
    }
    if (product_details.price == "") {
        return false;
    }
    if (product_details.quantity == "") {
        return false;
    }
    if (product_details.image == "") {
        return false;
    }
    if (product_details.category == "choose") {
        /// check if there exist already this id 
        alert("please fill product category field")
        return false;
    }
    if (!re_4_digit_price.test(product_details.price)) {
        alert("please put valid product price")
        return false;
    }
    if (!re_4_digit_price.test(product_details.quantity)) {
        alert("please put valid product quantity")
        return false;
    }
    return true;
}

function get_price_after_discount(price, discount) {
    return Number(price) - (price * Number(discount)) / 100
}


function get_id_number() {
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