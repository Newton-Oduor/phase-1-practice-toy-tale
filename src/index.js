let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetchToys();

  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", handleFormSubmit);
});

function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(resp => resp.json())
    .then(toys => {
      toys.forEach(renderToy);
    });
}

function renderToy(toy) {
  const toyCollection = document.getElementById("toy-collection");

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  toyCollection.appendChild(card);

  const likeButton = card.querySelector(".like-btn");
  likeButton.addEventListener("click", () => {
    likeToy(toy, likeButton);
  });
}

function handleFormSubmit(event) {
  event.preventDefault();
  const name = event.target.name.value;
  const image = event.target.image.value;

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      name: name,
      image: image,
      likes: 0
    })
  })
    .then(resp => resp.json())
    .then(newToy => {
      renderToy(newToy);
      event.target.reset();
    });
}

function likeToy(toy, button) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: newLikes
    })
  })
    .then(resp => resp.json())
    .then(updatedToy => {
      button.previousElementSibling.textContent = `${updatedToy.likes} Likes`;
      toy.likes = updatedToy.likes;
    });
}
