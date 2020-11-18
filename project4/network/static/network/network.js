document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#compose-form').addEventListener('submit', (event) => {
        event.preventDefault();
        send_post();
      });
});

async function send_post(){
    const response = await fetch('/posts', {
    method: 'POST',
    body: JSON.stringify({
        op: document.querySelector('#compose-op').value,
        content: document.querySelector('#compose-body').value
    })
    });
    const json = await response.json();
    console.log(json)
}
