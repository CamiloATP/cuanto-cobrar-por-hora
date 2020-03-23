(function() {
    let formulario = document.getElementById('formulario');

    if(formulario) {
        formulario.onsubmit = e => {
            e.preventDefault();
        } 
    }
})();