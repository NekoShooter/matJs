function sort(array, ini, fin){
    let izq = ini;
    let der = fin;
    let piv = array[~~((der + izq) / 2)];

    do{
        while (array[izq] < piv && izq < fin) ++izq;
        while (array[der] > piv && der > ini) --der;

        if(izq <= der){
            const tmp = array[izq];
            array[izq] = array[der];
            array[der] = tmp;
            ++izq;
            --der;}

    }while(izq <= der);

    if(ini < der) sort(array, ini ,der);
    if(fin > izq) sort(array, izq, fin);}


function OrdenarLista(lista){
    if(!lista || !lista.length) return false;
    sort(lista, 0 , lista.length - 1);
    return true;}

function esImpar(lista){ return lista.length %2;}

function Promedio(lista){
    if(!lista || !lista.length) return undefined;
    return (lista.reduce((vacum, vintro)=> vacum + vintro) / lista.length).toFixed(1);}

function Media(lista){
    if(!lista || !lista.length) return undefined;
    const med = ~~(lista.length / 2);
    return esImpar(lista) ? lista[med] : Promedio([lista[med] , lista[med - 1]]);}


function Moda(lista){
    if(!lista || !lista.length) return undefined;
    const obj = {val : 0, rep: 0};
    const moda = {val : 0, rep: 0};

    lista.forEach(val=>{
        obj.val == val ? ++obj.rep : obj.rep = 1;
        obj.val = val;     
        if (moda.rep < obj.rep){
            moda.val = obj.val;
            moda.rep = obj.rep;}});

    return moda;}