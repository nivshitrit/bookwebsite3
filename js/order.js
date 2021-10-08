var ref_to_orders = firebase.database().ref("orders");

ref_to_orders.on('child_added', snap => {
    var orders = snap.val();

    Object.entries(orders).forEach(([receipt_number, client_order]) => {
        Object.entries(client_order).forEach(([key, value]) => {
            // key can be or category : items 
            //            or order : client details  
            if (key == "order") {
                add_row_to_table(value)
            }
        })
    })
})

function add_row_to_table(client_order) {
    var name_email = client_order.email.split("@")[0]

    var $row =
        $(`<tr class='table-row ${name_email}'>` +
            '<th>' + client_order.receipt_number + '</th>' +
            '<td class="name">' + client_order.email + '</td>' +
            '<td >' + client_order.date + '</td>' +
            '<td class="author">' + client_order.price + '</td>' +
            '<th scope="col"></th>' +
            '<td><button class="btn btn-info more_info" onclick="more_info(' +
            "'" + client_order.receipt_number + "','" + client_order.date + "'" + ')">MORE INFO</button></td>' +
            '</tr>');

    $('table  #result_table').prepend($row);
}

ref_to_orders.on('child_removed', snap => {
    var order = snap.val();
    $("#" + order.receipt_number).remove();
})


function more_info(receipt_number, date) {
    firebase.database().
        ref("orders").
        child(date).
        child(receipt_number).
        once('value').
        then(snap => {
            var recipt_detail = snap.val();
            prepare_reciept_info(recipt_detail)
            $(".receipt").show();
        })
}

function prepare_reciept_info(recipt_detail) {

    Object.entries(recipt_detail).forEach(([key, value]) => {
        if (key == "order") {
            add_order_info(value)
        } else {
            add_products_info(key, value)
        }
    });
}

function add_order_info(order_info) {
    // console.log(order_info);
    $("#total").text(order_info.price + "$");
    $(".receipt_number").text(order_info.receipt_number);
    $(".client_email").text("Email : " + order_info.email);
}

function add_products_info(category, items_quantity) {
    // console.log(category);
    // console.log(items_quantity);

    Object.entries(items_quantity).forEach(([id, quantity]) => {
        firebase.database().
            ref(category).
            child(id).
            once('value').
            then(snap => {
                var db_product = snap.val();
                add_item_row_to_receipt(db_product.name, quantity, db_product.price_after_discount)
            });
    })
}

function add_item_row_to_receipt(name, quantity, price) {
    var sub_price = quantity * price;

    var $row =
        $('<tr class="item_row">' +
            '<td class="tableitem">' +
            '<p class="itemtext">' + name + '</p>' +
            '</td>' +
            '<td class="tableitem">' +
            '<p class="itemtext">' + quantity + '</p>' +
            ' </td>' +
            '<td class="tableitem">' +
            '<p class="itemtext">' + sub_price + '</p>' +
            '</td>' +
            '</tr>'
        );

    $($row).insertAfter($(".first_row").closest("tr"));
}


$(document).on('click', function (e) {
    // console.log(e.target.className)

    if (!e.target.className.includes("more_info")) {
        $('.item_row').remove();
        $('.receipt').hide();
    } else {
        $('.item_row').remove();
        $('.receipt').show();
    }
})

function search() {
    var input = $(".search").val();
    var name_email = input.split("@")[0]
    var obj_input = $("." + name_email);

    if (obj_input.length == 0) {
        alert(`the product ${input} doesn't exist in the table`)
        $(".search").val("")
    } else {
        $(".table-row").hide();
        obj_input.show();
    }
}

function all_rows() {
    $(".table-row").show();
}



