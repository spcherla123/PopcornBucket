
    const initialCommunities =[
    {
        id: "Horror",
    title: "Horror Fans",
    posts: [
    {id: 1, author: "Horror Fan1", text: "I love horror movies"},
    {id: 2, author: "Horror Fan2", text: "Me too!"}
    ]
        },
    {
        id: "Action",
    title: "Action Fans",
    posts: [
    {id: 3, author: "Action Fan1", text: "Im a big fan of action movies"}
    ]
     },
    {
        id: "Mystery",
    title: "Mystery Fans",
    posts: [
    {id:4, author: "Mystery Fan1", text: "I like to watch mystery movies"}
    ]
     }
    ];

    let communities = JSON.parse(localStorage.getItem('Movie-Communities')) || initialCommunities;
    let activeGroupId = null;

    const groupListElement = document.getElementById('group-list');
    const currentGroupTitleElement = document.getElementById('current-group-title');
    const postFormContainer = document.getElementById('post-form-container');
    const postsFeedElement = document.getElementById('posts-feed');
    const postContentInput = document.getElementById('post-content');

    function renderSidebar() {
        groupListElement.innerHTML = '';
            communities.forEach(group => {
                const groupDiv = document.createElement('div');
    groupDiv.className = `group-item ${activeGroupId === group.id ? 'active' : ''}`;
    groupDiv.innerText = group.title;

                groupDiv.onclick = () => selectCommunity(group.id);
    groupListElement.appendChild(groupDiv);
            });
        }


    function selectCommunity(groupId) {
        activeGroupId = groupId;
            const group = communities.find(g => g.id === groupId);

    currentGroupTitleElement.innerText = group.title;
    postFormContainer.style.display = 'block';

    renderFeed(group.posts);
    renderSidebar();
        }

    function renderFeed(posts) {
        postsFeedElement.innerHTML = '';
    if (!posts || posts.length === 0) {
        postsFeedElement.innerHTML = '<p style="color: #666; italic">No posts here yet</p>';
    return;
            }

            posts.forEach(post => {
                const replies = post.replies || [];
                let repliesHTML = '';

                replies.forEach(reply => {
                    repliesHTML += `
                    <div class="reply-item">
                    <div class="reply-author">@${reply.author}</div>
                    <div class="reply-text">${reply.text}</div>
                    </div>
                    `;
                });


                const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.innerHTML = `
    <div class="post-header">
        <div class="post-author">@${post.author}</div>
        <button class="btn-delete" onclick="deletePost(${post.id})">Delete</button>
    </div>
    <div class="post-text">${post.text}</div>

    <div class="replies-section">
    ${repliesHTML}
    <div class="reply-input-container">
    <input type="text" id="reply-input-${post.id}" placeholder="Write a reply"/>
    <button class="btn-reply" onclick="addReply(${post.id})">Reply</button>
    </div>
    </div>
    `;
    postsFeedElement.appendChild(postDiv);
            });
        }

    function createNewPost() {
            const text = postContentInput.value.trim();
    if (!text || !activeGroupId) return;

            const group = communities.find(g => g.id === activeGroupId);

    group.posts.unshift({
        id: Date.now(),
    author: "Movie Buff 123 ",
    text: text,
    replies: []
            });

    localStorage.setItem('Movie-Communities', JSON.stringify(communities));

    postContentInput.value = '';
    renderFeed(group.posts);
        }

    function addReply(postId) {
        const replyInput = document.getElementById(`reply-input-${postId}`);
        const text = replyInput.value.trim();
        if (!text || !activeGroupId) return;

        const group = communities.find(g => g.id === activeGroupId);
        const post = group.posts.find(p => p.id === postId);

        if (!post.replies) post.replies = [];

        post.replies.push({
            id: Date.now(),
            author: "Reply Buff 123",
            text: text
        });

        localStorage.setItem('Movie-Communities', JSON.stringify(communities));
        renderFeed(group.posts);
    }

    function deletePost(postId) {
            if (!activeGroupId) return;

            const group = communities.find(g => g.id === activeGroupId);

            group.posts = group.posts.filter(post => post.id !== postId);

    localStorage.setItem('Movie-Communities', JSON.stringify(communities));
    renderFeed(group.posts);
        }

    renderSidebar();

