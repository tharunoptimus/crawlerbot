;$(document).ready(function () {
    (function () {
        var cssFa = document.createElement("link");
        cssFa.href =
            "https://kit-pro.fontawesome.com/releases/v5.12.1/css/pro.min.css";
        cssFa.rel = "stylesheet";
        cssFa.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(cssFa);
    
        var cssMain = document.createElement("link");
        cssMain.href = "/css/main.css";
        cssMain.rel = "stylesheet";
        cssMain.type = "text/css";
        document.getElementById("maincss").disabled = true;
        document.getElementsByTagName("head")[0].appendChild(cssMain);
    })();
});

// When the Crawl Button is clicked
$(document).on("click", "#crawlButton",function() {
    var url = $("#urlInput").val();
    if(isValidURL(url)) {
        $("#crawlButton").attr("disabled", "disabled");
        $("#crawlButton").html("<i class='fa fa-cog fa-spin'></i> <span style='padding: 0.5rem;'>Crawling</span>");
        $("#crawlResult").html("Crawl in Progress");
        $("#crawlResult").show();
        $.ajax({
            url: "/api/result",
            type: "POST",
            data: {url: url},
            success: function(data) {
                $("#crawlButton").removeAttr("disabled");
                $("#crawlButton").html("<i class='far fa-spider-black-widow'></i></i> Crawl");
                $("#crawlResult").html("Crawl Success");
                setTimeout(function() {
                    $("#crawlResult").hide();
                }, 3000);
                alert("Crawl Successful!")
            },
            error: function(data) {
                $("#crawlButton").removeAttr("disabled");
                $("#crawlButton").html("<i class='far fa-spider-black-widow'></i> <span style='padding: 0.5rem;'>Crawl</span>");
                $("#crawlResult").html("Crawl Failed");
                setTimeout(function() {
                    $("#crawlResult").hide();
                }, 3000);
            }
        });
    }
    else {
        alert("Please Enter a valid URL!")
    }
});

// function to check whether the url is valid or not
function isValidURL(url) {
    var pattern = new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);
    return pattern.test(url);
}