const URL = 'http://localhost:3000/posts';
const token = localStorage.getItem('loggedInUserToken');
async function getPostsByToken() {
  const resp = await fetch(URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('data', await resp.json());
}

getPostsByToken();
