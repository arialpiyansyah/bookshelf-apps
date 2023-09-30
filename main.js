document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  //   Membuat sidebar muncul dan tersembunyi
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

  //
  function addBook() {
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const GeneratedBookID = generateBookID();
    const bookObject = generateBookObject(
      GeneratedBookID,
      bookTitle,
      bookAuthor,
      bookYear,
      false
    );
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    // saveData();
    // toastMessage(bookTitle);
  }
  const books = [];
  const RENDER_EVENT = "render-book";

  function generateBookID() {
    return +new Date();
  }

  function generateBookObject(id, bookTitle, author, year, isReaded) {
    return {
      id,
      bookTitle,
      author,
      year,
      isReaded,
    };
  }

  document.addEventListener(RENDER_EVENT, function () {
    const unReadedBookList = document.getElementById("incompleteBookshelfList");
    unReadedBookList.innerHTML = "";
    const readedBookList = document.getElementById("completeBookshelfList");
    readedBookList.innerHTML = "";

    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isReaded) {
        unReadedBookList.append(bookElement);
      } else {
        readedBookList.append(bookElement);
      }
    }
  });

  function makeBook(bookObject) {
    const textBookTitle = document.createElement("h3");
    textBookTitle.innerText = bookObject.bookTitle;

    const textBookAuthor = document.createElement("p");
    textBookAuthor.innerText = bookObject.author;

    const timeOfBook = document.createElement("p");
    timeOfBook.innerText = bookObject.year;

    const undoButton = document.createElement("button");
    undoButton.classList.add("undoIcon");

    const trashButton = document.createElement("button");
    trashButton.classList.add("trashIcon");

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

    if (bookObject.isReaded) {
      actionContainer.append(undoButton);
      undoButton.addEventListener("click", function () {
        undoBookFromReaded(bookObject.id);
      });
      actionContainer.append(trashButton);
      trashButton.addEventListener("click", function () {
        deleteBookFromReaded(bookObject.id);
      });
      container.append(actionContainer);
    } else {
      actionContainer.append(checkButton);
      actionContainer.append(trashButton);
      checkButton.addEventListener("click", function () {
        addBookReaded(bookObject.id);
      });
      container.append(actionContainer);
    }
    return container;
  }
});
