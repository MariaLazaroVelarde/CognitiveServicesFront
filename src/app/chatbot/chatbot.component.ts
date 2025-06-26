import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CopichatService } from '../services/copichat.service';
import { Copichat } from '../models/copichat.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements OnInit {
  chats: Copichat[] = [];
  chatsActivos: Copichat[] = [];
  nuevaPregunta: string = '';
  preguntaEditando: string = '';
  chatEditandoId: number | null = null;
  mostrarEliminados: boolean = false;
  loading: boolean = false;
  error: string = '';

  constructor(private copichatService: CopichatService) {}

  ngOnInit(): void {
    this.cargarChatsActivos();
  }

  // Crear nueva pregunta
  crearPregunta(): void {
    if (!this.nuevaPregunta.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'Por favor ingresa una pregunta',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    this.loading = true;
    this.error = '';

    // Mostrar loading
    Swal.fire({
      title: 'Creando pregunta...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.copichatService.crear(this.nuevaPregunta).subscribe({
      next: (nuevoChat) => {
        this.chatsActivos.unshift(nuevoChat);
        this.nuevaPregunta = '';
        this.loading = false;
        
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Pregunta creada correctamente',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (err) => {
        this.error = 'Error al crear la pregunta';
        this.loading = false;
        console.error(err);
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear la pregunta. Inténtalo nuevamente.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  // Iniciar edición
  iniciarEdicion(chat: Copichat): void {
    this.chatEditandoId = chat.id;
    this.preguntaEditando = chat.pregunta;
  }

  // Cancelar edición
  cancelarEdicion(): void {
    this.chatEditandoId = null;
    this.preguntaEditando = '';
  }

  // Guardar edición
  guardarEdicion(id: number): void {
    if (!this.preguntaEditando.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'La pregunta no puede estar vacía',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    this.loading = true;
    this.error = '';

    // Mostrar loading
    Swal.fire({
      title: 'Guardando cambios...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.copichatService.editar(id, this.preguntaEditando).subscribe({
      next: (chatEditado) => {
        const index = this.chatsActivos.findIndex(c => c.id === id);
        if (index !== -1) {
          this.chatsActivos[index] = chatEditado;
        }
        this.cancelarEdicion();
        this.loading = false;
        
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'La pregunta se editó correctamente',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (err) => {
        this.error = 'Error al editar la pregunta';
        this.loading = false;
        console.error(err);
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo editar la pregunta. Inténtalo nuevamente.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  // Eliminar lógicamente
  eliminarLogico(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres eliminar esta conversación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.error = '';

        // Mostrar loading
        Swal.fire({
          title: 'Eliminando...',
          text: 'Por favor espera',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.copichatService.eliminarLogico(id).subscribe({
          next: () => {
            this.chatsActivos = this.chatsActivos.filter(c => c.id !== id);
            this.loading = false;
            
            Swal.fire({
              icon: 'success',
              title: '¡Eliminado!',
              text: 'La conversación ha sido eliminada',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            this.error = 'Error al eliminar la conversación';
            this.loading = false;
            console.error(err);
            
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar la conversación. Inténtalo nuevamente.',
              confirmButtonColor: '#d33'
            });
          }
        });
      }
    });
  }

  // Eliminar físicamente
  eliminarFisico(id: number): void {
    Swal.fire({
      title: '¡Advertencia!',
      text: '¿Estás seguro de que quieres eliminar permanentemente esta conversación? Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar permanentemente',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.error = '';

        // Mostrar loading
        Swal.fire({
          title: 'Eliminando permanentemente...',
          text: 'Por favor espera',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.copichatService.eliminarFisico(id).subscribe({
          next: () => {
            this.chats = this.chats.filter(c => c.id !== id);
            this.chatsActivos = this.chatsActivos.filter(c => c.id !== id);
            this.loading = false;
            
            Swal.fire({
              icon: 'success',
              title: '¡Eliminado permanentemente!',
              text: 'La conversación ha sido eliminada de forma permanente',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            this.error = 'Error al eliminar permanentemente la conversación';
            this.loading = false;
            console.error(err);
            
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar permanentemente la conversación. Inténtalo nuevamente.',
              confirmButtonColor: '#d33'
            });
          }
        });
      }
    });
  }

  // Restaurar conversación
  restaurar(id: number): void {
    Swal.fire({
      title: '¿Restaurar conversación?',
      text: 'Esta conversación volverá a estar disponible',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.error = '';

        // Mostrar loading
        Swal.fire({
          title: 'Restaurando...',
          text: 'Por favor espera',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.copichatService.restaurar(id).subscribe({
          next: (chatRestaurado) => {
            this.chatsActivos.push(chatRestaurado);
            this.chats = this.chats.filter(c => c.id !== id);
            this.loading = false;
            
            Swal.fire({
              icon: 'success',
              title: '¡Restaurado!',
              text: 'La conversación ha sido restaurada correctamente',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            this.error = 'Error al restaurar la conversación';
            this.loading = false;
            console.error(err);
            
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo restaurar la conversación. Inténtalo nuevamente.',
              confirmButtonColor: '#d33'
            });
          }
        });
      }
    });
  }

  // Cargar chats activos
  cargarChatsActivos(): void {
    this.loading = true;
    this.error = '';

    this.copichatService.listarActivos().subscribe({
      next: (chats) => {
        this.chatsActivos = chats;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las conversaciones';
        this.loading = false;
        console.error(err);
        
        Swal.fire({
          icon: 'error',
          title: 'Error de carga',
          text: 'No se pudieron cargar las conversaciones. Inténtalo nuevamente.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  // Cargar todos los chats (incluyendo eliminados)
  cargarTodosLosChats(): void {
    this.loading = true;
    this.error = '';

    this.copichatService.listarTodo().subscribe({
      next: (chats) => {
        this.chats = chats;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar todas las conversaciones';
        this.loading = false;
        console.error(err);
        
        Swal.fire({
          icon: 'error',
          title: 'Error de carga',
          text: 'No se pudieron cargar todas las conversaciones. Inténtalo nuevamente.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  // Alternar vista de eliminados
  toggleMostrarEliminados(): void {
    this.mostrarEliminados = !this.mostrarEliminados;
    if (this.mostrarEliminados) {
      this.cargarTodosLosChats();
    } else {
      this.cargarChatsActivos();
    }
  }

  // Obtener chats eliminados
  get chatsEliminados(): Copichat[] {
    return this.chats.filter(chat => chat.status === 'ELIMINADO');
  }

  // Formatear fecha
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString();
  }
}