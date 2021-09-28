var queryString = window.location.search.substring(1);
var data = queryString.split("=");
var category = data[1];


$(".product-title").text(category)
$("." + category).css('text-decoration-line', 'underline')

var ref_to_category = firebase.database().ref(category);
ref_to_category.on('child_added', snap => {
    var db_product = snap.val();
    var price = get_price_after_discount(db_product.discount, db_product.price)

    if (Number(db_product.quantity) <= 0) {
        var out_of_stock = "out of stock"
    } else {
        var out_of_stock = ""
    }
    if (db_product.discount == "" || db_product.discount == null) {
        var discount = "";
    } else {
        var discount = db_product.discount + "% off";
    }

    var $single_item =
        $('<div id=' + db_product.id + ' class="col-10 col-sm-8 col-lg-4 mx-auto my-3">' +
            '<div class="card single-item">' +
            '<div class="img-container">' +
            '<img src="' + db_product.image + '" alt="" class="card-img-top product-img"></div>' +
            '<div class="card-body">' +
            '<h4 class="name">' + db_product.name + '</h4>' +
            '<span><i class="price">' + price + '$</i></span><br>' +
            '<span><i class="discount">' + discount + ' </i></span><br>' +
            '<span><i class="out_of_stock">' + out_of_stock + '</i></span><br>' +
            '<button class="add_to_cart" onclick="add_to_cart(' + "'" + db_product.id + "'" + ')">ADD TO CART </button>' +
            '</div></div></div>'
        )
    $('#product-items').append($single_item);
})

function get_price_after_discount(discount, price) {
    return ((100 - Number(discount)) * Number(price)) / 100
}

ref_to_category.on('child_changed', snap => {
    var db_product = snap.val();
    var price = get_price_after_discount(db_product.discount, db_product.price)
    $("#" + db_product.id).children("img").src = db_product.image
    $("#" + db_product.id).children(".name").innerText = db_product.name
    $("#" + db_product.id).children(".price").innerText = price
})

ref_to_category.on('child_removed', snap => {
    var db_product = snap.val();
    $("#" + db_product.id).remove();
})

var order_id = "";
function add_to_cart(id) {

    var category_items = JSON.parse(localStorage.getItem(category))
    console.log(category_items)
    if (category_items == null) {
        category_items = [];
        category_items.push(id)
        increase_cart_counter()
    } else {
        if (!category_items.includes(id)) {
            category_items.push(id)
            increase_cart_counter()
        }
    }
    localStorage.setItem(category, JSON.stringify(category_items))
}

function increase_cart_counter() {
    var sum_items = $("#cart_count").text();
    var new_sum = Number(sum_items) + 1;
    $("#cart_count").text(new_sum);
    localStorage.setItem("cart", new_sum)
    console.log(localStorage.getItem("cart"))
}


