/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable func-names */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
import './style.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, query, where, orderBy, onSnapshot, deleteDoc, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
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

let myLibrary = [];

// book collection

const colRef = collection(db, 'myLibrary');

// queries

const queryAllAscending = query(colRef, orderBy('createdAt'));

// real time collection subscription

onSnapshot(queryAllAscending, snapshot => {
  emptyBookshelf();
  const firebaseBooks = [];
  snapshot.docs.forEach(docs => {
    firebaseBooks.push({
      ...docs.data(),
      id: docs.id,
    });
  });

  myLibrary = [];
  firebaseBooks.forEach(item => {
    new Book(item.title, item.author, item.pages, item.readStatus, item.id).addBookToLibrary();
  });
  drawLibrary();
});

// firestore add book
const addBookForm = document.querySelector('#book-add');
addBookForm.addEventListener('submit', e => {
  e.preventDefault();
  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    pages: addBookForm.pages.value,
    readStatus: false,
    createdAt: serverTimestamp(),
  })
    .then(() => {
      addBookForm.reset();
    })
    .catch(err => {
      console.log(err.message);
    });
});

const Book = class {
  constructor(title, author, pages, readStatus, id) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readStatus = readStatus;
    this.id = id;
  }
};

Book.prototype.addBookToLibrary = function () {
  myLibrary.push(this);
};

function deleteFsBookWrapper() {
  const deleteFsBooks = document.querySelectorAll('#delete');

  deleteFsBooks.forEach(deleteFsBook => {
    deleteFsBook.addEventListener('click', () => {
      const docRef = doc(db, 'myLibrary', deleteFsBook.dataset.id);

      deleteDoc(docRef);
    });
  });
}

// update book record (read /unread only in this example)

function updateFsReadStatusWrapper() {
  const readCheckListeners = document.querySelectorAll('#checkbox');

  readCheckListeners.forEach(readStatus => {
    readStatus.addEventListener('change', e => {
      const docRef = doc(db, 'myLibrary', e.target.dataset.id);

      updateDoc(docRef, {
        readStatus: e.target.checked,
      });
    });
  });
}

const container = document.querySelector('#proj-cont');

function emptyBookshelf(parent = container) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
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
    myLibrary[i]?.readStatus === true && (readValue.checked = true);

    readValue.dataset.id = myLibrary[i]?.id;

    const deleteIcon = document.createElement('input');
    deleteIcon.setAttribute('type', 'image');
    deleteIcon.setAttribute('name', 'delete');
    deleteIcon.setAttribute('id', 'delete');
    deleteIcon.setAttribute('src', trashIcon);

    deleteIcon.classList.add('delete');
    deleteIcon.dataset.id = myLibrary[i]?.id;

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
    deleteFsBookWrapper();
    updateFsReadStatusWrapper();
  }
}
