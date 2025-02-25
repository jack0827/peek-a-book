$(function(){
    var length, pace, genre;

    $(".step .option").click(function(){
        var step = $(this).closest(".step");
        var nextStep = step.next(".step");
        var value = $(this).data("value");

        if (step.attr("id") === "book-genre") {
            genre = value;
            $("#star").animate({top: '90%'}, 1000);
            $("#star").removeClass("pink-filter");
            $("#star").addClass("blue-filter");

            $("#star1").animate({bottom: '90%'}, 1000);
            $("#star1").removeClass("yellow-filter");
            $("#star1").addClass("pink-filter");

        } else if (step.attr("id") === "book-length") {
            length = value;
            $("#star").animate({top: '-5%'}, 1000);
            $("#star").removeClass("blue-filter");
            $("#star").addClass("yellow-filter");

            $("#star1").animate({bottom: '-5%'}, 1000);
            $("#star1").removeClass("pink-filter");
            $("#star1").addClass("blue-filter");
        } else if (step.attr("id") === "book-pace") {
            pace = value;
            $("#star").hide(1000);
            $("#star1").hide(1000);

            $("#loading").show();

            setTimeout(function() {
                var userPace = pace;   // Replace with user input
                var userLength = length; // Replace with user input
                var userGenre = genre; // Replace with user input
            
                // Debugging: Check values before sending
                console.log("Values:", userPace, userLength, userGenre);
            
                $.ajax({
                    url: "https://prod-30.southeastasia.logic.azure.com:443/workflows/b6c0ec0e675c4917bbd70c99e148c42c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=vnV0AhOqzV_N7TMuB12vs-zeKIiR7DeeHoUXYQV7kxw", 
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        pace: userPace,
                        length: userLength,
                        genre: userGenre
                    }),
                    success: function(response) {
                        console.log("Success:", response);
            
                        var blurb = `
                            <div>
                                <button class="blurb-button">${genre}</button>
                                <button class="blurb-button" style="background-color: #2A5365;">${length}</button>
                                <button class="blurb-button" style="background-color: #9C7244">${pace}</button>
                            </div>
                        `;
            
                        $("#loading").hide();
                        $(".card").animate({ height: '500px' }, 600);
                        $("#bookmark").slideDown("slow");
            
                        $("#retry").show();
                        $("#result").html(`
                            <img src="${response.image}" alt="Book Image" style="width: 120px; height: auto; margin-bottom: 15px; margin-top: 30px; 
                            border-radius: 5px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.15), 0 6px 25px 0 rgba(0, 0, 0, 0.15);">
                            <h2 style="margin-bottom: 0px;"><i>${response.title}</i></h2>
                            <h2 style="font-size: 1em; margin-top: 2px; margin-bottom: 0px;"><i> by ${response.author}</i></h2>
                            <p style="font-size: 0.7em; margin-top: 10px; margin-bottom: 10px; text-align: justify;
                            text-justify: distribute;"><i>"${response.quote}"</i></p>
                            ${blurb}
                        `);
                    }, 
                    error: function(xhr, status, error) {
                        console.error("AJAX Error:", error);
                        console.log("Response Text:", xhr.responseText);
                        $("#loading").hide(); // Ensure loading hides even on failure
                        alert("An error occurred. Please try again.");
                    }
                });
            
            }, 1000);
            

        }
            
            // Ensure these are outside setTimeout
    step.hide();
    nextStep.fadeIn(1500);
            
    });
    
    $(document).on("mousemove", function (event) {
        $(".eye").each(function () {
          let $eye = $(this);
          let offset = $eye.offset();
          let x = offset.left + $eye.width() / 2;
          let y = offset.top + $eye.height() / 2;
      
          let radian = Math.atan2(event.pageX - x, event.pageY - y);
          let rotate = radian * (180 / Math.PI) * -1 + 270;
          $eye.css("transform", `rotate(${rotate}deg)`);
        });
      });
      

      $("#main-btn").click(function(){
        $("#book-start").hide();
        $("#book-genre").fadeIn(1500);

        $(".eyes").animate({top: '80%' ,zIndex: '10'}, 500);
        $(".PageTitle").hide(5);
        $("#PageSubtitle").hide(5);

        $("#star").addClass("pink-filter");
        $("#star1").addClass("yellow-filter");
        $("#star").show(1200);
        $("#star1").show(1200);
      });

      $("#retry").click(function(){
        $("#retry").hide();
        $("#bookmark").hide();
        $("#star").removeClass("yellow-filter");
        $("#star").addClass("pink-filter");
        $("#star1").removeClass("blue-filter");
        $("#star1").addClass("yellow-filter");
        $("#star").show(1200);
        $("#star1").show(1200);
        $("#result").empty();
        $(".card").animate({height: '380px'}, 500);
        $("#book-genre").fadeIn(1500);

      });
});