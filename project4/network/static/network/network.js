document.addEventListener('DOMContentLoaded', function() {
    // default visibility
    document.querySelector('#success-top').style.display = 'none';
    document.querySelector('#new-post-form').style.display = 'none';
    document.querySelector('#all-posts-feed').style.display = 'block';

    // load content
    get_all_posts();

    // buttons
    document.querySelector('#all-posts-button').addEventListener('click', ()=> {
        get_all_posts();
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
    setTimeout(() =>  get_all_posts(), 3000);
    setTimeout(() => document.querySelector('#success-top').style.display = 'none', 3000);
}

function get_all_posts(){
    document.querySelector('#all-posts-feed-inner').innerHTML = "";
    fetch(`/posts/all`)
    .then(response => response.json())
    .then(posts => {
        console.log(posts);
        if (isEmpty(posts)){
            const element = document.createElement('div');
            element.className = 'card-body';
            element.innerHTML = `Wow, such empty.`;
            document.querySelector('#all-posts-feed-inner').append(element);
        } else {
            posts.forEach(post => {
                const wrapper = document.createElement('div');
                const card = document.createElement('div');
                const card_body = document.createElement('div');
                wrapper.className = "col-xs-12 col-sm-8 col-md-8 col-lg-8";
                card.className = 'card mb-3';
                card_body.className = 'card-body';
                card.appendChild(card_body);
                wrapper.appendChild(card);

                const element = document.createElement('div');
                element.className = 'card-text';
                element.innerHTML = `${post.content}`;
                card_body.appendChild(element);

                document.querySelector('#all-posts-feed-inner').append(wrapper);
            });
        }
    })
}



// utility functions
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }