// const { send } = require("process");

const messageTypes = { LEFT: 'left', RIGHT: 'right', LOGIN: 'login'};

//chat stuff

const chatWindow = document.getElementById('chat');

const messagesList = document.getElementById('messagesList');

const messageInput = document.getElementById('messageInput');

const sendBtn = document.getElementById('sendBtn');


//login stuff
let username = '';
const usernameInput = document.getElementById('usernameInput');
const loginBtn = document.getElementById('loginBtn');
const loginWindow = document.getElementById('login');



const messages = [];// each item inside of here is gonna have {author, date, content, type}. type is either left, right, or login

var socket = io();

socket.on('message', message => {
    console.log(message);
    if (message.type !== messageTypes.LOGIN){
        if(message.author === username) {
            message.type = messageTypes.RIGHT;
        }
        else {
            message.type = messageTypes.LEFT;
        }
    }
    messages.push(message);
    displayMessages();
    chatWindow.scrollTop = chatWindow.scrollHeight;
});

//takes in message object, and return corresponding message HTML
// ES6 function.  createmessageHTML is the function. message is the parameter. Inside the brackets is the actual function.
const createMessageHTML = message => {
    if (message.type === messageTypes.LOGIN) {
        return `
            <p class="secondary-text text-center mb-2">${message.author} has joined the chat</p>
        `;
    }
    return `
        <div class="message ${message.type === messageTypes.LEFT 
            ? 'message-left' 
            : 'message-right'
        }">
            <div id="message-details" class="flex">
                <p class="message-author">${
                    message.type === messageTypes.RIGHT ? '' : message.author
                }</p>
                <p class="message-date">${message.date}</p>
            </div>
            <p class="message-content">${message.content}</p>
        </div>
    `;
}

//This function actually diplays the HTML that createMessageHTML function creates V
const displayMessages = () => {
    console.log('displaying messages')
    const messagesHTML = messages
        //map function takes the messages array, iterates through each item, give you a reference to each item inside of it, 
        //map functions takes on array, iterates through it, does some kind of conversion, and then returns a new converted array.
        //createMessageHTML(message) would be an implicit return.
        .map(message => createMessageHTML(message))
        //join takes all the items inside that array and puts them all in one string. basically converts an array into a string.
        .join('');
    //grabs messagesList.  innerHTML is a dom object.  wipes out whatever was there and sets it newly to the messagesHTML we just created above^
    messagesList.innerHTML = messagesHTML;
} 

displayMessages();

//sendbtn callback
sendBtn.addEventListener('click', (e) => {

    e.preventDefault();
    if (!messageInput.value) {

        return console.log('Must supply a message')

    }

    const date = new Date();
    const day = date.getDate();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const dateString = `${month}/${day}/${year}`;

    const message = {

        author: username,
        date: dateString,
        content: messageInput.value,

    }

    sendMessage(message);
    
    messageInput.value = '';

})

const sendMessage = message => {
    socket.emit('message', message);

}

//loginbtn callback
    //e is the parameter of the parameter function
loginBtn.addEventListener('click', e => {

    //prevent default action of form
    e.preventDefault();
    //set the username and create login message
    if (!usernameInput.value) {

        return console.log('Must supply a username')

    }
    username = usernameInput.value;

    sendMessage({
        author: username,
        type: messageTypes.LOGIN
    });

    //hide login and show chat window
    loginWindow.classList.add('hidden');
    chatWindow.classList.remove('hidden');
})

