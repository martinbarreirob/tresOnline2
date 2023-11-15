import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Game, Player } from '../models/interfaces.model'
import { ComponentFixture } from '@angular/core/testing';

@Component({
  selector: 'app-data-viewer',
  templateUrl: './data-viewer.component.html',
  styleUrls: ['./data-viewer.component.css']
})
export class DataViewerComponent implements OnInit {

  public centros = [
    {
      "ccn": 0,
      "codcnh": 0,
      "nombreCentro": "PINVESTIGA",
      "direccion": "DONATO BERNARDEZ SOTELO, Nº3, ENT-A",
      "telefono": "886128326",
      "municipio": "MOAÑA",
      "provincia": "PONTEVEDRA",
      "ccaa": "GALICIA",
      "codigoPostal": 36950,
      "camas": 1,
      "claseCentro": "-",
      "dependenciaFuncional": "-",
      "complejo": "N",
      "codidcom": 0,
      "nombreComplejo": "-",
      "alta": "N",
      "email": "asistenciatecnica@pinvestiga.com",
      "idCeim": null,
      "idFundacion": null
    },
    {
      "ccn": 10000000,
      "codcnh": 10000000,
      "nombreCentro": "OTROS",
      "direccion": "-",
      "telefono": "-",
      "municipio": "OTRO",
      "provincia": "OTRA",
      "ccaa": "OTRA",
      "codigoPostal": 0,
      "camas": 0,
      "claseCentro": "-",
      "dependenciaFuncional": "-",
      "complejo": "N",
      "codidcom": 0,
      "nombreComplejo": "-",
      "alta": "N",
      "email": "-",
      "idCeim": null,
      "idFundacion": null
    },
    {
      "ccn": 104000314,
      "codcnh": 40059,
      "nombreCentro": "HOSPITAL VIRGEN DEL MAR",
      "direccion": "CARRETERA DEL MAMI, KM. 1 S/N",
      "telefono": "950210100",
      "municipio": "Almería",
      "provincia": "ALMERÍA",
      "ccaa": "ANDALUCÍA",
      "codigoPostal": 4120,
      "camas": 76,
      "claseCentro": "Hospitales Generales",
      "dependenciaFuncional": "PRIVADOS",
      "complejo": "N",
      "codidcom": 0,
      "nombreComplejo": "",
      "alta": "N",
      "email": "VIRGENDELMAR@VITHAS.ES",
      "idCeim": 2,
      "idFundacion": null
    },
    {
      "ccn": 104000316,
      "codcnh": 40010,
      "nombreCentro": "HOSPITAL UNIVERSITARIO TORRECÁRDENAS",
      "direccion": "CALLE PARAJE TORRECARDENAS S/N",
      "telefono": "950016114",
      "municipio": "Almería",
      "provincia": "ALMERÍA",
      "ccaa": "ANDALUCÍA",
      "codigoPostal": 4009,
      "camas": 635,
      "claseCentro": "Hospitales Generales",
      "dependenciaFuncional": "SERVICIOS E INSTITUTOS DE SALUD DE LAS COMUNIDADES AUTÓNOMAS",
      "complejo": "S",
      "codidcom": 40097,
      "nombreComplejo": "Hospital Universitario Torrecardenas",
      "alta": "N",
      "email": "JOSE.TOMAS.SSPA@JUNTADEANDALUCIA.ES",
      "idCeim": 2,
      "idFundacion": null
    },
    {
      "ccn": 104000319,
      "codcnh": 40031,
      "nombreCentro": "HOSPITAL DE  LA CRUZ ROJA DE ALMERIA",
      "direccion": "CARRETERA DE RONDA S/N",
      "telefono": "950017400",
      "municipio": "Almería",
      "provincia": "ALMERÍA",
      "ccaa": "ANDALUCÍA",
      "codigoPostal": 4009,
      "camas": 69,
      "claseCentro": "Hospitales Generales",
      "dependenciaFuncional": "SERVICIOS E INSTITUTOS DE SALUD DE LAS COMUNIDADES AUTÓNOMAS",
      "complejo": "S",
      "codidcom": 40097,
      "nombreComplejo": "Hospital Universitario Torrecardenas",
      "alta": "N",
      "email": "ANNA.TORRES.SSPA@JUNTADEANDALUCIA.ES",
      "idCeim": 2,
      "idFundacion": null
    },
    {
      "ccn": 104000320,
      "codcnh": 40084,
      "nombreCentro": "HOSPITAL LA INMACULADA",
      "direccion": "AVENIDA DOCTORA ANA PARRA S/N",
      "telefono": "950029176",
      "municipio": "Huércal-Overa",
      "provincia": "ALMERÍA",
      "ccaa": "ANDALUCÍA",
      "codigoPostal": 4600,
      "camas": 184,
      "claseCentro": "Hospitales Generales",
      "dependenciaFuncional": "SERVICIOS E INSTITUTOS DE SALUD DE LAS COMUNIDADES AUTÓNOMAS",
      "complejo": "N",
      "codidcom": 0,
      "nombreComplejo": "",
      "alta": "N",
      "email": "H.INMACULADA.SSPA@JUNTADEANDALUCIA.ES",
      "idCeim": 2,
      "idFundacion": null
    },
    {
      "ccn": 104000321,
      "codcnh": 40118,
      "nombreCentro": "HOSPITAL DE PONIENTE",
      "direccion": "CARRETERA ALMERIMAR S/N",
      "telefono": "950022500",
      "municipio": "Ejido, El",
      "provincia": "ALMERÍA",
      "ccaa": "ANDALUCÍA",
      "codigoPostal": 4700,
      "camas": 261,
      "claseCentro": "Hospitales Generales",
      "dependenciaFuncional": "SERVICIOS E INSTITUTOS DE SALUD DE LAS COMUNIDADES AUTÓNOMAS",
      "complejo": "N",
      "codidcom": 0,
      "nombreComplejo": "",
      "alta": "N",
      "email": "SUGERENCIAS@EPHPO.ES",
      "idCeim": 2,
      "idFundacion": null
    },
    {
      "ccn": 104000322,
      "codcnh": 40101,
      "nombreCentro": "HOSPITAL MEDITERRANEO",
      "direccion": "CALLE NUEVA MUSA 8",
      "telefono": "950621063",
      "municipio": "Almería",
      "provincia": "ALMERÍA",
      "ccaa": "ANDALUCÍA",
      "codigoPostal": 4007,
      "camas": 89,
      "claseCentro": "Hospitales Generales",
      "dependenciaFuncional": "PRIVADOS",
      "complejo": "N",
      "codidcom": 0,
      "nombreComplejo": "",
      "alta": "N",
      "email": "JOSEANTONIO.ROJAS@GRUPOHLA.COM",
      "idCeim": 2,
      "idFundacion": null
    },
    {
      "ccn": 104001001,
      "codcnh": 40127,
      "nombreCentro": "HOSPITAL DE ALTA RESOLUCION EL TOYO",
      "direccion": "CAMINO DE LA BOTICA S/N",
      "telefono": "950158015",
      "municipio": "Almería",
      "provincia": "ALMERÍA",
      "ccaa": "ANDALUCÍA",
      "codigoPostal": 4131,
      "camas": 44,
      "claseCentro": "Hospitales Generales",
      "dependenciaFuncional": "SERVICIOS E INSTITUTOS DE SALUD DE LAS COMUNIDADES AUTÓNOMAS",
      "complejo": "N",
      "codidcom": 0,
      "nombreComplejo": "",
      "alta": "N",
      "email": "SUGERENCIAS@EPHPO.ES",
      "idCeim": 2,
      "idFundacion": null
    },
  ]

  public ccaa: any = [];
  public provincias: any = [];
  public estructuraAnidada: any = [];

  constructor() { }

  ngOnInit(): any {

    // Definir las interfaces
    interface Centro {
      ccaa: string;
      provincia: string;
      municipio: string;
      // ... otros datos del centro
    }

    function ordenarAlfabeticamente(a: any, b: any) {
      return a.nombre.localeCompare(b.nombre);
    }

    function crearEstructuraAnidada(centros: Centro[]) {
      const estructura: any = [];

      centros.forEach(centro => {
        let comunidad = estructura.find((c: any) => c.nombre === centro.ccaa);
        if (!comunidad) {
          comunidad = { nombre: centro.ccaa, provincias: [] };
          estructura.push(comunidad);
        }

        let provincia: any = comunidad.provincias.find((p: any) => p.nombre === centro.provincia);
        if (!provincia) {
          provincia = { nombre: centro.provincia, municipios: [] };
          comunidad.provincias.push(provincia);
        }

        let municipio = provincia.municipios.find((m: any) => m.nombre === centro.municipio);
        if (!municipio) {
          municipio = { nombre: centro.municipio, centros: [] };
          provincia.municipios.push(municipio);
        }

        municipio.centros.push(centro);
      });

      estructura.sort(ordenarAlfabeticamente);
      estructura.forEach((comunidad: any) => {
        comunidad.provincias.sort(ordenarAlfabeticamente);
        comunidad.provincias.forEach((provincia: any) => {
          provincia.municipios.sort(ordenarAlfabeticamente);
        });
      });

      return estructura;
    }

    this.estructuraAnidada = crearEstructuraAnidada(this.centros);
    console.log(this.estructuraAnidada);
  }

}
