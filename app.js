let finalCategories = {
    cat1: {
        fulfilled: false,
        questions: [],
        name: '',
        count: 5
    },

    cat2: {
        fulfilled: false,
        questions: [],
        name: '',
        count: 5
    },

    cat3: {
        fulfilled: false,
        questions: [],
        name: '',
        count: 5
    },

    cat4: {
        fulfilled: false,
        questions: [],
        name: '',
        count: 5
    },

    cat5: {
        fulfilled: false,
        questions: [],
        name: '',
        count: 5
    },

    cat6: {
        fulfilled: false,
        questions: [],
        name: '',
        count: 5
    },
}

// These are the ids given by the API for most popular categories
let possibleCats = [
    306, 136, 42, 780, 21, 105, 25, 103, 7, 442, 67, 227, 
    109, 114, 31, 176, 582, 1114, 508, 49, 561, 223, 770, 
    622, 313, 253, 420, 83, 184, 211, 51, 539, 267, 357,
    530, 369, 672, 793, 78, 574, 777, 680, 50, 99, 309,
    41, 26, 249, 1420, 218, 1145, 1079, 139, 89, 17, 197, 
    37, 2537, 705, 1800, 897, 1195, 128
];

randomCats();

// Chooses random categories for each game
function randomCats() {
    let chosenCats = [];

    // Grabs a random category and prevents duplicate
    for(let i=1; i<=6; i++){
        let cat = Math.floor(Math.random() * possibleCats.length);
        chosenCats.push(possibleCats[cat]);
        possibleCats.splice(cat, 1);
    }

    fetchQuestions(`https://jservice.io/api/category?id=${chosenCats[0]}`);
    fetchQuestions(`https://jservice.io/api/category?id=${chosenCats[1]}`);
    fetchQuestions(`https://jservice.io/api/category?id=${chosenCats[2]}`);
    fetchQuestions(`https://jservice.io/api/category?id=${chosenCats[3]}`);
    fetchQuestions(`https://jservice.io/api/category?id=${chosenCats[4]}`);
    fetchQuestions(`https://jservice.io/api/category?id=${chosenCats[5]}`);
}

// Fetches the data for the question
function fetchQuestions(url) {
	fetch(url)
		.then((response) => response.json())
		.then((responseJson) => makeQuestion(responseJson))
		.catch((error) => alert(error));
}

// Grabs all of the clues from a category and splits it by value
function makeQuestion(data) {
let title = data.title;

    // The api first has it split like this
    let splitClues = {
        c100: [],
        c200: [],
        c300: [],
        c400: [],
        c500: [],
        c600: [],
        c800: [],
        c1000: []
    };

    // Grabs the clue and answer, puts into array, goes to correct value of splitClues
    for (let i=0; i<data.clues.length; i++){
        let cVal = `c` + data.clues[i].value;
        let arr = [];
        arr.push(data.clues[i].question);
        arr.push(data.clues[i].answer);
        if(cVal !== 'cnull'){
            splitClues[cVal].push(arr);
        }
    };

    // Combines the questions into just 5 values
    let combinedArr = [
        splitClues.c100,
        splitClues.c200,
        splitClues.c300.concat(splitClues.c600),
        splitClues.c400.concat(splitClues.c800),
        splitClues.c500.concat(splitClues.c1000)
    ];
    
    chooseQuestions(combinedArr, title);

}

// Chooses 5 random questions (1 from each value)
function chooseQuestions(arr, title){
    let final5 = [];

    for (let i=0; i<arr.length; i++){
        let ran = Math.floor(Math.random() * arr[i].length);
        final5.push(arr[i][ran]);
    }

   pushToCategory(final5, title)
}

// Pushes the questions to the finalCategories array
function pushToCategory(arr, title){

    // breaks when it finds the column it needs to place itself in
    for(let i=0; i<Object.keys(finalCategories).length; i++ ){
        if(finalCategories[Object.keys(finalCategories)[i]].fulfilled === false){
                finalCategories[Object.keys(finalCategories)[i]].questions = arr;
                finalCategories[Object.keys(finalCategories)[i]].fulfilled = true;
                finalCategories[Object.keys(finalCategories)[i]].name = title.toUpperCase();
                break;
        }
    }

    // Only calls the next function once all categories have been added
    if(finalCategories[Object.keys(finalCategories)[5]].questions.length > 0) {
        setUpBoard();
    }
   
}

// Displays the category titles on the screen
function setUpBoard(){
    for(let i=1; i<=6; i++){
        $(`#cat${i}`).text(finalCategories[Object.keys(finalCategories)[i-1]].name);
    }
}

// Runs when user clicks on a square
$('#gameBoard').on('click', '.clue', function() {
	let squareId = `#${$(this).attr('id')}`;    // ex: #cat1-clue2
    let num = squareId.substr(-1, 1);           // ex: 2
	let cat = squareId.substr(1, 4);        // ex: cat1
    let clue = finalCategories[cat].questions[num-1];

    if($(squareId).text() !== ''){
        displayQuestion(clue, squareId);
    }
});

// Displays the current question full screen
function displayQuestion(clue, squareId) {

    // Questions pops up full screen
    $('#questionText').text(clue[0].toUpperCase());
    document.getElementById("myNav").style.width = "100%";
    document.getElementById("myNav").style.height = "100%";
    $('#answerBtn').show();

    // Displays answer to question and removes it from the board
    $('.overlay-content').on('click', '#answerBtn', function() {
        event.preventDefault;
        $('#answerText').text(clue[1].toUpperCase());
        $('#answerBtn').hide();
        $(squareId).text('');
    });
}

// Closes the question to reveal board
function closeNav(){
    document.getElementById("myNav").style.width = "0%";
    document.getElementById("myNav").style.height = "0%";
    $('#answerText').text('');
}