//
const URL = 'http://localhost:3000/auth';
const form = document.querySelector('.form-signin');

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
  console.log('got back', respInJs);
});
