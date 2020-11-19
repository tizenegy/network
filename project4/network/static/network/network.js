document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#success-top').style.display = 'none';
    document.querySelector('#all-posts-button').addEventListener('click', ()=> {
        console.log("clicked");
    });
    document.querySelector('#compose-form').addEventListener('submit', (event) => {
        event.preventDefault();
        send_post();
      });
});

async function send_post(){
    const response = await fetch('/posts', {
    method: 'POST',
    body: JSON.stringify({
        content: document.querySelector('#compose-body').value
    })
    });
    const json = await response.json();
    console.log(response.status);
    document.querySelector('#compose-body').value = "";
    document.querySelector('#success-top').style.display = 'block';
    setTimeout(() => document.querySelector('#success-top').style.display = 'none', 3000);
}
