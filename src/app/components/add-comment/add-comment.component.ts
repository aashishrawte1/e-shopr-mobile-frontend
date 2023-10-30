import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'user-portal-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss'],
})
export class AddCommentComponent implements OnInit {
  @Output() comment: EventEmitter<string> = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  addComment(input: string | number) {
    this.comment.emit(input as string);
  }

  onEnterPressed(input: string | number) {
    this.comment.emit(input as string);
  }
}
