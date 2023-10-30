import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  SimpleChanges,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'user-portal-image-placeholder',
  templateUrl: './image-placeholder.component.html',
  styleUrls: ['./image-placeholder.component.scss'],
})
export class ImagePlaceholderComponent implements OnInit, OnChanges {
  @Input() imageCount;
  @Input() url;

  @Output() itemClicked: EventEmitter<void> = new EventEmitter();
  images = [];
  constructor() {}

  ngOnInit() {
    this.images = Array(this.imageCount).fill(0);
  }

  onImageClick() {
    this.itemClicked.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.imageCount.previousValue !== changes.imageCount.currentValue) {
      this.imageCount = changes.imageCount.currentValue;
      this.images = Array(this.imageCount).fill(0);
    }
  }
}
