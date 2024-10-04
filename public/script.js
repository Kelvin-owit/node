document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".edit-post").forEach(button => {
      button.addEventListener("click", () => {
        const postId = button.getAttribute("data-id");
        const title = prompt("Enter new title:");
        const content = prompt("Enter new content:");
        if (title && content) {
          fetch(`/post/${postId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
          })
          .then(response => response.text())
          .then(data => {
            alert(data);
            location.reload();
          })
          .catch(error => console.error('Error:', error));
        }
      });
    });
  
    document.querySelectorAll(".patch-post").forEach(button => {
      button.addEventListener("click", () => {
        const postId = button.getAttribute("data-id");
        const updates = {};
        const title = prompt("Enter new title (leave blank to keep current):");
        const content = prompt("Enter new content (leave blank to keep current):");
        if (title) updates.title = title;
        if (content) updates.content = content;
        if (Object.keys(updates).length > 0) {
          fetch(`/post/${postId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
          })
          .then(response => response.text())
          .then(data => {
            alert(data);
            location.reload();
          })
          .catch(error => console.error('Error:', error));
        }
      });
    });
  
    document.querySelectorAll(".delete-post").forEach(button => {
      button.addEventListener("click", () => {
        const postId = button.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this post?")) {
          fetch(`/post/${postId}`, {
            method: 'DELETE'
          })
          .then(response => response.text())
          .then(data => {
            alert(data);
            location.reload();
          })
          .catch(error => console.error('Error:', error));
        }
      });
    });
  });