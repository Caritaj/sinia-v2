import { AfterViewInit, Component, Input, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import { saveAs } from 'file-saver';
import ExportingModule from 'highcharts/modules/exporting';
import { Subscription } from 'rxjs';
import noDataToDisplay from 'highcharts/modules/no-data-to-display';
import { AppComponent } from 'src/app/app.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
ExportingModule(Highcharts);
noDataToDisplay(Highcharts);

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.css']
})
export class GraficoComponent implements OnInit{
 


  //@Input() listaDatosIndicadores?:any;

  //Arrays para extraer el Eeriodo(años) y los valores(datos) para graficar
  categorias: any[] = [];
  valores: any[] = [];
  //variable para la grafica
  chart: any;
  constructor(private padreComponent:AppComponent){
   
  }


  //obtenemos estos datos del Padre para datos del grafico
  @Input() fuente?:any;
  @Input() unidad?:any;
  @Input() tematica?:any;
  @Input() ubigeo?:any;
  @Input() series?:any;
  @Input() ambito?:any;
  @Input() indicador?:any;
  @Input() indicadorNombre?:any;
  @Input() nombreUbigeo?:any;

  listaDatosIndicadores: any[]=[];
  private datosSubscription!: Subscription;
  ngOnInit(): void {
    this.datosSubscription = this.padreComponent.datosListos$.subscribe((listaDatosPadre) => {
      this.listaDatosIndicadores = listaDatosPadre;
      this.graficarDatos();
    });
  }

  ngOnDestroy(): void {
    this.datosSubscription!.unsubscribe();
  }

  
  
  graficarDatos(){
    this.categorias = [];
    this.valores = [];
    this.listaDatosIndicadores?.map((item:any)=>{
      this.categorias.push(item.periodo);
      this.valores.push(parseFloat(item.valor));
    });
    let chartContainer = document.getElementById('chartContainer')
    if(chartContainer){
    
      this.renderChart();
    }else{
      
      this.updateChart();
    }
  }
    renderChart(){
      
        this.chart = Highcharts.chart('chartContainer', {
          chart: {
            scrollablePlotArea: {
              minWidth: 0,
              scrollPositionX: 0,
              scrollPositionY: 0
            },
            animation: {
              duration: 2000 // Establecer la duración de la animación en milisegundos
            },
            backgroundColor: '#fff',
            type: 'line',
            
          },
          title: {
            text: this.nombreUbigeo + ' : '+ this.indicadorNombre,
            align:'center',
            widthAdjust: -120,
            style: {
              fontSize: '14px',
              fontFamily: 'Roboto, sans-serif',
              textAlign:'center',
              fontWeight: 'none',
            }
          },
          xAxis: {
            categories: this.categorias,
            title: {
              text: 'Años',
              fontFamily: 'Roboto, sans-serif',
            },
            labels: {
              style: {
                fontSize: '11px',
              }
            },
          },
          yAxis: {
            title: {
              text: this.unidad,
              fontFamily: 'Roboto, sans-serif',
            },
            labels: {
              style: {
                fontSize: '11px',
              }
            },
          },
          series: [
            {
              name: this.unidad,
              data:  this.valores || [],
              color: '#79b340',
              dataLabels: {
                enabled: true, 
                style:{
                  color:'#696969',
                  fontFamily: 'Roboto, sans-serif',
                },
                
              },
            }
          ],
          lang: {
            noData: "<div class='text-center'><i class='fa fa-info-circle h4'></i><br>No se dispone de información para el ámbito seleccionado.</div>"
          },
          noData: {
            style: {
              fontWeight: 'bold',
              fontSize: '15px',
              color: '#666666'
            },
            position: {
              align: 'center',
              verticalAlign: 'middle'
            },
          },
          credits: {
            enabled: true,
            text: 'Fuente: '+ this.fuente, 
            href: false 
          },
          legend: {
            enabled : false,
          },
          exporting: {
            buttons: {
              first: {
                symbol : "menuball",
                menuItems: [{
                  text: "<i class='fa fa-bar-chart' style='color:red;font-size:20px'></i> Ver como Barra",
                  onclick: () => {
                    this.changeChartType('column');
                  }
                },
                {
                  text: "<i class='fa fa-line-chart' style='color:blue;font-size:20px'></i> Ver como Línea",
                  onclick: () => {
                    this.changeChartType('line');
                  }
                },
                {
                  text: "<i class='fa fa-area-chart' style='color:green;font-size:20px'></i> Ver como Área",
                  onclick: () => {
                    this.changeChartType('area');
                  }
                },
                
                
              ]
              },
              contextButton:{
                menuItems:[
                  {
                    text: "<i class='fa fa-print' style='color:grey;font-size:20px'></i> Imprimir",
                    textKey: "printChart",
                    onclick: () => {
                      this.chart.print();
                    }
                  },
                  {
                    text: "<i class='fa fa-file-image' style='color:blue;font-size:20px'></i> Descargar como PNG",
                    textKey: "downloadPNG",
                    onclick: () => {
                      this.chart.exportChart({ type: 'image/png' });
                    }
                  },
                  {
                    text: "<i class='fa fa-file-excel' style='color:green;font-size:20px'></i> Descargar como CSV",
                    textKey: "downloadSVG",
                    onclick: () => {
                      this.downloadCSV(this.chart.series);
                    }
                  },
                  {
                    text: "<i class='fa fa-file-pdf' style='color:red;font-size:20px'></i> Descargar como PDF",
                    textKey: "downloadPDF",
                    onclick: () => {
                      this.chart.exportChart({ type: 'application/pdf' });
                    }
                  },
                  
    
                ]
              },
            },
            
          
          }
          
        }as any);
    }
    // Cambiar el tipo de gráfico según el valor del parámetro chartType
    changeChartType(chartType: string) {
      this.chart.update({
        chart: {
          type: chartType
        }
      });
    }
    //funcion para convertir  y descargar los datos en CSV
    convertToCSV(series: Highcharts.SeriesOptionsType[]) {
      const header = `Periodo,${this.unidad}\n`;
      const rows = series.map((s:any) => s.data.map((d:any) => `${d.category},${d.y}`).join('\n')).join('\n');
      return header + rows;
    }
    downloadCSV(series: Highcharts.SeriesOptionsType[]) {
      const currentDate = new Date().toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const fileName = `data-${currentDate}.csv`;
      const csv = this.convertToCSV(series);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, fileName);
    }
    // Actualizar el grafico luego de cambiar los datos
    updateChart() {
      this.chart.update({
        series: [
          {
            name: this.unidad,
            data:  this.valores,
            
          }
        ],
        title: {
          text: this.nombreUbigeo + ' : '+ this.indicadorNombre,
          
        },
        xAxis: {
          categories: this.categorias,
          
        },
        yAxis: {
          title: {
            text: this.unidad,
          },
        },
        credits: {
          enabled: true,
          text: 'Fuente: '+ this.fuente, 
          href: false 
        },
      })
     
    }
      
    }

  
  




