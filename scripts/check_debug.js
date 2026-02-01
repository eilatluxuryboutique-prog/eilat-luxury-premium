
fetch('https://eilat-luxury.vercel.app/api/debug')
    .then(res => res.text())
    .then(text => console.log(text))
    .catch(err => console.error(err));
