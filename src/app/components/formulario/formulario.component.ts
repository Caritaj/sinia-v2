import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit{
  ubigeo: any[] = [];
  tematica: any[] = [];

  regionParam:any;
  ubigeoSeleccionado ="00";
  tematicaSeleccionada = "04";


  @Output() parametrosUbigeoTematica = new EventEmitter<any>()

  constructor(private http:HttpClient,private route: ActivatedRoute){

  }
  ngOnInit(): void {
    this.http.get('/assets/data.json').subscribe((data:any)=>{
      this.ubigeo = data.ubigeo;
      this.tematica = data.tematica;
      this.enviarUbigeoTematica();
    });
    this.route.paramMap.subscribe(params => {
      this.regionParam = this.route.snapshot.paramMap.get('region');
      this.ubigeoSeleccionado = this.regionParam ?? '00';
    });
  }


  //enviar valores de ubigeo y tematica
  enviarUbigeoTematica(){
    const PARAMS = {
      ubigeo : this.ubigeo.find(item => item.value === this.ubigeoSeleccionado),
      tematica : this.tematicaSeleccionada
      
    }
  this.parametrosUbigeoTematica.emit(PARAMS);
}

}
