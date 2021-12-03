function createElemWithText(elemType = "p", textContent = "", className) {
    const myElem = document.createElement(elemType);
    myElem.textContent = textContent;
    if(className) {
        myElem.classList.add(className);
    }
    return myElem;
}

function createSelectOptions(userData) {
    if(!userData) return;

    var userDropDownArray = new Array;
    for(var i =0; i < userData.length; i++)
    {
        var option = document.createElement("option");
        option.value = userData[i].id;
        option.textContent = userData[i].name;
        userDropDownArray.push(option);
    }
    return userDropDownArray;
}

function toggleCommentSection (postId) {
    const section = document.querySelector(`section[data-post-id='${postId}']`);
    if(!postId) return;

    else if(section) {
        section.classList.toggle('hide');
        return section;
    }
    else {
        return null;
    }
}

function toggleCommentButton (postId) {
    const button = document.querySelector(`button[data-post-id='${postId}']`);
    if(!postId) return;

    if(button)
    {
        button.textContent = button.textContent === 'Show Comments' ? 'Hide Comments' : 'Show Comments';
        return button;
        
    } else {
        return null;
    }
}

function deleteChildElements (parentElement) {
    if(!parentElement?.tagName) return;

    var child = parentElement.lastElementChild;

    while(child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}

function addButtonListeners() {

    const main = document.querySelector("main");
    const buttons = main.querySelectorAll("button");

    if(!buttons) return;
    else {
        for(let i = 0; i < buttons.length;i++)
        {
            const postId = buttons[i].dataset.postId;
            buttons[i].addEventListener("click", function(e) {toggleComments(e,postId)},false);
        }
    }
    return buttons;
}
function removeButtonListeners() { 

    const main = document.querySelector("main");
    const buttons = main.querySelectorAll("button");

    if(!buttons) return;
    else {
    for(let i = 0; i < buttons.length;i++)
    {
        const postId = buttons[i].dataset.postId;
        buttons[i].removeEventListener("click", function(e) {toggleComments(e,postId)},false);
    }
}

    return buttons;
}



function createComments(comment) {

    if(!comment) return;

    var fragment = document.createDocumentFragment();

    for(var i = 0; i < comment.length;i++) {
        var commentArticle = document.createElement("ARTICLE");
        var commentH3 = createElemWithText('h3',comment[i].name);
        var commentPara = createElemWithText('p',comment[i].body);
        var commentEmail = createElemWithText('p',`From: ${comment[i].email}`);

        commentArticle.append(commentH3,commentPara,commentEmail)
        fragment.append(commentArticle);
    }
    return fragment;
}

function populateSelectMenu(users) {

    if(!users) return;

    var selectMenu = document.getElementById("selectMenu");
    var selectOptions = createSelectOptions(users);

    for(const option of selectOptions)
    {
        selectMenu.append(option);
    }
    return selectMenu;
}

const getUsers = async () => { //need to implement try-catch block
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const jsonData = await response.json();
    return jsonData;
}

const getUserPosts = async (userId) => { //need to implement try-catch block
    if(!userId) return;
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    const jsonData = await response.json();
    return jsonData;
}

const getUser = async (userId) => {//need to implement try-catch block
    if(!userId) return;
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    const jsonData = await response.json();
    return jsonData;
}

const getPostComments = async(postId) => {//need to implement try-catch block
    if(!postId) return;

    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    const jsonData = await response.json();
    return jsonData;
}

const displayComments = async(postId) => {
    if(!postId) return;

    var sectionElem = document.createElement("SECTION");

    sectionElem.setAttribute('data-post-id',postId);

    sectionElem.classList.add('comments');
    sectionElem.classList.add('hide'); 

    var comments = await getPostComments(postId);
    var fragment = createComments(comments);

    sectionElem.append(fragment);

    return sectionElem;
}

const createPosts = async(post) => {
    if(!post) return;

    var fragment = document.createDocumentFragment();

    for(var i = 0; i < post.length; i++)
    {
        var postArticle = document.createElement("ARTICLE");
        var postH2 = createElemWithText('h2',post[i].title);
        var postParaBody = createElemWithText('p',post[i].body);
        var postParaID = createElemWithText('p',`Post ID: ${post[i].id}`);
        var author = await getUser(post[i].userId);
            var postParaAuthor = createElemWithText('p',`Author: ${author.name} with ${author.company.name}`);
            var postParaCatchPhrase = createElemWithText('p',`${author.company.catchPhrase}`);
        var button = document.createElement("BUTTON");
            button.textContent = "Show Comments";
            button.dataset.postId = post[i].id;
        var section = await displayComments(post[i].id);
        postArticle.append(postH2,postParaBody,postParaID,postParaAuthor,postParaCatchPhrase,button,section);
        fragment.append(postArticle);
    }
    return fragment;
}

const displayPosts = async (post) => {

    const main = document.querySelector("main");
    var element;
    if(post) {
        element = await createPosts(post);
    } else {
        element = main.querySelector("p");
    }

    main.append(element);

    return element;
}
function toggleComments(event,postId) { 

    if(!postId || !event) return;

    event.target.listener = true;

    var section =  toggleCommentSection(postId);

    var button =  toggleCommentButton(postId);

    return [section,button];
}

const refreshPosts = async(post) => {
    if(!post) return;
    
    var removeButtons = removeButtonListeners();

    var main = deleteChildElements(document.querySelector("main"));

    var fragment = await displayPosts(post);

    var addButtons = addButtonListeners();

    return [removeButtons,main,fragment,addButtons];

}

const selectMenuChangeEventHandler = async(event) => {

    
    const userId = event?.target?.value || 1;

    const post = await getUserPosts(userId);

    const refreshPostsArray = await refreshPosts(post);

    
    return [userId, post, refreshPostsArray];
}

const initPage = async() => {

    const users = await getUsers();

    const select = populateSelectMenu(users);

    return [users,select];
}

function initApp() {
    initPage();
    const selectMenu = document.getElementById("selectMenu");

    selectMenu.addEventListener("change",selectMenuChangeEventHandler,false);
}

document.addEventListener("DOMContentLoaded", initApp,false);