// Javascript/script.js

/* Place icons randomly */
function scatterIcons() {
    const cards = document.querySelectorAll('.file-card');

    cards.forEach(card => {
        // 1. Generate a random X position 
        let x = Math.random() * 85 + 5; 
        // 2. If the icon falls in the folder zone (30%-70%), push it to the right
        if (x > 30 && x < 70) {
            x = (x < 50) ? x - 25 : x + 25; 
        }
        // 3. Generate a random Y position (10% to 85%)
        const y = Math.random() * 75 + 10;
        // Apply final positions in percentages
        card.style.left = `${x}%`;
        card.style.top = `${y}%`;
        // Add a random tilt for a more natural look
        const randomRotate = Math.floor(Math.random() * 40) - 20;
        card.style.transform = `rotate(${randomRotate}deg)`;
    });
}


/* Allow icons to be dropped */
function allowDrop(e) {e.preventDefault();}

function openModal(folderId) {
    const modal = document.querySelector('.modal-container');
    const vanessaContent = document.getElementById('content-vanessa');
    const kelseyContent = document.getElementById('content-kelsey');
    const annaContent = document.getElementById('content-anna');

    // Show the main modal background
    modal.style.display = 'flex';

    // Hide all contents first to prevent overlapping
    const contents = [vanessaContent, kelseyContent, annaContent];
    contents.forEach(content => {
        if (content) content.style.display = 'none';
    });

    // Show only the content matching the folderId
    if (folderId === 'folder-vanessa' && vanessaContent) vanessaContent.style.display = 'flex';
    else if (folderId === 'folder-kelsey' && kelseyContent) kelseyContent.style.display = 'flex';
    else if (folderId === 'folder-anna' && annaContent) annaContent.style.display = 'flex';
}

function handleDrop(e) {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("text");
    const card = document.getElementById(cardId);
    const iconId = card.querySelector('img').id;
    const folder = e.currentTarget; 
    const folderId = folder.id;

    // 1. Define Correct Matches
    const correctMatches = {
        'icon-blood': 'folder-vanessa',
        'icon-belt': 'folder-vanessa',
        'icon-porcupine': 'folder-vanessa',

        'icon-skull': 'folder-kelsey',
        'icon-shovel': 'folder-kelsey',

        'icon-nowater': 'folder-anna',
        'icon-nopower': 'folder-anna',
        'icon-camera': 'folder-anna'
    };

    // 2. Check if it's the right folder
    if (correctMatches[iconId] === folderId) {

        // Move icon INSIDE the folder
        const innerBasket = folder.querySelector('.folder-inner');
        innerBasket.appendChild(card);

        // Style the icon to fit inside the folder
        card.style.position = "static"; 
        card.style.width = "80px"; 
        card.style.height = "80px";
        card.style.transform = "scale(0.6)";
        card.style.boxShadow = "none";
        card.style.border = "none"; 
        card.style.cursor = "default";
        card.draggable = false; // Disable dragging once filed

        const iconsInFolder = innerBasket.querySelectorAll('img').length;
        const targets = { 'folder-vanessa': 3, 'folder-kelsey': 2, 'folder-anna': 3 };

        // [SUCCESS CASE] Trigger modal opening if target reached
        if (iconsInFolder === targets[folderId]) {
            setTimeout(() => {
                openModal(folderId);
            }, 500); 
        }
        console.log("Success: Icon filed in folder.");
        
    } else {
        // alert("This doesn't belong here.");
        folder.classList.add('shake');
        setTimeout(() => folder.classList.remove('shake'),500);
    }
}

window.onload = () => {
    document.querySelectorAll('.file-card').forEach(card => {
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData("text", e.target.id);
        });
    });

    // Enable dropping for folders
    document.querySelectorAll('.folder').forEach(folder => {
        folder.addEventListener('dragover', allowDrop); 
        folder.addEventListener('drop', handleDrop);
        folder.addEventListener('click', () => {
            const iconsInFolder = folder.querySelectorAll('img').length;
            const folderId = folder.id;
            const targets = { 'folder-vanessa': 3, 'folder-kelsey': 2, 'folder-anna': 3 };

            // Open modal only if the folder is fully filled
            if (iconsInFolder >= targets[folderId]) {
                openModal(folderId);
            }
        });
    });
    
    // Existing scatter function if you have one
    if (typeof scatterIcons === 'function') scatterIcons();

    // Close modal listener for all close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = document.querySelector('.modal-container');
            modal.style.display = 'none'; 
            
            // Hide all inner contents to reset state
            const vanessa = document.getElementById('content-vanessa');
            const kelsey = document.getElementById('content-kelsey');
            const anna = document.getElementById('content-anna');

            if (vanessaContent) vanessaContent.style.display = 'none';
            if (kelseyContent) kelseyContent.style.display = 'none';
            if (annaContent) annaContent.style.display = 'none';
        });
    });
}


const draggables = document.querySelectorAll('.draggable-work');

// 1. Initial settings: tracking target and starting coordinates
let currentTarget = null; 
let startX = 0, startY = 0;

// 2. Drag Start (mousedown)
document.querySelectorAll('.draggable-work').forEach(work => {
    work.addEventListener('mousedown', (e) => {
        currentTarget = work;
        startX = e.clientX;
        startY = e.clientY;
        work.style.transition = 'none'; 

        // Check if the work is inside an item-box to manage stacking context
        const parentBox = work.closest('.item-box');
        
        if (parentBox) {
            parentBox.style.zIndex = "200"
        }else {
            work.style.zIndex = 100;
        }   
        work.style.cursor = 'grabbing';
    });
});

// 3. Dragging (mousemove)
document.addEventListener('mousemove', (e) => {
    if (!currentTarget) return;

    // Calculate distance from the starting point
    const x = e.clientX - startX;
    const y = e.clientY - startY;
    
    // Use requestAnimationFrame for smoother performance
    requestAnimationFrame(() => {
        if (currentTarget) {
            currentTarget.style.transform = `translate(${x}px, ${y}px)`;
        }
    });
});

// 4. Drag End (mouseup)
document.addEventListener('mouseup', () => {
    if (!currentTarget) return;

    const target = currentTarget; 
    currentTarget = null;       

    // Re-enable smooth transition and move back to original position
    target.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    target.style.cursor = 'grab';

    target.style.transform = `translate(0px, 0px)`;
    
    // Reset z-index to hide behind the profile after the animation finishes
    setTimeout(() => {
        const parentBox = target.closest('.item-box');
        if (parentBox) {
            parentBox.style.zIndex = "15"; 
        } else {
            target.style.zIndex = "5";
        }
    }, 600);
});