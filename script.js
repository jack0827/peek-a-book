$(function(){
    var length, pace, genre;

    $(".step .option").click(function(){
        var step = $(this).closest(".step");
        var nextStep = step.next(".step");
        var value = $(this).data("value");

        if (step.attr("id") === "book-genre") {
            genre = value;
            $("#star").animate({top: '90%'}, 1000).removeClass("pink-filter").addClass("blue-filter");
            $("#star1").animate({bottom: '90%'}, 1000).removeClass("yellow-filter").addClass("pink-filter");

        } else if (step.attr("id") === "book-length") {
            length = value;
            $("#star").animate({top: '-5%'}, 1000).removeClass("blue-filter").addClass("yellow-filter");
            $("#star1").animate({bottom: '-5%'}, 1000).removeClass("pink-filter").addClass("blue-filter");

        } else if (step.attr("id") === "book-pace") {
            pace = value;
            $("#star").hide(1000);
            $("#star1").hide(1000);

            $("#loading").show();

            setTimeout(function() {
                var userPace = pace;   
                var userLength = length; 
                var userGenre = genre;
    
                console.log("Values:", userPace, userLength, userGenre);
            
                $.ajax({
                    url: "https://prod-37.southeastasia.logic.azure.com:443/workflows/84793fd72ad1463d9087697e81396062/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=kjmJ8litu6SmGo2B6bOPOLVx7fS7nQkmZFcDq1SGM8c", 
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        pace: userPace,
                        length: userLength,
                        genre: userGenre
                    }),
                    success: function(response) {
                        console.log("Success:", response);
                        var quoteHTML = response.quote && response.quote.trim() !== "" 
                        ? `<p id="quote" style="margin-top: 12px; margin-bottom: 10px; justify-content: center; text-align: center;
                        text-justify: inter-word; word-spacing: -1px;"><i>"${response.quote}"</i></p>` 
                        : "";
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
                            <img id="bookimg" src="${response.image}" alt="Book Image"  style="width: 125px; height: auto; margin-bottom: 15px; margin-top: 10px; 
                            border-radius: 5px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.15), 0 6px 25px 0 rgba(0, 0, 0, 0.15);">
                            <h2 id="booktitle" style="margin-bottom: 0px;"><i>${response.title}</i></h2>
                            <h2 id="bookauthor" style="margin-top: 2px; margin-bottom: 0px;"><i> by ${response.author}</i></h2>
                            ${quoteHTML}
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

        $("#star").addClass("pink-filter").show(1200);
        $("#star1").addClass("yellow-filter").show(1200);
      });

      $("#retry").click(function(){
        $("#retry").hide();
        $("#bookmark").hide();
        $("#star").removeClass("yellow-filter").addClass("pink-filter").show(1200);
        $("#star1").removeClass("blue-filter").addClass("yellow-filter").show(1200);
        $("#result").empty();
        $(".card").animate({height: '380px'}, 500);
        $("#book-genre").fadeIn(1500);

      });
});