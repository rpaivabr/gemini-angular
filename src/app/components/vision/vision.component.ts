import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';


import { GeminiService } from '../../services/gemini.service';
import { LineBreakPipe } from '../../pipes/link-break.pipe';
import { ClientChatContent } from '../../models/client-chat.content';
import { EMPTY, catchError, finalize } from 'rxjs';

type ImageFile = { preview: string; file: File };

@Component({
  selector: 'app-vision',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    LineBreakPipe,
  ],
  templateUrl: './vision.component.html',
  styleUrl: './vision.component.scss'
})
export default class VisionComponent {
  message = '';
  contents: ClientChatContent[] = [];
  imageFile: ImageFile | undefined;

  constructor(private geminiService: GeminiService) {}

  sendMessage(message: string): void {
    if(!this.imageFile) {
      return;
    }

    const chatContent: ClientChatContent = {
      agent: 'user',
      message,
      imagePreview: this.imageFile?.preview
    };
    const file = this.imageFile.file;

    this.contents.push(chatContent);
    this.contents.push({
      agent: 'chatbot',
      message: '...',
      loading: true,
    });

    this.message = '';
    this.imageFile = undefined;

    this.geminiService
      .vision(chatContent.message, file)
      .pipe(
        catchError(() => {
          return EMPTY;
        }),
        finalize(() => {
          const loadingMessageIndex = this.contents.findIndex(
            (content) => content.loading
          );
          if (loadingMessageIndex !== -1) {
            this.contents.splice(loadingMessageIndex, 1);
          }
        })
      )
      .subscribe((content) => {
        this.contents.push(content);
      });
  }

  selectImage(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const preview = e.target?.result as string;
        this.imageFile = {file, preview};
      };

      reader.readAsDataURL(file);
    }
  }
}
