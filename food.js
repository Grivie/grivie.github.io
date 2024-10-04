
function openPopup() {
    document.getElementById("popupcabang").style.display = "block";
}
function closePopup() {
    document.getElementById("popupcabang").style.display = "none";
}
function openPopup2() {
    document.getElementById("popupcabang2").style.display = "block";
}
function closePopup2() {
    document.getElementById("popupcabang2").style.display = "none";
}
document.getElementById("profile-item").onclick = function () {
    const profileFullscreen = document.getElementById("profile-fullscreen");
    profileFullscreen.style.display = profileFullscreen.style.display === "none" || profileFullscreen.style.display === "" ? "block" : "none";
};
function closeProfile() {
    document.getElementById("profile-fullscreen").style.display = "none";
}
function showPromoBox() {
    const promoBox = document.getElementById("promoBox");
    promoBox.style.display = promoBox.style.display === "none" || promoBox.style.display === "" ? "block" : "none";
}
