var ref_to_massages = firebase.database().ref("massages");
localStorage.removeItem("massages");

ref_to_massages.on('child_added', snap => {
    var massages = snap.val();

    Object.entries(massages).forEach(([date, time]) => {
        add_row_to_table(time)
    })
})

function add_row_to_table(massage_details) {
    console.log(massage_details)
    var $row =
        $(`<tr class='table-row ${massage_details.email.split("@")[0]}' id=${massage_details.time} >` +
            '<th>' + massage_details.date + '</th>' +
            `<td > ${massage_details.full_name}</td>` +
            `<td class="name"> ${massage_details.email}</td>` +
            '<th scope="col"></th>' +
            '<th scope="col"></th>' +
            '<td><button class="btn btn-info watch_massage" onclick="watch_massage(' +
            "'" + massage_details.time + "','" + massage_details.date + "'" + ')">WATCH MASSAGE</button></td>' +
            '<td><button class="btn btn-danger remove" onclick="remove(' +
            "'" + massage_details.time + "','" + massage_details.date + "'" + ')"> REMOVE</button></td>' +
            '</tr>');

    $('table  #massages_table').prepend($row);
}

ref_to_massages.on('child_removed', snap => {
    var massage = snap.val();
    $("#" + massage.time).remove();
})

function watch_massage(time, date) {
    firebase.database().
        ref("massages").
        child(date).
        child(time).
        once('value').
        then(snap => {
            var massage_details = snap.val();
            prepare_massage_info(massage_details)
            $(".massage_form").show();
        })
}

function prepare_massage_info(massage_details) {
    $(".email_name").text(massage_details.email)
    $(".massage_info").text(massage_details.massage)
}

function remove(time, date) {
    if (confirm("Are you sure you want to remove this masage ?")) {
        firebase.database().
            ref("massages").
            child(date).
            child(time).remove();
        window.location.reload();
    }
}

$(document).on('click', function (e) {
    console.log(e.target.className)

    if (e.target.className.includes("massage_info") ||
        e.target.className.includes("alert-success") ||
        e.target.className.includes("watch_massage")) {
        $('.massage_form').show();
    } else {
        $('.massage_form').hide();
    }
})

function search() {
    var input = $(".search").val();
    var name_email = input.split("@")[0]
    var obj_input = $("." + name_email);

    if (obj_input.length == 0) {
        alert(`the product ${input} doesn't exist in the table`)
        $(".search").val("")
    }
    else {
        $(".table-row").hide();
        obj_input.show();
    }
}


function all_rows() {
    $(".table-row").show();
}
