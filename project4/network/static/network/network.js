document.addEventListener('DOMContentLoaded', function() {
    console.log("dom loaded");
    // default visibility
    document.querySelector('#user-page-elements').style.display = 'none';
    document.querySelector('#loader').style.display = 'block';
    document.querySelector('#all-posts-feed').style.display = 'block';
    if (document.querySelector('#current_username').value !== ""){
        document.querySelector('#new-post-button-big').style.display = 'block';
        document.querySelector('#new-post-button').style.display = 'block';
    }
    window.onload = () => {
        if (document.querySelector('#current_username').value !== ""){
            if (window.innerHeight > window.innerWidth) {
                document.querySelector('#new-post-button').style.display = 'block';
                document.querySelector('#new-post-button-big').style.display = 'none';
            } else {
                document.querySelector('#new-post-button').style.display = 'none';
                document.querySelector('#new-post-button-big').style.display = 'block';
            }
        }
    }
    console.log("visibility done");

    // load content
    get_posts("all", 1);

    // set local storage
    localStorage.setItem('pagename', 'home');
    localStorage.setItem('username', document.querySelector('#current_username').value);
    localStorage.setItem('target_username', '');
    localStorage.setItem('posts_per_page', 10);
    console.log(localStorage.getItem('posts_per_page'));
    console.log("getting posts done");
    
    // buttons and links
    document.querySelector('#all-posts-button').addEventListener('click', ()=> {
        show_homepage();
    });
    document.querySelector('#home-page-button').addEventListener('click', ()=> {
        show_homepage();
    });
    if (document.querySelector('#current_username').value !== ""){
        document.querySelector('#user-dashboard-button').addEventListener('click', ()=> {
            from_username = localStorage.getItem('username');
            to_username = localStorage.getItem('target_username');
            console.log(`${from_username} wants to follow ${to_username}`);
            toggle_follow(from_username, to_username);
            setTimeout(() =>  get_user(to_username), 2000);
        });
        document.querySelector('#user-page-button').addEventListener('click', ()=> {
            show_userpage(localStorage.getItem('username'));
        });
        document.querySelector('#following-page-button').addEventListener('click', ()=> {
            show_following_feed();
        });
        document.querySelector('#compose-form').addEventListener('submit', (event) => {
            event.preventDefault();
            document.querySelector('#loader').style.display = 'block';
            send_post();
            cancel_button = document.querySelector('#cancel-new-post-modal');
            cancel_button.click();
            setTimeout(() =>  get_posts("all", 1), 3000);
            setTimeout(() =>  document.querySelector('#loader').style.display = 'none', 3000);
        });
    }

      document.addEventListener('click', event => {
        const element = event.target;
        if (element.className == 'card-header'){
            show_userpage(element.dataset.op);
            console.log(`opening user page for ${element.dataset.op}`);
            localStorage.setItem('target_username', element.dataset.op)
        }
      });

      console.log("event listeners done");
});
// toggle floating button
window.onresize = () => {
    if (window.innerHeight > window.innerWidth) {
        document.querySelector('#new-post-button').style.display = 'block';
        document.querySelector('#new-post-button-big').style.display = 'none';
    } else {
        document.querySelector('#new-post-button').style.display = 'none';
        document.querySelector('#new-post-button-big').style.display = 'block';
    }
}

// functionality
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

function get_posts(feed_filter, page_number){
    document.querySelector('#all-posts-feed-inner').innerHTML = "";
    if (feed_filter === "userfeed"){
        feed_filter = `${feed_filter}-${localStorage.getItem("username")}`;
    }
    console.log(feed_filter);
    ppp = localStorage.getItem('posts_per_page');
    fetch(`/posts/${feed_filter}?page=${page_number}&ppp=${ppp}`)
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
            })
        }
    })
}

function toggle_follow(from_username, to_username){
    fetch(`/follow`, {
        method: 'POST',
        body: `from_user=${from_username}&to_user=${to_username}`,
        headers: {'Content-type': 'application/x-www-form-urlencoded'}
    })
    .then(response => response.json())
    .then (rsp => {
        console.log(`server: ${rsp.message}`);
        if (rsp.message == "Unfollow successful."){
            document.querySelector('#user-page-item3').innerHTML = `Follow`;
        } else if (rsp.message == "Follow successful.") {
            document.querySelector('#user-page-item3').innerHTML = `Unfollow`;
        } else {
            document.querySelector('#user-page-item3').innerHTML = ``;
        }
    })
    };

function get_follow_status(from_username, to_username){
    fetch(`/follow/${from_username}/${to_username}`)
    .then(response => response.json())
    .then (rsp => {
        console.log(`server: ${rsp.message}`);
        if (rsp.message == "not following"){
            document.querySelector('#user-page-item3').innerHTML = `Follow`;
        } else if (rsp.message == "following") {
            document.querySelector('#user-page-item3').innerHTML = `Unfollow`;
        } else {
            document.querySelector('#user-page-item3').innerHTML = `Error`;
        }
    })
    };


// pages
function show_homepage(){
    document.querySelector('#user-page-elements').style.display = 'none';
    document.querySelector("#feed-banner").innerHTML = 'All posts';
    document.querySelector('#loader').style.display = 'block';
    if (document.querySelector('#current_username').value !== ""){
    document.querySelector('#new-post-button-big').style.display = 'block';
    document.querySelector('#new-post-button').style.display = 'block';
    }
    get_posts("all", 2);
    localStorage.setItem('pagename','home');
    localStorage.setItem('target_username','');
    document.querySelector('#all-posts-feed').style.display = 'block';
    document.querySelector('#loader').style.display = 'none';
    console.log(localStorage);
}

function show_userpage(target_username){
    document.querySelector('#user-page-elements').style.display = 'block';
    document.querySelector("#feed-banner").innerHTML = `Posts by ${target_username}`;
    document.querySelector("#user-page-banner").innerHTML = `Networker: ${target_username}`;
    document.querySelector('#loader').style.display = 'block';
    document.querySelector('#user-page-elements').style.display = 'block';
    username = localStorage.getItem('username')
    console.log(`current: ${username} viewing: ${target_username}`);
    if (document.querySelector('#current_username').value !== ""){
        document.querySelector('#new-post-button-big').style.display = 'none';
        document.querySelector('#new-post-button').style.display = 'none';
        if (target_username === username) {
            document.querySelector('#user-dashboard-button').style.display = 'none';
        }else{
            document.querySelector('#user-dashboard-button').style.display = 'block';
        }
        get_follow_status(username, target_username); 
    }
    get_user(target_username);
    get_posts(target_username, 1);
    document.querySelector('#all-posts-feed').style.display = 'block';
    document.querySelector('#loader').style.display = 'none';
    scroll(0,0);
    localStorage.setItem('pagename','user');
    localStorage.setItem('target_username',target_username);
    console.log(localStorage);
}

function show_following_feed(){
    document.querySelector('#user-page-elements').style.display = 'none';
    document.querySelector("#feed-banner").innerHTML = `Users you follow`;
    document.querySelector("#user-page-banner").style.display = 'none';
    document.querySelector('#loader').style.display = 'block';
    username = localStorage.getItem('username')
    if (document.querySelector('#current_username').value !== ""){
        document.querySelector('#new-post-button-big').style.display = 'block';
        document.querySelector('#new-post-button').style.display = 'block';
    }
    get_posts("userfeed", 1);
    document.querySelector('#all-posts-feed').style.display = 'block';
    document.querySelector('#loader').style.display = 'none';
    scroll(0,0);
    localStorage.setItem('pagename','following');
    console.log(localStorage);
}


// utility functions
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }