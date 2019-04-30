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

  tarefasTodo: Tarefa[] = [];
  tarefasInPro: Tarefa[] = [];
  tarefasDone: Tarefa[] = [];
  tarefas: Tarefa[] = [];
  usuarios: any;

  ngOnInit() {
    this.hubConnection = new HubConnectionBuilder().withUrl('http://192.168.1.127:6001/kanban', {
      skipNegotiation: true,
      // this.hubConnection = new HubConnectionBuilder().withUrl('http://192.168.1.134:6001/kanban', {skipNegotiation: true,
      // this.hubConnection = new HubConnectionBuilder().withUrl('http://localhost:5000/kanban', {skipNegotiation: true,
      transport: HttpTransportType.WebSockets
    }).build();

    console.log('HUB:')
    console.log(this.hubConnection);

    this.hubConnection.
      start()
      .then(() => this.hubConnection
        .invoke('getEnviar'))
      .catch(err => console.log('Error while establishing connection'));

    this.hubConnection.on('Enviar', (response: any) => {
      this.tarefasTodo = response.todo;
      this.tarefasInPro = response.inpro;
      this.tarefasDone = response.done;
    });

    // this.getTarefas();
    // this.getUsuarios();
    // this.getTarefasStatus();
  }

  public sendMessage(): void {
    this.hubConnection
      .invoke('getEnviar')
      .catch(err => console.log(err));
  }

  // ngModel do filtro
  valorUsuario: any = 'todos';

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

  mudarSignalR(event: CdkDragDrop<Tarefa[]>) {
    this.hubConnection
      .invoke('getEnviar', event.container.data[event.currentIndex])
      .catch(err => console.log(err));
  }


  onDrop(event: CdkDragDrop<Tarefa[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex, event.currentIndex);
      const status = parseInt(event.container.id, 10);
      console.log(event.container.data[event.currentIndex]); // OBJETO ALTERADO
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

  // Movimentar os Cards, com isso alterar os status
  // onDrop(event: CdkDragDrop<Tarefa[]>) {
  //   if (event.previousContainer !== event.container) {
  //     transferArrayItem(event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex, event.currentIndex);
  //     const status = parseInt(event.container.id, 10);
  //     // console.log(event.container.data[event.currentIndex]);// OBJETO ALTERADO
  //     if (status === 0) {
  //     this.editarTarefa(event.container.data[event.currentIndex].id, status, event.container.data[event.currentIndex]);
  //     }
  //     if (status === 1) {
  //       this.editarTarefa(event.container.data[event.currentIndex].id, status, event.container.data[event.currentIndex]);
  //     }
  //     if (status === 2) {
  //       this.editarTarefa(event.container.data[event.currentIndex].id, status, event.container.data[event.currentIndex]);
  //     }
  //   } else {
  //     moveItemInArray(event.container.data,
  //       event.previousIndex, event.currentIndex);
  //   }
  // }

  getTarefasStatus() {
    this.http.get('http://localhost:5000/api/tarefas').subscribe(
      // this.http.get('http://192.168.1.127:6001/tarefas').subscribe(
      (response: any) => {
        this.tarefasTodo = response.todo;
        this.tarefasInPro = response.inpro;
        this.tarefasDone = response.done;
      }, error => {
        console.log(error);
      }
    );
  }

  getTarefas() {
    this.http.get('http://localhost:5000/api/tarefas').subscribe(
      (response: Tarefa[]) => {
        this.tarefas = response;
      }, error => {
        console.log(error);
      }
    );
  }

  getTarefasPorUsuario(nome: string) {
    if (nome.toLocaleLowerCase() === 'todos') {
      this.getTarefasStatus();
    } else {
      this.http.get('http://localhost:5000/api/tarefas/' + nome).subscribe(
        (response: any) => {
          this.tarefasTodo = response.todo;
          this.tarefasInPro = response.inpro;
          this.tarefasDone = response.done;
        }, error => {
          console.log(error);
        }
      );
    }
  }

  getUsuarios() {
    this.http.get('http://localhost:5000/api/usuarios').subscribe(
      response => {
        this.usuarios = response;
      }, error => {
        console.log(error);
      }
    );
  }

  editarTarefa(id: number, status: number, tarefa: Tarefa) {
    console.log('EditarTarefa: ');
    console.log(tarefa);
    tarefa.status = status;
    this.http.put(`http://localhost:5000/api/tarefas/${id}`, tarefa).subscribe(
      () => {
        console.log('Deu certo');
      }, error => {
        console.log(error);
      }
    );
  }


}
