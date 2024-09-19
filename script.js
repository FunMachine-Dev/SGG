document.addEventListener('DOMContentLoaded', function () {
    var path = window.location.pathname;
    //IF en index
    /*btn mostrar contraseña*/
    if (path.includes('index.html')) {
        var toggleButton = document.getElementById('togglePassword');
        if (toggleButton) {
            toggleButton.addEventListener('click', function () {
                var passwordInput = document.getElementById('pass');
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    toggleButton.textContent = 'Ocultar';
                } else {
                    passwordInput.type = 'password';
                    toggleButton.textContent = 'Mostrar';
                }
            });
        }
    }

    //IF en reembolso
    /*btn agregar gasto*/
    if (path.includes('reembolso.html')) {
        var btn_ingresar = document.getElementById('btn_ingresar');
        var container = document.getElementById('container');
        if (btn_ingresar && container) {
            let rowCounter = 0; // Contador para hacer únicos los name

            btn_ingresar.addEventListener('click', function () {
                // Incrementa el contador por cada fila nueva
                rowCounter++;

                // Obtiene los valores
                var fecha = document.getElementById('fecha').value;
                var numBoleta = document.getElementById('num_boleta').value;
                var descripcion = document.getElementById('descripcion').value;
                var monto = document.getElementById('monto').value;

                // Crear una nueva fila
                var row = document.createElement('div');
                row.className = 'row';

                // Crear el botón de eliminar
                var deleteButton = document.createElement('div');
                deleteButton.className = 'btn-delete';
                deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ff2825" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M4 7l16 0" />
            <path d="M10 11l0 6" />
            <path d="M14 11l0 6" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
            </svg>`;
                deleteButton.addEventListener('click', function () {
                    row.remove();
                    updateTotal(); // Actualiza el total después de eliminar la fila
                });

                // Insertar el botón de eliminar antes del primer campo de texto
                row.appendChild(deleteButton);

                // Crear 4 columnas, cada una con un campo de texto
                var values = [fecha, numBoleta, descripcion, monto];
                var names = [`fecha_${rowCounter}`, `num_boleta_${rowCounter}`, `descripcion_${rowCounter}`, `monto_${rowCounter}`]; // Nombres únicos

                for (var i = 0; i < values.length; i++) {
                    var col = document.createElement('div');
                    col.className = 'col';

                    var input = document.createElement('input');
                    input.className = 'input form-control agregar';
                    input.name = names[i]; // Asignar name único

                    // Establecer el tipo de entrada según la posición en el array
                    if (i === 0) {
                        input.type = 'date'; // Primer campo como tipo date
                    } else if (i === values.length - 1) {
                        input.type = 'number'; // Último campo como tipo number para monto
                        input.addEventListener('input', updateTotal); // Agregar evento input para actualizar total
                    } else {
                        input.type = 'text'; // Campos intermedios como tipo text
                    }

                    // Formatear monto con separadores de miles
                    if (i === values.length - 1) {
                        input.value = formatNumber(values[i]);
                    } else {
                        input.value = values[i];
                    }

                    col.appendChild(input);
                    row.appendChild(col);
                }

                // Agregar la fila al contenedor
                container.appendChild(row);

                // Borrar los datos de origen
                document.getElementById('fecha').value = '';
                document.getElementById('num_boleta').value = '';
                document.getElementById('descripcion').value = '';
                document.getElementById('monto').value = '';

                // Actualizar total
                updateTotal();
            });

            function formatNumber(value) {
                // Remover cualquier carácter no numérico y agregar separadores de miles
                return value.replace(/\D/g, '') // Elimina caracteres no numéricos
                    .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Agrega separadores de miles
            }

            function updateTotal() {
                var total = 0;
                var inputs = container.querySelectorAll('input[type="number"]');

                inputs.forEach(function (input) {
                    // Remover el formato de separadores de miles antes de sumar
                    var value = input.value.replace(/\./g, '');
                    total += parseInt(value, 10) || 0;
                });

                document.getElementById('total').value = formatNumber(total.toString());
            }
        }

        //botón finalizar
        if (submitBtn) {
            document.getElementById('submitBtn').addEventListener('click', function (event) {
                event.preventDefault(); // Evita acciones predeterminadas para pruebas

                // Obtén todas las filas dinámicas
                var rows = document.querySelectorAll('#container .row');
                var modalBody = document.querySelector('.modal-body');

                // Limpia el contenido del modal
                modalBody.innerHTML = '';

                // Recorre cada fila y extrae la información de los inputs
                rows.forEach(function (row, index) {
                    // Omitir la primera fila (índice 0)
                    if (index > 0) {
                        var inputs = row.querySelectorAll('input');
                        if (inputs.length > 0) {
                            var fecha = inputs[0].value;
                            var numBoleta = inputs[1].value;
                            var descripcion = inputs[2].value;
                            var monto = inputs[3].value;

                            // Agrega la información de la fila al modal
                            var rowInfo = `
                                    <p><strong>Gasto ${index}:</strong></p>
                                    <ul>
                                        <li>Fecha: ${fecha}</li>
                                        <li>N° Bol/Fact: ${numBoleta}</li>
                                        <li>Descripción: ${descripcion}</li>
                                        <li>Monto: $${monto}</li>
                                    </ul>
                                `;
                            modalBody.innerHTML += rowInfo;
                        }
                    }
                });

                // Obtén el valor del campo 'total'
                updateTotal();
                var total = document.getElementById('total').value;

                // Agrega el total al final del contenido del modal
                var totalInfo = `
                        <div class="mt-3">
                            <strong>Total reembolso solicitado:</strong> $${formatNumber(total)}
                        </div>
                    `;
                modalBody.innerHTML += totalInfo;

                // Función para formatear el número con separadores de miles
                function formatNumber(value) {
                    return + value.replace(/\D/g, '') // Elimina caracteres no numéricos
                        .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Agrega separadores de miles
                }
            });
        }
    }

    //IF en rendición
    /*btn agregar gasto*/
    if (path.includes('rendicion.html')) {
        var btn_ingresar = document.getElementById('btn_ingresar');
        var container = document.getElementById('container');
        if (btn_ingresar && container) {
            let rowCounter = 0; // Contador para hacer únicos los name

            btn_ingresar.addEventListener('click', function () {
                // Incrementa el contador por cada fila nueva
                rowCounter++;

                // Obtiene los valores
                var fecha = document.getElementById('fecha').value;
                var numBoleta = document.getElementById('num_boleta').value;
                var descripcion = document.getElementById('descripcion').value;
                var monto = document.getElementById('monto').value;

                // Crear una nueva fila
                var row = document.createElement('div');
                row.className = 'row';

                // Crear el botón de eliminar
                var deleteButton = document.createElement('div');
                deleteButton.className = 'btn-delete';
                deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ff2825" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M4 7l16 0" />
            <path d="M10 11l0 6" />
            <path d="M14 11l0 6" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
            </svg>`;
                deleteButton.addEventListener('click', function () {
                    row.remove();
                    updateTotal();
                    updateDiferencia(); // Actualiza los totales después de eliminar la fila
                });

                // Insertar el botón de eliminar antes del primer campo de texto
                row.appendChild(deleteButton);

                // Crear 4 columnas, cada una con un campo de texto
                var values = [fecha, numBoleta, descripcion, monto];
                var names = [`fecha_${rowCounter}`, `num_boleta_${rowCounter}`, `descripcion_${rowCounter}`, `monto_${rowCounter}`]; // Nombres únicos

                for (var i = 0; i < values.length; i++) {
                    var col = document.createElement('div');
                    col.className = 'col';

                    var input = document.createElement('input');
                    input.className = 'input form-control agregar';
                    input.name = names[i]; // Asignar name único

                    // Establecer el tipo de entrada según la posición en el array
                    if (i === 0) {
                        input.type = 'date'; // Primer campo como tipo date
                    } else if (i === values.length - 1) {
                        input.type = 'number'; // Último campo como tipo number para monto
                        input.addEventListener('input', function () {
                            updateTotal();
                            updateDiferencia();
                        }); // Agregar evento input para actualizar total
                    } else {
                        input.type = 'text'; // Campos intermedios como tipo text
                    }

                    // Formatear monto con separadores de miles
                    if (i === values.length - 1) {
                        input.value = formatNumber(values[i]);
                    } else {
                        input.value = values[i];
                    }

                    col.appendChild(input);
                    row.appendChild(col);
                }

                // Agregar la fila al contenedor
                container.appendChild(row);

                // Borrar los datos de origen
                document.getElementById('fecha').value = '';
                document.getElementById('num_boleta').value = '';
                document.getElementById('descripcion').value = '';
                document.getElementById('monto').value = '';

                // Actualizar total
                updateTotal();
                updateDiferencia();
            });

            function formatNumber(value) {
                // Remover cualquier carácter no numérico y agregar separadores de miles
                return value.replace(/\D/g, '') // Elimina caracteres no numéricos
                    .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Agrega separadores de miles
            }

            function updateDiferencia() {
                var solicitado = parseInt(document.getElementById('solicitado').value.replace(/\./g, ''), 10) || 0;
                var total = parseInt(document.getElementById('total').value.replace(/\./g, ''), 10) || 0;
                var diferencia = solicitado - total;  // Calcular la diferencia

                // Formatear la diferencia y agregar el signo negativo si corresponde
                if (diferencia < 0) {
                    document.getElementById('diferencia').value = '-' + formatNumber(Math.abs(diferencia).toString());
                } else if (diferencia === solicitado) {
                    document.getElementById('diferencia').value = '';  // Vaciar campo si la diferencia es cero
                } else {
                    document.getElementById('diferencia').value = formatNumber(diferencia.toString());
                }
            }


            function updateTotal() {
                var total = 0;
                var inputs = container.querySelectorAll('input[type="number"]');

                inputs.forEach(function (input) {
                    // Remover el formato de separadores de miles antes de sumar
                    var value = input.value.replace(/\./g, '');
                    total += parseInt(value, 10) || 0;
                });

                document.getElementById('total').value = formatNumber(total.toString());
            }
        }

        //botón finalizar
        if (submitBtn) {
            document.getElementById('submitBtn').addEventListener('click', function (event) {
                event.preventDefault(); // Evita acciones predeterminadas para pruebas

                // Obtén todas las filas dinámicas
                var rows = document.querySelectorAll('#container .row');
                var modalBody = document.querySelector('.modal-body');

                // Limpia el contenido del modal
                modalBody.innerHTML = '';

                var solicitado = document.getElementById('solicitado').value;
                var diferencia = document.getElementById('diferencia').value;

                // Recorre cada fila y extrae la información de los inputs
                rows.forEach(function (row, index) {
                    // Omitir la primera fila (índice 0)
                    if (index > 0) {
                        var inputs = row.querySelectorAll('input');

                        if (inputs.length > 0) {
                            var fecha = inputs[0].value;
                            var numBoleta = inputs[1].value;
                            var descripcion = inputs[2].value;
                            var monto = inputs[3].value;

                            // Agrega la información de la fila al modal
                            var rowInfo = `
                                    <p><strong>Gasto ${index}:</strong></p>
                                    <ul>
                                        <li>Fecha: ${fecha}</li>
                                        <li>N° Bol/Fact: ${numBoleta}</li>
                                        <li>Descripción: ${descripcion}</li>
                                        <li>Monto: $${monto}</li>

                                    </ul>
                                `;
                            modalBody.innerHTML += rowInfo;
                        }
                    }
                });

                // Obtén el valor del campo 'total'
                updateTotal();
                var total = document.getElementById('total').value;

                // Agrega el total al final del contenido del modal
                var totalInfo = `
                        <div class="mt-3">
                        <strong>Total rendición:</strong> $${formatNumber(total)}<br>
                        <strong>Monto solicitado:</strong> $${formatNumber(solicitado)}<br>
                        <strong>Diferencia:</strong> $${formatNumber(diferencia)}
                        </div>
                    `;
                modalBody.innerHTML += totalInfo;

                // Función para formatear el número con separadores de miles
                function formatNumber(value) {
                    return + value.replace(/\D/g, '') // Elimina caracteres no numéricos
                        .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Agrega separadores de miles
                }
            });
        }
    }

});