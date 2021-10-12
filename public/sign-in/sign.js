//
const URL = 'http://localhost:3000/auth';
const form = document.querySelector('.form-signin');
const navbar = document.querySelector('.navbar-nav');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  // console.log(Object.fromEntries(formData));
  const resp = await fetch(`${URL}/login`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  const respInJs = await resp.json();
  if (respInJs.msg === 'user found') {
    localStorage.setItem('loggedInUserToken', respInJs.token);
    localStorage.setItem('loggedInUserEmail', respInJs.foundUser);
    showUserInNavbar();
    showPostsInNavbar();
  }
  console.log('got back', respInJs);
});

// console.log(localStorage.getItem('loggedInUserEmail'));

function loggedIn() {
  if (localStorage.getItem('loggedInUserEmail')) {
    showUserInNavbar();
    showPostsInNavbar();
  }
}
loggedIn();

function showUserInNavbar() {
  navbar.innerHTML += `<a class="nav-link" disabled href="#">User: ${localStorage.getItem(
    'loggedInUserEmail',
  )}</a>`;
}
function showPostsInNavbar() {
  navbar.innerHTML += '<a class="nav-link" href="/public/">Posts</a>';
}
