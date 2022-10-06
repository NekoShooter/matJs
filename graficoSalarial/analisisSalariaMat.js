const btnSig = document.querySelector('.siguiente');
const btnAnt = document.querySelector('.anterior');
const btnBuscar = document.querySelector('form');
const buscador = document.querySelector('#input-buscar');
const txtPromedio = document.querySelector('.promedio');
const txtMedia = document.querySelector('.media');
const txtModa = document.querySelector('.moda');
const Portada = document.querySelector('.contenedor--portada');
const btnPromedio = document.querySelector('.btn-promedio');
const btnMedia = document.querySelector('.btn-media');
const btnModa = document.querySelector('.btn-moda');
const btnProyeccion = document.querySelector('.btn-proyeccion');
const btnFiltro = document.querySelector('.buscar-por-filtro');
const iconoFiltro = document.querySelector('.filtro-img');
const etiquetaFiltro = document.querySelector('.etiqueta-filtro');

btnSig.addEventListener('click', siguiente);
btnAnt.addEventListener('click', anterior);
btnBuscar.addEventListener('submit', buscar);
btnPromedio.addEventListener('click', calcularPromedio);
btnMedia.addEventListener('click', calcularMedia);
btnModa.addEventListener('click', calcularModa);
btnProyeccion.addEventListener('click', calcularProyeccion);
btnFiltro.addEventListener('click', cambiarFiltro);

window.addEventListener('resize', reDimencionar);
window.addEventListener('load', reDimencionar);

canvas.addEventListener('mousemove', rastrear)
canvas.addEventListener('click', mostrarMarcadores);
canvas.addEventListener('dblclick', ocultarMarcadores);


let idx = undefined;
let p = undefined;
let persona = undefined;
let empresa = undefined;
let traqueo = false;
let verMarcador = undefined;
let filtrarPorPersona = Boolean(true);
const arr_empresa = Array();
const empresas = crearObjEmpresas(salarios);
const proyeccion = {val:undefined, ele:undefined, mostrar: false, tendencia:undefined};
const promedio = {val:undefined, mostrar: false};
const media = { val:undefined, mostrar: false};
const moda = { val:undefined, mostrar: false};


function reDimencionar(){
    escalar();
    reEscalarParametrosDeDibujo(p);
    reDimencionarSubGrafica(promedio, 'promedio');
    reDimencionarSubGrafica(media, 'media');
    reDimencionarSubGrafica(moda, 'moda');
    graficar();}

function obtenerArr(){ return filtrarPorPersona ? salarios : arr_empresa;}
function obtenerEntidad(){ return filtrarPorPersona ? persona : empresa;}

function siguiente(){
    const arr = obtenerArr();
    if(idx === undefined) idx = -1;
    if(idx + 1 == arr.length) return;
    ++idx;
    NuevaGrafica();}


function anterior(){
    const arr = obtenerArr();
    if(idx === undefined) idx = arr.length;
    if(idx - 1 < 0) return;
    --idx;
    NuevaGrafica();}


function NuevaGrafica(){
    limpiarPantallaErr();
    BorraCalculos();
    obtenerDatos();
    dibujarGrafica(p);
    mostrarGuias();
    imprimirDatos();}


function graficar(){
    dibujarGrafica(p);
    subGraficar();
    graficarProyeccion();
    graficarParametros();
    mostrarGuiasDeSubGrafica();
    mostrarGuias();}

function subGraficar(){
    if(filtrarPorPersona || !empresa) return;
    dibujarSubGrafica(promedio, 'promedio', color.verdeTerminal);
    dibujarSubGrafica(media, 'media', color.azulTerminal);
    dibujarSubGrafica(moda, 'moda', color.amarilloTerminal);}

function reDimencionarSubGrafica(propiedad, llave){
    if(propiedad && !propiedad.mostrar) return;
    empresa[llave + 'Pos'] = obtenerPosDeDatos(empresa[llave],p.rangos,p);
    empresa[llave + 'PosEx'] = undefined;}

function dibujarSubGrafica(propiedad, tipoCalc, color){
    if(!propiedad.mostrar) return;
    graf.strokeStyle = color;
    if(proyeccion.mostrar && !empresa[tipoCalc +'PosEx']) 
        empresa[tipoCalc +'PosEx'] = obtenerPosDeDatos(empresa[tipoCalc], p.rangos, p);
    else if(proyeccion.val !== undefined && !proyeccion.mostrar){
        reDimencionarSubGrafica(propiedad,tipoCalc);}
    const pos = proyeccion.mostrar ? empresa[tipoCalc +'PosEx'] : empresa[tipoCalc +'Pos']
    graficarArrPosDeDatos(pos, p);}


function graficarParametros(){
    if(promedio.mostrar)dibujarGraficaLinealPorValor(promedio.val,p,color.verdeTerminal);
    if(media.mostrar)dibujarGraficaLinealPorValor(media.val,p,color.azulTerminal);
    if(moda.mostrar)dibujarGraficaLinealPorValor(moda.val,p,color.amarilloTerminal);
    modificarProyeccion();}


function mostrarGuias(){
    if(verMarcador === undefined) return;
    if(verMarcador)dibujarEtiquetasDeDatos(p, color.azulMarcado);
    else dibujarMarcadoresDeDatos(p,4, color.azulMarcado);}

function mostrarGuiasDeSubGrafica(){
    if(verMarcador === undefined || filtrarPorPersona) return;
    if(verMarcador){
        const etiqueta = (propiedad,llave, color)=>{
            if(!empresa[llave] || !propiedad.mostrar) return;
            const ll = proyeccion.mostrar ? llave + 'PosEx' : llave + 'Pos';
            dibujarEtiquetaDeArr(empresa[ll],empresa[llave],p, color);}

        etiqueta(promedio,'promedio', color.verdeTerminal);
        etiqueta(media, 'media',color.azulTerminal);
        etiqueta(moda, 'moda', color.amarilloTerminal);}


    else{
        const marcador = (propiedad, llave, Color = color.azulMarcado)=>{
            if(!empresa[llave] || !propiedad.mostrar) return;
            
            const ll = proyeccion.mostrar ? llave + 'PosEx' : llave + 'Pos';
            dibujarMarcadorDeArr(empresa[ll],4,Color);}
        

        marcador(promedio,'promedio', color.verdeTerminal);
        marcador(media,'media',color.azulTerminal);
        marcador(moda, 'moda', color.amarilloTerminal);}}


function obtenerDatos(){
    const arr = obtenerArr();
    if(idx === undefined || arr.length - 1  < idx) return;

    let arr_datos = undefined;
    let arr_elementos = undefined;
    const nombre = filtrarPorPersona ? salarios[idx].name : arr_empresa[idx];

    if(filtrarPorPersona){
        arr_datos = salarios[idx].trabajos.map(val=> val.salario);
        arr_elementos = salarios[idx].trabajos.map(val=> val.year);}
    else{
        arr_elementos = Array();
        arr_datos = {};
        for(const llave in empresas[arr_empresa[idx]]){
            arr_datos[llave] = empresas[arr_empresa[idx]][llave];
            OrdenarLista(arr_datos[llave]);
            arr_elementos.push(llave);}}

    construirData(nombre, arr_datos, arr_elementos);
    buscador.value = nombre;}


function construirData(nombre ,arr_datos, arr_elementos){
    if(filtrarPorPersona){
        persona = {};
        persona['nombre'] = nombre;
        persona['salarios'] = arr_datos;
        p = obtenerParametrosDeDibujo(arr_datos, arr_elementos, 14);
        OrdenarLista(persona['salarios']);}
    else{
        empresa = {};
        empresa['nombre'] = arr_empresa[idx];
        const arr_sumDatos = Array();

        for(const annios in arr_datos){
            let total = 0;
            arr_datos[annios].forEach(dato =>{ total += dato; });
            OrdenarLista(arr_datos[annios]);
            arr_sumDatos.push(total);}

        empresa['historial'] = arr_datos;

        p = obtenerParametrosDeDibujo(arr_sumDatos, arr_elementos, 14);
        empresa['salarios'] = arr_sumDatos;
        OrdenarLista(empresa['salarios']);}}




function buscar(event){
    event.preventDefault();
    const entidad = obtenerEntidad();
    if(entidad && entidad.nombre == buscador.value){ return;}
    if(buscador.value ===''){ pantallaErr(); return;}

    let __idx = -1;

    if(filtrarPorPersona) __idx = salarios.findIndex(val => val.name === buscador.value);
    else __idx = arr_empresa.findIndex(nombre => nombre === buscador.value);

    if(__idx < 0){ pantallaErr(); return; }

    idx = __idx;
    NuevaGrafica();}

function pantallaInicio(){
    BorrarDatos();
    Portada.classList.remove('oculto');
    imprimirDatos();}

function pantallaErr(){
    pantallaInicio();
    console.error('error de elemento no encontrado');
    txtPromedio.classList.remove('oculto');
    txtPromedio.classList.add('color-err');
    txtPromedio.innerText = '-- No localizado --';}


function limpiarPantallaErr(){
    Portada.classList.add('oculto');
    txtPromedio.classList.add('oculto');
    txtPromedio.classList.remove('color-err');
    txtPromedio.innerText = '';
    proyeccion.mostrar = false;
    modificarProyeccion();}


function BorrarDatos(){
    borrarGrafico();
    idx = undefined;
    persona = undefined;
    empresa = undefined;
    p = undefined;
    proyeccion.mostrar = false;
    modificarProyeccion();
    BorraCalculos();}


function imprimirDatos(){
    modificarRes(promedio, txtPromedio, btnPromedio,'Pro', 'color-verdeTerminal');
    modificarRes(media, txtMedia, btnMedia ,'Med', 'color-azulTerminal');
    modificarRes(moda, txtModa, btnModa ,'Mod', 'color-amarilloTerminal');}


function modificarRes(dato, span, btn, txt, classColor){
    span.innerText ='';
    if(dato.mostrar){ 
        span.classList.remove('oculto');
        span.innerText = `${txt}: ${dato.val}`;
        btn.classList.add(classColor);}
    else{
        span.classList.add('oculto');
        btn.classList.remove(classColor);}}


function modificarProyeccion(){
    if(proyeccion.val === undefined) return;
    const clase = colorDeLaTendencia('color-verdeTerminal','color-amarilloTerminal','color-err');
    if(proyeccion.mostrar) btnProyeccion.classList.add(clase);
    else btnProyeccion.classList.remove(clase);}


function BorraCalculos(){
    proyeccion.val = undefined; proyeccion.mostrar = false; 
    proyeccion.ele = undefined; proyeccion.tendencia = undefined;
      promedio.val = undefined;   promedio.mostrar = false;
         media.val = undefined;      media.mostrar = false;
          moda.val = undefined;       moda.mostrar = false;}

function mostrar(calc){
    calc.mostrar = !calc.mostrar;
    if(!filtrarPorPersona && calc.mostrar && proyeccion.mostrar) calcularProyecciones();
    graficar();
    imprimirDatos();}

function calcular(tipoCalc, funcion){
    const entidad = obtenerEntidad();
    if(!entidad) return;
    if(tipoCalc.val === undefined)
        tipoCalc.val = funcion(entidad);
    mostrar(tipoCalc);}


function calculoGeneral(etiqueta, entidad, funcion){
    if(!filtrarPorPersona){
        entidad[etiqueta] = Array();
        for(const annio in entidad.historial){
            entidad[etiqueta].push(Number(funcion( entidad.historial[annio])));}
        reDimencionarSubGrafica(undefined, etiqueta);}

    return funcion(entidad.salarios);}


function calcularPromedio(){
    calcular(promedio, entidad => calculoGeneral('promedio', entidad, v => Promedio(v)));}

function calcularModa(){
    calcular(moda, entidad => calculoGeneral('moda', entidad, v => Moda(v).val));}

function calcularMedia(){
    calcular(media, entidad => calculoGeneral('media', entidad, v =>Media(v)));}


function rastrear(event){
    if(!estaDentroDelaGrafica(event.offsetX, event.offsetY,p)){
        if(traqueo){
            graficar();
            canvas.classList.remove('cursor-cruz');}
        traqueo = false;
        return;};
    canvas.classList.add('cursor-cruz');
    graficar();
    dibujarGraficaLinealPorPos(event.offsetX, event.offsetY,p,color.claroGuia);
    traqueo = true;}


function mostrarMarcadores(event){
    if(!estaDentroDelaGrafica(event.offsetX, event.offsetY,p)) return;
    if(verMarcador === undefined) verMarcador = false;
    verMarcador = !verMarcador;
    graficar();}


function ocultarMarcadores(event){
    if(estaDentroDelaGrafica(event.offsetX, event.offsetY,p)){
        verMarcador = undefined;
        graficar();}}


function graficarProyeccion(){
    if(!proyeccion.mostrar || !obtenerEntidad()) return;

    let colorTendencia = colorDeLaTendencia(color.verdeTerminal,color.amarilloTerminal,color.rojoCritical);
    
    graf.setLineDash([2, 5]);
    dibujarGraficaPorIdx(p, p.exepcion, colorTendencia);
    graf.setLineDash([]);
    dibujarEtiqueta(p, p.exepcion, colorTendencia);
    graficarProyeccionIndividual(promedio,'promedio');
    graficarProyeccionIndividual(media,'media');
    graficarProyeccionIndividual(moda,'moda');}


function graficarProyeccionIndividual(propiedad, tipoCalc){
    if(!empresa || !propiedad.mostrar) return;
    const obj_colores = {subida : color.verdeTerminal, bajada : color.rojoCritical, estable : color.amarilloTerminal}
    const Final  = empresa[tipoCalc].length - 1;
    const colorTen = colorDeLaTendenciaIndividual(empresa[tipoCalc][Final - 1],empresa[tipoCalc][Final],obj_colores);
    graf.setLineDash([2, 5]);
    graf.strokeStyle = colorTen;
    const pos = empresa[tipoCalc+'PosEx'][Final - 1];
    const posF = empresa[tipoCalc+'PosEx'][Final];
    trazarLinea(pos.x, pos.y,posF.x, posF.y);
    trazarEtiqueta(empresa[tipoCalc][Final],posF.x,posF.y,p.font,p.espacios,colorTen);
    graf.setLineDash([]);}


function colorDeLaTendenciaIndividual(origen, final, obj_colores) {
    let colorTen = obj_colores.estable;
    if(final < origen) colorTen = obj_colores.bajada;
    else if(final > origen) colorTen = obj_colores.subida;
    return colorTen;}


function colorDeLaTendencia(subida, estable, bajada){
    if(proyeccion.tendencia === undefined) return estable;
    if(proyeccion.tendencia) return subida;
    return bajada;}


function calcularProyeccion(){
    if(!obtenerEntidad()) return;
    if(proyeccion.val === undefined){
        proyeccion.val = Proyeccion(p.datos);
        let num = Number(p.elementos[p.elementos.length - 1]);
        if(num === NaN) num = p.elementos[p.elementos.length - 1];
        else ++num;
        if(proyeccion.val > p.datos[p.datos.length-1]) proyeccion.tendencia = true;
        else if(proyeccion.val < p.datos[p.datos.length-1]) proyeccion.tendencia = false;
        proyeccion.ele = num;}

    if(!proyeccion.mostrar) agragarUnaExepcion(proyeccion.val, proyeccion.ele,p);
    else EliminarExepcion(p);
    calcularProyecciones();

    proyeccion.mostrar = !proyeccion.mostrar;
    graficar();}

function calcularProyecciones(){
    calcProyeccionIndividual(promedio, 'promedio');
    calcProyeccionIndividual(media, 'media');
    calcProyeccionIndividual(moda, 'moda');}

function calcProyeccionIndividual(propiedad, tipoCalc){
    if(filtrarPorPersona || !propiedad.mostrar || !empresa || !empresa[tipoCalc]) return;
    if(empresa[tipoCalc].length-1 == p.exepcion) return;
    empresa[tipoCalc].push(Number(Proyeccion(empresa[tipoCalc])));}


function crearObjEmpresas(arr_salarios){
    if(!arr_salarios) return undefined;
    const obj_empresas = {};

        arr_salarios.forEach(entidad =>{
            entidad.trabajos.forEach(empresa =>{
                if(!obj_empresas[empresa.empresa]){
                    obj_empresas[empresa.empresa] = {}
                    arr_empresa.push(empresa.empresa);};
                if(!obj_empresas[empresa.empresa][empresa.year]) obj_empresas[empresa.empresa][empresa.year] = Array();
                obj_empresas[empresa.empresa][empresa.year].push(empresa.salario);});});
    return obj_empresas;}



function cambiarFiltro(){
    filtrarPorPersona = !filtrarPorPersona;
    pantallaInicio();
    modIcono();}

function modIcono(){
    if(filtrarPorPersona){
        iconoFiltro.setAttribute('src','./persona.png');
        etiquetaFiltro.innerText = 'Filtrar por Persona';}
    else{
        iconoFiltro.setAttribute('src','./empresa.png');
        etiquetaFiltro.innerText = 'Filtrar por Empresa';}}