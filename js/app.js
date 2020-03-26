(function() {
    let formulario = document.getElementById('formulario');

    /**
     * Number.prototype.cashFormat(n, x, s, c)
     * ---
     * @param integer data: <- amount
     * @param integer n: length of decimal
     * @param integer x: length of whole part
     * @param mixed s: sections delimiter
     * @param mixed c: decimal delimiter
     * @origen https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-string
     * @return String
     * */
    // Number.prototype.cashFormat = function(n = 0, x = 3, s = '.', c = ',') {
    const cashFormat = (data, n = 0, x = 3, s = '.', c = ',') => {
        const re = '\\d(?=(\\d{' + x + '})+' + (n > 0 ? '\\D' : '$') + ')', num = data.toFixed(Math.max(0, ~~n));
        return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
    };

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
            let result = document.getElementById('result');
            let metodo = document.getElementById('metodo');

            // Sueldo bruto anual (salario * 12 meses)
            let sueldoAnual = salario * 12;
            console.log('Sueldo Anual:', sueldoAnual);

            // Calcular la cantidad de horas a trabajar anualmente (horas × días × 52 semanas)
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
            let beneficioAnual = (totalHoras - horasLibres) * valorBaseHora;
            console.log('Beneficio Anual', beneficioAnual);

            let valorExtraAnual = valorHorasLibres + totalGastosExtras;
            console.log('Valor Extra Anual', valorExtraAnual);

            // Porcentaje de Rentabilidad
            let rentabilidad = (valorExtraAnual / beneficioAnual).toFixed(3);
            console.log('Rentabilidad', rentabilidad);

            // Total
            let valorPorHoraTrabajo = Math.ceil(valorBaseHora + (valorBaseHora * rentabilidad) + (valorBaseHora * beneficio));
            console.log('total', valorPorHoraTrabajo);

            // ===========================================================
            // Validar datos de entrada - enviar mensajes de errores
            // ===========================================================

            let formula = `<strong>Sueldo bruto anual</strong>: (\$${cashFormat(salario)} * 12 meses) = \$${cashFormat(sueldoAnual)}<hr>`;
            formula += `<strong>Cantidad de horas a trabajar anualmente</strong>: (${cantHoras} * ${cantDias} * 52 semanas) = ${cashFormat(totalHoras)}hrs<hr>`;
            formula += `<strong>Valor base por hora</strong>: (\$${cashFormat(sueldoAnual)} / ${cashFormat(totalHoras)}) = \$${cashFormat(valorBaseHora)}<hr>`;
            formula += `<strong>Cantidad de las horas libres (Vacaciones y feriados)</strong>: (${vacaciones} * ${cantHoras}) + (${feriados} * ${cantHoras}) = ${cashFormat(horasLibres)}hrs<hr>`;
            formula += `<strong>Valor de las horas libres (Vacaciones y feriados)</strong>: (${cashFormat(horasLibres)}hrs * \$${cashFormat(valorBaseHora)}) = \$${cashFormat(valorHorasLibres)}<hr>`;
            formula += `<strong>Gastos extras anual</strong>: (\$${cashFormat(gastosExtras)} * 12 meses) = \$${cashFormat(totalGastosExtras)}<hr>`;
            formula += `<strong>Beneficio anual</strong>: (${cashFormat(totalHoras)}hrs - ${cashFormat(horasLibres)}hrs) * \$${cashFormat(valorBaseHora)} = \$${cashFormat(beneficioAnual)}<hr>`;
            formula += `<strong>Valor Extra Anual</strong>: \$${cashFormat(valorHorasLibres)} + \$${cashFormat(totalGastosExtras)} = \$${cashFormat(valorExtraAnual)}<hr>`;
            formula += `<strong>Porcentaje de Rentabilidad</strong>: (\$${cashFormat(valorExtraAnual)} / \$${cashFormat(beneficioAnual)}) = ${(rentabilidad*100).toFixed(3)}%<hr>`;
            formula += `<strong>Valor por hora de trabajo</strong>: (\$${cashFormat(valorBaseHora)} + (\$${cashFormat(valorBaseHora)} * ${(rentabilidad*100).toFixed(3)}%) + (\$${cashFormat(valorBaseHora)} * ${beneficio}%)) = \$${cashFormat(valorPorHoraTrabajo)}<hr>`;

            metodo.innerHTML = '<div class="mt-5 h2">Formula: </div><br>' + formula;
            result.innerHTML = `<div class="mb-5 h3">Valor por hora de trabajo: \$${cashFormat(valorPorHoraTrabajo)}</div>`;
        } 
    }
})();