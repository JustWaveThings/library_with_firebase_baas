/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable func-names */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
import './style.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import trashIcon from './img/delete.svg';

const firebaseConfig = {
  apiKey: 'AIzaSyDHbAqh5qZOjfDBB4J4VnbcN6-gwBfdS3I',
  authDomain: 'library-add-firebase.firebaseapp.com',
  projectId: 'library-add-firebase',
  storageBucket: 'library-add-firebase.appspot.com',
  messagingSenderId: '1044075796113',
  appId: '1:1044075796113:web:da6200fcfae6fb706d1130',
};

initializeApp(firebaseConfig);

const db = getFirestore();

const colRef = collection(db, 'myLibrary');

const fireBooks = getDocs(colRef).then(snapshot => {
  const firebaseBooks = [];
  snapshot.docs.forEach(doc => {
    firebaseBooks.push({
      ...doc.data(),
      id: doc.id,
    });
  });
  console.log(firebaseBooks);
  return firebaseBooks;
});

addFsBook(fireBooks);

const myLibrary = [];

const Book = class {
  constructor(title, author, pages, readStatus) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readStatus = readStatus;
  }
};

Book.prototype.bookIndex = function (length = 5) {
  this.index = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    this.index += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return this.index;
};

Book.prototype.addBookToLibrary = function () {
  this.bookIndex();
  myLibrary.push(this);
};

const book1 = new Book('The Hobbit', 'J.R.R. Tolkien', 450, 'unread');
const book2 = new Book('Catch-22', 'Joseph Heller', 400, 'unread');
const book3 = new Book('Heart of Darkness', 'Joseph Conrad', 300, 'unread');
const book4 = new Book('Botany of Desire', 'Michael Pollan', 250, 'unread');

book1.addBookToLibrary();
book2.addBookToLibrary();
book3.addBookToLibrary();
book4.addBookToLibrary();

function addFsBook(obj) {
  obj
    .then(res => {
      res.forEach(item => {
        const fsBook = new Book(item.formTitle, item.formAuthor, item.formPages, item.formRead);
        console.log(fsBook);
        fsBook.addBookToLibrary();
        emptyBookshelf();
        drawLibrary();
        clearForm();
      });
    })
    .catch(err => {
      console.log(err.message);
    });
}

function addBook(event) {
  event.preventDefault();
  const sample = new Book(formTitle.value, formAuthor.value, formPages.value, formRead.value);
  sample.addBookToLibrary();
  emptyBookshelf();
  drawLibrary();
  clearForm();
}

function clearForm() {
  document.getElementById('book-add').reset();
}

const container = document.querySelector('#proj-cont');
function emptyBookshelf(parent = container) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function deleteBook(event) {
  const bookToBeDeletedIndex = event.currentTarget.dataset.indexValue;
  const foundIndex = myLibrary.findIndex(x => x.index === bookToBeDeletedIndex);
  myLibrary.splice(foundIndex, 1);
  emptyBookshelf();
  drawLibrary();
}

function setReadStatus(event) {
  const bookToChange = event.currentTarget.dataset.indexValue;
  const foundIndex = myLibrary.findIndex(x => x.index === bookToChange);
  myLibrary[foundIndex].readStatus === 'unread' ? (myLibrary[foundIndex].readStatus = 'read') : (myLibrary[foundIndex].readStatus = 'unread');
}

function drawLibrary() {
  let i = 0;
  do {
    displayBooksInArray(myLibrary[i]);
    i += 1;
  } while (i <= myLibrary.length - 1);

  function displayBooksInArray() {
    const bookContainer = document.createElement('li');
    bookContainer.classList.add('proj-item');

    const titleLabel = document.createElement('h4');
    titleLabel.classList.add('item-desc', 'book-title');
    titleLabel.textContent = 'Title:';

    const titleValue = document.createElement('h5');
    titleValue.classList.add('item-book-title');
    titleValue.id = 'title-cont';
    titleValue.textContent = myLibrary[i]?.title;

    const authorLabel = document.createElement('h4');
    authorLabel.classList.add('item-desc', 'author');
    authorLabel.textContent = 'Author:';

    const authorValue = document.createElement('h5');
    authorValue.classList.add('item-author');
    authorValue.id = 'author-cont';
    authorValue.textContent = myLibrary[i]?.author;

    const pagesLabel = document.createElement('h4');
    pagesLabel.classList.add('item-desc', 'pages');
    pagesLabel.textContent = 'Pages:';

    const pagesValue = document.createElement('h5');
    pagesValue.classList.add('item-pages');
    pagesValue.id = 'pages-cont';
    pagesValue.textContent = myLibrary[i]?.pages;

    const readLabel = document.createElement('h4');
    readLabel.classList.add('item-desc', 'read-toggle');
    readLabel.textContent = 'Read?:';

    const readValue = document.createElement('input');
    readValue.setAttribute('class', 'checkbox');
    readValue.id = 'checkbox';
    readValue.setAttribute('type', 'checkbox');
    readValue.setAttribute('name', 'checkbox');
    // console.log(`On redraw/reload, for book ${i} the read status is: ${myLibrary[i]?.readStatus}`);
    if (myLibrary[i]?.readStatus === 'read') {
      readValue.checked = true;
    }
    readValue.dataset.indexValue = myLibrary[i]?.index;
    readValue.addEventListener('pointerup', event => {
      setReadStatus(event);
    });

    /* 		function setReadStatus(event) {
		const bookToChange = event.currentTarget.dataset.indexValue;
		const foundIndex = myLibrary.findIndex(
			(x) => x.index === bookToChange
		);
		myLibrary[foundIndex].readStatus === 'unread'
			? (myLibrary[foundIndex].readStatus = 'read')
			: (myLibrary[foundIndex].readStatus = 'unread');
	}; */

    const deleteIcon = document.createElement('input');
    deleteIcon.setAttribute('type', 'image');
    deleteIcon.setAttribute('name', 'delete');
    deleteIcon.setAttribute('id', 'delete');
    deleteIcon.setAttribute('src', trashIcon);

    deleteIcon.classList.add('delete');
    deleteIcon.dataset.indexValue = myLibrary[i]?.index;
    deleteIcon.addEventListener('click', event => {
      deleteBook(event);
    });

    container.appendChild(bookContainer);
    bookContainer.appendChild(titleLabel);
    bookContainer.appendChild(titleValue);
    bookContainer.appendChild(authorLabel);
    bookContainer.appendChild(authorValue);
    bookContainer.appendChild(pagesLabel);
    bookContainer.appendChild(pagesValue);
    bookContainer.appendChild(readLabel);
    bookContainer.appendChild(readValue);
    bookContainer.appendChild(deleteIcon);
  }
}

const formTitle = document.getElementById('title');
const formAuthor = document.getElementById('author');
const formPages = document.getElementById('pages');
const formRead = document.getElementById('readStatus');
const formButton = document.querySelector('#btn');
formButton.addEventListener('click', event => {
  addBook(event);
});

drawLibrary();
