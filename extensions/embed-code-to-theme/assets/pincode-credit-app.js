"use strit";
let selector = {
    cartForm: `[action="/cart"]`
}
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
const userid = params.userid;
const utm_source = (params.utm_source).toUpperCase();
alert(userid + '<<>>' + utm_source);
(utm_source === 'PINCODE_CREDITS') && sessionStorage.setItem("pindoceCreditsUserId", userid);
let pindoceCreditsUserId = sessionStorage.getItem("pindoceCreditsUserId") || null;
if (pindoceCreditsUserId != null) {
    let interval = setInterval(function () {
        if (document.querySelectorAll(selector.cartForm).length) {
            document.querySelectorAll(selector.cartForm).forEach(cartForm => {
                (cartForm.querySelector('[sgpc_user]')) && cartForm.querySelector('[sgpc_user]').remove();
                cartForm.appendChild(`<input type="hidden" name="attributes[pindoceCreditsUserId]" value="${userid}" sgpc_user>`);
            });
            clearInterval(interval);
        }
    }, 100);
}