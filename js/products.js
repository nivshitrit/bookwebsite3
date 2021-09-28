var queryString = window.location.search.substring(1);
var data = queryString.split("=");
var category = data[1];

var ref_to_category = firebase.database().ref(category);

ref_to_category.on('child_added', snap => {
    var db_product = snap.val();

    var $row =
        $(`<tr id=${db_product.name} class=table-row>` +
            '<th><img src=' + db_product.image + '></th>' +
            '<td >' + db_product.id + '</td>' +
            '<td class="name">' + db_product.name + '</td>' +
            '<td class="company">' + db_product.company + '</td>' +
            '<td class="category">' + db_product.quantity + '</td>' +
            '<td class="quantity">' + db_product.price + "$" + '</td>' +
            '<td class="price">' + db_product.discount + "%" + '</td>' +
            '<th scope="col"></th>' +
            '<td><button class="btn btn-success update_product" onclick="update_product(' + "'" + db_product.id + "'" + ')">UPDATE</button></td>' +
            '<td><button class="btn btn-danger" onclick="remove_product(' + "'" + db_product.id + "'" + ')">REMOVE</button></td>' +
            '</tr>');

    $('table> tbody:last').append($row);
})

ref_to_category.on('child_changed', snap => {
    var db_product = snap.val();
    $("#" + db_product.id).children("img").src = db_product.image
    $("#" + db_product.id).children(".name").innerText = db_product.name
    $("#" + db_product.id).children(".company").innerText = db_product.company
    $("#" + db_product.id).children(".quantity").innerText = db_product.quantity
    $("#" + db_product.id).children(".price").innerText = db_product.price
})

ref_to_category.on('child_removed', snap => {
    var db_product = snap.val();
    $("#" + db_product.id).remove();
})

function update_product(id) {
    $(".form-style-2").toggle()

    ref_to_category.child(id).once('value').then(snap => {
        var db_product = snap.val();

        $("#company").val(db_product.company)
        $("#id").val(db_product.id)
        $("#name").val(db_product.name)
        $("#category").val(db_product.category)
        $("#price").val(db_product.price)
        $("#discount").val(db_product.discount)
        $("#weight").val(db_product.weight)
        $("#quantity").val(db_product.quantity)
        $("#description").val(db_product.description)
        $("#img").val(db_product.image);
    })
}

function submit_update() {
    var product = {
        company: $("#company").val(),
        id: $("#id").val(),
        name: $("#name").val(),
        category: $("#category").val(),
        price: $("#price").val(),
        discount: $("#discount").val(),
        quantity: $("#quantity").val(),
        description: $("#description").val(),
        image: $("#img").val(),
    }

    var is_valid = is_valid_product_details(product)
    if (is_valid) {
        var ref_to_child = ref_to_category.child(product.id);
        for (const [key, value] of Object.entries(product)) {
            ref_to_child.update({ [key]: value })
        }
        $(".form-style-2").hide()
        location.reload();
    }
}

function remove_product(id) {
    if (confirm("Are you sure you want to remove this product ?")) {
        ref_to_category.child(id).remove();
    }
}

function search() {
    var input = $(".search").val();
    var obj_input = $("#" + input);

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


function out_btn() {
    $(".form-style-2").hide()
}

function is_valid_product_details(product) {
    var re_4_digit = /^\d{1,4}$/

    if (product.company == "") {
        return false;
    }
    if (product.name == "") {
        return false;
    }
    if (product.price == "") {
        return false;
    }
    if (product.quantity == "") {
        return false;
    }
    if (product.image == "") {
        return false;
    }

    if (!re_4_digit.test(product.price)) {
        alert("please put valid product price")
        return false;
    }
    if (!re_4_digit.test(product.quantity)) {
        alert("please put valid product quantity")
        return false;
    }
    return true;
}
