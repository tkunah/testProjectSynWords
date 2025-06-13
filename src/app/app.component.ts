import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [FormsModule, HttpClientModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public text:string = '';
  public wordsQuantity:number = 0;
  public symbolsQuantity:number = 0;
  private selectedText:string = '';
  public synList:any = [];
  private synUrl:string = 'https://api.datamuse.com/words?rel_syn=';
  private http = inject(HttpClient);
  private changeDetector = inject(ChangeDetectorRef);
  private subscription: Subscription = new Subscription();
  @ViewChild('textArea') textareaRef!: ElementRef<HTMLTextAreaElement>;

  public onTextareaChange() {
    const curText = this.text;

    this.symbolsQuantity = curText.split(' ').join("").length; //curText.length;
    this.wordsQuantity = curText.trim().split(/\s+/).length;
  }

  public getSelectedText(textarea: HTMLTextAreaElement): void {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      this.selectedText = this.text.substring(start, end);
    } else {
      this.selectedText = '';
    }
  }

  private addTextSelection() {
    const start = this.text.indexOf(this.selectedText);
    const end = this.selectedText.length;

    this.textareaRef.nativeElement.focus();
    this.textareaRef.nativeElement.setSelectionRange(start, start+end);
  }

  public synonymFind() {
    const curText = this.selectedText.split(' ').join("+");

    this.subscription = this.http.get(this.synUrl+curText).subscribe(
      res => this.synList = res,
      err => console.error(err),
      () => {
        console.log('HTTP request completed.', this.synList);
        this.subscription.unsubscribe();
        this.addTextSelection();
      });
  }

  public copyText(textarea: HTMLTextAreaElement): void {
    navigator.clipboard.writeText(textarea.value).then(() => {
      textarea.select();
      console.log(textarea.value);
    }).catch(err => console.error(err));
  }

  public changeWord(word: string) {
    this.text = this.text.replace(this.selectedText, word);
    this.selectedText = word;
    this.addTextSelection();
    this.onTextareaChange();
    this.changeDetector.detectChanges();
  }
}
