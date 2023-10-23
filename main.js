document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  //  Membuat sidebar muncul dan tersembunyi
  const sidebar = document.getElementById("sidebar");
  const toggleSidebar = document.getElementById("input");
  const closeButton = document.getElementById("closeButton");

  toggleSidebar.addEventListener("click", function () {
    sidebar.classList.remove("hiddenMode");
    toggleSidebar.classList.add("hiddenMode");
  });

  closeButton.addEventListener("click", function () {
    sidebar.classList.add("hiddenMode");
    toggleSidebar.classList.remove("hiddenMode");
  });

  // Membuat fungsi untuk menambahkan data buku
  function addBook() {
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const inputIsCompleted = document.getElementById(
      "inputBookIsComplete"
    ).checked;
    const GeneratedBookID = generateBookID();
    const bookObject = generateBookObject(
      GeneratedBookID,
      bookTitle,
      bookAuthor,
      bookYear,
      inputIsCompleted
    );
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    toastMessage(bookTitle);
  }
  const books = [];
  const RENDER_EVENT = "render-book";

  function generateBookID() {
    return +new Date();
  }

  function generateBookObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted,
    };
  }

  document.addEventListener(RENDER_EVENT, function () {
    const unReadBookList = document.getElementById("incompleteBookshelfList");
    unReadBookList.innerHTML = "";
    const hasBeenReadBookList = document.getElementById(
      "completeBookshelfList"
    );
    hasBeenReadBookList.innerHTML = "";

    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isCompleted) {
        unReadBookList.append(bookElement);
      } else {
        hasBeenReadBookList.append(bookElement);
      }
    }
  });

  function makeBook(bookObject) {
    const textBookTitle = document.createElement("h3");
    textBookTitle.innerText = bookObject.title;

    const textBookAuthor = document.createElement("p");
    textBookAuthor.innerText = bookObject.author;

    const timeOfBook = document.createElement("p");
    timeOfBook.innerText = bookObject.year;

    const undoButton = document.createElement("button");
    undoButton.classList.add("undoIcon");

    const trashButton = document.createElement("button");
    trashButton.classList.add("trashIcon");
    trashButton.addEventListener("click", function () {
      const bookTitle = bookObject.title;
      const dialogBox = confirm(`Apakah Anda Yakin Menghapus ${bookTitle}?`);
      if (dialogBox == true) {
        deleteBook(bookObject.id, bookObject.title);
      }
    });

    const checkButton = document.createElement("button");
    checkButton.classList.add("checkIcon");

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");

    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(
      textBookTitle,
      textBookAuthor,
      timeOfBook,
      actionContainer
    );
    container.setAttribute("id", `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
      actionContainer.append(undoButton);
      undoButton.addEventListener("click", function () {
        undoBookFromCompleted(bookObject.id, bookObject.title);
      });
      actionContainer.append(trashButton);
      container.append(actionContainer);
    } else {
      actionContainer.append(checkButton);
      checkButton.addEventListener("click", function () {
        addCompletedRead(bookObject.id, bookObject.title);
      });
      actionContainer.append(trashButton);
      container.append(actionContainer);
    }
    return container;
  }

  function addCompletedRead(bookId, title) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    const toastText = document.getElementById("toast");
    toastText.className = "toast show";
    toastText.innerText = `${title} telah dibaca!`;
    setTimeout(function () {
      toastText.className = toastText.className.replace("show", "");
    }, 1500);
  }

  function deleteBook(bookId, title) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    const toastText = document.getElementById("toast");
    toastText.className = "toast show";
    toastText.innerText = `${title} telah dihapus!`;
    setTimeout(function () {
      toastText.className = toastText.className.replace("show", "");
    }, 1500);
  }

  function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }

  function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
    return -1;
  }

  function toastMessage(bookTitle) {
    const toastText = document.getElementById("toast");
    toastText.className = "toast show";
    toastText.innerText = `${bookTitle} telah ditambahkan!`;
    setTimeout(function () {
      toastText.className = toastText.className.replace("show", "");
    }, 1500);
  }

  document
    .getElementById("searchBook")
    .addEventListener("input", function (event) {
      searchBook();
      event.preventDefault();
    });
  document
    .getElementById("searchBook")
    .addEventListener("click", function (event) {
      searchBook();
      event.preventDefault();
    });

  function searchBook() {
    const searchBook = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const bookList = document.querySelectorAll(".book_item");
    for (let book of bookList) {
      const title = book.firstElementChild.innerText.toLowerCase();
      if (title.includes(searchBook)) {
        book.style.display = "block";
      } else {
        book.style.display = "none";
      }
    }
  }

  const SAVE_EVENT = "save-book";
  const STORAGE_KEY = "BOOKSHELF_APPS";

  function isStorageExist() {
    if (typeof Storage === "undefined") {
      alert("Tidak ada web storage!");
      return false;
    }
    return true;
  }

  function saveData() {
    if (isStorageExist()) {
      const parsedData = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsedData);
      document.dispatchEvent(new Event(SAVE_EVENT));
    }
  }

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let bookData = JSON.parse(serializedData);
    if (bookData !== null) {
      for (const data of bookData) {
        books.push(data);
      }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
