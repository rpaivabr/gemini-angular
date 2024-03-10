import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MarkdownModule } from 'ngx-markdown';

import { GeminiService } from '../../services/gemini.service';
import { ClientChatContent } from '../../models/client-chat.content';
import { LineBreakPipe } from '../../pipes/link-break.pipe';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    LineBreakPipe,
    MarkdownModule
  ],
  templateUrl: './text.component.html',
  styleUrl: './text.component.scss'
})
export default class TextComponent {
  message = '';
  contents: ClientChatContent[] = [];

  constructor(private geminiService: GeminiService) {}

  generateText(message: string): void {
    const chatContent: ClientChatContent = {
      agent: 'user',
      message,
    };

    this.contents.push(chatContent);
    this.contents.push({
      agent: 'chatbot',
      message: '...',
      loading: true,
    });

    this.message = '';
    this.geminiService
      .generateText(message)
      .pipe(
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
}
