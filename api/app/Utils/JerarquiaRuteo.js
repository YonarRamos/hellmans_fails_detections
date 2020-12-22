'use strict';

var JerarquiaRuteo = {
  agragaJerarquiaDeOrden(ruteos, equipo) {
    return ruteos.map(ruteo => {
      ruteo.orden = this.posicionRuteo(ruteo.TagName);
      return ruteo;
    });
  },
  posicionRuteo(tagName) {
    if (tagName.indexOf('.Linea') > 0) {
      return 1;
    }
    if (tagName.indexOf('.Molino') > 0) {
      return 1;
    }
    if (tagName.indexOf('.Premix') > 0) {
      return 2;
    }
    if (tagName.indexOf('.Tk_Pasta') > 0) {
      return 3;
    }
    if (tagName.indexOf('.Tk_Slurry') > 0) {
      return 3;
    }
    if (tagName.indexOf('.Ketchup') > 0) {
      return 4;
    }
  },
  defineValorRuteo(ruteos) {
    // Filtra y rellena primer componente del ruteo
    let primerComponenteRuteo = ruteos.find(ruteo => {
      if (ruteo.orden === 1) {
        return true;
      }
    });

    let valorPrimerComponenteRuteo = '00000000';
    if (primerComponenteRuteo) {
      valorPrimerComponenteRuteo = primerComponenteRuteo.Value.toString();
    }
    valorPrimerComponenteRuteo = this.rellenaConCeroTexto(valorPrimerComponenteRuteo, 8);

    // Filtra y rellena segundo componente del ruteo
    let segundoComponenteRuteo = ruteos.find(ruteo => {
      if (ruteo.orden === 2) {
        return true;
      }
    });

    let valorSegundoComponenteRuteo = '00000000';
    if (segundoComponenteRuteo) {
      valorSegundoComponenteRuteo = segundoComponenteRuteo.Value.toString();
    }
    valorSegundoComponenteRuteo = this.rellenaConCeroTexto(valorSegundoComponenteRuteo, 8);

    // Filtra y rellena tercer componente del ruteo
    let tercerComponenteRuteo = ruteos.find(ruteo => {
      if (ruteo.orden === 3) {
        return true;
      }
    });

    let valorTercerComponenteRuteo = '000000';
    if (tercerComponenteRuteo) {
      valorTercerComponenteRuteo = tercerComponenteRuteo.Value.toString();
    }
    valorTercerComponenteRuteo = this.rellenaConCeroTexto(valorTercerComponenteRuteo, 6);

    // Filtra y rellena cuarto componente del ruteo
    let cuartoComponenteRuteo = ruteos.find(ruteo => {
      if (ruteo.orden === 4) {
        return true;
      }
    });

    let valorCuartoComponenteRuteo = '00';
    if (cuartoComponenteRuteo) {
      valorCuartoComponenteRuteo = cuartoComponenteRuteo.Value.toString();
    }
    valorCuartoComponenteRuteo = this.rellenaConCeroTexto(valorCuartoComponenteRuteo, 2);

    return (
      valorPrimerComponenteRuteo +
      valorSegundoComponenteRuteo +
      valorTercerComponenteRuteo +
      valorCuartoComponenteRuteo
    );
  },
  rellenaConCeroTexto(texto, ancho) {
    while (texto.length < ancho) {
      texto = '0' + texto;
    }
    return texto;
  }
};

module.exports = JerarquiaRuteo;
