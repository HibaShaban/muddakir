$(async function() {

    // Global variables
    let file;
    let suraNum;
    let questions;
    let total_questions;
    let counter;

    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    
    const enToAra = function (str) {
        if (typeof str === 'string') {
            for(var i=0; i<10; i++) {
                str = str.replaceAll(i, arabicNumbers[i]);
            }
        }
        return str;
    };

    $.getJSON('data/suras.json', function(json){
        $.each(json, function(key, value) {
            $('#suraNum').append($("<option></option>").attr("value", value.num).text(value.name));
        });
    });

    const loadFile = async function(question_type) {
        await $.getJSON(`data/${question_type}.json`, async function(json) {
            file = json;
        });
    }

    function loadQuestions() {
        suraNum = parseInt($("#suraNum").val());
        console.log(suraNum);
        console.log(file);
        counter = 1;
        questions = JSON.parse(JSON.stringify(file.find(x => x.sura === suraNum).questions));
        console.log(questions)
        total_questions = questions.length;
    }

    function getAyat(verses) {
        verseRange = verses.split("-").map(numStr => parseInt(numStr));
        if (verseRange.length == 1) {
            verseNums = verseRange;
        } else {
            verseNums = [...Array(verseRange[1]-verseRange[0]+1).keys()].map(i => i + verseRange[0]);
        }

        let ayat = Promise.all(verseNums.map(verseNum => {
            return axios.get(`https://api.quran.com/api/v4/quran/verses/uthmani?verse_key=${suraNum}:${verseNum}`);
        }));

        ayat.then(data => {
            let ayatStr = data.map(response => {
                return response.data.verses[0].text_uthmani + ` ${enToAra(response.data.verses[0].verse_key.split(":")[1])} `;
            }).join("");
            $("#ayat").append(`<p class="is-size-5" dir="rtl">${ayatStr}</p>`);
        });
    }

    await loadFile("maqati");
    loadQuestions();

    $("#next-btn").on("click", function() {
        if(counter > total_questions) {
            loadQuestions();
        }
        let index = Math.floor(Math.random() * questions.length);
        $("#question").html(questions[index].question);
        $("#ayat").empty();
        questions[index].ayat.map(getAyat);
        $("#questionNum").html(`Question ${counter} of ${total_questions}`);
        questions.splice(index,1);
        counter += 1;
        if ($('#ayat').is(':visible')) {
            $('#view').addClass('fa-eye');
            $('#view').removeClass('fa-eye-slash');
            $('#ayat').hide();
        }
    });

    $('select').on('change', function() {
        loadQuestions();
    });

    $('input[type=radio][name=question]').on('change', async function() {
        await loadFile(this.value);
        loadQuestions();
    });

    $('#view').on('click', function() {
        $('#view').toggleClass('fa-eye');
        $('#view').toggleClass('fa-eye-slash');
        $('#ayat').toggle();
    });

    // $('#switchRoundedOutlinedDefault').on('click', function(){
    //     if($(this).is(':checked')){
    //         $("#ayat").show();
    //     } else {
    //         $("#ayat").hide();
    //     }
    // });
});
