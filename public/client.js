(function() {
    new Vue({
        el: '#app',
        data: {
            boardForm: {
                code: '',
                title: '',
            },
            board: null,
            cardForm: {
                title: '',
                description: ''
            },
            msg: ''
        },

        methods: {
            // show s error message
            handleError: function(error) {
                this.msg = error
                setTimeout(() => {
                    this.msg = ''
                }, 2000)
            },
            // check the fetch response throw a error if response is not ok
            statusCheck: async function(response) {
                if (!response.ok) {
                    throw new Error(await response.text());
                }
                return response;
            },
            // create a new board
            add: function() {

                const { code, title } = this.boardForm;
                if (!code) {
                    return;
                }
                fetch(`/boards`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code, title })
                })
                    .then(this.statusCheck)
                    .then(res => res.json())
                    .then(board => {
                        this.board = board;
                    }).catch(this.handleError)
            },
            // load a board
            load: function() {
                const { code } = this.boardForm;
                if (!code) {
                    return;
                }
                fetch(`/boards/${code}`)
                    .then(this.statusCheck)
                    .then(res => res.json())
                    .then(board => {
                        this.board = board;
                    }).catch(this.handleError)
            },
            // add a card to board with default state waiting
            addCard: function() {
                const { title, description } = this.cardForm;
                if (!title) {
                    return;
                }
                const code = this.board.code;
                fetch(`/boards/cards`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code, title, description })
                })
                    .then(this.statusCheck)
                    .then(res => res.json())
                    .then(board => {
                        this.board = board;
                        this.cardForm.title = ''
                        this.cardForm.description = ''
                    }).catch(this.handleError)
            },
            // move card to next state
            move: function(id) {
                const code = this.board.code;
                fetch(`/boards/${code}/cards/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                })
                    .then(this.statusCheck)
                    .then(res => res.json())
                    .then(board => {
                        this.board = board;
                    }).catch(this.handleError)
            },
            // remove the card from board by id
            remove: function(id) {
                const code = this.board.code;
                fetch(`/boards/${code}/cards/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                })
                    .then(this.statusCheck)
                    .then(res => res.json())
                    .then(board => {
                        this.board = board;
                    }).catch(this.handleError)
            }
        }
    })
})()

