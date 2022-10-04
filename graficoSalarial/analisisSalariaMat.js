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

btnSig.addEventListener('click', siguiente);
btnAnt.addEventListener('click', anterior);
btnBuscar.addEventListener('submit', buscar);
btnPromedio.addEventListener('click', calcularPromedio);
btnMedia.addEventListener('click', calcularMedia);
btnModa.addEventListener('click', calcularModa);
btnProyeccion.addEventListener('click', calcularProyeccion);

window.addEventListener('resize', reDimencionar);
window.addEventListener('load', reDimencionar);

canvas.addEventListener('mousemove', rastrear)
canvas.addEventListener('click', mostrarMarcadores);
canvas.addEventListener('dblclick', ocultarMarcadores);


let idx = undefined;
let p = undefined;
let persona = undefined;
let traqueo = false;
let verMarcador = undefined;
const proyeccion = {val:undefined, ele:undefined, mostrar: false, tendencia:undefined};
const promedio = {val:undefined, mostrar: false};
const media = { val:undefined, mostrar: false};
const moda = { val:undefined, mostrar: false};


function reDimencionar(){
    escalar();
    reEscalarParametrosDeDibujo(p);
    graficar();}


function siguiente(){
    const i = idx;
    if(idx === undefined) idx = -1;
    if(idx + 1 == salarios.length) return;
    ++idx;
    NuevaGrafica();}


function anterior(){
    const i = idx;
    if(idx === undefined) idx = salarios.length;
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
    graficarProyeccion();
    graficarParametros();
    mostrarGuias();}


function graficarParametros(){
    if(promedio.mostrar)dibujarGraficaLinealPorValor(promedio.val,p,color.verdeTerminal);
    if(media.mostrar)dibujarGraficaLinealPorValor(media.val,p,color.azulTerminal);
    if(moda.mostrar)dibujarGraficaLinealPorValor(moda.val,p,color.amarilloTerminal);
    modificarProyeccion();}


function mostrarGuias(){
    if(verMarcador === undefined) return;
    if(verMarcador)dibujarEtiquetasDeDatos(p, color.azulMarcado);
    else dibujarMarcadoresDeDatos(p,4, color.azulMarcado);}


function obtenerDatos(){
    if(idx === undefined || salarios.length - 1  < idx) return;
    const arr_salarios = salarios[idx].trabajos.map(val=> val.salario);
    const arr_annios = salarios[idx].trabajos.map(val=> val.year);
    construirData(salarios[idx].name, arr_salarios, arr_annios);
    OrdenarLista(persona['salarios']);
    buscador.value = persona.nombre;}


function construirData(nombre ,arr_salarios, arr_annios){
    persona = {};
    persona['nombre'] = nombre;
    persona['salarios'] = arr_salarios;
    p = obtenerParametrosDeDibujo(arr_salarios, arr_annios, 14);}


function buscar(event){
    event.preventDefault();
    if(persona && persona.nombre == buscador.value){ return;}
    if(buscador.value ===''){ pantallaErr(); return;}

    const __persona = salarios.findIndex(val => val.name === buscador.value);
    if(__persona < 0){ pantallaErr(); return; }

    idx = __persona;
    NuevaGrafica();}


function pantallaErr(){
    BorrarDatos();
    console.error('error de elemento no encontrado');
    Portada.classList.remove('oculto');
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
    p = undefined;
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
    graficar();
    imprimirDatos();}

function calcularPromedio(){
    if(!persona) return;
    if(promedio.val === undefined)
        promedio.val = Promedio(persona.salarios);
    mostrar(promedio);}


function calcularModa(){
    if(!persona) return;
    if(moda.val === undefined)
        moda.val = Moda(persona.salarios).val;
    mostrar(moda)}

function calcularMedia(){
    if(!persona) return;
    if(media.val === undefined)
        media.val = Media(persona.salarios);
    mostrar(media);}


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
    if(!proyeccion.mostrar || !persona) return;

    let colorTendencia = colorDeLaTendencia(color.verdeTerminal,color.amarilloTerminal,color.rojoCritical);
    
    graf.setLineDash([2, 5]);
    dibujarGraficaPorIdx(p, p.exepcion, colorTendencia);
    graf.setLineDash([]);
    dibujarEtiqueta(p, p.exepcion, colorTendencia);}


function colorDeLaTendencia(subida, estable, bajada){
    if(proyeccion.tendencia === undefined) return estable;
    if(proyeccion.tendencia) return subida;
    return bajada;}


function calcularProyeccion(){
    if(!persona) return;
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

    proyeccion.mostrar = !proyeccion.mostrar;
    graficar();}