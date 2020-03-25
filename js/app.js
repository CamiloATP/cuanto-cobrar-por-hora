(function() {
    let formulario = document.getElementById('formulario');

    if(formulario) {
        formulario.onsubmit = e => {
            e.preventDefault();
            
            let salario = Number(document.getElementById('salario').value);
            let cantHoras = Number(document.getElementById('cantHoras').value);
            let cantDias = Number(document.getElementById('cantDias').value);
            let vacaciones = Number(document.getElementById('vacaciones').value);
            let feriados = Number(document.getElementById('feriados').value);
            let gastosExtras = Number(document.getElementById('gastosExtras').value);
            let beneficio = parseFloat(document.getElementById('beneficio').value);

            // Sueldo bruto anual (salario * 12 meses)
            let sueldoAnual = salario * 12;

            console.log('Sueldo Anual:', sueldoAnual);

            // Calcular la cantidad de horas a trabajar anualmente
            // (horas × días × 52 semanas)
            let totalHoras = cantHoras * cantDias * 52;

            console.log('Total Horas:', totalHoras);

            // Valor base por hora
            let valorBaseHora = Math.ceil(sueldoAnual / totalHoras);

            console.log('Valor base hora:', valorBaseHora);

            // Valor de las horas libres
            let horasLibres = (vacaciones * cantHoras) + (feriados * cantHoras);
            
            console.log('Horas Libres:', horasLibres);

            let valorHorasLibres = horasLibres * valorBaseHora;
            
            console.log('Valor Horas Libres', valorHorasLibres);

            // Gastos extras anual (gastos extras * 12 meses)
            let totalGastosExtras = gastosExtras * 12;

            console.log('Total Gastos Extras', totalGastosExtras);

            // Beneficio anual.
            // totalHoras - horasLibres × valorBaseHora
            let beneficioAnual = (totalHoras - horasLibres) * valorBaseHora;

            console.log('Beneficio Anual', beneficioAnual);

            let valorExtraAnual = valorHorasLibres + totalGastosExtras;

            console.log('Valor Extra Anual', valorExtraAnual);

            // Porcentaje de Rentabilidad
            let rentabilidad = (valorExtraAnual / beneficioAnual).toFixed(4);

            console.log('Rentabilidad', rentabilidad);

            let valorPorHoraTrabajo = Math.ceil(valorBaseHora + (valorBaseHora * rentabilidad) + (valorBaseHora * beneficio));

            console.log('total', valorPorHoraTrabajo);

            alert(valorPorHoraTrabajo);
        } 
    }
})();