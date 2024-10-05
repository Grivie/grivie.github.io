<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grivie - Great Living Integration</title>
    <link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600&display=swap" rel="stylesheet">
</head>

<style>
    .item-row {
        background: white;
        border-radius: 10px;
        width: 200px;
        margin-right: 10px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        font-family: "Josefin Sans", sans-serif;
        text-decoration: none;
        transition: background-color 0.1s ease-in-out;
        scroll-snap-align: start;
        animation: slideIn 0.5s forwards;
    }
    
    .rating {
        display: flex;
        margin-top: -15px;
        margin-left: 70%;
    }
    
    .star {
        font-size: 10px;
        color: gold;
        margin-top: 5px;
    }
    
    .item-image {
        border-radius: 10px;
        width: 100%;
        height: auto;
        overflow: hidden;
        position: relative;
    }
    
    .item-details {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 5px;
        text-align: center;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .item-price {
        color: #cc0404;
        font-weight: bold;
        font-size: 12px !important;
        margin-left: 5px;
        flex-grow: 1;
    }
    
    .item-title {
        font-weight: bold;
        color: black;
        font-size: 12px;
        margin-left: 5px;
    }
</style>

<div class="carousel-container" style="margin-bottom: 120px">{produk_baru}</div>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        const itemRows = document.querySelectorAll(".item-row");
        itemRows.forEach((itemRow) => {
            const randomRating = Math.floor(Math.random() * 3) + 3;
            let stars = "";
            for (let j = 0; j < 5; j++) {
                stars += `<span class="star">${j < randomRating ? "★" : "☆"}</span>`;
            }
            const rating = document.createElement("div");
            rating.classList.add("rating");
            rating.innerHTML = stars;
            itemRow.appendChild(rating);
        });
    });
</script>
