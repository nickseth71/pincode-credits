"use strit";
console.log('Pincode Credits Loaded!');
let selector = {
    cartForm: `[action="/cart"]`
}

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});


const userid = params.userid;
const utm_source = (params.utm_source) || 'null';
console.log(userid, '<<>>', utm_source);
(utm_source.toUpperCase() === 'PINCODE_CREDITS') && sessionStorage.setItem("pindoceCreditsUserId", userid);
let pindoceCreditsUserId = sessionStorage.getItem("pindoceCreditsUserId") || null;
if (pindoceCreditsUserId != null) {
    let interval = setInterval(function () {
        if (document.querySelectorAll(selector.cartForm).length) {
            document.querySelectorAll(selector.cartForm).forEach(cartForm => {
                (cartForm.querySelector('[sgpc_user]')) && cartForm.querySelector('[sgpc_user]').remove();
                let input = document.createElement("INPUT");
                input.setAttribute("type", "hidden");
                input.setAttribute("name", "attributes[pindoceCreditsUserId]");
                input.setAttribute("value", userid);
                input.setAttribute("sgpc_user", "");
                cartForm.appendChild(input);
            });
            clearInterval(interval);
        }
    }, 100);
}