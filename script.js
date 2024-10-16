

document.addEventListener('DOMContentLoaded', function () {

    // Función para cargar scripts dinámicamente
    function loadScript(src, callback) {
        var script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        script.onerror = function () {
            console.error('Error al cargar el script: ' + src);
        };
        document.head.appendChild(script);
    }

    // Carga Popper.js, Bootstrap
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.7/umd/popper.min.js', function () {
        console.log('Popper.js cargado');

        loadScript('https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/js/bootstrap.bundle.min.js', function () {
            console.log('Bootstrap cargado');

        });
    });

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
    if (path.includes('reembolso.html')) {
        var btn_ingresar = document.getElementById('btn_ingresar');
        var datosIngresados = document.getElementById('datosIngresados');

        /*btn agregar gasto*/
        if (btn_ingresar && datosIngresados) {
            let rowCounter = 0; // Contador para hacer únicos los name
            let visibleGastos = 0; // Contador para gastos visibles
            var container = document.createElement('fieldset');
            container.id = 'datosIngresadosHijo';
            container.style.display = 'none'; // Inicialmente oculto

            // Agregar el contenedor al DOM
            datosIngresados.appendChild(container);

            // Agregar filas al hacer click en el botón 'agregar gasto'
            btn_ingresar.addEventListener('click', function () {

                // Incrementa el contador por cada fila nueva
                rowCounter++;
                visibleGastos++;

                // Mostrar el fieldset cuando hay filas
                container.style.display = 'block'; // Mostrar el fieldset
                container.disabled = false;  // Asegurarse de que esté habilitado

                // Obtiene los valores
                var fecha = document.getElementById('fecha').value;
                var numBoleta = document.getElementById('num_boleta').value;
                var descripcion = document.getElementById('descripcion').value;
                var monto = document.getElementById('monto').value;

                // Crear un elemento <hr> y título
                var line = document.createElement('hr');
                var tituloGasto = document.createElement('p');
                tituloGasto.className = 'titulo-gasto';
                tituloGasto.textContent = `Gasto ${visibleGastos}`;

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
                </svg> 
                <p class="delete">Eliminar gasto</p>`;

                //acción del boton borrar
                deleteButton.addEventListener('click', function () {
                    row.remove();
                    tituloGasto.remove();
                    line.remove();
                    visibleGastos--;
                    updateTotal();
                    updateTituloGasto(); // Actualiza los totales después de eliminar la fila

                    // Si no quedan filas, oculta el fieldset
                    if (visibleGastos === 0) {
                        container.style.display = 'none';  // Oculta el fieldset
                    }
                });

                // Insertar el conteo de gastos y el  botón de eliminar antes del primer campo de texto
                // Crear un contenedor para el título y el botón de eliminar
                var gastosDelete = document.createElement('div');
                gastosDelete.className = 'tituloGastos';
                gastosDelete.appendChild(tituloGasto);
                gastosDelete.appendChild(deleteButton);
                row.appendChild(gastosDelete);


                // Crear 4 columnas, cada una con un campo de texto
                var titles = ["Fecha", "N° boleta/factura", "Descripción", "Monto"];
                var values = [fecha, numBoleta, descripcion, monto];
                var names = [`fecha_${visibleGastos}`, `num_boleta_${visibleGastos}`, `descripcion_${visibleGastos}`, `monto_${visibleGastos}`]; // Nombres únicos

                for (var i = 0; i < values.length; i++) {
                    var col = document.createElement('div');
                    col.className = 'col-12 col-md-3';

                    // Crear un título (label) para cada campo de texto
                    var label = document.createElement('label');
                    label.textContent = titles[i]; // Establecer el texto del título
                    label.htmlFor = names[i]; // Asociar la etiqueta con el campo de texto

                    //Crear campo de texto
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

                    col.appendChild(label);
                    col.appendChild(input);
                    row.appendChild(col);

                }

                // Agregar la fila al contenedor
                container.appendChild(row);
                container.appendChild(line);

                // Borrar los datos de origen
                document.getElementById('fecha').value = '';
                document.getElementById('num_boleta').value = '';
                document.getElementById('descripcion').value = '';
                document.getElementById('monto').value = '';

                // Actualizar total
                updateTotal();

            });

            // Función para actualizar los títulos de gastos
            function updateTituloGasto() {
                const titles = container.querySelectorAll('.titulo-gasto');
                titles.forEach((title, index) => {
                    title.innerText = `Gasto ${index + 1}`; // Actualiza el texto del título
                });
            }

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
                var rows = document.querySelectorAll('#datosIngresados .row');
                console.log(`Se han encontrado ${rows.length} filas en el contenedor.`);
                var modalBody = document.querySelector('.modal-body');

                // Limpia el contenido del modal
                modalBody.innerHTML = '';

                // Recorre cada fila y extrae la información de los inputs
                rows.forEach(function (row, index) {
                    // Omitir la primera fila (índice 0)
                    if (index >= 0) {
                        var inputs = row.querySelectorAll('input');
                        if (inputs.length > 0) {
                            var fecha = inputs[0].value;
                            var numBoleta = inputs[1].value;
                            var descripcion = inputs[2].value;
                            var monto = inputs[3].value;

                            // Agrega la información de la fila al modal
                            var rowInfo = `
                                    <p><strong>Gasto ${index + 1}:</strong></p>
                                    <ul>
                                        <li>Fecha: ${formatoFecha(fecha)}</li>
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
                            <strong>Total reembolso solicitado:</strong> $${total}
                        </div>
                    `;
                modalBody.innerHTML += totalInfo;

                /* Función para formatear el número con separadores de miles
                function formatNumber(value) {
                    return + value.replace(/\D/g, '') // Elimina caracteres no numéricos
                        .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Agrega separadores de miles
                }*/

                function formatoFecha(value) {
                    const fechaNacimiento = new Date(value);
                    // Ajustar manualmente para evitar la discrepancia de un día
                    fechaNacimiento.setMinutes(fechaNacimiento.getMinutes() + fechaNacimiento.getTimezoneOffset());
                    const dia = String(fechaNacimiento.getDate()).padStart(2, '0');
                    const mes = String(fechaNacimiento.getMonth() + 1).padStart(2, '0');
                    const año = fechaNacimiento.getFullYear();
                    return `${dia}-${mes}-${año}`;
                }

            });
        }
    }

    //IF en rendición
    if (path.includes('rendicion.html')) {
        var btn_ingresar = document.getElementById('btn_ingresar');
        var datosIngresados = document.getElementById('datosIngresados');
        /*btn agregar gasto*/
        if (btn_ingresar && datosIngresados) {
            let rowCounter = 0; // Contador para hacer únicos los name
            let visibleGastos = 0; // Contador para gastos visibles
            var container = document.createElement('fieldset');
            container.id = 'datosIngresadosHijo';
            container.style.display = 'none'; // Inicialmente oculto

            // Agregar el contenedor al DOM
            datosIngresados.appendChild(container);

            // Agregar filas al hacer click en el botón 'agregar gasto'
            btn_ingresar.addEventListener('click', function () {

                // Incrementa el contador por cada fila nueva
                rowCounter++;
                visibleGastos++;

                // Mostrar el fieldset cuando hay filas
                container.style.display = 'block'; // Mostrar el fieldset
                container.disabled = false;  // Asegurarse de que esté habilitado

                // Obtiene los valores
                var fecha = document.getElementById('fecha').value;
                var numBoleta = document.getElementById('num_boleta').value;
                var descripcion = document.getElementById('descripcion').value;
                var monto = document.getElementById('monto').value;

                // Crear un elemento <hr> y título
                var line = document.createElement('hr');
                var tituloGasto = document.createElement('p');
                tituloGasto.className = 'titulo-gasto';
                tituloGasto.textContent = `Gasto ${visibleGastos}`;

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
                </svg> 
                <p class="delete">Eliminar gasto</p>`;

                //acción del boton borrar
                deleteButton.addEventListener('click', function () {
                    row.remove();
                    tituloGasto.remove();
                    line.remove();
                    visibleGastos--;
                    updateTotal();
                    updateDiferencia();
                    updateTituloGasto(); // Actualiza los totales después de eliminar la fila

                    // Si no quedan filas, oculta el fieldset
                    if (visibleGastos === 0) {
                        container.style.display = 'none';  // Oculta el fieldset
                    }

                });

                // Insertar el conteo de gastos y el  botón de eliminar antes del primer campo de texto
                // Crear un contenedor para el título y el botón de eliminar
                var gastosDelete = document.createElement('div');
                gastosDelete.className = 'tituloGastos';
                gastosDelete.appendChild(tituloGasto);
                gastosDelete.appendChild(deleteButton);
                row.appendChild(gastosDelete);


                // Crear 4 columnas, cada una con un campo de texto
                var titles = ["Fecha", "N° boleta/factura", "Descripción", "Monto"];
                var values = [fecha, numBoleta, descripcion, monto];
                var names = [`fecha_${visibleGastos}`, `num_boleta_${visibleGastos}`, `descripcion_${visibleGastos}`, `monto_${visibleGastos}`]; // Nombres únicos

                for (var i = 0; i < values.length; i++) {
                    var col = document.createElement('div');
                    col.className = 'col-12 col-md-3';

                    // Crear un título (label) para cada campo de texto
                    var label = document.createElement('label');
                    label.textContent = titles[i]; // Establecer el texto del título
                    label.htmlFor = names[i]; // Asociar la etiqueta con el campo de texto

                    //Crear campo de texto
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

                    col.appendChild(label);
                    col.appendChild(input);
                    row.appendChild(col);

                }

                // Agregar la fila al contenedor
                container.appendChild(row);
                container.appendChild(line);

                // Borrar los datos de origen
                document.getElementById('fecha').value = '';
                document.getElementById('num_boleta').value = '';
                document.getElementById('descripcion').value = '';
                document.getElementById('monto').value = '';

                // Actualizar total
                updateTotal();
                updateDiferencia();
            });

            // Función para actualizar los títulos de gastos
            function updateTituloGasto() {
                const titles = container.querySelectorAll('.titulo-gasto');
                titles.forEach((title, index) => {
                    title.innerText = `Gasto ${index + 1}`; // Actualiza el texto del título
                });
            }

            function formatNumber(value) {
                // Remover cualquier carácter no numérico y agregar separadores de miles
                return value.replace(/\D/g, '') // Elimina caracteres no numéricos
                    .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Agrega separadores de miles
            }

            function updateDiferencia() {
                var solicitado = parseInt(document.getElementById('inputSolicitado').value.replace(/\./g, ''), 10) || 0;
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
                var rows = document.querySelectorAll('#datosIngresados .row');
                console.log("N° Filas: ");
                var modalBody = document.querySelector('.modal-body');

                // Limpia el contenido del modal
                modalBody.innerHTML = '';

                var solicitado = document.getElementById('inputSolicitado').value;
                var diferencia = document.getElementById('diferencia').value;

                // Recorre cada fila y extrae la información de los inputs
                rows.forEach(function (row, index) {
                    // Omitir la primera fila (índice 0)

                    var inputs = row.querySelectorAll('input');

                    if (inputs.length > 0) {
                        var fecha = inputs[0].value;
                        var numBoleta = inputs[1].value;
                        var descripcion = inputs[2].value;
                        var monto = inputs[3].value;

                        // Agrega la información de la fila al modal
                        var rowInfo = `
                                    <p><strong>Gasto ${index + 1}:</strong></p>
                                    <ul>
                                        <li>Fecha: ${formatoFecha(fecha)}</li>
                                        <li>N° Bol/Fact: ${numBoleta}</li>
                                        <li>Descripción: ${descripcion}</li>
                                        <li>Monto: $${monto}</li>

                                    </ul>
                                `;
                        modalBody.innerHTML += rowInfo;
                    }

                });

                // Obtén el valor del campo 'total'
                updateTotal();
                var total = document.getElementById('total').value;

                // Agrega el total al final del contenido del modal
                var totalInfo = `
                        <div class="mt-3">
                        <strong>Total gastado:</strong> $${total}<br>
                        <strong>Monto solicitado:</strong> $${solicitado}<br>
                        <strong>Diferencia:</strong> $${diferencia}
                        </div>
                    `;
                modalBody.innerHTML += totalInfo;

                /* Función para formatear el número con separadores de miles
                function formatNumber(value) {
                    return + value.replace(/\D/g, '') // Elimina caracteres no numéricos
                        .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Agrega separadores de miles
                }*/

                //Formatea la fecha en el modal
                function formatoFecha(value) {
                    const fechaNacimiento = new Date(value);
                    // Ajustar manualmente para evitar la discrepancia de un día
                    fechaNacimiento.setMinutes(fechaNacimiento.getMinutes() + fechaNacimiento.getTimezoneOffset());
                    const dia = String(fechaNacimiento.getDate()).padStart(2, '0');
                    const mes = String(fechaNacimiento.getMonth() + 1).padStart(2, '0');
                    const año = fechaNacimiento.getFullYear();
                    return `${dia}-${mes}-${año}`;
                }
            });
        }
    }

    /*Acorta el label del input N° Boleta/Factura en pantallas medianas*/
    function updateLabelText() {
        var label = document.getElementById('labelBolFact');
        var label2 = document.getElementById('labelDiferencia');
        if (window.innerWidth <= 882 && window.innerWidth >= 768) {
            label.textContent = 'N° bol/fact'; // Cambiar el texto para pantallas entre 768px y 882px
        } else {
            label.textContent = 'N° boleta/factura'; // Texto por defecto
        }
        /*Acorta label Diferencia rendición*/
        if (window.innerWidth <= 882 && window.innerWidth >= 768) {
            label2.textContent = 'Diferencia'; // Cambiar el texto para pantallas entre 768px y 882px
        } else {
            label2.textContent = 'Diferencia rendición'; // Texto por defecto
        }
    }

    // Llamar a la función cuando la página se carga
    window.addEventListener('load', updateLabelText);

    // Llamar a la función cada vez que se cambia el tamaño de la ventana
    window.addEventListener('resize', updateLabelText);

});