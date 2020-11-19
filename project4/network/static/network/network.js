document.addEventListener('DOMContentLoaded', function() {
    // default visibility
    document.querySelector('#success-top').style.display = 'none';
    document.querySelector('#new-post-form').style.display = 'none';
    document.querySelector('#all-posts-feed').style.display = 'block';

    // buttons
    document.querySelector('#all-posts-button').addEventListener('click', ()=> {
        document.querySelector('#all-posts-feed').style.display = 'block';
    });
    document.querySelector('#new-post-button').addEventListener('click', ()=> {
        form = document.querySelector('#new-post-form');
        form.style.display === 'block' ? form.style.display = 'none' : form.style.display = 'block';
    });
    document.querySelector('#compose-form').addEventListener('submit', (event) => {
        event.preventDefault();
        send_post();
        document.querySelector('#new-post-form').style.display = 'none';
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
