document.addEventListener('DOMContentLoaded', function() {
    console.log("dom loaded");
    // default visibility
    document.querySelector('#user-page-elements').style.display = 'none';
    document.querySelector('#loader').style.display = 'block';
    document.querySelector('#all-posts-feed').style.display = 'block';
    document.querySelector('#new-post-button-big').style.display = 'block';
    document.querySelector('#new-post-button').style.display = 'block';
    window.onload = () => {
        if (window.innerHeight > window.innerWidth) {
            document.querySelector('#new-post-button').style.display = 'block';
            document.querySelector('#new-post-button-big').style.display = 'none';
        } else {
            document.querySelector('#new-post-button').style.display = 'none';
            document.querySelector('#new-post-button-big').style.display = 'block';
        }
    }
    console.log("visibility done");

    // load content
    get_posts("all");
    console.log("getting posts done");
    
    // buttons and links
    document.querySelector('#all-posts-button').addEventListener('click', ()=> {
        document.querySelector('#user-page-elements').style.display = 'none';
        document.querySelector("#feed-banner").innerHTML = 'All posts';
        document.querySelector('#loader').style.display = 'block';
        document.querySelector('#new-post-button-big').style.display = 'block';
        document.querySelector('#new-post-button').style.display = 'block';
        get_posts("all");
        document.querySelector('#all-posts-feed').style.display = 'block';
        document.querySelector('#loader').style.display = 'none';
    });
    document.querySelector('#user-page-button').addEventListener('click', ()=> {
        // current_username = "bastian";
        current_username = document.getElementById('current_username').value;
        show_userpage(current_username);
        console.log(`opening user page for ${current_username}`);
    });
    document.querySelector('#compose-form').addEventListener('submit', (event) => {
        event.preventDefault();
        document.querySelector('#loader').style.display = 'block';
        send_post();
        cancel_button = document.querySelector('#cancel-new-post-modal');
        cancel_button.click();
        setTimeout(() =>  get_posts("all"), 3000);
        setTimeout(() =>  document.querySelector('#loader').style.display = 'none', 3000);
      });

      document.addEventListener('click', event => {
        const element = event.target;
        if (element.className == 'card-header'){
            show_userpage(element.dataset.op);
            console.log(`opening user page for ${element.dataset.op}`);
        }
      });

      console.log("event listeners done");
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
}

function get_posts(feed_filter){
    document.querySelector('#all-posts-feed-inner').innerHTML = "";
    fetch(`/posts/${feed_filter}`)
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
                footer.innerHTML = `${post.created} <button class="hide">Hide</button>`;
                likes.style.textAlign = "right";
                header.setAttribute('data-op', `${post.op}`)
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

function get_user(username){
    fetch(`/users/${username}`)
    .then(response => response.json())
    .then(users => {
        console.log(users);
        if (isEmpty(users)){
            console.log("json does not contain user");
        } else {
            users.forEach(user => {
                document.querySelector('#user-page-item1').innerHTML = `${user.followers} followers`;
                document.querySelector('#user-page-item2').innerHTML = `${user.following} following`;
                document.querySelector('#user-page-item3').innerHTML = `follow`;
            })
        }
    })
}

function show_userpage(username){
    document.querySelector('#user-page-elements').style.display = 'block';
    document.querySelector("#feed-banner").innerHTML = `Posts by ${username}`;
    document.querySelector("#user-page-banner").innerHTML = `Networker: ${username}`;
    document.querySelector('#loader').style.display = 'block';
    document.querySelector('#new-post-button-big').style.display = 'none';
    document.querySelector('#new-post-button').style.display = 'none';
    document.querySelector('#user-page-elements').style.display = 'block';
    get_user(username);
    get_posts(username);
    document.querySelector('#all-posts-feed').style.display = 'block';
    document.querySelector('#loader').style.display = 'none';
    scroll(0,0);
}


// utility functions
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }