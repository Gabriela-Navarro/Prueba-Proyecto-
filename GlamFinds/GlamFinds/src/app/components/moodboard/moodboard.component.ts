import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import interact from 'interactjs';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';


@Component({
  selector: 'app-moodboard',
  templateUrl: './moodboard.component.html',
  styleUrls: ['./moodboard.component.scss']
})
export class MoodboardComponent implements AfterViewInit {
  @ViewChild('moodboard', { static: false }) moodboard!: ElementRef;
  moodboardItems: any[] = [];
  isPreviewMode = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.moodboardItems.push({
              type: 'image',
              src: e.target.result,
              top: 100,
              left: 100,
              width: 150,
              height: 150
            });
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  ngAfterViewInit() {
    interact('.moodboard-item')
      .draggable({
        listeners: {
          move(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // Aplicar el movimiento a la imagen
            target.style.transform = `translate(${x}px, ${y}px)`;

            // Actualizar las posiciones en donde se encuentra la imagen
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          }
        }
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move(event) {
            let target = event.target;
            let x = (parseFloat(target.getAttribute('data-x')) || 0);
            let y = (parseFloat(target.getAttribute('data-y')) || 0);

            // Actualizar el tamaño del elemento
            target.style.width = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';

            // Traducir si es necesario
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.transform = `translate(${x}px, ${y}px)`;

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          }
        }
      });
  }
  downloadMoodboard() {
    const node = this.moodboard.nativeElement;
    function filter () {
      return (node.tagName !== 'BUTTON');
    }
    domtoimage.toPng(node,{filter:filter})
      .then((dataUrl: string) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'moodboard.png';
        link.click();
      })
      .catch((error: any) => {
        console.error('Error al capturar el moodboard:', error);
      });
  }
  removeItem(index: number) {
    this.moodboardItems.splice(index, 1);
  }
}

