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

    const comeBackCash = (str) => {
        return Number(str.replace(/\./g, '').replace(/\,/g, ''));
    }

    // Validar datos genericos
    const validarData = data => {
        if(!isNaN(data) && data !== '' && data !== undefined && data !== null && data > 0)
        {
            return true;
        }

        return false;
    }

    // fadeOut effect for message and class error
    const fadeOutMessage = node => {
        setTimeout(() => {
            node.style.opacity = 0.5;
            setTimeout(() => {
                node.style.opacity = 0.2;
                setTimeout(() => {
                    node.removeAttribute('style');
                    node.innerHTML = '';
                    if(node.querySelector('#error')){
                        node.querySelector('#error').remove();
                    }
                }, 150);
            }, 150);
        }, 2700);
    }

    if(formulario) {
        formulario.onsubmit = e => {
            e.preventDefault();
            
            const salario = Number(comeBackCash(document.getElementById('salario').value.trim()));
            const cantHoras = Number(document.getElementById('cantHoras').value.trim());
            const cantDias = Number(document.getElementById('cantDias').value.trim());
            const vacaciones = Number(document.getElementById('vacaciones').value.trim());
            const feriados = Number(document.getElementById('feriados').value.trim());
            const gastosExtras = Number(comeBackCash(document.getElementById('gastosExtras').value.trim()));
            let beneficio = document.getElementById('beneficio').value.trim();
            let result = document.getElementById('result');
            let metodo = document.getElementById('metodo');
            let error = [];

            // ===========================================================
            // Validar datos de entrada 
            // ===========================================================    
            if(!validarData(salario)) {
                error.push('Error, ingrese ¿cuánto quiere ganar al mes?');
            }

            if(!validarData(cantHoras)) {
                error.push('Error, ingrese la cantidad de horas por día');
            }

            if(!validarData(cantDias)) {
                error.push('Error, ingrese la cantidad de días a la semana');
            }

            if(isNaN(vacaciones) || vacaciones < 0) {
                if(!validarData(vacaciones)) {
                    error.push('Error, ingrese valor válido en cantidad de días de vacaciones ');
                }
            }
            
            if(isNaN(feriados) || feriados < 0) {
                if(!validarData(feriados)) {
                    error.push('Error, ingrese valor válido en cantidad de feriados al año');
                }
            }            
                          
            if(isNaN(gastosExtras) || gastosExtras < 0) {
                if(!validarData(gastosExtras)) {
                    error.push('Error, ingrese valor válido de gastos extras');
                }
            }

            // Beneficio
            if(/\%/g.test(beneficio)) {
                beneficio = beneficio.replace(/\%/g, '');
            }

            if(isNaN(beneficio)) {
                error.push('Error, ingrese el porcentaje de beneficios como dato númerico o decimal(0.00)');
            }

            // ===========================================================
            // Calcular ¿Cuánto cobrar por hora?
            // ===========================================================

            // Sueldo bruto anual (salario * 12 meses)
            const sueldoAnual = salario * 12;

            // Calcular la cantidad de horas a trabajar anualmente (horas × días × 52 semanas)
            const totalHoras = cantHoras * cantDias * 52;

            // Valor base por hora
            const valorBaseHora = Math.ceil(sueldoAnual / totalHoras);

            // Valor de las horas libres
            const horasLibres = (vacaciones * cantHoras) + (feriados * cantHoras);
            const valorHorasLibres = horasLibres * valorBaseHora;

            // Gastos extras anual (gastos extras * 12 meses)
            const totalGastosExtras = gastosExtras * 12;

            // Beneficio anual.
            const beneficioAnual = (totalHoras - horasLibres) * valorBaseHora;

            // Valor extra anual
            const valorExtraAnual = valorHorasLibres + totalGastosExtras;

            // Porcentaje de Rentabilidad
            const rentabilidad = (valorExtraAnual / beneficioAnual).toFixed(3);
            
            // Porcentaje de Beneficio por trabajo
            const porcentajeBeneficio = (Number(beneficio) / 100).toFixed(2) || 0.0;

            // Total
            const valorPorHoraTrabajo = Math.ceil((valorBaseHora + (valorBaseHora * rentabilidad)) + (valorBaseHora * porcentajeBeneficio));

            if(error.length !== 0) {
                metodo.innerHTML = '';
                result.classList.remove('h3');
                result.innerHTML = '';

                error.map(data => {
                    result.innerHTML += `<div id="error" class="alert alert-dismissible alert-danger">
                        <p class="mb-0">${data}</p>
                    </div>`;
                    fadeOutMessage(result);
                });

                error = [];
            } else {
                let formula = `<strong>Sueldo bruto anual</strong>: (\$${cashFormat(salario)} * 12 meses) = \$${cashFormat(sueldoAnual)}<hr>`;
                formula += `<strong>Cantidad de horas a trabajar anualmente</strong>: (${cantHoras} * ${cantDias} * 52 semanas) = ${cashFormat(totalHoras)}hrs<hr>`;
                formula += `<strong>Valor base por hora</strong>: (\$${cashFormat(sueldoAnual)} / ${cashFormat(totalHoras)}) = \$${cashFormat(valorBaseHora)}<hr>`;
                formula += `<strong>Cantidad de las horas libres (Vacaciones y feriados)</strong>: (${vacaciones} * ${cantHoras}) + (${feriados} * ${cantHoras}) = ${cashFormat(horasLibres)}hrs<hr>`;
                formula += `<strong>Valor de las horas libres (Vacaciones y feriados)</strong>: (${cashFormat(horasLibres)}hrs * \$${cashFormat(valorBaseHora)}) = \$${cashFormat(valorHorasLibres)}<hr>`;
                formula += `<strong>Gastos extras anual</strong>: (\$${cashFormat(gastosExtras)} * 12 meses) = \$${cashFormat(totalGastosExtras)}<hr>`;
                formula += `<strong>Beneficio anual</strong>: (${cashFormat(totalHoras)}hrs - ${cashFormat(horasLibres)}hrs) * \$${cashFormat(valorBaseHora)} = \$${cashFormat(beneficioAnual)}<hr>`;
                formula += `<strong>Valor Extra Anual</strong>: \$${cashFormat(valorHorasLibres)} + \$${cashFormat(totalGastosExtras)} = \$${cashFormat(valorExtraAnual)}<hr>`;
                formula += `<strong>Porcentaje de Rentabilidad</strong>: (\$${cashFormat(valorExtraAnual)} / \$${cashFormat(beneficioAnual)}) = ${(rentabilidad*100).toFixed(3)}%<hr>`;
                formula += `<strong>Valor por hora de trabajo</strong>: (\$${cashFormat(valorBaseHora)} + (\$${cashFormat(valorBaseHora)} * ${(rentabilidad*100).toFixed(3)}%) + (\$${cashFormat(valorBaseHora)} * ${porcentajeBeneficio}%)) = \$${cashFormat(valorPorHoraTrabajo)}<hr>`;
    
                metodo.innerHTML = '<div class="mt-5 h2">Formula: </div><br>' + formula;
                result.innerHTML = `<div class="mb-5 h3">Valor por hora de trabajo: \$${cashFormat(valorPorHoraTrabajo)}</div>`;
                window.location.hash = '#result'; // <-- Focus
            }
        } 
    }
})();