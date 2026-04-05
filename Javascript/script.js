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
        card.ondragstart = () => false;

        card.addEventListener('pointerdown', (e) => {
            if (card.parentElement.classList.contains('folder-inner')) return;

            card.setPointerCapture(e.pointerId); 
            activeCard = card;

            cardStartX = e.clientX;
            cardStartY = e.clientY;
            cardInitialLeft = card.offsetLeft;
            cardInitialTop = card.offsetTop;

            card.style.transition = 'none';
            card.style.zIndex = '1000';
            card.style.cursor = 'grabbing';
        });
    });

    // Enable dropping for folders
    document.querySelectorAll('.folder').forEach(folder => {
        folder.addEventListener('click', () => {
            const iconsInFolder = folder.querySelectorAll('.file-card').length;
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

            if (vanessa) vanessa.style.display = 'none';
            if (kelsey) kelsey.style.display = 'none';
            if (anna) anna.style.display = 'none';
        });
    });
}


const draggables = document.querySelectorAll('.draggable-work');

// 1. Initial settings: tracking target and starting coordinates
let currentTarget = null; 
let activeCard = null; 

let startX = 0, startY = 0;
let cardStartX = 0, cardStartY = 0;
let cardInitialLeft = 0, cardInitialTop = 0;

// 2. Drag Start
document.querySelectorAll('.draggable-work').forEach(work => {
    work.ondragstart = () => false;

    work.addEventListener('pointerdown', (e) => {
        work.setPointerCapture(e.pointerId);

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

// 3. Dragging 
document.addEventListener('pointermove', (e) => {
    if (!currentTarget && !activeCard) return;

    requestAnimationFrame(() => {
       if (currentTarget) {
            const x = e.clientX - startX;
            const y = e.clientY - startY;
            currentTarget.style.transform = `translate(${x}px, ${y}px)`;
        }
        if (activeCard) {
            const dx = e.clientX - cardStartX; 
            const dy = e.clientY - cardStartY;
            activeCard.style.left = `${cardInitialLeft + dx}px`;
            activeCard.style.top = `${cardInitialTop + dy}px`;
        }
    });
});

// 4. Drag End
document.addEventListener('pointerup', (e) => {
    if (activeCard) {
        const card = activeCard; 
        activeCard = null;  

        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const folder = elements.find(el => el.classList.contains('folder'));

        if (folder) {
            checkMatchAndDrop(card, folder);
        }else {
            card.style.zIndex = "5";
            card.style.cursor = 'grab';
        }
    }

    if (currentTarget) {
        const target = currentTarget;
        currentTarget = null;

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
    }
});

// 5. 폴더 매칭 함수 (모바일용 필수 로직)
function checkMatchAndDrop(card, folder) {
    const iconId = card.querySelector('img').id;
    const folderId = folder.id;
    const correctMatches = {
        'icon-blood': 'folder-vanessa', 'icon-belt': 'folder-vanessa', 'icon-porcupine': 'folder-vanessa',
        'icon-skull': 'folder-kelsey', 'icon-shovel': 'folder-kelsey',
        'icon-nowater': 'folder-anna', 'icon-nopower': 'folder-anna', 'icon-camera': 'folder-anna'
    };

    if (correctMatches[iconId] === folderId) {
        const innerBasket = folder.querySelector('.folder-inner');
        innerBasket.appendChild(card);

        card.style.setProperty('position', 'relative', 'important');
        card.style.left = 'auto';
        card.style.top = 'auto';
        
        card.style.transform = "scale(0.6)";
        card.style.cursor = "default";
        card.style.background = "transparent";
        card.style.boxShadow = "none";
        
        const iconsInFolder = innerBasket.querySelectorAll('.file-card').length;
        const targets = { 'folder-vanessa': 3, 'folder-kelsey': 2, 'folder-anna': 3 };
        if (iconsInFolder === targets[folderId]) {
            setTimeout(() => openModal(folderId), 500);
        }
    } else {
        folder.classList.add('shake');
        setTimeout(() => folder.classList.remove('shake'), 500);
    }
}