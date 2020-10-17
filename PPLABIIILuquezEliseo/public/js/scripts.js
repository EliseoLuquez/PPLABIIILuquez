var frm;
var btnModificar;
var btnEliminar;
var divTabla;
var btnCerrar;
var frmDatos;

window.addEventListener('load', () => {
    frm = document.forms[0];
    btnModificar = document.getElementById('btnModificar');
    btnEliminar = document.getElementById('btnEliminar');    
    divTabla = document.getElementById('divTabla');
    btnCerrar = document.getElementById('btnCerrar');
    frmDatos = document.getElementById('formDatos');

    TraerDatos();
    Cerrar();

    btnModificar.addEventListener('click', function(e){
        var mModificada = ObtenerDato(frm);
        if(ValidarNombre() && ValidarTurno() && ValidarFechaFinal()) 
        {
            Modificar(mModificada);
            Cerrar();
        }
        
    });

    btnEliminar.addEventListener('click', function(e){
        var pEliminada = ObtenerDato(frm);
        Eliminar(pEliminada);
        Cerrar();
    });

    btnCerrar.addEventListener('click', function(e){
        Cerrar();
    });

});

function TraerDatos()
{
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4)
        {
            if(xhr.status = 200)
            {
                HideSpinner();
                let json = JSON.parse(xhr.responseText);
                divTabla.innerHTML = '';
                divTabla.appendChild(CrearTabla(json));

            }
            else
            {
                console.log(xhr.status + '' + xhr.statusText);
            }
        }
        else
        {
           divTabla.innerHTML = '';
           Spinner();
        }
    }
    xhr.open('GET', 'http://localhost:3000/materias', true);
    xhr.send();
}


function Eliminar()
{
    let id = parseInt(document.querySelector('#txtId').value);
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = ()=> {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
        {
            HideSpinner();
            TraerDatos();
        }     
        else
        {
           divTabla.innerHTML = '';
           Spinner(true);
        }
    }
    xhr.open('POST', 'http://localhost:3000/eliminar', true);
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded'); 
    xhr.send(`id=${id}`);
}


function Modificar(dato)
{
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = ()=> {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
        {   
            HideSpinner();
            TraerDatos();
        }     
        else
        {
            divTabla.innerHTML = '';
            Spinner(true);
        }
    }
    xhr.open('POST', 'http://localhost:3000/editar', true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify(dato));
}



function CrearTabla(array)
{
    var tabla = document.createElement('divTabla');

    tabla.getAttribute('border', '1px solid black');
    tabla.getAttribute('style', 'border-collapse: collapse');
    tabla.getAttribute('width 700px');

    let cabecera = document.createElement('tr');

    for (atributo in array[0])
    {
        let th = document.createElement('th');
        th.textContent = atributo;

        cabecera.appendChild(th);
  
    }

    tabla.appendChild(cabecera);

    for (var i in array)
    {
        var row = document.createElement('tr');
        var auxObj = array[i];

        for (var j in auxObj)
        {

            let td = document.createElement('td');
            var dato = document.createTextNode(auxObj[j]);
            td.addEventListener('dblclick', CargarFormulario);
            td.appendChild(dato);
            row.appendChild(td);
    
        }
        tabla.appendChild(row);
    }
    return tabla;
}


function CargarFormulario(e)
{
    let tr = e.target.parentElement;
    let nodes = tr.childNodes;
    let dato = new Materia(nodes[0].textContent, nodes[1].textContent, nodes[2].textContent, nodes[3].textContent, 
        nodes[4].textContent);
    CargarForm(document.forms[0], dato);
    Abrir();
}

function CargarForm(frm, materia)
{
    for(elements of frm.elements)
    {
        switch(elements.name)
        {
            case 'id':
                elements.value = materia.id;
                break;
            case 'nombre':
                elements.value = materia.nombre;
                break;
            case 'cuatrimestre':
                elements.value = materia.cuatrimestre;
                break;
            case 'fechaFinal':
                elements.value = materia.fechaFinal;
                break;
            case 'turno':
                if(materia.turno == 'Mañana')
                {
                    document.getElementById('Mañana').checked = true;
                    document.getElementById('Noche').checked = false;
                }
                else if(materia.turno == 'Noche')
                {
                    document.getElementById('Mañana').checked = false;
                    document.getElementById('Noche').checked = true;
                }
            default:
                break;
        }
    }
}

function ObtenerDato(frm)
{
    let id;
    let nombre;
    let cuatrimestre;
    let fechaFinal;
    let turno;

    for(elements of frm.elements)
    {
        switch(elements.name)
        {
            case 'id':
                id = elements.value;
                break;
            case 'nombre':
                nombre = elements.value;
                break;
            case 'cuatrimestre':
                cuatrimestre = elements.value;
                break;
            case 'fechaFinal':
                fechaFinal = elements.value;
                break;
            case 'turno':
                if(document.getElementById('Mañana').checked == true)
                {
                    turno = 'Mañana';
                }
                else if(document.getElementById('Noche').checked == true)
                {
                    turno = 'Noche';
                }
                break;
        }
    }
    return new Materia(id, nombre, cuatrimestre, fechaFinal, turno);
}

function Abrir()
{
    var form = document.getElementById('formDatos');
    var overlay = document.getElementById('overlay');
    overlay.classList.add('active');
    form.hidden = false;
}

function Cerrar()
{
    var form = document.getElementById('formDatos');
    var overlay = document.getElementById('overlay');
    overlay.classList.remove('active');
    form.hidden = true;
}


function ValidarNombre()
{
    var retorno = false;
    var inputNombre = document.getElementById('nombretxt');
    var nombre = inputNombre.value;
    if(nombre.length < 6)
    {
        inputNombre.style.borderColor = 'red';
    }
    else
    {
        retorno = true;
    }
    return retorno;
}

function ValidarTurno()
{
    var retorno = false;
    var maniana = document.getElementById('Noche');
    var noche = document.getElementById('Mañana');

    if(noche.checked || maniana.checked)
    {
        retorno = true;
    }
    else{
        noche.style.borderColor = 'red';
        maniana.style.borderColor = 'red';
    }
    return retorno;

}

function ValidarFechaFinal()
{
    var retorno = false;
    var inputFecha = document.getElementById('fechaFinaltxt');
    var fechaFinal = inputFecha.value.split('/');
    var fechaValida = new Date(parseInt(fechaFinal[2]), parseInt(fechaFinal[1]), parseInt(fechaFinal[0]));
    var fechaHoy = new Date();
    fechaValida.setHours(0,0,0,0);
    fechaHoy.setHours(0,0,0,0);

    if(fechaValida > fechaHoy)
    {
        retorno = true;
    }
    else
    {
        inputFecha.style.borderColor = 'red';
    }
    return retorno;
}

function Spinner()
{
    var spinner = document.getElementById('spinner');
    var img = document.createElement('img');
    spinner.appendChild(img);
    spinner.hidden = false;
    return spinner;
}

function HideSpinner()
{
    var spinner = document.getElementById('spinner');
    spinner.hidden = true;
}