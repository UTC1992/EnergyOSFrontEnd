import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { ReportesCortes } from '../../../services/reportes-cortes.service';
import { LoginService } from '../../../services/login.service';
import Swal from 'sweetalert2';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD-MM-YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-estadisticas-cortes',
  templateUrl: './estadisticas-cortes.component.html',
  styleUrls: ['./estadisticas-cortes.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class EstadisticasCortesComponent implements OnInit {

  //consolidado
  fechaDiarioInicio: string = null;
  dateDiarioInicio = new FormControl(
    'date', [
      Validators.required
    ]
  );

  fechaDiarioFin: string = null;
  dateDiarioFin = new FormControl(
    'date', [
      Validators.required
    ]
  );

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public barChartLabels: Label[] = ['00-00-0000'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'COR' },
    { data: [], label: 'NOT' },
    { data: [], label: 'REC' }
  ];



  constructor(
    private reporteService: ReportesCortes,
    private loginService: LoginService
  ) { }

  ngOnInit() {
  }

  mostrarReporteDiario(){
    if(this.fechaDiarioInicio == null || this.fechaDiarioFin == null){
      this.showAlert('Alerta !', 'Debe elegir una fecha de inicio y una de fin para consultar', 'warning');
      return
    }
    
    let empresa = this.loginService.usuario.id_emp;
    var dateInicio = this.fechaDiarioInicio;
    var vectorInicio = dateInicio.split("-");
    var fechaInicio=vectorInicio[2]+"-"+vectorInicio[1]+"-"+vectorInicio[0];

    var dateFin = this.fechaDiarioFin;
    var vectorFin = dateFin.split("-");
    var fechaFin=vectorFin[2]+"-"+vectorFin[1]+"-"+vectorFin[0];

    let data: any[] = [];
    data.push({ 
      'empresa': empresa,
      'inicio': fechaInicio,
      'fin': fechaFin
    });
    console.log(data);
    this.reporteService.getCortesDiarios(data).subscribe(response =>{
      console.log(response);
      let dataNot = [];
      let conNot = 0;
      let dataCor = [];
      let conCor = 0;
      let dataRec = [];
      let conRec = 0;

      let conLabels = 0;
      for(let i = 0; i < response.length; i++){

        //console.log("valor encontrado => "+this.barChartLabels.find(barChartLabels => barChartLabels == response[i].fecha));

        if(!this.barChartLabels.find(barChartLabels => barChartLabels == response[i].fecha)){
          this.barChartLabels[conLabels] = response[i].fecha;
          conLabels = conLabels + 1;
        }

        if(response[i].actividad == "NOTIFICACIONES"){
          dataNot[conNot] = response[i].cantidad;
          conNot = conNot + 1;
        }
        
        if(response[i].actividad == "CORTE"){
          dataCor[conCor] = response[i].cantidad;
          conCor = conCor + 1;
        }

        if(response[i].actividad == "RECONEXIONES"){
          dataRec[conRec] = response[i].cantidad;
          conRec = conRec + 1;
        }

        
      }
      this.barChartData[0].data = dataCor;
      this.barChartData[1].data = dataNot;
      this.barChartData[2].data = dataRec;
      //console.log(this.barChartLabels);
      //console.log(this.barChartData);
       
    });
  }

  getFechaInicio(pickerInput: string): void {
    this.fechaDiarioInicio = pickerInput;
    //console.log(this.fechaBuscar);
  }
  getFechaFin(pickerInput: string): void {
    this.fechaDiarioFin = pickerInput;
    //console.log(this.fechaBuscar);
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    //console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    //console.log(event, active);
  }

  showAlert(title, text, type){
    Swal.fire({
      title: title,
      text: text,
      type: type,
      allowOutsideClick: false
    });
  }

}
