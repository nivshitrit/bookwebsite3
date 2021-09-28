
var categories = ["rings", "necklaces", "pendants", "earrings", "watches", "bracelets", "diamonds"]
var total_sum = $(".total")

$(".continue_shopping").click(() => {
    window.location = '/jewlery_website/customer/shop.html?category=rings'
})

categories.forEach(category => {
    var items = JSON.parse(localStorage.getItem(category))
    console.log(items)
    if (items != null) {
        items.forEach(id => {
            add_item_to_order(category, id)
        })
    }
})

function add_item_to_order(category, id) {
    firebase.
        database().
        ref(category).
        child(id).
        once('value').
        then(snap => {
            db_product = snap.val();
            add_item_price_to_total(db_product.price_after_discount)
            add_row_to_table(db_product)
        })
}

function add_row_to_table(db_product) {
    console.log(db_product)
    var $single_order =
        $('<tr class="item_row" id="' + db_product.id + '">' +
            '<td><img src=' + db_product.image + ' /> </td>' +
            '<td>' + db_product.name + '</td> ' +
            '<td>' + db_product.price + '$</td>' +
            '<td>' + db_product.discount + '%</td>' +
            '<td><div class="quantity_btn">' +
            '<input type="button" onclick="minus_btn(' + "'" + db_product.id + "'" + ')"value="-" class="button-minus" data-field="quantity">' +
            '<input class="quantity_input" type="text" value="1"/>' +
            '<input type="button" onclick="plus_btn(' + "'" + db_product.id + "'" + ')" value="+" class="button-plus" data-field="quantity">' +
            '</div></td>' +
            '<td class="text-right sum">' + db_product.price_after_discount + '$</td>' +
            '<td class="text-right">' +
            '<button onclick="remove_from_cart(' + "'" + db_product.category + "','" + db_product.id + "'" + ')" class="btn btn-sm btn-danger">' +
            '<i class="fa fa-trash"></i></button></td>' +
            '</tr>'
        )
    $('.table_body').prepend($single_order);
}

function add_item_price_to_total(price) {
    var sum = Number(total_sum.text().replace("$", "")) + Number(price)
    total_sum.text(sum + "$")
}

function plus_btn(id) {
    var amount = Number($(`#${id} .quantity_input`).val());
    var sum = Number($(`#${id} .sum`).text().replace("$", ""));
    var price = sum / amount;

    $(`#${id} .quantity_input`).val(amount + 1)
    $(`#${id} .sum`).text(sum + price + "$")

    var total = Number(total_sum.text().replace("$", ""))
    total_sum.text(total + price + "$")
}

function minus_btn(id) {
    var amount = Number($(`#${id} .quantity_input`).val())
    var sum = Number($(`#${id} .sum`).text().replace("$", ""))
    price = sum / amount;

    if (amount > 1) {
        $(`#${id} .quantity_input`).val(amount - 1)
        $(`#${id} .sum`).text(sum - price + "$")

        var total = Number(total_sum.text().replace("$", ""))
        total_sum.text(total - price + "$")
    }
}

function remove_from_cart(category, id) {
    decrease_cart_counter()
    var id_total_price = Number($(`#${id} .sum`).text().replace("$", ""))
    var total = Number(total_sum.text().replace("$", ""))

    console.log(id_total_price)
    console.log(total)

    total_sum.text(total - id_total_price + "$")

    $("#" + id).remove();

    var items = JSON.parse(localStorage.getItem(category))
    items = items.filter(item => item !== id)
    localStorage.setItem(category, JSON.stringify(items))
}

function decrease_cart_counter() {
    var sum_items = $("#cart_count").text();
    if (sum_items > 0) {
        var new_sum = Number(sum_items) - 1;
        $("#cart_count").text(new_sum);
        localStorage.setItem("cart", new_sum)
    }
}

var order = {
    "rings": {},
    "necklaces": {},
    "pendants": {},
    "earrings": {},
    "watches": {},
    "bracelets": {},
    "diamonds": {}
}

function checkout() {

    var sum = Number(localStorage.getItem("cart"));
    console.log(sum)

    if (sum < 1) {
        alert("your cart is empty, please add some products")
    } else {
        keep_order_in_local_storage()
    }
}


function keep_order_in_local_storage() {
    categories.forEach(category => {
        var items = JSON.parse(localStorage.getItem(category))
        if (items != null) {
            items.forEach(id => {
                var quantity = $(`#${id} .quantity_input`).val();
                order[category][id] = quantity;
            })
        }
    })

    localStorage.setItem("order", JSON.stringify(order));

    var url = '/jewlery_website/customer/payment.html?total=' + Math.floor(Number(total_sum.text().replace("$", "")))
    window.location.href = url;
}



