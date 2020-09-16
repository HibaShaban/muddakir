$(document).ready(function() {

    // Global variables
    let db;
    let question_type;
    let suraNum;
    let questions;
    let total_questions;
    let counter;

    let setValues = function() {
        suraNum = $("#suraNum").val();
        counter = 1;
        questions = JSON.parse(JSON.stringify(question_type[suraNum].questions));
        total_questions = questions.length;
    }

    $.getJSON("data/questions.json", function(json) {
        db = json;
        $.each(db.maqati, function(key, value) {
            $('#suraNum').append($("<option></option>").attr("value", key).text(value.sura));
        });
        question_type = db.maqati;
        setValues();
    });

    $("#next-btn").on("click", function() {
        if(counter > total_questions) {
            setValues();
        }
        // if (questions.length === 0) {
        //     $("#question").html("Check back for questions later");
        //     $("#ayat").html();
        //     $("#questionNum").html();
        //     return;
        // }
        let index = Math.floor(Math.random() * questions.length);
        $("#question").html(questions[index].question);
        $("#ayat").html(questions[index].ayat);
        $("#questionNum").html(counter+"/"+total_questions);
        questions.splice(index,1);
        counter += 1;
    });
    
    $('select').on('change', function() {
        setValues();
    });
    
    $('input[type=radio][name=question]').change(function() {
        switch(this.value) {
            case 'maqati':
                question_type = db.maqati;
                break;
            case 'mahawir':
                question_type = db.mahawir;
                break;
            case 'topics':
                question_type = db.topics;
                break;
        }
        setValues();
    });

    $('#switchRoundedOutlinedDefault').click(function(){
        if($(this).is(':checked')){
            $("#ayat").show();
        } else {
            $("#ayat").hide();
        }
    });
});
