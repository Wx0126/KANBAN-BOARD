const express = require('express')
const app = express()
const port = 23078
const path = require('path')

const WAITING = 0;
const IN_PROGRESS = 1;
const COMPLETED = 2;

// the boards database
const boards = {

}

app.use(express.json());

app.use('/', express.static(path.join(__dirname, 'public')))

/**
 * create a new board and add it to the boards
 * @param {*} code the board code
 * @param {*} title the board title
 * @returns null if the board already exist otherwise return the new board object
 */
function createBoard(code, title) {
    if (boards[code]) {
        return null;
    }

    const board = {
        code,
        title,
        cards: []
    }
    boards[code] = board
    return board;
}
// format the board by add waiting, in_progress, and completed list
// the cards are categorized by its state
function formatBoard(board) {

    return {
        code: board.code,
        title: board.title,
        waiting: board.cards.filter(e => e.state === WAITING),
        in_progress: board.cards.filter(e => e.state === IN_PROGRESS),
        completed: board.cards.filter(e => e.state === COMPLETED)
    }
}

// // get the index.html
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/index.html');
// })

// get a specific board by code
app.get('/boards/:code', (req, res) => {
    let code = req.params.code;
    if (boards[code]) {
        res.json(formatBoard(boards[code]));
    } else {
        res.status(400).type('text').send("Board Not Found")
    }
})

// create a new board
app.post('/boards', (req, res) => {
    // get board code and title
    const { code, title } = req.body;
    // create a board
    let board = createBoard(code, title);

    // if success return the board
    if (board) {
        res.json(formatBoard(board));
    } else {
        res.status(422).type('text').send("Duplicate code")
    }
})

app.post('/boards/cards', (req, res) => {
    const { description, title, code } = req.body;
    // if board code dose not exist return 400
    if (!boards[code]) {
        return res.status(400).type('text').send("Board Not Found")
    }
    // get the board
    let board = boards[code];
    // add a card to the board the default state is WAITING
    board.cards.push({
        id: board.cards.length + 1,
        title,
        description,
        state: WAITING,
    })
    // send the formatted board back to client
    res.json(formatBoard(board));
})

// change the card state
app.put('/boards/:code/cards/:id', (req, res) => {
    // get card id and board code from path paramter
    const { id, code } = req.params;

    // if board code dose not exist return 400
    if (!boards[code]) {
        return res.status(400).type('text').send("Board Not Found")
    }
    let board = boards[code];

    let card = board.cards.find(c => c.id == id);

    // increase card.state by increasing 1 if the state is not COMPLETED
    if (card.state < COMPLETED) {
        card.state++;
    }

    // send the formatted board back to client
    res.json(formatBoard(board));

})

// remove a card from the specific board by id
app.delete('/boards/:code/cards/:id', (req, res) => {
    const { id, code } = req.params;

    // if board code dose not exist return 400
    if (!boards[code]) {
        return res.status(400).type('text').send("Board Not Found")
    }
    let board = boards[code];
    let index = board.cards.findIndex(c => c.id == id);

    // if card dose not exist in that board return 400
    if (index === -1) {
        return res.status(400).type('text').send("Card Not Found")
    }

    // remove the card
    board.cards.splice(index, 1);

    // send the formatted board back to client
    res.json(formatBoard(board));

})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})