const canvas = document.querySelector('canvas');
const graf = canvas.getContext('2d');

const x = Array();
const y = Array();

x.push(50);//main {width:50%}
x.push(90);//padding 5% - 100%
x.push(90);//.contenedor--grafico {width:90%}

y.push(75);//main {width:75%}
y.push(90);//padding 5% - 100%
y.push(70);//.explorador {height:20%} + .contenedor--btn{height:10%} - 100

const color = { gris: '#83878b', 
                grisOscuro: '#35363b', 
                verdeTerminal :'#7EBF8E',
                amarilloTerminal:'#afbf7e',
                azulMarcado: '#88B6F2',
                azulTerminal:'#9197BF',
                rojoCritical:'#BF826B',
                claroGuia:'#F2CEA0'}

let canvas_t = undefined;

function relacion(num, porcentaje){ return (num * porcentaje) / 100;}
function porcentaje(num, cant_base){return (num * 100) / cant_base;}

function obtenerTam(array_w, array_h){
    let x = window.innerWidth;
    let y = window.innerHeight;
    array_w.forEach(val => { x = relacion(x, val);});
    array_h.forEach(val => { y = relacion(y, val); });
    return {w:x, h:y};}


function escalar(){
    canvas_t = obtenerTam(x,y);
    canvas.setAttribute('width',canvas_t.w);
    canvas.setAttribute('height',canvas_t.h);}


function font(proporcionREM){
    if(!canvas_t || proporcionREM <= 0) return 0;
    const per = ~~(canvas_t.w / 200);
    return  ~~(per * (proporcionREM / 2));}


function obtenerRangos(arr_elementos, divisiones){
    if(!arr_elementos) return undefined;
    let max = undefined;
    let min = undefined;

    for(val of arr_elementos){
        if(!max && !min) max = min = val;
        else if(val > max) max = val;
        else if(val < min) min = val;}

    return crearRangos(min, max, divisiones);}


function crearRangos(min, max, divisiones){
    if(divisiones <= 0) divisiones = 1;
    const rangos = Array(divisiones);

    const grupo_max = grupoNum(max);
    const grupo_min = grupoNum(min);
    const dif = grupo_max.unidad - grupo_min.unidad;
    const pas = 1 + dif;

    min = grupo_min.unidad * grupo_min.cifra;
    max = grupo_max.unidad * grupo_max.cifra;

    if(min == max) {
        grupo_min.unidad -=.5;
        grupo_max.unidad +=.5;}

    if(min != grupo_min.cant){
        const min_val = grupo_min.unidad * grupo_min.cifra;
        min = grupo_min.unidad - 1 ? (grupo_min.unidad - 1 ) : grupo_min.unidad;
        min = min < grupo_min.unidad && min_val <= grupo_min.cant ? grupo_min.unidad : min;
        const min_tmp = (dif <= 2 && pas >= 0? grupo_min.unidad + .5 : min) * grupo_min.cifra;
        min = min < min_tmp && min_tmp <= grupo_min.cant ? min_tmp : min * grupo_min.cifra;}
    
    if(max != grupo_max.cant){
        max = (grupo_max.unidad + 1) * grupo_max.cifra;
        const max_tmp = dif <= 1 ? (grupo_max.unidad + .5) * grupo_max.cifra: max;
        max = max_tmp >= grupo_max.cant ? max_tmp : max;}
    
    const fr = (max - min) / divisiones;

    rangos[0] = max;
    for(let i = 0; i < divisiones - 1; ++i) rangos[divisiones - 1 - i] = min + ~~(fr * i);
    return rangos;}


function grupoNum(num){
    const grupo = {unidad:0, cifra:0, dimencion:0};
    if(num <= 0) return grupo;

    let unidad = 1;
    let cifra = 1;
    while(true){
        unidad = ~~(num / cifra);

        if(unidad){
            grupo.cifra = cifra;
            grupo.unidad = unidad;
            grupo.cant = num;}
        else break;
        ++grupo.dimencion;
        cifra *= 10;}
    return grupo;}


function padding(m1, m2 = undefined, m3 = undefined, m4 = undefined){
    const m = _m => _m <= 0 ? 0 : _m;
    const b = _b => _b === undefined;
    if(b(m2) && b(m3) && b(m4)) return {der: m(m1), izq:m(m1), sup:m(m1), inf:m(m1)};
    else if(b(m3) && b(m4)) return {der:m(m2), izq:m(m2), sup:m(m1), inf:m(m1)};
    else if(b(m4)) return {der:m(m2), izq:m(m2), sup:m(m1), inf:m(m3)};
    return {der:m(m2), izq:m(m4), sup:m(m1), inf:m(m3)};}


function obtenerDivisiones(tam, num_val, puntoDePartida){
    const arr = Array();
    const div = ~~((tam / num_val));
    const tol_err = div - puntoDePartida;
    for(let i = 1; i <= num_val; ++i) arr.push((div* i) - tol_err);
    return arr;}


function obtenerParametrosDeDibujo(arr_datos, arr_ele, tam_fuente, Padding = undefined){
    if(!canvas_t || !arr_datos || !arr_ele) return undefined;
    if(arr_datos.length != arr_ele.length) return undefined;
    
    const Parametros ={};
    const rangos = obtenerRangos(arr_datos, 4);
    
    Parametros['padding'] = Padding;
    Parametros['font_t'] = tam_fuente;
    Parametros['padding'] = Padding;
    Parametros['elementos'] = arr_ele;
    Parametros['datos'] = arr_datos.slice();
    Parametros['rangos'] = rangos;
    reEscalarParametrosDeDibujo(Parametros);
    return Parametros;}


function reEscalarParametrosDeDibujo(parametroDeDibujo){
    if(!parametroDeDibujo || !canvas_t) return;
    const p = parametroDeDibujo;
    let Padding = p.padding;
    const ancho = font(p.font_t);
    p['espacios'] = grupoNum((p.rangos[0])).dimencion;

    const padding_right = porcentaje(p.espacios * ancho, canvas_t.w);
    const padding_bottom = porcentaje(ancho * 3 , canvas_t.h);
    const padding_top = porcentaje(ancho / 2,canvas_t.h);

    if(!Padding) Padding = padding(padding_top,padding_right,padding_bottom,0);
    else{ 
        Padding.sup += padding_top;
        Padding.der += padding_right;
        Padding.inf += padding_bottom;}

    const x = ~~(relacion(canvas_t.w, Padding.der));
    const y = ~~(relacion(canvas_t.h, Padding.sup));
    const xf = ~~(relacion(canvas_t.w, Padding.izq));
    const yf = ~~(relacion(canvas_t.h, Padding.inf));
    
    p['xi'] = x;  p['yi'] = y; 
    p['xf'] = canvas_t.w - xf;
    p['yf'] = canvas_t.h - yf;

    const w = canvas_t.w - (x + xf);
    const h = canvas_t.h - (y + yf);
    const mx = ~~relacion(relacion(w, 100 / p.elementos.length ), 50);

    p['secV'] = obtenerDivisiones(h, p.rangos.length, y);
    p['secH'] = obtenerDivisiones(w, p.elementos.length, mx + x);
    p['coors'] = obtenerPosDeDatos(p.datos, p.rangos, p);
    p['font'] = font(p.font_t);}


function obtenerPosDeDatos(arr_datos, arr_rangos, parametroDeDibujo){
    if(!arr_rangos|| !arr_datos || !parametroDeDibujo) return undefined;

    const p = parametroDeDibujo;

    if(arr_rangos.length != p.secV.length || arr_datos.length != p.secH.length) return undefined;

    const arr_coors = Array(arr_datos.length);

    arr_datos.forEach((val, idx)=>{
        const pos = {};
        pos['y'] = localizarPosY(val, p, arr_rangos);
        pos['x'] = p.secH[idx]; 
        arr_coors[idx] = pos});
    
    return arr_coors;}


function localizarPosY(val, parametroDeDibujo, arr_rangos = undefined){
    if(val === undefined || !parametroDeDibujo) return undefined;
    if(!arr_rangos) arr_rangos = parametroDeDibujo.rangos;
    const p = parametroDeDibujo;

    for(let i = 0; i < arr_rangos.length - 1; ++i){
        if(arr_rangos[i] >= val && arr_rangos[i+1] <= val)
            return localizar(val, arr_rangos[i], arr_rangos[i + 1],p.secV[i + 1], p.secV[i]);}
    return undefined;}


function localizarValY(posY, parametroDeDibujo){
    if(posY === undefined || !parametroDeDibujo) return undefined;
    const p = parametroDeDibujo;

    for(let i = 0; i < p.secV.length - 1; ++i){
        if(p.secV[i] <= posY && p.secV[i + 1]  >= posY)
            return ~~localizar(posY, p.secV[i], p.secV[i + 1], p.rangos[i + 1] ,p.rangos[i]);}

    const secFinal = (p.secV[p.secV.length - 1] - p.secV[p.secV.length - 2]) +p.secV[p.secV.length - 1];
    return ~~localizar(posY, p.secV[p.secV.length - 1], secFinal, 0 ,p.rangos[p.rangos.length - 1]);}


function localizar(parametro, inicio, fin, valIncio, valFin){
    const unidades = fin - inicio;
    const area = valFin - valIncio;
    const unidad = area / unidades;
    const dif = fin - parametro;
    return (dif * unidad) + valIncio;}


function borrarGrafico(){ graf.clearRect(0,0,canvas_t.w,canvas_t.h);}


function dibujarGrafica(parametroDeDibujo){
    if(!canvas_t || !parametroDeDibujo) return;

    borrarGrafico();
    graf.lineWidth = 1;
    
    dibujarGrilla(p);
    dibujarRegla(p);
    dibujarGraduacion(p);
    dibujarGraficaDeDatos(p.coors);}


function trazarLinea(XOrigen, YOrigen, XFinal, YFinal){
    graf.beginPath();
    graf.moveTo(XOrigen, YOrigen);
    graf.lineTo(XFinal, YFinal);
    graf.stroke();}


function dibujarRegla(parametroDeDibujo){
    if(!parametroDeDibujo) return;
    const p = parametroDeDibujo;
    
    graf.strokeStyle = color.gris;
    
    trazarLinea(p.xi, p.yi, p.xi, p.yf);
    trazarLinea(p.xi, p.yf, p.xf, p.yf);}


function dibujarGrilla(parametroDeDibujo){
    if(!parametroDeDibujo) return;
    const p = parametroDeDibujo;

    graf.strokeStyle = color.grisOscuro;

    for(val of p.secV) trazarLinea(p.xi,val, p.xf, val);
    for(val of p.secH) trazarLinea(val,p.yi, val, p.yf);}


function dibujarGraduacion(parametroDeDibujo){
    if(!parametroDeDibujo) return;
    const p = parametroDeDibujo;
    const font_t = p.font;
    const med_font = ~~(font_t / 2);

    graf.fillStyle = color.gris;
    graf.font = font_t + 'px arial';
    graf.textAlign ='end';

    p.rangos.forEach((val, idx) =>{
        graf.fillText(val,p.xi- font_t, p.secV[idx] + med_font);});

    graf.textAlign ='center';

    p.elementos.forEach((val, idx)=>{
        graf.fillText(val,p.secH[idx] , p.yf + font_t + med_font);});}
    

function dibujarGraficaDeDatos(arr_coors){
    if(!arr_coors) return;

    graf.strokeStyle = color.verdeTerminal;
    graf.fillStyle = color.verdeTerminal;
    graf.lineWidth = 2;

    for(let i = 0; i < arr_coors.length - 1; ++i)
        trazarLinea(arr_coors[i].x,arr_coors[i].y,arr_coors[i+1].x,arr_coors[i+1].y);}


function estaDentroDelaGrafica(posX, posY, parametroDeDibujo){
    if(!parametroDeDibujo) return false;
    const p = parametroDeDibujo;
    const confirmarX = posX >= p.xi && posX <= p.xf - 1;
    const confirmarY = posY >= p.yi && posY < p.yf - 1;
    return confirmarX && confirmarY;}


function dibujarGraficaLinealPorPos(posX, posY, parametroDeDibujo, colorLinea = '#000', colorTxt = '#000'){
    const val = localizarValY(posY,parametroDeDibujo);
    //trazarGraficaLineal(posY,parametroDeDibujo,undefined,colorLinea,colorTxt);
    graf.setLineDash([2, 5]);
    graf.strokeStyle = colorLinea;
    trazarLinea(posX, p.yi, posX, p.yf);
    trazarLinea(p.xi, posY, p.xf, posY);
    graf.setLineDash([]);
    trazarEtiqueta(val,posX - (p.font / 2),posY,p.font,p.espacios,colorLinea,colorTxt);}


function dibujarGraficaLinealPorValor(val, parametroDeDibujo, colorLinea = '#000', colorTxt = '#000'){
    const y = localizarPosY(val, parametroDeDibujo);
    trazarGraficaLineal(y, parametroDeDibujo,val,colorLinea,colorTxt);}


function dibujarEtiquetasDeDatos(parametroDeDibujo, colorFondo = '#000', colorTxt = '#000'){
    if(!parametroDeDibujo) return;
    const p = parametroDeDibujo;
    p.coors.forEach((coors, idx)=>{
        trazarEtiqueta(p.datos[idx], coors.x, coors.y, p.font, p.espacios , colorFondo, colorTxt);});}


function trazarGraficaLineal(posY, parametroDeDibujo, val = undefined, colorLinea = '#000', colorTxt = '#000'){
    if(posY === undefined || !parametroDeDibujo) return;
    const p = parametroDeDibujo;
    
    if(val !== undefined) trazarEtiqueta(val, p.xi, posY, p.font, p.espacios, colorLinea, colorTxt);

    graf.setLineDash([2, 5]);
    graf.strokeStyle = colorLinea;
    trazarLinea(p.xi + 2, posY, p.xf, posY);
    graf.setLineDash([]); }


function trazarEtiqueta(val, posX, posY, font, espacios, colorFondo = '#000', colorTxt = '#000'){
    graf.strokeStyle = colorFondo;
    graf.fillStyle = colorFondo;
    espacios = espacios <= 3 ? espacios += .5 : espacios;

    if(val == ~~val){ espacios -= 1; val = ~~val;}
     
    const fTam = font / 2;
    const tam = espacios * font;
    const esp = fTam + (fTam / 4);

    graf.beginPath();
    graf.moveTo(posX, posY);
    graf.lineTo(posX - fTam, posY - esp);
    graf.lineTo(posX - tam , posY - esp);
    graf.lineTo(posX - tam , posY + fTam);
    graf.lineTo(posX - fTam, posY + fTam);
    graf.fill();

    graf.fillStyle = colorTxt;
    graf.textAlign = 'end';
    graf.fillText(val, posX - fTam ,posY + (fTam / 2));}


function dibujarMarcadoresDeDatos(parametroDeDibujo, radio, colorMarcador = '#000'){
    if(!parametroDeDibujo) return;
    trazarMarcadores(parametroDeDibujo.coors, radio, colorMarcador);}


function trazarMarcadores(arr_coors, tam, colorMarcador){
    if(!arr_coors || tam <= 0) return;
    graf.fillStyle = colorMarcador;

    for(let val of arr_coors){
        graf.beginPath();
        graf.arc(val.x, val.y, tam, 0, 2 * Math.PI);
        graf.fill();}}