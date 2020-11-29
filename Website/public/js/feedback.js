$("#submitForm").submit(function(event) {

    event.preventDefault();

    let formData = {
        feedback: $("#feedback").val()
    }

    let data = JSON.stringify(formData);

    $.ajax({
        type: "POST",
        url: "/feedback",
        data: {
            serData: data
        },
        success: function(data) {
            alert("Thank you for  your feedback");
            window.location.replace("/home");
        },
        error: function(error) {
            alert(error.status + " Invalid Data Entered");
        }
    })
})