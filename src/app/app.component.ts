import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  text:string = '';
  wordsQuantity:number = 0;
  symbolsQuantity:number = 0;
  selectedText:string = '';
  @ViewChild('textArea') textareaRef!: ElementRef<HTMLTextAreaElement>;
  synList:any = [];
  synUrl:string = 'https://api.datamuse.com/words?rel_syn=';
  constructor(private http: HttpClient) {}

  onTextareaChange() {
    const curText = this.text;

    this.symbolsQuantity = curText.split(' ').join("").length; //curText.length;
    this.wordsQuantity = curText.trim().split(/\s+/).length;
  }

  getSelectedText(textarea: HTMLTextAreaElement): void {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      this.selectedText = this.text.substring(start, end);
    } else {
      this.selectedText = '';
    }
  }

  addTextSelection() {
    const start = this.text.indexOf(this.selectedText);
    const end = this.selectedText.length;

    this.textareaRef.nativeElement.focus();
    this.textareaRef.nativeElement.setSelectionRange(start, start+end);
  }

  synonymFind() {
    const curText = this.selectedText.split(' ').join("+");

    this.http.get(this.synUrl+curText).subscribe(
      res => this.synList = res,
      err => console.error(err),
      () => {
        console.log('HTTP request completed.', this.synList);
        this.addTextSelection();
      });
  }

  copyText(textarea: HTMLTextAreaElement): void {
    navigator.clipboard.writeText(textarea.value).then(() => {
      textarea.select();
      console.log(textarea.value);
    }).catch(err => console.error(err));
  }

  changeWord(word: string) {
    this.text = this.text.replace(this.selectedText, word);
    this.selectedText = word;
    setTimeout(() => {
      this.addTextSelection();
      this.onTextareaChange();
    }, 0);
  }
}
