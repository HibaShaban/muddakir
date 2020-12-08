$(async function() {

    // Global variables
    let file;
    let suraNum;
    let questions;
    let total_questions;
    let counter;

    $.getJSON('data/suras.json', function(json){
        $.each(json, function(key, value) {
            $('#suraNum').append($("<option></option>").attr("value", key).text(value));
        });
    });

    const loadFile = async function(question_type) {
        await $.getJSON(`data/${question_type}.json`, async function(json) {
            file = json;
        });
    }

    function loadQuestions() {
        suraNum = $("#suraNum").val();
        console.log(suraNum);
        console.log(file);
        counter = 1;
        questions = JSON.parse(JSON.stringify(file[suraNum].questions));
        total_questions = questions.length;
    }

    await loadFile("maqati");
    loadQuestions();

    $("#next-btn").on("click", function() {
        if(counter > total_questions) {
            loadQuestions();
        }
        let index = Math.floor(Math.random() * questions.length);
        $("#question").html(questions[index].question);
        $("#ayat").html(questions[index].ayat.join('<br/>'));
        $("#questionNum").html(`Question ${counter} of ${total_questions}`);
        questions.splice(index,1);
        counter += 1;
    });
    
    $('select').on('change', function() {
        loadQuestions();
    });
    
    $('input[type=radio][name=question]').on('change', async function() {
        await loadFile(this.value);
        loadQuestions();
    });

    $('#switchRoundedOutlinedDefault').on('click', function(){
        if($(this).is(':checked')){
            $("#ayat").show();
        } else {
            $("#ayat").hide();
        }
    });
});
