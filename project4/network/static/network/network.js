document.addEventListener('DOMContentLoaded', function() {
    // default visibility
    document.querySelector('#loader').style.display = 'block';
    document.querySelector('#all-posts-feed').style.display = 'block';
    window.onload = () => {
        if (window.innerHeight > window.innerWidth) {
            document.querySelector('#new-post-button').style.display = 'block';
            document.querySelector('#new-post-button-big').style.display = 'none';
        } else {
            document.querySelector('#new-post-button').style.display = 'none';
            document.querySelector('#new-post-button-big').style.display = 'block';
        }
    }

    // load content
    get_posts();
    
    // buttons
    document.querySelector('#all-posts-button').addEventListener('click', ()=> {
        document.querySelector('#loader').style.display = 'block';
        get_posts();
        document.querySelector('#all-posts-feed').style.display = 'block';
        document.querySelector('#loader').style.display = 'none';
    });
    document.querySelector('#compose-form').addEventListener('submit', (event) => {
        event.preventDefault();
        document.querySelector('#loader').style.display = 'block';
        send_post();
        cancel_button = document.querySelector('#cancel-new-post-modal');
        cancel_button.click();
        // document.querySelector('#new-post-form').style.display = 'none';
      });
});

window.onresize = () => {
    if (window.innerHeight > window.innerWidth) {
        document.querySelector('#new-post-button').style.display = 'block';
        document.querySelector('#new-post-button-big').style.display = 'none';
    } else {
        document.querySelector('#new-post-button').style.display = 'none';
        document.querySelector('#new-post-button-big').style.display = 'block';
    }
}

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
    document.querySelector('#loader').style.display = 'block';
    setTimeout(() =>  get_posts(), 3000);
    setTimeout(() =>  document.querySelector('#loader').style.display = 'none', 3000);
}

function get_posts(){
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
                // prepare card
                const wrapper = document.createElement('div');
                const card = document.createElement('div');
                const card_body = document.createElement('div');
                // wrapper.className = "col-xs-12 col-sm-8 col-md-8 col-lg-8";
                card.className = 'card mb-3';
                card_body.className = 'card-body';
                card.appendChild(card_body);
                wrapper.appendChild(card);
                // fill card with content
                const header = document.createElement('div');
                const content = document.createElement('div');
                const likes = document.createElement('div');
                const footer = document.createElement('div');
                header.className = 'card-header';
                content.className = 'card-text';
                likes.className = 'card-text';
                footer.className = 'card-footer';
                header.innerHTML = `${post.op}`;
                content.innerHTML = `${post.content}`;
                likes.innerHTML = `${post.likes} likes`;
                footer.innerHTML = `${post.created}`;
                likes.style.textAlign = "right";
                card.prepend(header);
                card_body.appendChild(content);
                card_body.appendChild(likes);
                card.appendChild(footer);

                document.querySelector('#all-posts-feed-inner').append(wrapper);
                document.querySelector('#loader').style.display = 'none';
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