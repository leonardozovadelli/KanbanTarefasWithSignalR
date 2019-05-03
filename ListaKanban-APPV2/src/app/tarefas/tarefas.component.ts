import { Usuario } from './../_models/Usuario';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { Tarefa } from '../_models/Tarefa';
import {
  HubConnection, HubConnectionBuilder, HttpTransportType
} from '@aspnet/signalr';

@Component({
  selector: 'app-tarefas',
  templateUrl: './tarefas.component.html',
  styleUrls: ['./tarefas.component.css']
})
export class TarefasComponent implements OnInit {

  constructor(private http: HttpClient) { }

  private hubConnection: HubConnection;
  obj: Tarefa;

  // ngModel do filtro
  valorUsuario: any = 'todos';

  tarefasTodo: Tarefa[] = [];
  tarefasInPro: Tarefa[] = [];
  tarefasDone: Tarefa[] = [];
  tarefas: Tarefa[] = [];
  usuarios: Usuario[] = [];

  GetTarefas() {
    this.hubConnection.on('EnviarTarefa', (response: any) => {
      // this.hubConnection.on('Enviar', (response: any) => {
      // this.hubConnection.on('EnviarCalendar', (response: any) => {
      this.tarefasTodo = response.todo;
      this.tarefasInPro = response.inpro;
      this.tarefasDone = response.done;
    });
  }
  GetTarefasTodosUpdate() {
    this.hubConnection.on('EnviarTodosKanban', (response: any) => {
      // this.hubConnection.on('Enviar', (response: any) => {
      // this.hubConnection.on('EnviarCalendar', (response: any) => {


      this.tarefasTodo = response.todo;
      this.tarefasInPro = response.inpro;
      this.tarefasDone = response.done;
    });
  }
  GetAllFiltro() {
    this.hubConnection.on('EnviarFiltro', (response: any) => {
      // this.hubConnection.on('Enviar', (response: any) => {
      // this.hubConnection.on('EnviarCalendar', (response: any) => {
      this.tarefasTodo = response.todo;
      this.tarefasInPro = response.inpro;
      this.tarefasDone = response.done;
    });
  }
  GetUsuario() {
    this.hubConnection.on('EnviarUsuario', (response: any) => {
      this.usuarios = response;
    });
  }

  GetTarefasUsuarios() {
    this.GetTarefas();
    this.GetUsuario();
  }

  ngOnInit() {
    this.hubConnection = new HubConnectionBuilder().withUrl('http://192.168.1.127:6001/kanban', {
      skipNegotiation: true, // Thiago
      // this.hubConnection = new HubConnectionBuilder().withUrl('http://192.168.1.134:6002/kanban', {skipNegotiation: true, // Matheus
      transport: HttpTransportType.WebSockets
    }).build();

    this.hubConnection.
      start()
      .then(() => this.hubConnection
        .invoke('getKanban'))
      .catch(err => console.log('Error while establishing connection'));
    this.GetTarefasUsuarios();

  }

  mudarSignalR(event: CdkDragDrop<Tarefa[]>) {
    const status = parseInt(event.container.id, 10);
    event.container.data[event.currentIndex].status = status;

    if (this.valorUsuario === 'todos') {
      this.hubConnection
      .invoke('UpdateKanban',
        event.container.data[event.currentIndex].responsavel.nome,
        event.container.data[event.currentIndex].id,
        event.container.data[event.currentIndex].status)
      .catch(err => console.log(err));

      this.hubConnection.
        invoke('getKanban')
        .catch(err => console.log(err));
    } else { 
      this.hubConnection
      .invoke('UpdateKanban',
        event.container.data[event.currentIndex].responsavel.nome,
        event.container.data[event.currentIndex].id,
        event.container.data[event.currentIndex].status)
      .catch(err => console.log(err));
    }


  }


  FiltrarUsuarioSignalR(nome: string) {
    if (nome.toLocaleLowerCase() === 'todos') {
      this.hubConnection
        .invoke('GetFiltro');
      this.GetTarefasTodosUpdate();
    } else {
      this.hubConnection
        .invoke('FiltrarUsuarioKanban', nome)
        .catch(err => console.log(err));

      this.GetAllFiltro();
    }
  }


  onDrop(event: CdkDragDrop<Tarefa[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex, event.currentIndex);
      const status = parseInt(event.container.id, 10);
      if (status === 0) {
        this.mudarSignalR(event);
      }
      if (status === 1) {
        this.mudarSignalR(event);
      }
      if (status === 2) {
        this.mudarSignalR(event);
      }
    } else {
      moveItemInArray(event.container.data,
        event.previousIndex, event.currentIndex);
    }
  }

  inserirIcon(esfPrev: number, esfReal: number) {
    let classes = [];
    if (esfPrev < esfReal) {
      classes = [
        'glyphicon glyphicon-warning-sign position-absolute'
      ];
    }
    return classes;
  }

  borderLeft(prio: number) {
    const colors = [
      'borderLeftBaixa',
      'borderLeftMedia',
      'borderLeftAlta',
    ];
    return colors[prio];
  }

  mudarTexto(prio: number) {
    const textos = [
      'Baixa',
      'Média',
      'Alta'
    ];
    return textos[prio];
  }

  mudarCor(prio: number) {
    const classes = [
      'bgBaixa',
      'bgMedia',
      'bgAlta'
    ];
    return classes[prio];
  }
}
